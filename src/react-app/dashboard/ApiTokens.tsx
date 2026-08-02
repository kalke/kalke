import { useState, type FormEvent } from "react";
import {
	createToken,
	PDE_BASE,
	revokeToken,
	setWorkingPat,
} from "../api";
import { copy, type Lang } from "../content";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

export function ApiTokens({ lang }: Props) {
	const t = copy[lang].playground;
	const { tokens, refreshTokens, busy, setBusy, setError } = useDashboard();
	const [newTokenName, setNewTokenName] = useState("api");
	const [createdToken, setCreatedToken] = useState("");
	const [copied, setCopied] = useState(false);

	async function onCreateToken(e: FormEvent) {
		e.preventDefault();
		setBusy(true);
		setError("");
		setCopied(false);
		try {
			const created = await createToken(newTokenName.trim() || "token");
			setCreatedToken(created.token);
			setWorkingPat(created.token);
			await refreshTokens();
		} catch {
			setError(t.tokenError);
		} finally {
			setBusy(false);
		}
	}

	async function onRevoke(id: string) {
		setBusy(true);
		setError("");
		try {
			await revokeToken(id);
			await refreshTokens();
		} catch {
			setError(t.tokenError);
		} finally {
			setBusy(false);
		}
	}

	async function onCopy() {
		if (!createdToken) return;
		try {
			await navigator.clipboard.writeText(createdToken);
			setCopied(true);
		} catch {
			setError(t.tokenError);
		}
	}

	return (
		<>
			<p className="eyebrow">{t.pathApi}</p>
			<h1>{t.tokensTitle}</h1>
			<p className="section-intro">{t.tokensHint}</p>

			<form className="playground-form inline" onSubmit={onCreateToken}>
				<label>
					{t.tokenName}
					<input
						value={newTokenName}
						onChange={(e) => setNewTokenName(e.target.value)}
					/>
				</label>
				<button className="btn btn-primary" type="submit" disabled={busy}>
					{t.createToken}
				</button>
			</form>

			{createdToken ? (
				<div className="playground-secret surface-panel">
					<p>{t.tokenOnce}</p>
					<code>{createdToken}</code>
					<button className="btn btn-ghost" type="button" onClick={onCopy}>
						{copied ? t.copied : t.copyToken}
					</button>
				</div>
			) : null}

			<ul className="playground-token-list">
				{tokens.map((tok) => (
					<li key={tok.id}>
						<span>
							{tok.name} · <code>{tok.prefix}…</code>
						</span>
						<button
							type="button"
							className="btn btn-ghost"
							onClick={() => onRevoke(tok.id)}
							disabled={busy}
						>
							{t.revoke}
						</button>
					</li>
				))}
			</ul>

			<section className="playground-panel">
				<h2>{t.apiHowTitle}</h2>
				<p className="playground-muted">{t.apiHowBody}</p>
				<pre className="api-snippet">{`curl -X POST "${PDE_BASE}/v1/extract?doc_type=identity_document" \\\n  -H "Authorization: Bearer <token>" \\\n  -F "file=@doc.pdf" \\\n  -F "consent=lgpd-extract-v1"`}</pre>
			</section>
		</>
	);
}
