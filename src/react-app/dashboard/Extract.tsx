import { useMemo, useState, type FormEvent } from "react";
import { SurfacePanel } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { extractDocument, type ExtractProgress } from "../api";
import { copy, type Lang } from "../content";
import { FileDropzone } from "./FileDropzone";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

type SummaryRow = { k: string; label: string; v: string };

function labelFor(key: string, labels: Record<string, string>): string {
	return labels[key] ?? key.replace(/_/g, " ");
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
	return v != null && typeof v === "object" && !Array.isArray(v);
}

const DATE_FIELD_KEYS = new Set([
	"data",
	"data_emissao",
	"data_nascimento",
	"expiry_date",
	"issue_date",
	"validade",
]);

function fieldBase(key: string): string {
	const leaf = key.includes(".") ? (key.split(".").pop() ?? key) : key;
	return leaf.replace(/^(emitente|tomador|destinatario)_/, "");
}

function isDateField(key: string): boolean {
	const base = fieldBase(key);
	if (DATE_FIELD_KEYS.has(base)) return true;
	return base === "date" || /^data_/.test(base) || /_date$/.test(base);
}

function parseDateParts(raw: string): { y: number; m: number; d: number } | null {
	const s = raw.trim();
	let match = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/.exec(s);
	if (match) {
		return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
	}
	match = /^(\d{2})[/.-](\d{2})[/.-](\d{4})$/.exec(s);
	if (match) {
		return { y: Number(match[3]), m: Number(match[2]), d: Number(match[1]) };
	}
	return null;
}

function formatHumanDate(raw: string, lang: Lang): string | null {
	const parts = parseDateParts(raw);
	if (!parts) return null;
	const { y, m, d } = parts;
	if (m < 1 || m > 12 || d < 1 || d > 31) return null;
	const date = new Date(Date.UTC(y, m - 1, d, 12));
	if (
		date.getUTCFullYear() !== y ||
		date.getUTCMonth() !== m - 1 ||
		date.getUTCDate() !== d
	) {
		return null;
	}
	return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
}

function formatScalar(v: unknown, lang?: Lang, key?: string): string | null {
	if (v == null || v === "") return null;
	if (typeof v === "string") {
		if (lang && key && isDateField(key)) {
			return formatHumanDate(v, lang) ?? v;
		}
		return v;
	}
	if (typeof v === "number" || typeof v === "boolean") {
		return String(v);
	}
	return null;
}

function pushRow(
	rows: SummaryRow[],
	seen: Set<string>,
	key: string,
	value: unknown,
	labels: Record<string, string>,
	lang: Lang,
) {
	if (seen.has(key)) return;
	const formatted = formatScalar(value, lang, key);
	if (formatted == null) return;
	seen.add(key);
	rows.push({ k: key, label: labelFor(key, labels), v: formatted });
}

function flattenObject(
	obj: Record<string, unknown>,
	labels: Record<string, string>,
	lang: Lang,
	prefix = "",
): SummaryRow[] {
	const rows: SummaryRow[] = [];
	const seen = new Set<string>();

	const preferred = [
		"tipo",
		"nome",
		"full_name",
		"name",
		"cpf",
		"rg",
		"cnpj",
		"numero_documento",
		"document_number",
		"data_nascimento",
		"orgao_emissor",
		"validade",
		"expiry_date",
		"logradouro",
		"numero",
		"bairro",
		"cidade",
		"uf",
		"cep",
		"emissor",
		"data",
		"issue_date",
		"serie",
		"valor_total",
		"total",
		"invoice_number",
		"data_emissao",
		"address",
		"endereco",
	];

	for (const key of preferred) {
		pushRow(rows, seen, prefix ? `${prefix}.${key}` : key, obj[key], labels, lang);
	}

	for (const [key, value] of Object.entries(obj)) {
		const path = prefix ? `${prefix}.${key}` : key;
		if (seen.has(path) || seen.has(key)) continue;

		if (isPlainObject(value)) {
			const nestedPreferred = ["nome", "cpf", "cnpj"];
			for (const nk of nestedPreferred) {
				const nestedKey = `${key}_${nk}`;
				pushRow(rows, seen, nestedKey, value[nk], labels, lang);
			}
			for (const [nk, nv] of Object.entries(value)) {
				const nestedKey = `${key}_${nk}`;
				pushRow(rows, seen, nestedKey, nv, labels, lang);
			}
			continue;
		}

		if (Array.isArray(value)) {
			if (value.length === 0) continue;
			const lines = value
				.map((item, i) => {
					if (!isPlainObject(item)) return formatScalar(item) ?? "";
					const desc = formatScalar(item.descricao) ?? `Item ${i + 1}`;
					const qty = formatScalar(item.quantidade);
					const valor = formatScalar(item.valor);
					const bits = [desc];
					if (qty) bits.push(`qtd ${qty}`);
					if (valor) bits.push(`R$ ${valor}`);
					return bits.join(" · ");
				})
				.filter(Boolean);
			if (lines.length) {
				seen.add(path);
				rows.push({
					k: path,
					label: labelFor(key, labels),
					v: lines.join("\n"),
				});
			}
			continue;
		}

		pushRow(rows, seen, key, value, labels, lang);
	}

	return rows;
}

