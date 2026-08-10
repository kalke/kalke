import {
	useEffect,
	useState,
	type ChangeEvent,
	type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router";
import {
	BANK_DD_POLICY,
	BANK_TOS_POLICY,
	bankBootstrap,
	bankMeta,
	bankOnboardingComplete,
	bankOnboardingConsent,
	bankOnboardingDocuments,
	bankOnboardingSkip,
	bankOnboardingStart,
	extractDocument,
	listExtractions,
	type BankMeta,
	type ExtractProgress,
} from "../api";
import { copy, type Lang } from "../content";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };
type Step = "consent" | "docs";
type DocKind = "identity_document" | "address_proof";

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

export function BankOnboarding({ lang }: Props) {
	const t = copy[lang].playground;
	const navigate = useNavigate();
	const { busy, setBusy, setError } = useDashboard();
	const [meta, setMeta] = useState<BankMeta | null>(null);
	const [step, setStep] = useState<Step>("consent");
	const [tos, setTos] = useState(false);
	const [identityDone, setIdentityDone] = useState(false);
	const [addressDone, setAddressDone] = useState(false);
	const [identityFile, setIdentityFile] = useState<File | null>(null);
	const [addressFile, setAddressFile] = useState<File | null>(null);
	const [progress, setProgress] = useState<ExtractProgress | null>(null);
	const [bootstrapping, setBootstrapping] = useState(false);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const m = await bankMeta();
				if (!cancelled) setMeta(m);
			} catch {
				/* meta is informational; onboarding can proceed without it */
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	async function finishWithBootstrap() {
		setBootstrapping(true);
		await bankBootstrap();
		navigate("/playground/bank", { replace: true });
	}

	async function onConsentContinue(e: FormEvent) {
		e.preventDefault();
		if (!tos) {
			setError(t.bankTosRequired);
			return;
		}
		setBusy(true);
		setError("");
		try {
			await bankOnboardingStart();
			await bankOnboardingConsent(BANK_TOS_POLICY);
			setStep("docs");
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankOnboardingError);
		} finally {
			setBusy(false);
		}
	}

	async function uploadDoc(kind: DocKind, file: File | null) {
		if (!file) {
			setError(t.extractEmpty);
			return;
		}
		setBusy(true);
		setError("");
		setProgress({ percent: 2, stage: "upload" });
		try {
			const result = await extractDocument(file, kind, true, setProgress);
			const items = await listExtractions(kind);
			const newest = items[0];
			await bankOnboardingDocuments({
				doc_type: kind,
				pde_extraction_id: newest?.id ?? null,
				summary: summaryFromExtract(result),
			});
			if (kind === "identity_document") {
				setIdentityDone(true);
				setIdentityFile(null);
			} else {
				setAddressDone(true);
				setAddressFile(null);
			}
			setProgress(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : t.extractError);
			setProgress(null);
		} finally {
			setBusy(false);
		}
	}

	async function onSkip() {
		setBusy(true);
		setError("");
		try {
			await bankOnboardingSkip();
			await finishWithBootstrap();
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankOnboardingError);
			setBootstrapping(false);
		} finally {
			setBusy(false);
		}
	}

	async function onFinish() {
		setBusy(true);
		setError("");
		try {
			if (identityDone || addressDone) {
				await bankOnboardingConsent(BANK_DD_POLICY);
			}
			await bankOnboardingComplete();
			await finishWithBootstrap();
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankOnboardingError);
			setBootstrapping(false);
		} finally {
			setBusy(false);
		}
	}

	const progressLabel =
		progress?.stage === "upload" ? t.uploadProgress : t.extractProgress;

	return (
		<>
			<p className="eyebrow">{t.pathBank}</p>
			<div className="bank-title-row">
				<h1>{t.bankOnboardingTitle}</h1>
				<span className="bank-demo-badge">{t.bankDemoBadge}</span>
			</div>
			<p className="section-intro">{t.bankOnboardingIntro}</p>

			<p className="cv-page-actions">
				<Link className="btn btn-ghost" to="/playground/bank">
					{t.bankTransferBack}
				</Link>
			</p>

			{step === "consent" ? (
				<form className="playground-form extract-form" onSubmit={onConsentContinue}>
					{meta ? (
						<section className="playground-panel bank-panel">
							<h2>{t.bankDisclaimerTitle}</h2>
							<p className="playground-muted">{meta.disclaimer}</p>
							<p className="playground-muted">
								{meta.welcome_amount} {meta.currency}
							</p>
						</section>
					) : null}

					<label className={`playground-consent${tos ? " is-checked" : ""}`}>
						<input
							type="checkbox"
							checked={tos}
							onChange={(e) => setTos(e.target.checked)}
							required
							disabled={busy}
						/>
						<span className="playground-consent-copy">
							<span className="playground-consent-title">{t.bankTosTitle}</span>
							<span className="playground-consent-text">{t.bankTosLabel}</span>
						</span>
					</label>

					<button
						className="btn btn-primary"
						type="submit"
						disabled={busy || !tos}
					>
						{t.bankContinue}
					</button>
				</form>
			) : (
				<section className="bank-docs">
					<h2>{t.bankDocsTitle}</h2>
					<p className="section-intro">{t.bankDocsHint}</p>

					<div className="playground-form extract-form">
						<label>
							{t.bankDocIdentity}
							{identityDone ? (
								<span className="bank-doc-status">{t.bankDocUploaded}</span>
							) : (
								<>
									<input
										type="file"
										accept="image/*,.pdf,application/pdf"
										disabled={busy}
										onChange={(e: ChangeEvent<HTMLInputElement>) => {
											setIdentityFile(e.target.files?.[0] ?? null);
											e.target.value = "";
										}}
									/>
									<button
										type="button"
										className="btn btn-ghost"
										disabled={busy || !identityFile}
										onClick={() => void uploadDoc("identity_document", identityFile)}
									>
										{t.bankDocUpload}
									</button>
								</>
							)}
						</label>

						<label>
							{t.bankDocAddress}
							{addressDone ? (
								<span className="bank-doc-status">{t.bankDocUploaded}</span>
							) : (
								<>
									<input
										type="file"
										accept="image/*,.pdf,application/pdf"
										disabled={busy}
										onChange={(e: ChangeEvent<HTMLInputElement>) => {
											setAddressFile(e.target.files?.[0] ?? null);
											e.target.value = "";
										}}
									/>
									<button
										type="button"
										className="btn btn-ghost"
										disabled={busy || !addressFile}
										onClick={() => void uploadDoc("address_proof", addressFile)}
									>
										{t.bankDocUpload}
									</button>
								</>
							)}
						</label>

						{progress ? (
							<div
								className={`extract-progress${progress.stage === "extract" ? " is-extracting" : ""}`}
								role="status"
								aria-live="polite"
							>
								<div className="extract-progress-head">
									<span>{progressLabel}</span>
									<span>{Math.round(progress.percent)}%</span>
								</div>
								<div
									className="extract-progress-track"
									aria-valuemin={0}
									aria-valuemax={100}
									aria-valuenow={Math.round(progress.percent)}
									role="progressbar"
								>
									<span
										className="extract-progress-fill"
										style={{ width: `${Math.max(4, progress.percent)}%` }}
									/>
								</div>
							</div>
						) : null}

						{bootstrapping ? (
							<p className="playground-muted">{t.bankBootstrapping}</p>
						) : null}

						<div className="bank-onboarding-actions">
							<button
								type="button"
								className="btn btn-ghost bank-skip-cta"
								disabled={busy}
								onClick={() => void onSkip()}
							>
								{t.bankDocSkip}
							</button>
							<p className="playground-muted bank-skip-hint">{t.bankDocSkipHint}</p>
							<button
								type="button"
								className="btn btn-primary"
								disabled={busy || (!identityDone && !addressDone)}
								onClick={() => void onFinish()}
							>
								{t.bankFinish}
							</button>
						</div>
					</div>
				</section>
			)}
		</>
	);
}
