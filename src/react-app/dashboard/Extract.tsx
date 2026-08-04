import {
	useId,
	useMemo,
	useRef,
	useState,
	type ChangeEvent,
	type DragEvent,
	type FormEvent,
} from "react";
import { extractDocument, type ExtractProgress } from "../api";
import { copy, type Lang } from "../content";
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

function formatBytes(n: number): string {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function fileKind(file: File): "pdf" | "image" | "other" {
	if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) return "pdf";
	if (file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(file.name)) {
		return "image";
	}
	return "other";
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

export function Extract({ lang }: Props) {
	const t = copy[lang].playground;
	const { busy, setBusy, error, setError } = useDashboard();
	const [docType, setDocType] = useState("identity_document");
	const [file, setFile] = useState<File | null>(null);
	const [consent, setConsent] = useState(false);
	const [result, setResult] = useState<unknown>(null);
	const [showJson, setShowJson] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [progress, setProgress] = useState<ExtractProgress | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const fileInputId = useId();

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

	function onFileChange(e: ChangeEvent<HTMLInputElement>) {
		pickFile(e.target.files?.[0] ?? null);
		e.target.value = "";
	}

	function onDrop(e: DragEvent<HTMLLabelElement>) {
		e.preventDefault();
		setDragging(false);
		if (busy) return;
		const next = e.dataTransfer.files?.[0] ?? null;
		if (next) pickFile(next);
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
			<p className="eyebrow">{t.pathExtract}</p>
			<h1>{t.pdeTitle}</h1>
			<p className="section-intro">{t.pdeHint}</p>

			<form className="playground-form extract-form" onSubmit={onExtract}>
					<label>
						{t.docType}
						<select
							value={docType}
							onChange={(e) => setDocType(e.target.value)}
							disabled={busy}
						>
							<option value="identity_document">{t.docTypeIdentity}</option>
							<option value="address_proof">{t.docTypeAddress}</option>
							<option value="invoice_nf">{t.docTypeInvoice}</option>
						</select>
					</label>

					<div className="file-field">
						<span className="file-field-label">{t.chooseFile}</span>
						<input
							ref={inputRef}
							id={fileInputId}
							className="file-input-hidden"
							type="file"
							accept="image/*,.pdf,application/pdf"
							onChange={onFileChange}
							disabled={busy}
						/>
						{!file ? (
							<label
								htmlFor={fileInputId}
								className={`file-dropzone${dragging ? " is-dragging" : ""}`}
								onDragEnter={(e) => {
									e.preventDefault();
									if (!busy) setDragging(true);
								}}
								onDragOver={(e) => {
									e.preventDefault();
									if (!busy) setDragging(true);
								}}
								onDragLeave={(e) => {
									e.preventDefault();
									if (e.currentTarget.contains(e.relatedTarget as Node)) return;
									setDragging(false);
								}}
								onDrop={onDrop}
							>
								<span className="file-dropzone-icon" aria-hidden="true">
									↑
								</span>
								<span className="file-dropzone-title">{t.dropHint}</span>
								<span className="file-dropzone-browse">{t.dropBrowse}</span>
							</label>
						) : (
							<div className={`file-selected kind-${fileKind(file)}`}>
								<div className="file-selected-badge" aria-hidden="true">
									{fileKind(file) === "pdf" ? "PDF" : "IMG"}
								</div>
								<div className="file-selected-meta">
									<strong title={file.name}>{file.name}</strong>
									<span>{formatBytes(file.size)}</span>
								</div>
								<div className="file-selected-actions">
									<button
										type="button"
										className="btn btn-ghost"
										disabled={busy}
										onClick={() => inputRef.current?.click()}
									>
										{t.dropReplace}
									</button>
									<button
										type="button"
										className="btn btn-ghost"
										disabled={busy}
										onClick={() => pickFile(null)}
									>
										{t.dropRemove}
									</button>
								</div>
							</div>
						)}
					</div>

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

					<label
						className={`playground-consent${consent ? " is-checked" : ""}`}
					>
						<input
							type="checkbox"
							checked={consent}
							onChange={(e) => setConsent(e.target.checked)}
							required
							disabled={busy}
						/>
						<span className="playground-consent-copy">
							<span className="playground-consent-title">{t.consentTitle}</span>
							<span className="playground-consent-text">{t.consentLabel}</span>
						</span>
					</label>
					<button
						className="btn btn-primary"
						type="submit"
						disabled={busy || !consent || !file}
					>
						{busy ? t.extracting : t.extract}
					</button>
				</form>

			{summary ? (
				<div className="extract-result surface-panel">
					<h2>{t.extracted}</h2>
					<p className="path-label">{t.resultSummary}</p>
					<dl className="extract-summary">
						{summary.rows.map((row) => (
							<div key={row.k}>
								<dt>{row.label}</dt>
								<dd className={row.v.includes("\n") ? "is-multiline" : undefined}>
									{row.v}
								</dd>
							</div>
						))}
					</dl>
					<button
						type="button"
						className="btn btn-ghost"
						onClick={() => setShowJson((v) => !v)}
					>
						{showJson ? t.resultHideJson : t.resultJson}
					</button>
					{showJson ? (
						<pre className="playground-result-json">
							{JSON.stringify(result, null, 2)}
						</pre>
					) : null}
				</div>
			) : !error && !busy ? (
				<p className="playground-muted">{t.extractEmpty}</p>
			) : null}
		</>
	);
}
