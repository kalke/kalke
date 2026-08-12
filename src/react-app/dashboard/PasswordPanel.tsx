import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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

function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="grid gap-2">
			<Label>{label}</Label>
			{children}
		</div>
	);
}

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
			<h2
				id="password-title"
				className="mb-1 font-display text-lg font-semibold tracking-tight"
			>
				{t.passwordTitle}
			</h2>
			<p className="mb-4 text-sm text-muted">{t.passwordHint}</p>
			{!pendingEmail ? (
				<form className="grid max-w-sm gap-4" onSubmit={onStart}>
					<Field label={t.currentPassword}>
						<Input
							type="password"
							autoComplete="current-password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							onKeyDown={onKeyEvent}
							onKeyUp={onKeyEvent}
							required
						/>
					</Field>
					<Field label={t.newPassword}>
						<Input
							type="password"
							autoComplete="new-password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							onKeyDown={onKeyEvent}
							onKeyUp={onKeyEvent}
							minLength={10}
							required
						/>
					</Field>
					<Field label={t.confirmPassword}>
						<Input
							type="password"
							autoComplete="new-password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							onKeyDown={onKeyEvent}
							onKeyUp={onKeyEvent}
							minLength={10}
							required
						/>
					</Field>
					{capsOn ? (
						<p
							className="font-display text-xs tracking-wide text-accent"
							role="status"
							aria-live="polite"
						>
							{t.capsOn}
						</p>
					) : null}
					<ul
						className="grid gap-1.5 rounded-md border border-border bg-bg-deep/45 px-3 py-2.5 font-display text-xs text-muted"
						aria-label={t.passwordTitle}
					>
						<li className={cn(rules.minLength && "text-accent-cool")}>
							{rules.minLength ? "● " : "○ "}
							{t.passwordRuleLen}
						</li>
						<li className={cn(rules.hasLetter && "text-accent-cool")}>
							{rules.hasLetter ? "● " : "○ "}
							{t.passwordRuleLetter}
						</li>
						<li className={cn(rules.hasNumber && "text-accent-cool")}>
							{rules.hasNumber ? "● " : "○ "}
							{t.passwordRuleNumber}
						</li>
						<li className={cn(rules.matches && "text-accent-cool")}>
							{rules.matches ? "● " : "○ "}
							{t.passwordRuleMatch}
						</li>
					</ul>
					{localError ? (
						<p className="rounded-md border border-danger/45 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
							{localError}
						</p>
					) : null}
					<Button type="submit" disabled={busy || !strong}>
						{t.passwordSendCode}
					</Button>
				</form>
			) : (
				<form className="grid max-w-sm gap-4" onSubmit={onVerify}>
					<p className="text-sm text-muted">
						{t.passwordCodeHint.replace("{email}", pendingEmail)}
					</p>
					<Field label={t.verifyCode}>
						<Input
							className="font-display tracking-[0.35em]"
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
					</Field>
					{localError ? (
						<p className="rounded-md border border-danger/45 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
							{localError}
						</p>
					) : null}
					<Button type="submit" disabled={busy || code.trim().length < 6}>
						{t.passwordConfirmCode}
					</Button>
					<div className="flex flex-wrap items-center gap-2">
						<Button
							variant="ghost"
							type="button"
							disabled={busy || resendIn > 0}
							onClick={() => void onResend()}
						>
							{resendIn > 0
								? t.resendIn.replace("{seconds}", String(resendIn))
								: t.resend}
						</Button>
						<Button
							variant="ghost"
							type="button"
							disabled={busy}
							onClick={onCancelPending}
						>
							{t.passwordCancelCode}
						</Button>
					</div>
				</form>
			)}
			{passwordMsg ? <p className="mt-3 text-sm text-muted">{passwordMsg}</p> : null}
		</>
	);
}
