import { useState, type FormEvent } from "react";
import { changePassword } from "../api";
import { copy, type Lang } from "../content";
import { useDashboard } from "./DashboardContext";

type Props = { lang: Lang };

export function PasswordPanel({ lang }: Props) {
	const t = copy[lang].playground;
	const { busy, setBusy, setError } = useDashboard();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordMsg, setPasswordMsg] = useState("");

	async function onChangePassword(e: FormEvent) {
		e.preventDefault();
		setError("");
		setPasswordMsg("");
		if (newPassword.length < 10) {
			setError(t.passwordShort);
			return;
		}
		if (newPassword !== confirmPassword) {
			setError(t.passwordMismatch);
			return;
		}
		if (currentPassword === newPassword) {
			setError(t.passwordSame);
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
			if (code === "password too short") setError(t.passwordShort);
			else if (code === "new password must differ") setError(t.passwordSame);
			else setError(t.passwordError);
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
						minLength={10}
						required
					/>
				</label>
				<button className="btn btn-primary" type="submit" disabled={busy}>
					{t.changePassword}
				</button>
			</form>
			{passwordMsg ? <p className="playground-muted">{passwordMsg}</p> : null}
		</>
	);
}
