import { useEffect, useState, type FormEvent } from "react";
import { SurfacePanel } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
			setName(me.name ?? next);
			setNameMsg(t.profileNameOk);
		} catch (err) {
			const code = err instanceof Error ? err.message : "";
			if (code === "invalid name") setNameErr(t.profileNameRequired);
			else setNameErr(t.profileNameError);
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
			<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
				{t.pathProfile}
			</p>
			<h1 className="font-display mb-3 text-3xl font-semibold tracking-tight">
				{t.profileTitle}
			</h1>
			<p className="mb-8 max-w-2xl text-muted">{t.profileIntro}</p>

			<SurfacePanel
				className="mb-6 grid gap-4"
				aria-labelledby="profile-identity"
			>
				<h2
					id="profile-identity"
					className="font-display text-lg font-semibold tracking-tight"
				>
					{t.profileIdentityTitle}
				</h2>
				<p className="text-sm text-muted">{t.profileIdentityHint}</p>
				<form className="grid max-w-sm gap-4" onSubmit={onSaveName}>
					<Field label={t.name}>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							autoComplete="name"
							maxLength={120}
							required
						/>
					</Field>
					<Field label={t.email}>
						<Input value={user.email} readOnly disabled />
					</Field>
					{nameErr ? (
						<p
							className="rounded-md border border-danger/45 bg-danger-bg px-3 py-2 text-sm text-danger"
							role="alert"
						>
							{nameErr}
						</p>
					) : null}
					{nameMsg ? <p className="text-sm text-muted">{nameMsg}</p> : null}
					<Button type="submit" disabled={busy}>
						{t.profileSaveName}
					</Button>
				</form>
			</SurfacePanel>

			<SurfacePanel className="mb-6 grid gap-4" aria-labelledby="profile-email">
				<h2
					id="profile-email"
					className="font-display text-lg font-semibold tracking-tight"
				>
					{t.profileEmailTitle}
				</h2>
				<p className="text-sm text-muted">{t.profileEmailHint}</p>
				{!emailPending ? (
					<form className="grid max-w-sm gap-4" onSubmit={onStartEmail}>
						<Field label={t.profileNewEmail}>
							<Input
								type="email"
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
								autoComplete="email"
								required
							/>
						</Field>
						{emailErr ? (
							<p
								className="rounded-md border border-danger/45 bg-danger-bg px-3 py-2 text-sm text-danger"
								role="alert"
							>
								{emailErr}
							</p>
						) : null}
						{emailMsg ? <p className="text-sm text-muted">{emailMsg}</p> : null}
						<Button type="submit" disabled={busy}>
							{t.profileEmailSendCode}
						</Button>
					</form>
				) : (
					<form className="grid max-w-sm gap-4" onSubmit={onVerifyEmail}>
						<p className="text-sm text-muted">
							{t.verifyHint.replace("{email}", emailPending)}
						</p>
						<Field label={t.verifyCode}>
							<Input
								value={emailCode}
								onChange={(e) => setEmailCode(e.target.value)}
								inputMode="numeric"
								autoComplete="one-time-code"
								required
							/>
						</Field>
						{emailErr ? (
							<p
								className="rounded-md border border-danger/45 bg-danger-bg px-3 py-2 text-sm text-danger"
								role="alert"
							>
								{emailErr}
							</p>
						) : null}
						{emailMsg ? <p className="text-sm text-muted">{emailMsg}</p> : null}
						<div className="flex flex-wrap items-center gap-2">
							<Button type="submit" disabled={busy}>
								{t.verifySubmit}
							</Button>
							<Button
								variant="ghost"
								type="button"
								disabled={busy || resendIn > 0}
								onClick={() => void onResendEmail()}
							>
								{resendIn > 0
									? t.resendIn.replace("{seconds}", String(resendIn))
									: t.resend}
							</Button>
							<Button
								variant="ghost"
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
							</Button>
						</div>
					</form>
				)}
			</SurfacePanel>

			<SurfacePanel className="mb-6" aria-labelledby="password-title">
				<PasswordPanel lang={lang} />
			</SurfacePanel>

			<section className="mb-6" aria-labelledby="tokens-heading">
				<div id="tokens-heading">
					<ApiTokens lang={lang} embedded />
				</div>
			</section>
		</>
	);
}
