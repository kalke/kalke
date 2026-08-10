import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
	bankCepLookup,
	bankMeta,
	bankOnboardingComplete,
	bankOnboardingDocuments,
	bankOnboardingSkip,
	bankOnboardingStart,
	extractDocument,
	listExtractions,
	type BankMeta,
	type ExtractProgress,
} from "../api";
import { copy, type Lang } from "../content";
import {
	ageYears,
	digitsOnly,
	isAdult,
	isEmail,
	maskCep,
	maskPhone,
} from "./bankValidation";
import { FileDropzone } from "./FileDropzone";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };
type Step = 0 | 1 | 2 | 3 | 4 | 5;

type WizardState = {
	full_name: string;
	birth_date: string;
	document_number: string;
	cep: string;
	street: string;
	number: string;
	complement: string;
	neighborhood: string;
	city: string;
	state: string;
	email: string;
	phone: string;
	terms_accepted: boolean;
};

const STORAGE_KEY = "kalke-bank-onboarding-v1";
const STEPS = [
	"ID document",
	"Account holder",
	"Address",
	"Contact",
	"Terms",
	"Review",
] as const;

const empty: WizardState = {
	full_name: "",
	birth_date: "",
	document_number: "",
	cep: "",
	street: "",
	number: "",
	complement: "",
	neighborhood: "",
	city: "",
	state: "",
	email: "",
	phone: "",
	terms_accepted: false,
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
	return v != null && typeof v === "object" && !Array.isArray(v);
}

function summaryFromExtract(result: unknown): Record<string, unknown> | null {
	if (!isPlainObject(result)) return null;
	if (isPlainObject(result.data)) return result.data;
	if (isPlainObject(result.fields)) return result.fields;
	const rest = { ...result };
	delete rest.id;
	delete rest.doc_type;
	return Object.keys(rest).length ? rest : null;
}

function strField(data: Record<string, unknown>, ...keys: string[]): string {
	for (const key of keys) {
		const v = data[key];
		if (typeof v === "string" && v.trim()) return v.trim();
	}
	return "";
}

