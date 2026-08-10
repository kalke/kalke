import { useEffect, useState, type FormEvent } from "react";
import {
	emailChangeResend,
	emailChangeStart,
	emailChangeVerify,
	updateProfile,
} from "../api";
import { copy, type Lang } from "../content";
import { ApiTokens } from "./ApiTokens";
import { PasswordPanel } from "./PasswordPanel";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

export function Profile({ lang }: Props) {
	const t = copy[lang].playground;
	const { user, setUser, busy, setBusy, setError } = useDashboard();
	const [name, setName] = useState(user?.name ?? "");
	const [nameMsg, setNameMsg] = useState("");
	const [nameErr, setNameErr] = useState("");

	const [newEmail, setNewEmail] = useState("");
	const [emailCode, setEmailCode] = useState("");
	const [emailPending, setEmailPending] = useState("");
	const [emailMsg, setEmailMsg] = useState("");
	const [emailErr, setEmailErr] = useState("");
	const [resendIn, setResendIn] = useState(0);

	useEffect(() => {
		setName(user?.name ?? "");
	}, [user?.name]);

	useEffect(() => {
		if (resendIn <= 0) return;
		const id = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
		return () => window.clearTimeout(id);
	}, [resendIn]);

	async function onSaveName(e: FormEvent) {
		e.preventDefault();
		setNameErr("");
		setNameMsg("");
		setError("");
		const next = name.trim();
		if (!next) {
			setNameErr(t.profileNameRequired);
			return;
		}
		setBusy(true);
		try {
			const me = await updateProfile(next);
			setUser(me);
			setNameMsg(t.profileNameOk);
		} catch {
			setNameErr(t.profileNameError);
		} finally {
			setBusy(false);
		}
	}

	async function onStartEmail(e: FormEvent) {
		e.preventDefault();
		setEmailErr("");
		setEmailMsg("");
		setError("");
		const email = newEmail.trim().toLowerCase();
		if (!email || !email.includes("@")) {
			setEmailErr(t.profileEmailInvalid);
			return;
		}
		setBusy(true);
		try {
			const pending = await emailChangeStart(email);
			setEmailPending(pending.email);
			setResendIn(pending.resend_after_seconds);
			setEmailMsg(t.profileEmailSent.replace("{email}", pending.email));
		} catch (err) {
			const code = err instanceof Error ? err.message : "";
			if (code === "email_taken") setEmailErr(t.profileEmailTaken);
			else if (code === "email unchanged") setEmailErr(t.profileEmailSame);
			else setEmailErr(t.profileEmailError);
		} finally {
			setBusy(false);
		}
	}

	async function onVerifyEmail(e: FormEvent) {
		e.preventDefault();
		if (!emailPending) return;
		setEmailErr("");
		setEmailMsg("");
		setBusy(true);
		try {
			const me = await emailChangeVerify(emailPending, emailCode.trim());
			setUser(me);
			setNewEmail("");
			setEmailCode("");
			setEmailPending("");
			setEmailMsg(t.profileEmailOk);
		} catch (err) {
			const code = err instanceof Error ? err.message : "";
			if (code === "email_taken") setEmailErr(t.profileEmailTaken);
			else setEmailErr(t.verifyError);
		} finally {
			setBusy(false);
		}
	}

	async function onResendEmail() {
		if (!emailPending || resendIn > 0) return;
		setEmailErr("");
		setBusy(true);
		try {
			const r = await emailChangeResend(emailPending);
			setResendIn(r.resend_after_seconds);
			if (!r.ok) setEmailErr(t.resendWait);
			else setEmailMsg(t.profileEmailSent.replace("{email}", emailPending));
		} catch {
			setEmailErr(t.resendError);
		} finally {
			setBusy(false);
		}
	}

	if (!user) return null;

	return (
		<>
			<p className="eyebrow">{t.pathProfile}</p>
			<h1>{t.profileTitle}</h1>
			<p className="section-intro">{t.profileIntro}</p>

			<section className="profile-section surface-panel" aria-labelledby="profile-identity">
				<h2 id="profile-identity">{t.profileIdentityTitle}</h2>
				<p className="playground-muted">{t.profileIdentityHint}</p>
				<form className="playground-form" onSubmit={onSaveName}>
					<label>
						{t.name}
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
							autoComplete="name"
							maxLength={120}
							required
						/>
					</label>
					<label>
						{t.email}
						<input value={user.email} readOnly disabled />
					</label>
					{nameErr ? <p className="playground-error">{nameErr}</p> : null}
					{nameMsg ? <p className="playground-muted">{nameMsg}</p> : null}
					<button className="btn btn-primary" type="submit" disabled={busy}>
						{t.profileSaveName}
					</button>
				</form>
			</section>

			<section className="profile-section surface-panel" aria-labelledby="profile-email">
				<h2 id="profile-email">{t.profileEmailTitle}</h2>
				<p className="playground-muted">{t.profileEmailHint}</p>
				{!emailPending ? (
					<form className="playground-form" onSubmit={onStartEmail}>
						<label>
							{t.profileNewEmail}
							<input
								type="email"
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
								autoComplete="email"
								required
							/>
						</label>
						{emailErr ? <p className="playground-error">{emailErr}</p> : null}
						{emailMsg ? <p className="playground-muted">{emailMsg}</p> : null}
						<button className="btn btn-primary" type="submit" disabled={busy}>
							{t.profileEmailSendCode}
						</button>
					</form>
				) : (
					<form className="playground-form" onSubmit={onVerifyEmail}>
						<p className="playground-muted">
							{t.verifyHint.replace("{email}", emailPending)}
						</p>
						<label>
							{t.verifyCode}
							<input
								value={emailCode}
								onChange={(e) => setEmailCode(e.target.value)}
								inputMode="numeric"
								autoComplete="one-time-code"
								required
							/>
						</label>
						{emailErr ? <p className="playground-error">{emailErr}</p> : null}
						{emailMsg ? <p className="playground-muted">{emailMsg}</p> : null}
						<div className="profile-email-actions">
							<button className="btn btn-primary" type="submit" disabled={busy}>
								{t.verifySubmit}
							</button>
							<button
								className="btn btn-ghost"
								type="button"
								disabled={busy || resendIn > 0}
								onClick={() => void onResendEmail()}
							>
								{resendIn > 0
									? t.resendIn.replace("{seconds}", String(resendIn))
									: t.resend}
							</button>
							<button
								className="btn btn-ghost"
								type="button"
								disabled={busy}
								onClick={() => {
									setEmailPending("");
									setEmailCode("");
									setEmailErr("");
									setEmailMsg("");
								}}
							>
								{t.profileEmailCancel}
							</button>
						</div>
					</form>
				)}
			</section>

			<section className="profile-section surface-panel" aria-labelledby="password-title">
				<PasswordPanel lang={lang} />
			</section>

			<section className="profile-section" aria-labelledby="tokens-heading">
				<div id="tokens-heading" className="profile-tokens-wrap">
					<ApiTokens lang={lang} embedded />
				</div>
			</section>
		</>
	);
}
