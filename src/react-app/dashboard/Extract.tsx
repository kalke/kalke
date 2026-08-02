import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
	clearWorkingPat,
	extractDocument,
} from "../api";
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

function formatScalar(v: unknown): string | null {
	if (v == null || v === "") return null;
	if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
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
) {
	if (seen.has(key)) return;
	const formatted = formatScalar(value);
	if (formatted == null) return;
	seen.add(key);
	rows.push({ k: key, label: labelFor(key, labels), v: formatted });
}

function flattenObject(
	obj: Record<string, unknown>,
	labels: Record<string, string>,
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
		pushRow(rows, seen, prefix ? `${prefix}.${key}` : key, obj[key], labels);
	}

	for (const [key, value] of Object.entries(obj)) {
		const path = prefix ? `${prefix}.${key}` : key;
		if (seen.has(path) || seen.has(key)) continue;

		if (isPlainObject(value)) {
			const nestedPreferred = ["nome", "cpf", "cnpj"];
			for (const nk of nestedPreferred) {
				const nestedKey = `${key}_${nk}`;
				pushRow(rows, seen, nestedKey, value[nk], labels);
			}
			for (const [nk, nv] of Object.entries(value)) {
				const nestedKey = `${key}_${nk}`;
				pushRow(rows, seen, nestedKey, nv, labels);
			}
			continue;
		}

		if (Array.isArray(value)) {
			if (value.length === 0) continue;
			const lines = value.map((item, i) => {
				if (!isPlainObject(item)) return formatScalar(item) ?? "";
				const desc = formatScalar(item.descricao) ?? `Item ${i + 1}`;
				const qty = formatScalar(item.quantidade);
				const valor = formatScalar(item.valor);
				const bits = [desc];
				if (qty) bits.push(`qtd ${qty}`);
				if (valor) bits.push(`R$ ${valor}`);
				return bits.join(" · ");
			}).filter(Boolean);
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

		pushRow(rows, seen, key, value, labels);
	}

	return rows;
}

function summarize(
	data: unknown,
	docType: string,
	labels: Record<string, string>,
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

	rows.push(...flattenObject(payload, labels));
	return { title: resolvedType, rows };
}

function isUnauthorized(err: unknown): boolean {
	if (!(err instanceof Error)) return false;
	const msg = err.message.toLowerCase();
	return msg === "unauthorized" || msg.includes("unauthorized");
}

export function Extract({ lang }: Props) {
	const t = copy[lang].playground;
	const { ensureWorkingPat, busy, setBusy, error, setError } = useDashboard();
	const [docType, setDocType] = useState("identity_document");
	const [file, setFile] = useState<File | null>(null);
	const [consent, setConsent] = useState(false);
	const [result, setResult] = useState<unknown>(null);
	const [showJson, setShowJson] = useState(false);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				await ensureWorkingPat();
				if (!cancelled) setReady(true);
			} catch {
				if (!cancelled) setError(t.needToken);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [ensureWorkingPat, setError, t.needToken]);

	const summary = useMemo(
		() => (result != null ? summarize(result, docType, t.fieldLabels) : null),
		[result, docType, t.fieldLabels],
	);

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
		try {
			let pat = await ensureWorkingPat();
			try {
				setResult(await extractDocument(pat, file, docType, consent));
			} catch (err) {
				if (!isUnauthorized(err)) throw err;
				clearWorkingPat();
				pat = await ensureWorkingPat();
				setResult(await extractDocument(pat, file, docType, consent));
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : t.extractError);
		} finally {
			setBusy(false);
		}
	}

	return (
		<>
			<p className="eyebrow">{t.pathExtract}</p>
			<h1>{t.pdeTitle}</h1>
			<p className="section-intro">{t.pdeHint}</p>

			{!ready ? (
				<p className="playground-muted">{t.preparingToken}</p>
			) : (
				<form className="playground-form" onSubmit={onExtract}>
					<label>
						{t.docType}
						<select value={docType} onChange={(e) => setDocType(e.target.value)}>
							<option value="identity_document">{t.docTypeIdentity}</option>
							<option value="address_proof">{t.docTypeAddress}</option>
							<option value="invoice_nf">{t.docTypeInvoice}</option>
						</select>
					</label>
					<label>
						{t.chooseFile}
						<input
							type="file"
							accept="image/*,.pdf,application/pdf"
							onChange={(e) => setFile(e.target.files?.[0] ?? null)}
							required
						/>
					</label>
					<label
						className={`playground-consent${consent ? " is-checked" : ""}`}
					>
						<input
							type="checkbox"
							checked={consent}
							onChange={(e) => setConsent(e.target.checked)}
							required
						/>
						<span className="playground-consent-copy">
							<span className="playground-consent-title">{t.consentTitle}</span>
							<span className="playground-consent-text">{t.consentLabel}</span>
						</span>
					</label>
					<button
						className="btn btn-primary"
						type="submit"
						disabled={busy || !consent}
					>
						{busy ? t.extracting : t.extract}
					</button>
				</form>
			)}

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
			) : !error && ready ? (
				<p className="playground-muted">{t.extractEmpty}</p>
			) : null}
		</>
	);
}
