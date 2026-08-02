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
	signupResend,
	signupStart,
	signupVerify,
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
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [otpCode, setOtpCode] = useState("");
	const [verifyOpen, setVerifyOpen] = useState(false);
	const [resendIn, setResendIn] = useState(0);
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

	useEffect(() => {
		if (resendIn <= 0) return;
		const id = window.setInterval(() => {
			setResendIn((s) => (s > 0 ? s - 1 : 0));
		}, 1000);
		return () => window.clearInterval(id);
	}, [resendIn]);

	async function afterAuth(u: Me) {
		setUser(u);
		setPassword("");
		setOtpCode("");
		setVerifyOpen(false);
		setName("");
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
			const pending = await signupStart(name, email, password);
			setEmail(pending.email);
			setVerifyOpen(true);
			setResendIn(pending.resend_after_seconds || 120);
		} catch {
			setError(t.signupError);
		} finally {
			setBusy(false);
		}
	}

	async function onVerify(e: FormEvent) {
		e.preventDefault();
		setError("");
		setBusy(true);
		try {
			await afterAuth(await signupVerify(email, otpCode));
		} catch {
			setError(t.verifyError);
		} finally {
			setBusy(false);
		}
	}

	async function onResend() {
		if (resendIn > 0) return;
		setError("");
		setBusy(true);
		try {
			const out = await signupResend(email);
			setResendIn(out.resend_after_seconds || 120);
			if (!out.ok) setError(t.resendWait);
		} catch {
			setError(t.resendError);
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

	const isAdmin = !!user?.permissions?.includes("admin");

	async function onExtract(e: FormEvent) {
		e.preventDefault();
		if (!isAdmin) {
			setError(t.adminOnly);
			return;
		}
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
									setVerifyOpen(false);
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
							{mode === "signup" ? (
								<label>
									{t.name}
									<input
										type="text"
										autoComplete="name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
										minLength={2}
										maxLength={80}
									/>
								</label>
							) : null}
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
							<p>{isAdmin ? t.pdeHint : t.adminOnly}</p>
							{isAdmin ? (
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
							) : null}
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

			{verifyOpen ? (
				<div className="playground-modal" role="dialog" aria-modal="true" aria-labelledby="verify-title">
					<div className="playground-modal-panel">
						<h2 id="verify-title">{t.verifyTitle}</h2>
						<p>{t.verifyHint.replace("{email}", email)}</p>
						<form className="playground-form" onSubmit={onVerify}>
							<label>
								{t.verifyCode}
								<input
									type="text"
									inputMode="numeric"
									autoComplete="one-time-code"
									pattern="[0-9]{6}"
									maxLength={6}
									value={otpCode}
									onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
									required
								/>
							</label>
							<button className="btn btn-primary" type="submit" disabled={busy || otpCode.length !== 6}>
								{t.verifySubmit}
							</button>
						</form>
						<button
							type="button"
							className="btn btn-ghost playground-resend"
							onClick={onResend}
							disabled={busy || resendIn > 0}
						>
							{resendIn > 0 ? t.resendIn.replace("{seconds}", String(resendIn)) : t.resend}
						</button>
						<button
							type="button"
							className="btn btn-ghost"
							onClick={() => {
								setVerifyOpen(false);
								setOtpCode("");
							}}
						>
							{t.verifyClose}
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}
