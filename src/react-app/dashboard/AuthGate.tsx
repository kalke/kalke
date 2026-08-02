import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
	forgotPasswordResend,
	forgotPasswordStart,
	forgotPasswordVerify,
	login,
	oauthStartURL,
	passwordlessResend,
	passwordlessStart,
	passwordlessVerify,
	signupResend,
	signupStart,
	signupVerify,
	type Me,
} from "../api";
import { copy, type Lang } from "../content";
import { useCapsLock } from "../hooks/useCapsLock";
import { evaluatePassword, passwordIsStrong } from "./passwordRules";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };
type AuthMode = "login" | "signup" | "forgot";
type VerifyKind = "signup" | "passwordless" | "reset";

export function AuthGate({ lang }: Props) {
	const t = copy[lang].playground;
	const { afterAuth, busy, setBusy, error, setError } = useDashboard();
	const { capsOn, onKeyEvent } = useCapsLock();
	const [mode, setMode] = useState<AuthMode>("login");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [otpCode, setOtpCode] = useState("");
	const [verifyKind, setVerifyKind] = useState<VerifyKind | null>(null);
	const [resendIn, setResendIn] = useState(0);

	const signupRules = useMemo(() => evaluatePassword(password), [password]);
	const signupStrong = passwordIsStrong(signupRules, false);
	const resetRules = useMemo(
		() => evaluatePassword(password, confirmPassword),
		[password, confirmPassword],
	);
	const resetStrong = passwordIsStrong(resetRules, true);
	const loginWantsPassword = showPassword && password.trim().length > 0;

	useEffect(() => {
		if (resendIn <= 0) return;
		const id = window.setInterval(() => {
			setResendIn((s) => (s > 0 ? s - 1 : 0));
		}, 1000);
		return () => window.clearInterval(id);
	}, [resendIn]);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const oauth = params.get("oauth");
		if (!oauth) return;
		if (oauth === "error") setError(t.oauthError);
		params.delete("oauth");
		const next = params.toString();
		const url = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`;
		window.history.replaceState({}, "", url);
	}, [setError, t.oauthError]);

	function switchMode(next: AuthMode) {
		setMode(next);
		setError("");
		setVerifyKind(null);
		setOtpCode("");
		setPassword("");
		setConfirmPassword("");
		setShowPassword(false);
	}

	async function finishAuth(me: Me) {
		await afterAuth(me);
		setPassword("");
		setConfirmPassword("");
		setOtpCode("");
		setVerifyKind(null);
		setName("");
	}

	async function onLogin(e: FormEvent) {
		e.preventDefault();
		setError("");
		if (showPassword && !password.trim()) {
			setError(t.loginError);
			return;
		}
		setBusy(true);
		try {
			if (loginWantsPassword) {
				await finishAuth(await login(email, password));
			} else {
				const pending = await passwordlessStart(email);
				setEmail(pending.email);
				setVerifyKind("passwordless");
				setResendIn(pending.resend_after_seconds || 120);
			}
		} catch {
			setError(loginWantsPassword ? t.loginError : t.passwordlessError);
		} finally {
			setBusy(false);
		}
	}

	async function onSignup(e: FormEvent) {
		e.preventDefault();
		setError("");
		if (!signupStrong) {
			setError(t.passwordWeak);
			return;
		}
		setBusy(true);
		try {
			const pending = await signupStart(name, email, password);
			setEmail(pending.email);
			setVerifyKind("signup");
			setResendIn(pending.resend_after_seconds || 120);
		} catch {
			setError(t.signupError);
		} finally {
			setBusy(false);
		}
	}

	async function onForgot(e: FormEvent) {
		e.preventDefault();
		setError("");
		setBusy(true);
		try {
			const pending = await forgotPasswordStart(email);
			setEmail(pending.email);
			setPassword("");
			setConfirmPassword("");
			setVerifyKind("reset");
			setResendIn(pending.resend_after_seconds || 120);
		} catch {
			setError(t.forgotError);
		} finally {
			setBusy(false);
		}
	}

	async function onVerify(e: FormEvent) {
		e.preventDefault();
		if (!verifyKind) return;
		setError("");
		setBusy(true);
		try {
			if (verifyKind === "signup") {
				await finishAuth(await signupVerify(email, otpCode));
			} else if (verifyKind === "passwordless") {
				await finishAuth(await passwordlessVerify(email, otpCode));
			} else {
				if (!resetStrong) {
					setError(t.passwordWeak);
					return;
				}
				const out = await forgotPasswordVerify(email, otpCode, password);
				if ("permissions" in out) {
					await finishAuth(out);
				} else {
					setVerifyKind(null);
					switchMode("login");
				}
			}
		} catch (err) {
			const code = err instanceof Error ? err.message : "";
			if (verifyKind === "reset") {
				if (code.includes("password")) setError(t.passwordWeak);
				else setError(t.resetError);
			} else {
				setError(t.verifyError);
			}
		} finally {
			setBusy(false);
		}
	}

	async function onResend() {
		if (resendIn > 0 || !verifyKind) return;
		setError("");
		setBusy(true);
		try {
			const out =
				verifyKind === "signup"
					? await signupResend(email)
					: verifyKind === "passwordless"
						? await passwordlessResend(email)
						: await forgotPasswordResend(email);
			setResendIn(out.resend_after_seconds || 120);
			if (!out.ok) setError(t.resendWait);
		} catch {
			setError(t.resendError);
		} finally {
			setBusy(false);
		}
	}

	const formSubmit =
		mode === "login" ? onLogin : mode === "signup" ? onSignup : onForgot;

	const verifyTitle =
		verifyKind === "reset"
			? t.resetTitle
			: verifyKind === "passwordless"
				? t.passwordlessTitle
				: t.verifyTitle;
	const verifyHint =
		verifyKind === "reset"
			? t.resetHint.replace("{email}", email)
			: t.verifyHint.replace("{email}", email);

	return (
		<>
			<p className="eyebrow">{t.eyebrow}</p>
			<h1>{t.title}</h1>
			<p className="section-intro">{t.intro}</p>

			{mode === "login" || mode === "signup" ? (
				<div className="playground-modes" role="tablist" aria-label="Auth">
					<button
						type="button"
						role="tab"
						aria-selected={mode === "login"}
						className={mode === "login" ? "is-active" : undefined}
						onClick={() => switchMode("login")}
					>
						{t.modeLogin}
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={mode === "signup"}
						className={mode === "signup" ? "is-active" : undefined}
						onClick={() => switchMode("signup")}
					>
						{t.modeSignup}
					</button>
				</div>
			) : (
				<p className="auth-panel-title">{t.forgotTitle}</p>
			)}

			<div className="auth-panel">
				{mode === "signup" ? (
					<div className="auth-methods">
						<a className="auth-method" href={oauthStartURL("google")}>
							{t.continueWithGoogle}
						</a>
						<a className="auth-method" href={oauthStartURL("github")}>
							{t.continueWithGitHub}
						</a>
						<p className="auth-divider">
							<span>{t.authOr}</span>
						</p>
					</div>
				) : null}

				<form className="playground-form" onSubmit={formSubmit}>
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
					{mode === "login" && showPassword ? (
						<label>
							{t.password}
							<input
								type="password"
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onKeyDown={onKeyEvent}
								onKeyUp={onKeyEvent}
								required
							/>
						</label>
					) : null}
					{mode === "signup" ? (
						<label>
							{t.password}
							<input
								type="password"
								autoComplete="new-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onKeyDown={onKeyEvent}
								onKeyUp={onKeyEvent}
								minLength={10}
								required
							/>
						</label>
					) : null}
					{capsOn &&
					((mode === "login" && showPassword) || mode === "signup") ? (
						<p className="caps-indicator is-on" role="status" aria-live="polite">
							{t.capsOn}
						</p>
					) : null}
					{mode === "signup" ? (
						<ul className="password-rules" aria-label={t.password}>
							<li className={signupRules.minLength ? "is-ok" : undefined}>
								{t.passwordRuleLen}
							</li>
							<li className={signupRules.hasLetter ? "is-ok" : undefined}>
								{t.passwordRuleLetter}
							</li>
							<li className={signupRules.hasNumber ? "is-ok" : undefined}>
								{t.passwordRuleNumber}
							</li>
						</ul>
					) : null}
					{mode === "forgot" ? <p className="auth-hint">{t.forgotHint}</p> : null}
					<button
						className="btn btn-primary auth-submit"
						type="submit"
						disabled={busy || (mode === "signup" && !signupStrong)}
					>
						{mode === "login"
							? loginWantsPassword
								? t.login
								: t.passwordlessSubmit
							: mode === "signup"
								? t.signup
								: t.forgotSubmit}
					</button>
				</form>

				{mode === "login" ? (
					<>
						<p className="auth-footnotes">
							<button
								type="button"
								onClick={() => {
									setError("");
									if (showPassword) {
										setShowPassword(false);
										setPassword("");
									} else {
										setShowPassword(true);
									}
								}}
							>
								{showPassword ? t.hidePassword : t.usePassword}
							</button>
							<span aria-hidden="true">·</span>
							<button type="button" onClick={() => switchMode("forgot")}>
								{t.forgotPassword}
							</button>
						</p>
						<p className="auth-divider">
							<span>{t.authOr}</span>
						</p>
						<div className="auth-methods">
							<a className="auth-method" href={oauthStartURL("google")}>
								{t.continueWithGoogle}
							</a>
							<a className="auth-method" href={oauthStartURL("github")}>
								{t.continueWithGitHub}
							</a>
						</div>
					</>
				) : null}

				{mode === "forgot" ? (
					<p className="auth-footnotes">
						<button type="button" onClick={() => switchMode("login")}>
							{t.forgotBack}
						</button>
					</p>
				) : null}

				{error ? <p className="playground-error">{error}</p> : null}
			</div>

			{verifyKind ? (
				<div
					className="playground-modal"
					role="dialog"
					aria-modal="true"
					aria-labelledby="verify-title"
				>
					<div className="playground-modal-panel surface-panel">
						<h2 id="verify-title">{verifyTitle}</h2>
						<p>{verifyHint}</p>
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
									onChange={(e) =>
										setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
									}
									required
								/>
							</label>
							{verifyKind === "reset" ? (
								<>
									<label>
										{t.newPassword}
										<input
											type="password"
											autoComplete="new-password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											onKeyDown={onKeyEvent}
											onKeyUp={onKeyEvent}
											minLength={10}
											required
										/>
									</label>
									<label>
										{t.confirmPassword}
										<input
											type="password"
											autoComplete="new-password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											onKeyDown={onKeyEvent}
											onKeyUp={onKeyEvent}
											minLength={10}
											required
										/>
									</label>
									{capsOn ? (
										<p
											className="caps-indicator is-on"
											role="status"
											aria-live="polite"
										>
											{t.capsOn}
										</p>
									) : null}
									<ul className="password-rules" aria-label={t.newPassword}>
										<li className={resetRules.minLength ? "is-ok" : undefined}>
											{t.passwordRuleLen}
										</li>
										<li className={resetRules.hasLetter ? "is-ok" : undefined}>
											{t.passwordRuleLetter}
										</li>
										<li className={resetRules.hasNumber ? "is-ok" : undefined}>
											{t.passwordRuleNumber}
										</li>
										<li className={resetRules.matches ? "is-ok" : undefined}>
											{t.passwordRuleMatch}
										</li>
									</ul>
								</>
							) : null}
							<button
								className="btn btn-primary auth-submit"
								type="submit"
								disabled={
									busy ||
									otpCode.length !== 6 ||
									(verifyKind === "reset" && !resetStrong)
								}
							>
								{verifyKind === "reset" ? t.resetSubmit : t.verifySubmit}
							</button>
						</form>
						<p className="auth-footnotes">
							<button
								type="button"
								onClick={onResend}
								disabled={busy || resendIn > 0}
							>
								{resendIn > 0
									? t.resendIn.replace("{seconds}", String(resendIn))
									: t.resend}
							</button>
							<span aria-hidden="true">·</span>
							<button
								type="button"
								onClick={() => {
									setVerifyKind(null);
									setOtpCode("");
									setConfirmPassword("");
									if (verifyKind === "reset" || verifyKind === "passwordless") {
										setPassword("");
									}
								}}
							>
								{t.verifyClose}
							</button>
						</p>
					</div>
				</div>
			) : null}
		</>
	);
}
