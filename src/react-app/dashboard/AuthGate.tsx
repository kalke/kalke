import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
	login,
	signupResend,
	signupStart,
	signupVerify,
} from "../api";
import { copy, type Lang } from "../content";
import { useCapsLock } from "../hooks/useCapsLock";
import { evaluatePassword, passwordIsStrong } from "./passwordRules";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };
type AuthMode = "login" | "signup";

export function AuthGate({ lang }: Props) {
	const t = copy[lang].playground;
	const { afterAuth, busy, setBusy, error, setError } = useDashboard();
	const { capsOn, onKeyEvent } = useCapsLock();
	const [mode, setMode] = useState<AuthMode>("login");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [otpCode, setOtpCode] = useState("");
	const [verifyOpen, setVerifyOpen] = useState(false);
	const [resendIn, setResendIn] = useState(0);

	const signupRules = useMemo(() => evaluatePassword(password), [password]);
	const signupStrong = passwordIsStrong(signupRules, false);

	useEffect(() => {
		if (resendIn <= 0) return;
		const id = window.setInterval(() => {
			setResendIn((s) => (s > 0 ? s - 1 : 0));
		}, 1000);
		return () => window.clearInterval(id);
	}, [resendIn]);

	async function onLogin(e: FormEvent) {
		e.preventDefault();
		setError("");
		setBusy(true);
		try {
			await afterAuth(await login(email, password));
			setPassword("");
		} catch {
			setError(t.loginError);
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
			setPassword("");
			setOtpCode("");
			setVerifyOpen(false);
			setName("");
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

	return (
		<>
			<p className="eyebrow">{t.eyebrow}</p>
			<h1>{t.title}</h1>
			<p className="section-intro">{t.intro}</p>

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
						onKeyDown={onKeyEvent}
						onKeyUp={onKeyEvent}
						minLength={mode === "signup" ? 10 : undefined}
						required
					/>
				</label>
				{capsOn ? (
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
				<button
					className="btn btn-primary"
					type="submit"
					disabled={busy || (mode === "signup" && !signupStrong)}
				>
					{mode === "login" ? t.login : t.signup}
				</button>
			</form>

			{error ? <p className="playground-error">{error}</p> : null}

			{verifyOpen ? (
				<div
					className="playground-modal"
					role="dialog"
					aria-modal="true"
					aria-labelledby="verify-title"
				>
					<div className="playground-modal-panel surface-panel">
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
									onChange={(e) =>
										setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
									}
									required
								/>
							</label>
							<button
								className="btn btn-primary"
								type="submit"
								disabled={busy || otpCode.length !== 6}
							>
								{t.verifySubmit}
							</button>
						</form>
						<button
							type="button"
							className="btn btn-ghost playground-resend"
							onClick={onResend}
							disabled={busy || resendIn > 0}
						>
							{resendIn > 0
								? t.resendIn.replace("{seconds}", String(resendIn))
								: t.resend}
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
		</>
	);
}
