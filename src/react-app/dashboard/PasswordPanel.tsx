import { useMemo, useState, type FormEvent } from "react";
import { changePassword } from "../api";
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

	const rules = useMemo(
		() => evaluatePassword(newPassword, confirmPassword),
		[newPassword, confirmPassword],
	);
	const strong = passwordIsStrong(rules, true);

	async function onChangePassword(e: FormEvent) {
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
			await changePassword(currentPassword, newPassword);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setPasswordMsg(t.passwordOk);
		} catch (err) {
			const code = err instanceof Error ? err.message : "";
			if (code === "password too short") setLocalError(t.passwordShort);
			else if (
				code === "password needs a letter" ||
				code === "password needs a number"
			) {
				setLocalError(t.passwordWeak);
			} else if (code === "new password must differ") setLocalError(t.passwordSame);
			else setLocalError(t.passwordError);
		} finally {
			setBusy(false);
		}
	}

	return (
		<>
			<h2 id="password-title">{t.passwordTitle}</h2>
			<p>{t.passwordHint}</p>
			<form className="playground-form" onSubmit={onChangePassword}>
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
					<li className={rules.minLength ? "is-ok" : undefined}>{t.passwordRuleLen}</li>
					<li className={rules.hasLetter ? "is-ok" : undefined}>{t.passwordRuleLetter}</li>
					<li className={rules.hasNumber ? "is-ok" : undefined}>{t.passwordRuleNumber}</li>
					<li className={rules.matches ? "is-ok" : undefined}>{t.passwordRuleMatch}</li>
				</ul>
				{localError ? <p className="playground-error">{localError}</p> : null}
				<button className="btn btn-primary" type="submit" disabled={busy || !strong}>
					{t.changePassword}
				</button>
			</form>
			{passwordMsg ? <p className="playground-muted">{passwordMsg}</p> : null}
		</>
	);
}
