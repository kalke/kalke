import type { FormEvent, KeyboardEventHandler } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { oauthStartURL } from "../api";
import { evaluatePassword } from "./passwordRules";

export type VerifyKind = "signup" | "passwordless" | "reset";

export function Field({
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

export function PasswordRules({
	rules,
	labels,
	showMatch,
}: {
	rules: ReturnType<typeof evaluatePassword>;
	labels: {
		len: string;
		letter: string;
		number: string;
		match?: string;
	};
	showMatch?: boolean;
}) {
	return (
		<ul className="grid gap-1 text-xs text-muted" aria-label="Password rules">
			<li className={cn(rules.minLength && "text-accent-cool")}>{labels.len}</li>
			<li className={cn(rules.hasLetter && "text-accent-cool")}>
				{labels.letter}
			</li>
			<li className={cn(rules.hasNumber && "text-accent-cool")}>
				{labels.number}
			</li>
			{showMatch ? (
				<li className={cn(rules.matches && "text-accent-cool")}>
					{labels.match}
				</li>
			) : null}
		</ul>
	);
}

export function OAuthButtons({
	google,
	github,
	hint,
}: {
	google: string;
	github: string;
	hint: string;
}) {
	return (
		<div className="grid gap-2">
			<a
				className={buttonVariants({ variant: "outline", className: "w-full" })}
				href={oauthStartURL("google")}
			>
				{google}
			</a>
			<a
				className={buttonVariants({ variant: "outline", className: "w-full" })}
				href={oauthStartURL("github")}
			>
				{github}
			</a>
			<p className="text-center text-xs text-muted">{hint}</p>
		</div>
	);
}

export function AuthDivider({ label }: { label: string }) {
	return (
		<div className="relative text-center text-xs text-muted">
			<span className="bg-surface relative z-10 px-2">{label}</span>
			<span className="absolute inset-x-0 top-1/2 h-px bg-border" />
		</div>
	);
}

type VerifyCopy = {
	verifyCode: string;
	newPassword: string;
	confirmPassword: string;
	capsOn: string;
	passwordRuleLen: string;
	passwordRuleLetter: string;
	passwordRuleNumber: string;
	passwordRuleMatch: string;
	resetSubmit: string;
	verifySubmit: string;
	resend: string;
	resendIn: string;
	verifyClose: string;
};

type AuthVerifyDialogProps = {
	open: boolean;
	kind: VerifyKind | null;
	title: string;
	hint: string;
	copy: VerifyCopy;
	otpCode: string;
	onOtpCode: (v: string) => void;
	password: string;
	onPassword: (v: string) => void;
	confirmPassword: string;
	onConfirmPassword: (v: string) => void;
	capsOn: boolean;
	onKeyEvent: KeyboardEventHandler<HTMLInputElement>;
	resetRules: ReturnType<typeof evaluatePassword>;
	resetStrong: boolean;
	busy: boolean;
	resendIn: number;
	onVerify: (e: FormEvent) => void;
	onResend: () => void;
	onClose: () => void;
};

export function AuthVerifyDialog({
	open,
	kind,
	title,
	hint,
	copy: t,
	otpCode,
	onOtpCode,
	password,
	onPassword,
	confirmPassword,
	onConfirmPassword,
	capsOn,
	onKeyEvent,
	resetRules,
	resetStrong,
	busy,
	resendIn,
	onVerify,
	onResend,
	onClose,
}: AuthVerifyDialogProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
		>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{hint}</DialogDescription>
				</DialogHeader>
				<form className="grid gap-4" onSubmit={onVerify}>
					<Field label={t.verifyCode}>
						<Input
							type="text"
							inputMode="numeric"
							autoComplete="one-time-code"
							pattern="[0-9]{6}"
							maxLength={6}
							value={otpCode}
							onChange={(e) =>
								onOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
							}
							required
						/>
					</Field>
					{kind === "reset" ? (
						<>
							<Field label={t.newPassword}>
								<Input
									type="password"
									autoComplete="new-password"
									value={password}
									onChange={(e) => onPassword(e.target.value)}
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
									onChange={(e) => onConfirmPassword(e.target.value)}
									onKeyDown={onKeyEvent}
									onKeyUp={onKeyEvent}
									minLength={10}
									required
								/>
							</Field>
							{capsOn ? (
								<p
									className="text-xs text-accent"
									role="status"
									aria-live="polite"
								>
									{t.capsOn}
								</p>
							) : null}
							<PasswordRules
								rules={resetRules}
								showMatch
								labels={{
									len: t.passwordRuleLen,
									letter: t.passwordRuleLetter,
									number: t.passwordRuleNumber,
									match: t.passwordRuleMatch,
								}}
							/>
						</>
					) : null}
					<DialogFooter className="flex-col gap-3 sm:flex-col">
						<Button
							type="submit"
							className="w-full"
							disabled={
								busy ||
								otpCode.length !== 6 ||
								(kind === "reset" && !resetStrong)
							}
						>
							{kind === "reset" ? t.resetSubmit : t.verifySubmit}
						</Button>
						<div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
							<button
								type="button"
								className="underline-offset-4 hover:text-fg hover:underline disabled:opacity-50"
								onClick={onResend}
								disabled={busy || resendIn > 0}
							>
								{resendIn > 0
									? t.resendIn.replace("{seconds}", String(resendIn))
									: t.resend}
							</button>
							<span aria-hidden>·</span>
							<button
								type="button"
								className="underline-offset-4 hover:text-fg hover:underline"
								onClick={onClose}
							>
								{t.verifyClose}
							</button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