function summarize(
	data: unknown,
	docType: string,
	labels: Record<string, string>,
	lang: Lang,
): { title: string; rows: SummaryRow[] } {
	const rows: SummaryRow[] = [
		{
			k: "doc_type",
			label: labelFor("doc_type", labels),
			v: labelFor(docType, labels) !== docType ? labelFor(docType, labels) : docType,
		},
	];
	if (!isPlainObject(data)) {
		return { title: docType, rows };
	}

	const payload = isPlainObject(data.data)
		? data.data
		: isPlainObject(data.fields)
			? data.fields
			: data;

	const resolvedType = String(data.doc_type ?? payload.doc_type ?? docType);
	rows[0].v =
		labelFor(resolvedType, labels) !== resolvedType
			? labelFor(resolvedType, labels)
			: resolvedType;

	rows.push(...flattenObject(payload, labels, lang));
	return { title: resolvedType, rows };
}

function isUnauthorized(err: unknown): boolean {
	if (!(err instanceof Error)) return false;
	const msg = err.message.toLowerCase();
	return msg === "unauthorized" || msg.includes("unauthorized");
}

const selectClassName =
	"flex h-10 w-full rounded-md border border-input bg-bg-deep px-3 py-2 text-sm text-fg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function Extract({ lang }: Props) {
	const t = copy[lang].playground;
	const { busy, setBusy, error, setError } = useDashboard();
	const [docType, setDocType] = useState("identity_document");
	const [file, setFile] = useState<File | null>(null);
	const [consent, setConsent] = useState(false);
	const [result, setResult] = useState<unknown>(null);
	const [showJson, setShowJson] = useState(false);
	const [progress, setProgress] = useState<ExtractProgress | null>(null);

	const summary = useMemo(
		() => (result != null ? summarize(result, docType, t.fieldLabels, lang) : null),
		[result, docType, t.fieldLabels, lang],
	);

	function pickFile(next: File | null) {
		setFile(next);
		setError("");
		setResult(null);
		setShowJson(false);
		setProgress(null);
	}

	async function onExtract(e: FormEvent) {
		e.preventDefault();
		if (!consent) {
			setError(t.consentRequired);
			return;
		}
		if (!file) {
			setError(t.extractEmpty);
			return;
		}
		setBusy(true);
		setError("");
		setResult(null);
		setShowJson(false);
		setProgress({ percent: 2, stage: "upload" });
		try {
			setResult(await extractDocument(file, docType, consent, setProgress));
		} catch (err) {
			if (isUnauthorized(err)) {
				setError(t.needToken);
			} else {
				setError(err instanceof Error ? err.message : t.extractError);
			}
			setProgress(null);
		} finally {
			setBusy(false);
		}
	}

	const progressLabel =
		progress?.stage === "upload" ? t.uploadProgress : t.extractProgress;

	return (
		<>
			<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
				{t.pathExtract}
			</p>
			<h1 className="font-display mb-3 text-3xl font-semibold tracking-tight">
				{t.pdeTitle}
			</h1>
			<p className="mb-8 max-w-2xl text-muted">{t.pdeHint}</p>

			<form className="grid w-full max-w-md gap-4" onSubmit={onExtract}>
				<div className="grid gap-2">
					<Label htmlFor="extract-doc-type">{t.docType}</Label>
					<select
						id="extract-doc-type"
						className={selectClassName}
						value={docType}
						onChange={(e) => setDocType(e.target.value)}
						disabled={busy}
					>
						<option value="identity_document">{t.docTypeIdentity}</option>
						<option value="address_proof">{t.docTypeAddress}</option>
						<option value="invoice_nf">{t.docTypeInvoice}</option>
					</select>
				</div>

				<div className="grid gap-2">
					<span className="font-display text-xs text-muted">{t.chooseFile}</span>
					<FileDropzone
						file={file}
						onFile={pickFile}
						disabled={busy}
						dropHint={t.dropHint}
						dropBrowse={t.dropBrowse}
						dropReplace={t.dropReplace}
						dropRemove={t.dropRemove}
					/>
				</div>

				{progress ? (
					<div
						className="grid gap-2 rounded-md border border-border bg-bg-deep/50 p-3"
						role="status"
						aria-live="polite"
					>
						<div className="flex justify-between gap-3 font-display text-xs text-muted">
							<span>{progressLabel}</span>
							<span>{Math.round(progress.percent)}%</span>
						</div>
						<div
							className="h-1.5 overflow-hidden rounded-full bg-fg/5"
							aria-valuemin={0}
							aria-valuemax={100}
							aria-valuenow={Math.round(progress.percent)}
							role="progressbar"
						>
							<span
								className="block h-full rounded-full bg-gradient-to-r from-[#c4872f] via-accent to-accent-cool transition-[width] duration-250"
								style={{
									width: `${Math.max(4, progress.percent)}%`,
									...(progress.stage === "extract"
										? {
												backgroundSize: "200% 100%",
												animation:
													"extract-shimmer 1.1s linear infinite",
											}
										: {}),
								}}
							/>
						</div>
					</div>
				) : null}

				<label
					className={cn(
						"grid cursor-pointer grid-cols-[auto_1fr] items-start gap-3 rounded-md border border-accent/25 bg-gradient-to-br from-accent/[0.07] to-transparent bg-bg-deep/55 p-4 transition-colors hover:border-accent/40",
						consent &&
							"border-accent/55 from-accent/15 bg-surface/70 shadow-[0_0_0_1px_rgba(231,163,57,0.08)]",
					)}
				>
					<input
						type="checkbox"
						className="mt-1 size-4 shrink-0 accent-accent"
						checked={consent}
						onChange={(e) => setConsent(e.target.checked)}
						required
						disabled={busy}
					/>
					<span className="grid min-w-0 gap-1.5">
						<span className="font-display text-sm font-semibold tracking-wide text-accent">
							{t.consentTitle}
						</span>
						<span className="text-sm leading-relaxed text-muted">
							{t.consentLabel}
						</span>
					</span>
				</label>
				<Button type="submit" disabled={busy || !consent || !file}>
					{busy ? t.extracting : t.extract}
				</Button>
			</form>

			{summary ? (
				<SurfacePanel className="my-4 grid gap-4">
					<h2 className="font-display text-xl font-semibold tracking-tight">
						{t.extracted}
					</h2>
					<p className="font-display text-xs font-medium tracking-wide text-accent-cool">
						{t.resultSummary}
					</p>
					<dl className="mb-2 grid gap-2">
						{summary.rows.map((row) => (
							<div
								key={row.k}
								className="grid gap-1 border-b border-border pb-2 sm:grid-cols-[minmax(6rem,10rem)_1fr] sm:gap-3"
							>
								<dt className="font-display text-xs text-muted">{row.label}</dt>
								<dd
									className={cn(
										"m-0 break-words text-fg",
										row.v.includes("\n") && "whitespace-pre-line",
									)}
								>
									{row.v}
								</dd>
							</div>
						))}
					</dl>
					<Button
						type="button"
						variant="ghost"
						onClick={() => setShowJson((v) => !v)}
					>
						{showJson ? t.resultHideJson : t.resultJson}
					</Button>
					{showJson ? (
						<pre className="mt-3 max-h-88 overflow-auto rounded-md border border-border bg-bg-deep/55 p-3.5 font-display text-xs leading-relaxed break-words whitespace-pre-wrap text-fg">
							{JSON.stringify(result, null, 2)}
						</pre>
					) : null}
				</SurfacePanel>
			) : !error && !busy ? (
				<p className="mt-6 text-muted">{t.extractEmpty}</p>
			) : null}
		</>
	);
}
