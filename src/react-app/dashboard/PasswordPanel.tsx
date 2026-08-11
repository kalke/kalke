import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
	changePasswordResend,
	changePasswordStart,
	changePasswordVerify,
} from "../api";
import { copy, type Lang } from "../content";
import { useCapsLock } from "../hooks/useCapsLock";
import { evaluatePassword, passwordIsStrong } from "./passwordRules";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

export function PasswordPanel({ lang }: Props) {
	const t = copy[lang].playground;
	const { busy, setBusy } = useDashboard();
	const { capsOn, onKeyEvent } = useCapsLock();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordMsg, setPasswordMsg] = useState("");
	const [localError, setLocalError] = useState("");
	const [pendingEmail, setPendingEmail] = useState("");
	const [code, setCode] = useState("");
	const [resendIn, setResendIn] = useState(0);

	const rules = useMemo(
		() => evaluatePassword(newPassword, confirmPassword),
		[newPassword, confirmPassword],
	);
	const strong = passwordIsStrong(rules, true);

	useEffect(() => {
		if (resendIn <= 0) return;
		const id = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
		return () => window.clearTimeout(id);
	}, [resendIn]);

	async function onStart(e: FormEvent) {
		e.preventDefault();
		setLocalError("");
		setPasswordMsg("");
		if (!strong) {
			setLocalError(t.passwordWeak);
			return;
		}
		if (currentPassword === newPassword) {
			setLocalError(t.passwordSame);
			return;
		}
		setBusy(true);
		try {
			const pending = await changePasswordStart(currentPassword, newPassword);
			setPendingEmail(pending.email_masked);
			setResendIn(pending.resend_after_seconds);
			setCode("");
			setPasswordMsg(
				t.passwordCodeHint.replace("{email}", pending.email_masked),
			);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "";
			if (msg === "invalid credentials") setLocalError(t.passwordCurrentWrong);
			else if (msg === "password too short") setLocalError(t.passwordShort);
			else if (
				msg === "password needs a letter" ||
				msg === "password needs a number"
			) {
				setLocalError(t.passwordWeak);
			} else if (msg === "new password must differ") setLocalError(t.passwordSame);
			else setLocalError(t.passwordError);
		} finally {
			setBusy(false);
		}
	}

	async function onVerify(e: FormEvent) {
		e.preventDefault();
		setLocalError("");
		setPasswordMsg("");
		setBusy(true);
		try {
			await changePasswordVerify(code.trim());
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setPendingEmail("");
			setCode("");
			setPasswordMsg(t.passwordOk);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "";
			if (msg.includes("invalid") || msg.includes("expired") || msg.includes("tries")) {
				setLocalError(t.verifyError);
			} else setLocalError(t.passwordError);
		} finally {
			setBusy(false);
		}
	}

	async function onResend() {
		if (resendIn > 0) return;
		setLocalError("");
		setBusy(true);
		try {
			const r = await changePasswordResend();
			setResendIn(r.resend_after_seconds);
			if (!r.ok) setLocalError(t.resendWait);
			else {
				setPasswordMsg(
					t.passwordCodeHint.replace(
						"{email}",
						r.email_masked || pendingEmail || "…",
					),
				);
			}
		} catch {
			setLocalError(t.resendError);
		} finally {
			setBusy(false);
		}
	}

	function onCancelPending() {
		setPendingEmail("");
		setCode("");
		setLocalError("");
		setPasswordMsg("");
	}

	return (
		<>
			<h2 id="password-title">{t.passwordTitle}</h2>
			<p>{t.passwordHint}</p>
			{!pendingEmail ? (
				<form className="playground-form" onSubmit={onStart}>
					<label>
						{t.currentPassword}
						<input
							type="password"
							autoComplete="current-password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							onKeyDown={onKeyEvent}
							onKeyUp={onKeyEvent}
							required
						/>
					</label>
					<label>
						{t.newPassword}
						<input
							type="password"
							autoComplete="new-password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
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
						<p className="caps-indicator is-on" role="status" aria-live="polite">
							{t.capsOn}
						</p>
					) : null}
					<ul className="password-rules" aria-label={t.passwordTitle}>
						<li className={rules.minLength ? "is-ok" : undefined}>
							{t.passwordRuleLen}
						</li>
						<li className={rules.hasLetter ? "is-ok" : undefined}>
							{t.passwordRuleLetter}
						</li>
						<li className={rules.hasNumber ? "is-ok" : undefined}>
							{t.passwordRuleNumber}
						</li>
						<li className={rules.matches ? "is-ok" : undefined}>
							{t.passwordRuleMatch}
						</li>
					</ul>
					{localError ? <p className="playground-error">{localError}</p> : null}
					<button
						className="btn btn-primary"
						type="submit"
						disabled={busy || !strong}
					>
						{t.passwordSendCode}
					</button>
				</form>
			) : (
				<form className="playground-form" onSubmit={onVerify}>
					<p className="playground-muted">
						{t.passwordCodeHint.replace("{email}", pendingEmail)}
					</p>
					<label>
						{t.verifyCode}
						<input
							className="bank-otp-input"
							value={code}
							onChange={(e) =>
								setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
							}
							inputMode="numeric"
							autoComplete="one-time-code"
							placeholder="000000"
							maxLength={6}
							required
						/>
					</label>
					{localError ? <p className="playground-error">{localError}</p> : null}
					<button
						className="btn btn-primary"
						type="submit"
						disabled={busy || code.trim().length < 6}
					>
						{t.passwordConfirmCode}
					</button>
					<div className="profile-email-actions">
						<button
							className="btn btn-ghost"
							type="button"
							disabled={busy || resendIn > 0}
							onClick={() => void onResend()}
						>
							{resendIn > 0
								? t.resendIn.replace("{seconds}", String(resendIn))
								: t.resend}
						</button>
						<button
							className="btn btn-ghost"
							type="button"
							disabled={busy}
							onClick={onCancelPending}
						>
							{t.passwordCancelCode}
						</button>
					</div>
				</form>
			)}
			{passwordMsg ? <p className="playground-muted">{passwordMsg}</p> : null}
		</>
	);
}
