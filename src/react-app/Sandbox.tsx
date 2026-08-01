import { useEffect, useState, type FormEvent } from "react";
import type { User } from "oidc-client-ts";
import {
	accessToken,
	apiUrls,
	completeLoginIfNeeded,
	login,
	logout,
} from "./auth";
import { copy, type Lang } from "./content";

type Props = {
	lang: Lang;
};

export function Sandbox({ lang }: Props) {
	const t = copy[lang].sandbox;
	const [user, setUser] = useState<User | null>(null);
	const [ready, setReady] = useState(false);
	const [accountId, setAccountId] = useState("100");
	const [destination, setDestination] = useState("300");
	const [amount, setAmount] = useState("10");
	const [docType, setDocType] = useState("identity_document");
	const [file, setFile] = useState<File | null>(null);
	const [result, setResult] = useState("");
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			const next = await completeLoginIfNeeded();
			if (!cancelled) {
				setUser(next);
				setReady(true);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	async function callEbank(
		method: string,
		path: string,
		body?: unknown,
	): Promise<void> {
		const token = accessToken(user);
		if (!token) {
			setResult(t.needLogin);
			return;
		}
		setBusy(true);
		try {
			const res = await fetch(`${apiUrls.ebank}${path}`, {
				method,
				headers: {
					Authorization: `Bearer ${token}`,
					...(body !== undefined
						? { "Content-Type": "application/json" }
						: {}),
				},
				body: body !== undefined ? JSON.stringify(body) : undefined,
			});
			const text = await res.text();
			setResult(`${res.status}\n${text}`);
		} catch (err) {
			setResult(String(err));
		} finally {
			setBusy(false);
		}
	}

	async function onExtract(e: FormEvent) {
		e.preventDefault();
		const token = accessToken(user);
		if (!token) {
			setResult(t.needLogin);
			return;
		}
		if (!file) {
			setResult("No file selected");
			return;
		}
		setBusy(true);
		try {
			const form = new FormData();
			form.append("file", file);
			const res = await fetch(
				`${apiUrls.pde}/v1/extract?doc_type=${encodeURIComponent(docType)}`,
				{
					method: "POST",
					headers: { Authorization: `Bearer ${token}` },
					body: form,
				},
			);
			const text = await res.text();
			setResult(`${res.status}\n${text}`);
		} catch (err) {
			setResult(String(err));
		} finally {
			setBusy(false);
		}
	}

	const email = user?.profile?.email ?? user?.profile?.preferred_username ?? "";

	return (
		<>
			<p className="eyebrow">{t.eyebrow}</p>
			<h2>{t.title}</h2>
			<p className="section-intro">{t.intro}</p>

			<div className="sandbox-auth">
				{!ready ? (
					<p className="sandbox-muted">{t.loading}</p>
				) : user ? (
					<>
						<p>
							{t.signedInAs} <strong>{email || "user"}</strong>
						</p>
						<button type="button" className="btn btn-ghost" onClick={() => logout()}>
							{t.logout}
						</button>
					</>
				) : (
					<>
						<p className="sandbox-muted">{t.needLogin}</p>
						<button type="button" className="btn btn-primary" onClick={() => login()}>
							{t.login}
						</button>
					</>
				)}
			</div>

			<div className="sandbox-panels">
				<section className="sandbox-panel" aria-labelledby="sandbox-ebank">
					<h3 id="sandbox-ebank">{t.ebankTitle}</h3>
					<p>{t.ebankHint}</p>
					<label>
						{t.accountId}
						<input
							value={accountId}
							onChange={(e) => setAccountId(e.target.value)}
							autoComplete="off"
						/>
					</label>
					<label>
						{t.destination}
						<input
							value={destination}
							onChange={(e) => setDestination(e.target.value)}
							autoComplete="off"
						/>
					</label>
					<label>
						{t.amount}
						<input
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							inputMode="numeric"
							autoComplete="off"
						/>
					</label>
					<div className="sandbox-actions">
						<button
							type="button"
							className="btn btn-ghost"
							disabled={busy || !user}
							onClick={() =>
								callEbank(
									"GET",
									`/balance?account_id=${encodeURIComponent(accountId)}`,
								)
							}
						>
							{t.balance}
						</button>
						<button
							type="button"
							className="btn btn-ghost"
							disabled={busy || !user}
							onClick={() =>
								callEbank("POST", "/event", {
									type: "deposit",
									destination: accountId,
									amount: Number(amount),
								})
							}
						>
							{t.deposit}
						</button>
						<button
							type="button"
							className="btn btn-ghost"
							disabled={busy || !user}
							onClick={() =>
								callEbank("POST", "/event", {
									type: "withdraw",
									origin: accountId,
									amount: Number(amount),
								})
							}
						>
							{t.withdraw}
						</button>
						<button
							type="button"
							className="btn btn-ghost"
							disabled={busy || !user}
							onClick={() =>
								callEbank("POST", "/event", {
									type: "transfer",
									origin: accountId,
									destination,
									amount: Number(amount),
								})
							}
						>
							{t.transfer}
						</button>
					</div>
				</section>

				<section className="sandbox-panel" aria-labelledby="sandbox-pde">
					<h3 id="sandbox-pde">{t.pdeTitle}</h3>
					<p>{t.pdeHint}</p>
					<form className="sandbox-form" onSubmit={onExtract}>
						<label>
							{t.docType}
							<select
								value={docType}
								onChange={(e) => setDocType(e.target.value)}
							>
								<option value="identity_document">identity_document</option>
								<option value="address_proof">address_proof</option>
								<option value="invoice_nf">invoice_nf</option>
							</select>
						</label>
						<label>
							{t.chooseFile}
							<input
								type="file"
								accept="image/*,application/pdf"
								onChange={(e) => setFile(e.target.files?.[0] ?? null)}
							/>
						</label>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={busy || !user || !file}
						>
							{t.extract}
						</button>
					</form>
				</section>
			</div>

			{result ? (
				<div className="sandbox-result">
					<p className="eyebrow">{t.result}</p>
					<pre>{result}</pre>
				</div>
			) : null}
		</>
	);
}
