import { useEffect, useMemo, useState, type FormEvent } from "react";
import { extractDocument } from "../api";
import { copy, type Lang } from "../content";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

function summarize(data: unknown, docType: string): { title: string; rows: { k: string; v: string }[] } {
	const rows: { k: string; v: string }[] = [{ k: "doc_type", v: docType }];
	if (!data || typeof data !== "object") {
		return { title: "result", rows };
	}
	const obj = data as Record<string, unknown>;
	const nested =
		obj.data && typeof obj.data === "object"
			? (obj.data as Record<string, unknown>)
			: obj.fields && typeof obj.fields === "object"
				? (obj.fields as Record<string, unknown>)
				: obj;

	const prefer = [
		"full_name",
		"name",
		"nome",
		"document_number",
		"cpf",
		"rg",
		"cnpj",
		"address",
		"endereco",
		"issue_date",
		"expiry_date",
		"invoice_number",
		"total",
	];

	for (const key of prefer) {
		const val = nested[key];
		if (val != null && val !== "") {
			rows.push({ k: key, v: String(val) });
		}
	}

	if (rows.length === 1) {
		for (const [k, v] of Object.entries(nested)) {
			if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
				rows.push({ k, v: String(v) });
				if (rows.length >= 8) break;
			}
		}
	}

	return { title: String(obj.doc_type ?? nested.doc_type ?? docType), rows };
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
		() => (result != null ? summarize(result, docType) : null),
		[result, docType],
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
			const pat = await ensureWorkingPat();
			const data = await extractDocument(pat, file, docType, consent);
			setResult(data);
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
							accept=".pdf,image/*"
							onChange={(e) => setFile(e.target.files?.[0] ?? null)}
							required
						/>
					</label>
					<label className="playground-consent">
						<input
							type="checkbox"
							checked={consent}
							onChange={(e) => setConsent(e.target.checked)}
							required
						/>
						<span>{t.consentLabel}</span>
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
								<dt>{row.k}</dt>
								<dd>{row.v}</dd>
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
