import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
	bankCepLookup,
	bankOnboardingComplete,
	bankOnboardingDocuments,
	bankOnboardingSkip,
	bankOnboardingStart,
	extractDocument,
	listExtractions,
	type ExtractProgress,
} from "../api";
import { copy, type Lang } from "../content";
import { SurfacePanel } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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
import {
	useBankOnboardingAccount,
	type Step,
	type WizardState,
} from "./useBankOnboardingAccount";

type Props = { lang: Lang };

const STEPS = [
	"ID document",
	"Account holder",
	"Address",
	"Contact",
	"Terms",
	"Review",
] as const;

function isPlainObject(v: unknown): v is Record<string, unknown> {
	return v != null && typeof v === "object" && !Array.isArray(v);
}

function summaryFromExtract(result: unknown): Record<string, unknown> | null {
	if (!isPlainObject(result)) return null;
	// POST /v1/extract → { data: {...} }
	if (isPlainObject(result.data)) return result.data;
	// GET /v1/extractions → { result: { data: {...} } } or { result: {...fields} }
	if (isPlainObject(result.result)) {
		const nested = summaryFromExtract(result.result);
		if (nested) return nested;
	}
	if (isPlainObject(result.fields)) return result.fields;
	if (
		typeof result.nome === "string" ||
		typeof result.cpf === "string" ||
		typeof result.full_name === "string"
	) {
		return result;
	}
	return null;
}

function strField(data: Record<string, unknown>, ...keys: string[]): string {
	for (const key of keys) {
		const v = data[key];
		if (typeof v === "string" && v.trim()) return v.trim();
	}
	return "";
}

function Field({
	label,
	children,
	className,
}: {
	label: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("grid gap-2", className)}>
			<Label>{label}</Label>
			{children}
		</div>
	);
}

export function BankOnboarding({ lang }: Props) {
	const [searchParams] = useSearchParams();
	const accountId = searchParams.get("account") ?? "";
	return (
		<BankOnboardingWizard
			key={accountId || "new"}
			lang={lang}
			accountId={accountId}
		/>
	);
}

