import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
	createToken,
	extractDocument,
	listTokens,
	login,
	logout,
	me,
	revokeToken,
	signup,
	type Me,
	type TokenRow,
} from "./api";
import { copy, siteMeta, type Lang } from "./content";

type Props = { lang: Lang; onLang: (l: Lang) => void };
type AuthMode = "login" | "signup";

export function Playground({ lang, onLang }: Props) {
	const t = copy[lang].playground;
	const [user, setUser] = useState<Me | null>(null);
	const [loading, setLoading] = useState(true);
	const [mode, setMode] = useState<AuthMode>("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [inviteCode, setInviteCode] = useState("");
	const [error, setError] = useState("");
	const [tokens, setTokens] = useState<TokenRow[]>([]);
	const [newTokenName, setNewTokenName] = useState("playground");
	const [createdToken, setCreatedToken] = useState("");
	const [workingPat, setWorkingPat] = useState("");
	const [docType, setDocType] = useState("identity_document");
	const [file, setFile] = useState<File | null>(null);
	const [result, setResult] = useState("");
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		document.title = t.pageTitle;
		me()
			.then(async (u) => {
				setUser(u);
				if (u) setTokens(await listTokens());
			})
			.catch(() => setUser(null))
			.finally(() => setLoading(false));
	}, [t.pageTitle]);

	async function afterAuth(u: Me) {
		setUser(u);
		setPassword("");
		setInviteCode("");
		const created = await createToken("playground-session");
		setWorkingPat(created.token);
		setCreatedToken(created.token);
		setTokens(await listTokens());
	}

	async function onLogin(e: FormEvent) {
		e.preventDefault();
		setError("");
		setBusy(true);
		try {
			await afterAuth(await login(email, password));
		} catch {
			setError(t.loginError);
		} finally {
			setBusy(false);
		}
	}

	async function onSignup(e: FormEvent) {
		e.preventDefault();
		setError("");
		setBusy(true);
		try {
			await afterAuth(await signup(email, password, inviteCode));
		} catch {
			setError(t.signupError);
		} finally {
			setBusy(false);
		}
	}

	async function onLogout() {
		setBusy(true);
		try {
			await logout();
			setUser(null);
			setTokens([]);
			setWorkingPat("");
			setCreatedToken("");
			setResult("");
		} finally {
			setBusy(false);
		}
	}

	async function onCreateToken(e: FormEvent) {
		e.preventDefault();
		setBusy(true);
		setError("");
		try {
			const created = await createToken(newTokenName.trim() || "token");
			setCreatedToken(created.token);
			setWorkingPat(created.token);
			setTokens(await listTokens());
		} catch {
			setError(t.tokenError);
		} finally {
			setBusy(false);
		}
	}

	async function onRevoke(id: string) {
		setBusy(true);
		try {
			await revokeToken(id);
			setTokens(await listTokens());
		} catch {
			setError(t.tokenError);
		} finally {
			setBusy(false);
		}
	}

	async function onExtract(e: FormEvent) {
		e.preventDefault();
		if (!file || !workingPat) {
			setError(t.needToken);
			return;
		}
		setBusy(true);
		setError("");
		setResult("");
		try {
			const data = await extractDocument(workingPat, file, docType);
			setResult(JSON.stringify(data, null, 2));
		} catch (err) {
			setError(err instanceof Error ? err.message : t.extractError);
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="page playground-page">
			<div className="atmosphere" aria-hidden="true" />
			<header className="topbar">
				<Link className="brand-mark" to="/">
					{siteMeta.brand}
				</Link>
				<div className="topbar-end">
					<nav className="nav" aria-label={t.navAria}>
						<Link to="/">{t.backHome}</Link>
					</nav>
					<div className="lang-switch" role="group" aria-label="Language">
						<button
							type="button"
							className={lang === "pt" ? "is-active" : undefined}
							onClick={() => onLang("pt")}
							aria-pressed={lang === "pt"}
						>
							PT
						</button>
						<button
							type="button"
							className={lang === "en" ? "is-active" : undefined}
							onClick={() => onLang("en")}
							aria-pressed={lang === "en"}
						>
							EN
						</button>
					</div>
				</div>
			</header>

			<main className="playground-main">
				<p className="eyebrow">{t.eyebrow}</p>
				<h1>{t.title}</h1>
				<p className="section-intro">{t.intro}</p>

				{loading ? (
					<p className="playground-muted">{t.loading}</p>
				) : !user ? (
					<>
						<div className="playground-modes" role="tablist" aria-label="Auth">
							<button
								type="button"
								role="tab"
								aria-selected={mode === "login"}
								className={mode === "login" ? "is-active" : undefined}
								onClick={() => {
									setMode("login");
									setError("");
								}}
							>
								{t.modeLogin}
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={mode === "signup"}
								className={mode === "signup" ? "is-active" : undefined}
								onClick={() => {
									setMode("signup");
									setError("");
								}}
							>
								{t.modeSignup}
							</button>
						</div>
						<form
							className="playground-form"
							onSubmit={mode === "login" ? onLogin : onSignup}
						>
							<label>
								{t.email}
								<input
									type="email"
									autoComplete="username"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</label>
							<label>
								{t.password}
								<input
									type="password"
									autoComplete={mode === "login" ? "current-password" : "new-password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									minLength={mode === "signup" ? 10 : undefined}
									required
								/>
							</label>
							{mode === "signup" ? (
								<label>
									{t.inviteCode}
									<input
										type="text"
										autoComplete="one-time-code"
										value={inviteCode}
										onChange={(e) => setInviteCode(e.target.value)}
										required
									/>
								</label>
							) : null}
							<button className="btn btn-primary" type="submit" disabled={busy}>
								{mode === "login" ? t.login : t.signup}
							</button>
						</form>
					</>
				) : (
					<>
						<div className="playground-auth">
							<p>
								{t.signedInAs} <strong>{user.email}</strong>
							</p>
							<button className="btn btn-ghost" type="button" onClick={onLogout} disabled={busy}>
								{t.logout}
							</button>
						</div>

						<section className="playground-panel" aria-labelledby="tokens-title">
							<h2 id="tokens-title">{t.tokensTitle}</h2>
							<p>{t.tokensHint}</p>
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
								<p className="playground-secret">
									{t.tokenOnce}
									<code>{createdToken}</code>
								</p>
							) : null}
							<ul className="playground-token-list">
								{tokens.map((tok) => (
									<li key={tok.id}>
										<span>
											{tok.name} · <code>{tok.prefix}</code>
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
						</section>

						<section className="playground-panel" aria-labelledby="pde-title">
							<h2 id="pde-title">{t.pdeTitle}</h2>
							<p>{t.pdeHint}</p>
							<form className="playground-form" onSubmit={onExtract}>
								<label>
									{t.docType}
									<select value={docType} onChange={(e) => setDocType(e.target.value)}>
										<option value="identity_document">identity_document</option>
										<option value="address_proof">address_proof</option>
										<option value="invoice_nf">invoice_nf</option>
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
								<button className="btn btn-primary" type="submit" disabled={busy || !workingPat}>
									{t.extract}
								</button>
							</form>
							{result ? (
								<div className="playground-result">
									<h3>{t.result}</h3>
									<pre>{result}</pre>
								</div>
							) : null}
						</section>
					</>
				)}

				{error ? <p className="playground-error">{error}</p> : null}
			</main>
		</div>
	);
}
