import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
	forgotPasswordResend,
	forgotPasswordStart,
	forgotPasswordVerify,
	login,
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
import { SurfacePanel } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AuthDivider,
	AuthVerifyDialog,
	Field,
	OAuthButtons,
	PasswordRules,
	type VerifyKind,
} from "./authShared";
import { evaluatePassword, passwordIsStrong } from "./passwordRules";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };
type AuthMode = "login" | "signup" | "forgot";

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

	function closeVerify() {
		setVerifyKind(null);
		setOtpCode("");
		setConfirmPassword("");
		if (verifyKind === "reset" || verifyKind === "passwordless") {
			setPassword("");
		}
	}

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
		<div className="mx-auto max-w-md">
			<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
				{t.eyebrow}
			</p>
			<h1 className="font-display mb-3 text-3xl font-semibold tracking-tight">
				{t.title}
			</h1>
			<p className="mb-8 text-muted">{t.intro}</p>

			{mode === "login" || mode === "signup" ? (
				<Tabs
					value={mode}
					onValueChange={(v) => switchMode(v as AuthMode)}
					className="mb-4"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="login">{t.modeLogin}</TabsTrigger>
						<TabsTrigger value="signup">{t.modeSignup}</TabsTrigger>
					</TabsList>
				</Tabs>
			) : (
				<p className="mb-4 font-display text-lg font-semibold">{t.forgotTitle}</p>
			)}

			<SurfacePanel className="grid gap-6">
				{mode === "signup" ? (
					<>
						<OAuthButtons
							google={t.continueWithGoogle}
							github={t.continueWithGitHub}
							hint={t.authSocialHint}
						/>
						<AuthDivider label={t.authOr} />
					</>
				) : null}

				<form className="grid gap-4" onSubmit={formSubmit}>
					{mode === "signup" ? (
						<Field label={t.name}>
							<Input
								type="text"
								autoComplete="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								minLength={2}
								maxLength={80}
							/>
						</Field>
					) : null}
					<Field label={t.email}>
						<Input
							type="email"
							autoComplete="username"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Field>
					{mode === "login" && showPassword ? (
						<Field label={t.password}>
							<Input
								type="password"
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onKeyDown={onKeyEvent}
								onKeyUp={onKeyEvent}
								required
							/>
						</Field>
					) : null}
					{mode === "signup" ? (
						<Field label={t.password}>
							<Input
								type="password"
								autoComplete="new-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onKeyDown={onKeyEvent}
								onKeyUp={onKeyEvent}
								minLength={10}
								required
							/>
						</Field>
					) : null}
					{capsOn &&
					((mode === "login" && showPassword) || mode === "signup") ? (
						<p className="text-xs text-accent" role="status" aria-live="polite">
							{t.capsOn}
						</p>
					) : null}
					{mode === "signup" ? (
						<PasswordRules
							rules={signupRules}
							labels={{
								len: t.passwordRuleLen,
								letter: t.passwordRuleLetter,
								number: t.passwordRuleNumber,
							}}
						/>
					) : null}
					{mode === "forgot" ? (
						<p className="text-sm text-muted">{t.forgotHint}</p>
					) : null}
					<Button
						type="submit"
						className="w-full"
						disabled={busy || (mode === "signup" && !signupStrong)}
					>
						{mode === "login"
							? loginWantsPassword
								? t.login
								: t.passwordlessSubmit
							: mode === "signup"
								? t.signup
								: t.forgotSubmit}
					</Button>
				</form>

				{mode === "login" ? (
					<>
						<p className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
							<button
								type="button"
								className="underline-offset-4 hover:text-fg hover:underline"
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
							<span aria-hidden>·</span>
							<button
								type="button"
								className="underline-offset-4 hover:text-fg hover:underline"
								onClick={() => switchMode("forgot")}
							>
								{t.forgotPassword}
							</button>
						</p>
						<AuthDivider label={t.authOr} />
						<OAuthButtons
							google={t.continueWithGoogle}
							github={t.continueWithGitHub}
							hint={t.authSocialHint}
						/>
					</>
				) : null}

				{mode === "forgot" ? (
					<p className="text-center text-sm">
						<button
							type="button"
							className="text-muted underline-offset-4 hover:text-fg hover:underline"
							onClick={() => switchMode("login")}
						>
							{t.forgotBack}
						</button>
					</p>
				) : null}

				{error ? (
					<p className="text-sm text-danger" role="alert">
						{error}
					</p>
				) : null}
			</SurfacePanel>

			<AuthVerifyDialog
				open={Boolean(verifyKind)}
				kind={verifyKind}
				title={verifyTitle}
				hint={verifyHint}
				copy={t}
				otpCode={otpCode}
				onOtpCode={setOtpCode}
				password={password}
				onPassword={setPassword}
				confirmPassword={confirmPassword}
				onConfirmPassword={setConfirmPassword}
				capsOn={capsOn}
				onKeyEvent={onKeyEvent}
				resetRules={resetRules}
				resetStrong={resetStrong}
				busy={busy}
				resendIn={resendIn}
				onVerify={onVerify}
				onResend={onResend}
				onClose={closeVerify}
			/>
		</div>
	);
}
