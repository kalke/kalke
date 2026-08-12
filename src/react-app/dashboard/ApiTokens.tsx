import { useState, type FormEvent } from "react";
import { SurfacePanel } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createToken, PDE_BASE, revokeToken } from "../api";
import { copy, type Lang } from "../content";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang; embedded?: boolean };

export function ApiTokens({ lang, embedded = false }: Props) {
	const t = copy[lang].playground;
	const { tokens, refreshTokens, busy, setBusy, setError } = useDashboard();
	const [newTokenName, setNewTokenName] = useState("m2m");
	const [createdToken, setCreatedToken] = useState("");
	const [copied, setCopied] = useState(false);

	async function onCreateToken(e: FormEvent) {
		e.preventDefault();
		setBusy(true);
		setError("");
		setCopied(false);
		try {
			const created = await createToken(newTokenName.trim() || "m2m");
			setCreatedToken(created.token);
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
			{embedded ? (
				<>
					<h2 className="mb-1 font-display text-lg font-semibold tracking-tight">
						{t.tokensTitle}
					</h2>
					<p className="mb-4 text-sm text-muted">{t.tokensHint}</p>
				</>
			) : (
				<>
					<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
						{t.pathApi}
					</p>
					<h1 className="font-display mb-3 text-3xl font-semibold tracking-tight">
						{t.tokensTitle}
					</h1>
					<p className="mb-8 max-w-2xl text-muted">{t.tokensHint}</p>
				</>
			)}

			<form
				className="grid w-full max-w-xl gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
				onSubmit={onCreateToken}
			>
				<div className="grid gap-2">
					<Label htmlFor="token-name">{t.tokenName}</Label>
					<Input
						id="token-name"
						value={newTokenName}
						onChange={(e) => setNewTokenName(e.target.value)}
					/>
				</div>
				<Button type="submit" disabled={busy}>
					{t.createToken}
				</Button>
			</form>

			{createdToken ? (
				<SurfacePanel className="my-4 grid gap-3">
					<p className="text-sm text-fg">{t.tokenOnce}</p>
					<code className="block break-all font-display text-sm text-accent">
						{createdToken}
					</code>
					<Button variant="ghost" type="button" onClick={onCopy}>
						{copied ? t.copied : t.copyToken}
					</Button>
				</SurfacePanel>
			) : null}

			<ul className="mt-5 grid gap-2">
				{tokens.map((tok) => (
					<li
						key={tok.id}
						className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2.5 font-display text-sm"
					>
						<span>
							{tok.name} · <code>{tok.prefix}…</code>
						</span>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onRevoke(tok.id)}
							disabled={busy}
						>
							{t.revoke}
						</Button>
					</li>
				))}
			</ul>

			<section className="mt-7 border-t border-border pt-6">
				<h2 className="mb-2 font-display text-lg font-semibold tracking-tight">
					{t.apiHowTitle}
				</h2>
				<p className="mb-4 text-sm leading-relaxed text-muted">{t.apiHowBody}</p>
				<pre className="max-h-88 overflow-auto rounded-md border border-border bg-bg-deep/55 p-3.5 font-display text-xs leading-relaxed break-words whitespace-pre-wrap text-fg">{`curl -X POST "${PDE_BASE}/v1/extract?doc_type=identity_document" \\\n  -H "Authorization: Bearer <token>" \\\n  -F "file=@doc.pdf" \\\n  -F "consent=lgpd-extract-v1"`}</pre>
			</section>
		</>
	);
}