export function BankOnboarding({ lang }: Props) {
	const t = copy[lang].playground;
	const navigate = useNavigate();
	const { busy, setBusy, setError } = useDashboard();
	const [meta, setMeta] = useState<BankMeta | null>(null);
	const [step, setStep] = useState<Step>(0);
	const [form, setForm] = useState<WizardState>(() => {
		try {
			const raw = sessionStorage.getItem(STORAGE_KEY);
			if (raw) return { ...empty, ...JSON.parse(raw) };
		} catch {
			/* ignore */
		}
		return empty;
	});
	const [idFile, setIdFile] = useState<File | null>(null);
	const [progress, setProgress] = useState<ExtractProgress | null>(null);
	const [cepLoading, setCepLoading] = useState(false);
	const [termsOpen, setTermsOpen] = useState(false);
	const [termsError, setTermsError] = useState(false);

	useEffect(() => {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
	}, [form]);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const m = await bankMeta();
				if (!cancelled) setMeta(m);
			} catch {
				/* optional */
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const stepLabels = useMemo(
		() =>
			lang === "pt"
				? [
						"Documento",
						"Titular",
						"Endereço",
						"Contato",
						"Termos",
						"Revisão",
					]
				: [...STEPS],
		[lang],
	);

	function patch(partial: Partial<WizardState>) {
		setForm((prev) => ({ ...prev, ...partial }));
	}

	function validateStep(s: Step): string | null {
		if (s === 1) {
			if (form.full_name.trim().length < 2) return t.bankWizardNameRequired;
			if (!form.birth_date) return t.bankWizardDobRequired;
			if (!isAdult(form.birth_date)) return t.bankWizardUnderage;
			if (digitsOnly(form.document_number).length < 11)
				return t.bankWizardDocRequired;
		}
		if (s === 2) {
			if (digitsOnly(form.cep).length !== 8) return t.bankWizardCepRequired;
			if (!form.street.trim() || !form.number.trim())
				return t.bankWizardAddressRequired;
		}
		if (s === 3) {
			if (!isEmail(form.email)) return t.bankWizardEmailRequired;
			if (digitsOnly(form.phone).length < 10) return t.bankWizardPhoneRequired;
		}
		if (s === 4 && !form.terms_accepted) return t.bankTosRequired;
		return null;
	}

	function goNext() {
		const err = validateStep(step);
		if (err) {
			setTermsError(step === 4);
			setError(err);
			return;
		}
		setError("");
		setTermsError(false);
		setStep((s) => Math.min(5, s + 1) as Step);
	}

	function goBack() {
		setError("");
		setStep((s) => Math.max(0, s - 1) as Step);
	}

	async function onExtractId() {
		if (!idFile) return;
		setBusy(true);
		setError("");
		setProgress(null);
		try {
			await bankOnboardingStart();
			await extractDocument(idFile, "identity_document", true, setProgress);
			const listed = await listExtractions("identity_document");
			const latest = listed[0];
			const summary = summaryFromExtract(latest);
			if (summary) {
				await bankOnboardingDocuments({
					doc_type: "identity_document",
					pde_extraction_id: typeof latest?.id === "string" ? latest.id : null,
					summary,
				});
				patch({
					full_name:
						strField(summary, "nome", "name", "full_name") || form.full_name,
					birth_date:
						strField(summary, "data_nascimento", "birth_date") ||
						form.birth_date,
					document_number:
						digitsOnly(
							strField(summary, "cpf", "numero_documento", "document_number"),
						) || form.document_number,
				});
			}
			setStep(1);
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankOnboardingError);
		} finally {
			setBusy(false);
			setProgress(null);
		}
	}

	async function onCepBlur() {
		const cep = digitsOnly(form.cep);
		if (cep.length !== 8) return;
		setCepLoading(true);
		setError("");
		try {
			const data = await bankCepLookup(cep);
			patch({
				cep: data.cep,
				street: data.street || form.street,
				neighborhood: data.neighborhood || form.neighborhood,
				city: data.city || form.city,
				state: data.state || form.state,
			});
		} catch {
			/* manual entry fallback */
		} finally {
			setCepLoading(false);
		}
	}

	async function onSkip() {
		setBusy(true);
		setError("");
		try {
			await bankOnboardingStart();
			await bankOnboardingSkip(crypto.randomUUID());
			sessionStorage.removeItem(STORAGE_KEY);
			navigate("/playground/bank", { replace: true });
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankOnboardingError);
		} finally {
			setBusy(false);
		}
	}

	async function onConfirm(e: FormEvent) {
		e.preventDefault();
		const err = validateStep(4) || validateStep(1) || validateStep(2) || validateStep(3);
		if (err) {
			setError(err);
			return;
		}
		setBusy(true);
		setError("");
		try {
			await bankOnboardingStart();
			await bankOnboardingComplete(
				{
					full_name: form.full_name.trim(),
					birth_date: form.birth_date,
					document_number: digitsOnly(form.document_number),
					cep: digitsOnly(form.cep),
					street: form.street.trim(),
					number: form.number.trim(),
					complement: form.complement.trim() || undefined,
					neighborhood: form.neighborhood.trim() || undefined,
					city: form.city.trim() || undefined,
					state: form.state.trim().toUpperCase() || undefined,
					email: form.email.trim(),
					phone: digitsOnly(form.phone),
					terms_accepted: true,
					accepted_at: new Date().toISOString(),
				},
				crypto.randomUUID(),
			);
			sessionStorage.removeItem(STORAGE_KEY);
			navigate("/playground/bank", { replace: true });
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankOnboardingError);
		} finally {
			setBusy(false);
		}
	}

	return (
		<>
			<p className="eyebrow">{t.pathBank}</p>
			<div className="bank-title-row">
				<h1>{t.bankOnboardingTitle}</h1>
				<span className="bank-demo-badge">{t.bankDemoBadge}</span>
			</div>
			<p className="section-intro">{t.bankOnboardingIntro}</p>

			{meta ? (
				<p className="playground-muted">
					{meta.disclaimer} · {meta.welcome_amount} {meta.currency}
				</p>
			) : null}

			<ol className="bank-stepper" aria-label="Onboarding steps">
				{stepLabels.map((label, i) => {
					const state =
						i < step ? "done" : i === step ? "current" : "pending";
					return (
						<li key={label} className={`bank-step bank-step-${state}`}>
							<span className="bank-step-index">{i}</span>
							<span className="bank-step-label">{label}</span>
						</li>
					);
				})}
			</ol>

			<section className="playground-panel bank-panel extract-form">
				{step === 0 ? (
					<>
						<p>{t.bankWizardIdHint}</p>
						<FileDropzone
							file={idFile}
							onFile={setIdFile}
							disabled={busy}
							dropHint={t.dropHint}
							dropBrowse={t.dropBrowse}
							dropReplace={t.dropReplace}
							dropRemove={t.dropRemove}
						/>
						{progress ? (
							<div className="extract-progress" role="status">
								<div className="extract-progress-head">
									<span>{progress.stage}</span>
									<span>{Math.round(progress.percent)}%</span>
								</div>
								<div className="extract-progress-track">
									<div
										className="extract-progress-bar"
										style={{ width: `${progress.percent}%` }}
									/>
								</div>
							</div>
						) : null}
						<div className="bank-onboarding-actions">
							<button
								type="button"
								className="btn btn-primary"
								disabled={busy || !idFile}
								onClick={onExtractId}
							>
								{t.bankWizardExtract}
							</button>
							<button
								type="button"
								className="btn btn-ghost"
								disabled={busy}
								onClick={() => setStep(1)}
							>
								{t.bankWizardSkipId}
							</button>
						</div>
					</>
				) : null}

				{step === 1 ? (
					<>
						<label>
							{t.bankWizardFullName}
							<input
								value={form.full_name}
								onChange={(e) => patch({ full_name: e.target.value })}
								disabled={busy}
							/>
						</label>
						<label>
							{t.bankWizardDob}
							<input
								type="date"
								value={form.birth_date}
								onChange={(e) => patch({ birth_date: e.target.value })}
								disabled={busy}
							/>
						</label>
						{form.birth_date ? (
							<p className="playground-muted">
								{t.bankWizardAge}: {ageYears(form.birth_date)}
							</p>
						) : null}
						<label>
							{t.bankWizardDocument}
							<input
								value={form.document_number}
								onChange={(e) =>
									patch({ document_number: digitsOnly(e.target.value) })
								}
								disabled={busy}
								inputMode="numeric"
							/>
						</label>
					</>
				) : null}

				{step === 2 ? (
					<>
						<label>
							CEP
							<input
								value={maskCep(form.cep)}
								onChange={(e) => patch({ cep: digitsOnly(e.target.value) })}
								onBlur={onCepBlur}
								disabled={busy || cepLoading}
								inputMode="numeric"
							/>
						</label>
						{cepLoading ? (
							<p className="playground-muted">{t.bankWizardCepLoading}</p>
						) : null}
						<label>
							{t.bankWizardStreet}
							<input
								value={form.street}
								onChange={(e) => patch({ street: e.target.value })}
								disabled={busy}
							/>
						</label>
						<label>
							{t.bankWizardNumber}
							<input
								value={form.number}
								onChange={(e) => patch({ number: e.target.value })}
								disabled={busy}
							/>
						</label>
						<label>
							{t.bankWizardComplement}
							<input
								value={form.complement}
								onChange={(e) => patch({ complement: e.target.value })}
								disabled={busy}
							/>
						</label>
						<label>
							{t.bankWizardNeighborhood}
							<input
								value={form.neighborhood}
								onChange={(e) => patch({ neighborhood: e.target.value })}
								disabled={busy}
							/>
						</label>
						<label>
							{t.bankWizardCity}
							<input
								value={form.city}
								onChange={(e) => patch({ city: e.target.value })}
								disabled={busy}
							/>
						</label>
						<label>
							UF
							<input
								value={form.state}
								onChange={(e) =>
									patch({ state: e.target.value.toUpperCase().slice(0, 2) })
								}
								disabled={busy}
								maxLength={2}
							/>
						</label>
					</>
				) : null}

				{step === 3 ? (
					<>
						<label>
							Email
							<input
								type="email"
								value={form.email}
								onChange={(e) => patch({ email: e.target.value })}
								disabled={busy}
							/>
						</label>
						<label>
							{t.bankWizardPhone}
							<input
								value={maskPhone(form.phone)}
								onChange={(e) => patch({ phone: digitsOnly(e.target.value) })}
								disabled={busy}
								inputMode="tel"
							/>
						</label>
					</>
				) : null}

				{step === 4 ? (
					<>
						<p>{t.bankWizardTermsSummary}</p>
						<button
							type="button"
							className="btn btn-ghost"
							onClick={() => setTermsOpen(true)}
						>
							{t.bankWizardViewTerms}
						</button>
						<label
							className={`bank-terms-toggle${termsError ? " is-error" : ""}`}
						>
							<input
								type="checkbox"
								role="switch"
								checked={form.terms_accepted}
								onChange={(e) => {
									patch({ terms_accepted: e.target.checked });
									setTermsError(false);
								}}
								disabled={busy}
							/>
							<span>{t.bankTosLabel}</span>
						</label>
					</>
				) : null}

				{step === 5 ? (
					<form onSubmit={onConfirm}>
						<dl className="bank-review">
							<div>
								<dt>{t.bankWizardFullName}</dt>
								<dd>
									{form.full_name}{" "}
									<button type="button" className="linkish" onClick={() => setStep(1)}>
										{t.bankWizardEdit}
									</button>
								</dd>
							</div>
							<div>
								<dt>{t.bankWizardDob}</dt>
								<dd>{form.birth_date}</dd>
							</div>
							<div>
								<dt>{t.bankWizardDocument}</dt>
								<dd>{form.document_number}</dd>
							</div>
							<div>
								<dt>{t.bankWizardStreet}</dt>
								<dd>
									{form.street}, {form.number} — {form.city}/{form.state}{" "}
									<button type="button" className="linkish" onClick={() => setStep(2)}>
										{t.bankWizardEdit}
									</button>
								</dd>
							</div>
							<div>
								<dt>Email</dt>
								<dd>
									{form.email} / {maskPhone(form.phone)}{" "}
									<button type="button" className="linkish" onClick={() => setStep(3)}>
										{t.bankWizardEdit}
									</button>
								</dd>
							</div>
						</dl>
						<button className="btn btn-primary" type="submit" disabled={busy}>
							{t.bankWizardConfirm}
						</button>
					</form>
				) : null}

				{step > 0 && step < 5 ? (
					<div className="bank-onboarding-actions">
						<button type="button" className="btn btn-ghost" onClick={goBack} disabled={busy}>
							{t.bankWizardBack}
						</button>
						<button type="button" className="btn btn-primary" onClick={goNext} disabled={busy}>
							{t.bankWizardNext}
						</button>
					</div>
				) : null}
			</section>

			<p className="bank-skip-cta">
				<button type="button" className="btn btn-ghost" disabled={busy} onClick={onSkip}>
					{t.bankSkipDueDiligence}
				</button>
			</p>
			<p className="cv-page-actions">
				<Link className="btn btn-ghost" to="/playground/bank">
					{t.bankTransferBack}
				</Link>
			</p>

			{termsOpen ? (
				<div className="bank-modal" role="dialog" aria-modal="true">
					<div className="bank-modal-card">
						<h2>{t.bankWizardViewTerms}</h2>
						<p>{t.bankTosLabel}</p>
						<p className="playground-muted">{meta?.disclaimer}</p>
						<button type="button" className="btn btn-primary" onClick={() => setTermsOpen(false)}>
							OK
						</button>
					</div>
				</div>
			) : null}
		</>
	);
}
