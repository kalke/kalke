import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import {
	bankAccounts,
	bankTransferChallenge,
	bankTransferChallengeResend,
	bankTransferConfirm,
	bankTransferResolve,
	type BankAccount,
	type BankResolveResult,
	type BankTransferChallenge,
} from "../api";
import { copy, type Lang } from "../content";
import { SurfacePanel } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
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
import { digitsOnly, formatBankMoney } from "./bankValidation";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

type TransferSuccess = {
	amount: string;
	currency: string;
	destination: string;
	holder: string;
	originBalance: string;
};

const selectClassName = cn(
	"flex h-10 w-full rounded-md border border-input bg-bg-deep px-3 py-2 text-sm text-fg shadow-sm",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
	"disabled:cursor-not-allowed disabled:opacity-50",
);

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

export function BankTransfer({ lang }: Props) {
	const t = copy[lang].playground;
	const { busy, setBusy, setError } = useDashboard();
	const [accounts, setAccounts] = useState<BankAccount[]>([]);
	const [sourceId, setSourceId] = useState("");
	const [mode, setMode] = useState<"account" | "document">("account");
	const [destination, setDestination] = useState("");
	const [amount, setAmount] = useState("");
	const [memo, setMemo] = useState("");
	const [resolved, setResolved] = useState<BankResolveResult | null>(null);
	const [challenge, setChallenge] = useState<BankTransferChallenge | null>(null);
	const [code, setCode] = useState("");
	const [success, setSuccess] = useState<TransferSuccess | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const data = await bankAccounts();
				if (cancelled) return;
				const rows = data.accounts ?? [];
				setAccounts(rows);
				if (rows[0]?.id) setSourceId((prev) => prev || rows[0].id);
			} catch {
				/* listed later via transfer errors */
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	async function onResolve(e: FormEvent) {
		e.preventDefault();
		setBusy(true);
		setError("");
		setSuccess(null);
		setResolved(null);
		setChallenge(null);
		try {
			const value = destination.trim();
			const result = await bankTransferResolve(
				mode === "account"
					? { account: value }
					: { document: digitsOnly(value) },
			);
			setResolved(result);
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankTransferError);
		} finally {
			setBusy(false);
		}
	}

	async function onSendCode(e: FormEvent) {
		e.preventDefault();
		if (!resolved) return;
		setBusy(true);
		setError("");
		setSuccess(null);
		try {
			const result = await bankTransferChallenge({
				destination_account: resolved.account_display,
				source_account_id: sourceId || undefined,
				amount: amount.trim(),
				memo: memo.trim() || undefined,
			});
			setChallenge(result);
			setCode("");
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankTransferError);
		} finally {
			setBusy(false);
		}
	}

	async function onConfirm(e: FormEvent) {
		e.preventDefault();
		if (!challenge) return;
		setBusy(true);
		setError("");
		try {
			const result = await bankTransferConfirm(code.trim());
			const currency = result.currency || "USD";
			setSuccess({
				amount: result.amount || challenge.amount || amount,
				currency,
				destination:
					result.destination.display_number ||
					challenge.destination_display ||
					resolved?.account_display ||
					"",
				holder:
					result.destination.holder_name ||
					challenge.destination_holder ||
					resolved?.holder_name ||
					"",
				originBalance: result.origin.balance,
			});
			setAmount("");
			setMemo("");
			setResolved(null);
			setDestination("");
			setChallenge(null);
			setCode("");
			try {
				const data = await bankAccounts();
				setAccounts(data.accounts ?? []);
			} catch {
				/* ignore refresh failure */
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankTransferError);
		} finally {
			setBusy(false);
		}
	}

	async function onResend() {
		setBusy(true);
		setError("");
		try {
			const result = await bankTransferChallengeResend();
			setChallenge(result);
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankTransferError);
		} finally {
			setBusy(false);
		}
	}

	function closeChallenge() {
		setChallenge(null);
		setCode("");
		setError("");
	}

	function startAnother() {
		setSuccess(null);
		setError("");
	}

	const codeHint = t.bankTransferCodeHint.replace(
		"{email}",
		challenge?.email_masked || "…",
	);

	return (
		<>
			<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
				{t.pathBank}
			</p>
			<div className="mb-1 flex flex-wrap items-baseline gap-x-3.5 gap-y-2.5">
				<h1 className="font-display m-0 text-3xl font-semibold tracking-tight">
					{t.bankTransferTitle}
				</h1>
				<Badge
					variant="outline"
					className="border-accent/45 bg-accent/10 text-[0.68rem] font-semibold tracking-[0.08em] text-accent uppercase"
				>
					{t.bankDemoBadge}
				</Badge>
			</div>
			<p className="mb-8 text-muted">{t.bankTransferIntro}</p>

			<div className="mb-6 flex flex-wrap gap-2">
				<Link
					className={buttonVariants({ variant: "ghost" })}
					to="/playground/bank"
				>
					{t.bankTransferBack}
				</Link>
			</div>

			{success ? (
				<SurfacePanel className="mb-5 grid gap-3" role="status">
					<p className="font-display m-0 text-sm font-semibold tracking-wide text-accent uppercase">
						{t.bankTransferSuccessTitle}
					</p>
					<p className="font-display m-0 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold tracking-tight text-fg">
						{formatBankMoney(success.amount, success.currency, lang)}
					</p>
					<p className="m-0 text-sm text-muted">
						{t.bankTransferSuccessDest}: <code className="rounded bg-bg-deep px-1 py-0.5 text-xs">{success.destination}</code>
						{success.holder ? ` · ${success.holder}` : null}
					</p>
					<p className="m-0 text-sm text-muted">
						{t.bankTransferSuccessBalance}:{" "}
						<strong className="text-fg">
							{formatBankMoney(success.originBalance, success.currency, lang)}
						</strong>
					</p>
					<p className="m-0 text-sm text-muted">{t.bankTransferOk}</p>
					<Button type="button" className="w-full sm:w-auto" onClick={startAnother}>
						{t.bankTransferAnother}
					</Button>
				</SurfacePanel>
			) : (
				<>
					<form className="mb-6 grid max-w-lg gap-4" onSubmit={onResolve}>
						{accounts.length > 0 ? (
							<Field label={t.bankTransferSource}>
								<select
									className={selectClassName}
									value={sourceId}
									onChange={(e) => setSourceId(e.target.value)}
									disabled={busy || !!challenge}
								>
									{accounts.map((row) => (
										<option key={row.id} value={row.id}>
											{(row.display_number || row.id) +
												" · " +
												formatBankMoney(row.balance, row.currency, lang)}
										</option>
									))}
								</select>
							</Field>
						) : null}
						<div
							className="grid grid-cols-2 gap-2"
							role="group"
							aria-label={t.bankTransferDest}
						>
							<Button
								type="button"
								variant={mode === "account" ? "default" : "ghost"}
								disabled={busy || !!challenge}
								onClick={() => {
									setMode("account");
									setResolved(null);
								}}
							>
								{t.bankTransferDest}
							</Button>
							<Button
								type="button"
								variant={mode === "document" ? "default" : "ghost"}
								disabled={busy || !!challenge}
								onClick={() => {
									setMode("document");
									setResolved(null);
								}}
							>
								CPF
							</Button>
						</div>
						<Field label={mode === "account" ? t.bankTransferDest : "CPF"}>
							<Input
								value={destination}
								onChange={(e) => setDestination(e.target.value)}
								required
								disabled={busy || !!challenge}
								autoComplete="off"
								spellCheck={false}
								placeholder={mode === "account" ? "2-9" : "000.000.000-00"}
								inputMode={mode === "document" ? "numeric" : "text"}
							/>
						</Field>
						<Button
							type="submit"
							disabled={busy || !!challenge || !destination.trim()}
						>
							{t.bankTransferResolve}
						</Button>
					</form>

					{resolved ? (
						<form className="grid max-w-lg gap-4" onSubmit={onSendCode}>
							<SurfacePanel className="grid gap-1 p-4">
								<p className="m-0 text-fg">
									{t.bankTransferHolder}:{" "}
									<strong>{resolved.holder_name}</strong>
								</p>
								<p className="m-0 text-sm text-muted">
									<code className="rounded bg-bg-deep px-1 py-0.5 text-xs">
										{resolved.account_display}
									</code>
									{resolved.document_masked
										? ` · ${resolved.document_masked}`
										: null}
								</p>
							</SurfacePanel>
							<Field label={t.bankTransferAmount}>
								<Input
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									required
									disabled={busy || !!challenge}
									inputMode="decimal"
									placeholder="25.50"
								/>
							</Field>
							<Field label={t.bankTransferMemo}>
								<Input
									value={memo}
									onChange={(e) => setMemo(e.target.value)}
									disabled={busy || !!challenge}
									maxLength={280}
								/>
							</Field>
							<Button
								type="submit"
								disabled={busy || !!challenge || !amount.trim()}
							>
								{t.bankTransferSendCode}
							</Button>
						</form>
					) : null}
				</>
			)}

			<Dialog
				open={Boolean(challenge)}
				onOpenChange={(open) => {
					if (!open) closeChallenge();
				}}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>{t.bankTransferCodeTitle}</DialogTitle>
						<DialogDescription>{codeHint}</DialogDescription>
					</DialogHeader>
					{challenge?.amount ? (
						<p className="text-sm text-fg">
							<strong>
								{formatBankMoney(challenge.amount, "USD", lang)}
							</strong>
							{challenge.destination_display ? (
								<>
									{" · "}
									<code className="rounded bg-bg-deep px-1 py-0.5 text-xs">
										{challenge.destination_display}
									</code>
									{challenge.destination_holder
										? ` · ${challenge.destination_holder}`
										: null}
								</>
							) : null}
						</p>
					) : null}
					<form className="grid gap-4" onSubmit={onConfirm}>
						<Field label={t.bankTransferCode}>
							<Input
								className="tracking-[0.35em]"
								value={code}
								onChange={(e) =>
									setCode(digitsOnly(e.target.value).slice(0, 6))
								}
								required
								disabled={busy}
								inputMode="numeric"
								autoComplete="one-time-code"
								placeholder="000000"
								maxLength={6}
								autoFocus
							/>
						</Field>
						<DialogFooter className="flex-col gap-2 sm:flex-col">
							<Button
								type="submit"
								className="w-full"
								disabled={busy || code.trim().length < 6}
							>
								{t.bankTransferConfirm}
							</Button>
							<div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
								<Button
									type="button"
									variant="ghost"
									disabled={busy}
									onClick={() => void onResend()}
								>
									{busy ? t.bankTransferResendBusy : t.bankTransferResend}
								</Button>
								<Button
									type="button"
									variant="ghost"
									disabled={busy}
									onClick={closeChallenge}
								>
									{t.bankTransferChange}
								</Button>
							</div>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