function BankOnboardingWizard({
	lang,
	accountId,
}: {
	lang: Lang;
	accountId: string;
}) {
	const t = copy[lang].playground;
	const navigate = useNavigate();
	const { busy, setBusy, setError } = useDashboard();
	const {
		persistKey,
		form,
		setForm,
		step,
		setStep,
		patch,
		meta,
		bindAccountUrl,
	} = useBankOnboardingAccount(accountId);
	const [idFile, setIdFile] = useState<File | null>(null);
	const [progress, setProgress] = useState<ExtractProgress | null>(null);
	const [cepLoading, setCepLoading] = useState(false);
	const [termsOpen, setTermsOpen] = useState(false);
	const [termsError, setTermsError] = useState(false);

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
			const started = await bankOnboardingStart(accountId || undefined);
			const target = started.account_id || accountId || undefined;
			const extracted = await extractDocument(
				idFile,
				"identity_document",
				true,
				setProgress,
				{ refresh: true },
			);
			const listed = await listExtractions("identity_document");
			const latest = listed[0];
			const summary =
				summaryFromExtract(extracted) ?? summaryFromExtract(latest);
			const nextForm: WizardState = summary
				? {
						...form,
						full_name:
							strField(summary, "nome", "name", "full_name") || form.full_name,
						birth_date:
							strField(summary, "data_nascimento", "birth_date") ||
							form.birth_date,
						document_number:
							digitsOnly(
								strField(summary, "cpf", "numero_documento", "document_number"),
							) || form.document_number,
					}
				: form;
			if (summary) {
				await bankOnboardingDocuments({
					doc_type: "identity_document",
					pde_extraction_id: typeof latest?.id === "string" ? latest.id : null,
					summary,
					account_id: target,
				});
				setForm(nextForm);
			}
			bindAccountUrl(target, nextForm, 1);
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
			await bankOnboardingSkip({
				idempotencyKey: crypto.randomUUID(),
				accountId: accountId || undefined,
			});
			sessionStorage.removeItem(persistKey);
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
			await bankOnboardingComplete(
				{
					account_id: accountId || undefined,
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
			sessionStorage.removeItem(persistKey);
			navigate("/playground/bank", { replace: true });
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankOnboardingError);
		} finally {
			setBusy(false);
		}
	}

	return (
		<>
			<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
				{t.pathBank}
			</p>
			<div className="mb-1 flex flex-wrap items-baseline gap-x-3.5 gap-y-2.5">
				<h1 className="font-display m-0 text-3xl font-semibold tracking-tight">
					{t.bankOnboardingTitle}
				</h1>
				<Badge
					variant="outline"
					className="border-accent/45 bg-accent/10 text-[0.68rem] font-semibold tracking-[0.08em] text-accent uppercase"
				>
					{t.bankDemoBadge}
				</Badge>
			</div>
			<p className="mb-4 text-muted">{t.bankOnboardingIntro}</p>

			{meta ? (
				<p className="mb-4 text-sm text-muted">
					{meta.disclaimer} · {meta.welcome_amount} {meta.currency}
				</p>
			) : null}

			<p className="mb-2 text-sm text-muted" aria-live="polite">
				{step + 1} / {stepLabels.length}
				<span className="text-fg"> · {stepLabels[step]}</span>
			</p>
			<ol
				className="mb-6 flex list-none flex-wrap gap-2 p-0"
				aria-label="Onboarding steps"
			>
				{stepLabels.map((label, i) => {
					const state =
						i < step ? "done" : i === step ? "current" : "pending";
					return (
						<li
							key={label}
							className={cn(
								"inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs",
								state === "current" &&
									"border-accent/50 bg-accent/10 text-accent",
								state === "done" &&
									"border-accent-cool/40 bg-cool-soft text-accent-cool",
								state === "pending" && "border-border text-muted",
							)}
						>
							<span className="font-semibold tabular-nums">{i + 1}</span>
							<span className="hidden sm:inline">{label}</span>
						</li>
					);
				})}
			</ol>

			<SurfacePanel className="mb-5">
				<div className="grid gap-4">
					{step === 0 ? (
						<>
							<p className="m-0 text-fg">{t.bankWizardIdHint}</p>
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
								<div className="grid gap-2" role="status">
									<div className="flex justify-between text-sm text-muted">
										<span>{progress.stage}</span>
										<span>{Math.round(progress.percent)}%</span>
									</div>
									<div className="h-1.5 overflow-hidden rounded-full bg-border">
										<div
											className="h-full rounded-full bg-accent transition-[width] duration-200"
											style={{ width: `${progress.percent}%` }}
										/>
									</div>
								</div>
							) : null}
							<div className="mt-1 grid gap-2">
								<Button
									type="button"
									className="min-h-11 w-full touch-manipulation"
									disabled={busy || !idFile}
									onClick={onExtractId}
								>
									{t.bankWizardExtract}
								</Button>
								<Button
									type="button"
									variant="ghost"
									className="min-h-11 w-full touch-manipulation"
									disabled={busy}
									onClick={() => setStep(1)}
								>
									{t.bankWizardSkipId}
								</Button>
							</div>
						</>
					) : null}

					{step === 1 ? (
						<>
							<Field label={t.bankWizardFullName}>
								<Input
									value={form.full_name}
									onChange={(e) => patch({ full_name: e.target.value })}
									disabled={busy}
								/>
							</Field>
							<Field label={t.bankWizardDob}>
								<Input
									type="date"
									value={form.birth_date}
									onChange={(e) => patch({ birth_date: e.target.value })}
									disabled={busy}
								/>
							</Field>
							{form.birth_date ? (
								<p className="m-0 text-sm text-muted">
									{t.bankWizardAge}: {ageYears(form.birth_date)}
								</p>
							) : null}
							<Field label={t.bankWizardDocument}>
								<Input
									value={form.document_number}
									onChange={(e) =>
										patch({ document_number: digitsOnly(e.target.value) })
									}
									disabled={busy}
									inputMode="numeric"
								/>
							</Field>
						</>
					) : null}

					{step === 2 ? (
						<>
							<Field label="CEP">
								<Input
									value={maskCep(form.cep)}
									onChange={(e) => patch({ cep: digitsOnly(e.target.value) })}
									onBlur={onCepBlur}
									disabled={busy || cepLoading}
									inputMode="numeric"
								/>
							</Field>
							{cepLoading ? (
								<p className="m-0 text-sm text-muted">{t.bankWizardCepLoading}</p>
							) : null}
							<Field label={t.bankWizardStreet}>
								<Input
									value={form.street}
									onChange={(e) => patch({ street: e.target.value })}
									disabled={busy}
								/>
							</Field>
							<div className="grid min-w-0 grid-cols-2 gap-3">
								<Field label={t.bankWizardNumber}>
									<Input
										value={form.number}
										onChange={(e) => patch({ number: e.target.value })}
										disabled={busy}
									/>
								</Field>
								<Field label={t.bankWizardComplement}>
									<Input
										value={form.complement}
										onChange={(e) => patch({ complement: e.target.value })}
										disabled={busy}
									/>
								</Field>
							</div>
							<Field label={t.bankWizardNeighborhood}>
								<Input
									value={form.neighborhood}
									onChange={(e) => patch({ neighborhood: e.target.value })}
									disabled={busy}
								/>
							</Field>
							<div className="grid min-w-0 grid-cols-[1fr_5.5rem] gap-3">
								<Field label={t.bankWizardCity} className="min-w-0">
									<Input
										value={form.city}
										onChange={(e) => patch({ city: e.target.value })}
										disabled={busy}
									/>
								</Field>
								<Field label="UF">
									<Input
										value={form.state}
										onChange={(e) =>
											patch({ state: e.target.value.toUpperCase().slice(0, 2) })
										}
										disabled={busy}
										maxLength={2}
										autoCapitalize="characters"
									/>
								</Field>
							</div>
						</>
					) : null}

					{step === 3 ? (
						<>
							<Field label="Email">
								<Input
									type="email"
									value={form.email}
									onChange={(e) => patch({ email: e.target.value })}
									disabled={busy}
								/>
							</Field>
							<Field label={t.bankWizardPhone}>
								<Input
									value={maskPhone(form.phone)}
									onChange={(e) => patch({ phone: digitsOnly(e.target.value) })}
									disabled={busy}
									inputMode="tel"
								/>
							</Field>
						</>
					) : null}

					{step === 4 ? (
						<>
							<p className="m-0 text-fg">{t.bankWizardTermsSummary}</p>
							<Button
								type="button"
								variant="ghost"
								onClick={() => setTermsOpen(true)}
							>
								{t.bankWizardViewTerms}
							</Button>
							<label
								className={cn(
									"flex cursor-pointer items-start gap-3 rounded-md border border-border bg-bg-deep/40 p-3 transition-colors",
									form.terms_accepted && "border-accent/45 bg-accent/5",
									termsError && "border-danger aria-invalid:border-danger",
								)}
							>
								<input
									type="checkbox"
									className="mt-0.5 size-4 accent-[var(--accent)]"
									checked={form.terms_accepted}
									onChange={(e) => {
										patch({ terms_accepted: e.target.checked });
										setTermsError(false);
									}}
									disabled={busy}
								/>
								<span className="text-sm text-fg">{t.bankTosLabel}</span>
							</label>
						</>
					) : null}

					{step === 5 ? (
						<form className="grid gap-4" onSubmit={onConfirm}>
							<dl className="m-0 grid gap-3">
								<div>
									<dt className="mb-0.5 text-xs text-muted">
										{t.bankWizardFullName}
									</dt>
									<dd className="m-0 text-fg">
										{form.full_name}{" "}
										<button
											type="button"
											className="text-accent underline-offset-4 hover:underline"
											onClick={() => setStep(1)}
										>
											{t.bankWizardEdit}
										</button>
									</dd>
								</div>
								<div>
									<dt className="mb-0.5 text-xs text-muted">{t.bankWizardDob}</dt>
									<dd className="m-0 text-fg">{form.birth_date}</dd>
								</div>
								<div>
									<dt className="mb-0.5 text-xs text-muted">
										{t.bankWizardDocument}
									</dt>
									<dd className="m-0 text-fg">{form.document_number}</dd>
								</div>
								<div>
									<dt className="mb-0.5 text-xs text-muted">
										{t.bankWizardStreet}
									</dt>
									<dd className="m-0 text-fg">
										{form.street}, {form.number} — {form.city}/{form.state}{" "}
										<button
											type="button"
											className="text-accent underline-offset-4 hover:underline"
											onClick={() => setStep(2)}
										>
											{t.bankWizardEdit}
										</button>
									</dd>
								</div>
								<div>
									<dt className="mb-0.5 text-xs text-muted">Email</dt>
									<dd className="m-0 text-fg">
										{form.email} / {maskPhone(form.phone)}{" "}
										<button
											type="button"
											className="text-accent underline-offset-4 hover:underline"
											onClick={() => setStep(3)}
										>
											{t.bankWizardEdit}
										</button>
									</dd>
								</div>
							</dl>
							<Button className="w-full" type="submit" disabled={busy}>
								{t.bankWizardConfirm}
							</Button>
						</form>
					) : null}

					{step > 0 && step < 5 ? (
						<div className="mt-1 grid gap-2">
							<Button
								type="button"
								variant="ghost"
								className="min-h-11 w-full touch-manipulation"
								onClick={goBack}
								disabled={busy}
							>
								{t.bankWizardBack}
							</Button>
							<Button
								type="button"
								className="min-h-11 w-full touch-manipulation"
								onClick={goNext}
								disabled={busy}
							>
								{t.bankWizardNext}
							</Button>
						</div>
					) : null}
				</div>
			</SurfacePanel>

			<p className="mb-2 mt-4">
				<Button
					type="button"
					variant="ghost"
					className="min-h-11 touch-manipulation"
					disabled={busy}
					onClick={onSkip}
				>
					{t.bankSkipDueDiligence}
				</Button>
			</p>
			<p className="mb-0">
				<Link
					className={buttonVariants({ variant: "ghost" })}
					to="/playground/bank"
				>
					{t.bankTransferBack}
				</Link>
			</p>

			<Dialog open={termsOpen} onOpenChange={setTermsOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>{t.bankWizardViewTerms}</DialogTitle>
						<DialogDescription>{t.bankTosLabel}</DialogDescription>
					</DialogHeader>
					{meta?.disclaimer ? (
						<p className="text-sm text-muted">{meta.disclaimer}</p>
					) : null}
					<DialogFooter>
						<Button type="button" onClick={() => setTermsOpen(false)}>
							OK
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
