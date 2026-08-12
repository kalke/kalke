import { useEffect, useState } from "react";
import { Link } from "react-router";
import { bankAccount, type BankAccount } from "../api";
import { copy, type Lang } from "../content";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SurfacePanel } from "@/components/layout";
import { cn } from "@/lib/utils";
import { formatBankMoney } from "./bankValidation";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

function isIncomplete(row: BankAccount): boolean {
	const status = row.onboarding_status;
	return status !== "completed" && status !== "skipped";
}

export function BankDashboard({ lang }: Props) {
	const t = copy[lang].playground;
	const { setError } = useDashboard();
	const [account, setAccount] = useState<BankAccount | null>(null);
	const [loading, setLoading] = useState(true);
	const [missing, setMissing] = useState(false);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoading(true);
			setError("");
			setMissing(false);
			try {
				const row = await bankAccount();
				if (!cancelled) setAccount(row);
			} catch (err) {
				if (cancelled) return;
				const msg = err instanceof Error ? err.message : "";
				if (
					/not found|bank_404|404/i.test(msg) &&
					!/onboarding|complete onboarding/i.test(msg)
				) {
					setMissing(true);
					setAccount(null);
				} else if (/onboarding|complete onboarding|bank_400/i.test(msg)) {
					// Legacy gate — still treat as missing only when no account body.
					setMissing(true);
					setAccount(null);
				} else {
					setError(msg || t.bankLoadError);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [setError, t.bankLoadError]);

	const incomplete = account ? isIncomplete(account) : false;

	return (
		<>
			<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
				{t.pathBank}
			</p>
			<div className="mb-1 flex flex-wrap items-baseline gap-x-3.5 gap-y-2.5">
				<h1 className="font-display m-0 text-3xl font-semibold tracking-tight">
					{t.bankTitle}
				</h1>
				<Badge
					variant="outline"
					className="border-accent/45 bg-accent/10 text-[0.68rem] font-semibold tracking-[0.08em] text-accent uppercase"
				>
					{t.bankDemoBadge}
				</Badge>
			</div>
			<p className="mb-8 text-muted">{t.bankIntro}</p>

			{loading ? (
				<p className="text-sm text-muted">{t.bankLoading}</p>
			) : missing || !account ? (
				<SurfacePanel className="mb-5 grid gap-4">
					<p className="text-fg">{t.bankNoAccount}</p>
					<div className="flex flex-wrap gap-2">
						<Button asChild>
							<Link to="/playground/bank/onboarding" viewTransition>
								{t.bankOpenAccount}
							</Link>
						</Button>
						<Link
							className={buttonVariants({ variant: "ghost" })}
							to="/playground/bank/accounts"
							viewTransition
						>
							{t.bankAccountsTitle}
						</Link>
					</div>
				</SurfacePanel>
			) : (
				<>
					<SurfacePanel className="mb-5">
						<div className="mb-2 flex flex-wrap items-center gap-2">
							<p className="font-display text-xs tracking-[0.18em] text-muted uppercase">
								{t.bankBalance}
							</p>
							{incomplete ? (
								<Badge
									variant="outline"
									className="border-accent/50 bg-accent/10 text-[0.65rem] tracking-wide text-accent uppercase"
								>
									{t.bankStatusIncomplete}
								</Badge>
							) : null}
						</div>
						<p className="font-display my-1 text-[clamp(1.75rem,4vw,2.35rem)] font-semibold tracking-tight text-fg [overflow-wrap:anywhere]">
							{formatBankMoney(account.balance, account.currency, lang)}
						</p>
						<p className="text-sm leading-snug text-muted [overflow-wrap:anywhere]">
							{t.bankAccountId}:{" "}
							<code className="rounded bg-bg-deep px-1 py-0.5 text-xs">
								{account.display_number || account.id}
							</code>
							{account.holder_name ? ` · ${account.holder_name}` : null}
						</p>
						{incomplete ? (
							<p className="mt-3 text-sm text-accent">{t.bankIncompleteHint}</p>
						) : null}
					</SurfacePanel>

					<nav
						className="grid grid-cols-1 gap-2 sm:grid-cols-2"
						aria-label={t.bankTitle}
					>
						{incomplete ? (
							<Link
								className={cn(
									buttonVariants(),
									"min-h-11 justify-center text-center touch-manipulation sm:col-span-2",
								)}
								to="/playground/bank/onboarding"
								viewTransition
							>
								{t.bankContinueOnboarding}
							</Link>
						) : (
							<>
								<Link
									className={cn(
										buttonVariants(),
										"min-h-11 justify-center text-center touch-manipulation",
									)}
									to="/playground/bank/transfer"
									viewTransition
								>
									{t.bankGoTransfer}
								</Link>
								<Link
									className={cn(
										buttonVariants({ variant: "ghost" }),
										"min-h-11 justify-center text-center touch-manipulation",
									)}
									to="/playground/bank/activity"
									viewTransition
								>
									{t.bankGoActivity}
								</Link>
							</>
						)}
						<Link
							className={cn(
								buttonVariants({ variant: "ghost" }),
								"min-h-11 justify-center text-center touch-manipulation",
							)}
							to="/playground/bank/accounts"
							viewTransition
						>
							{t.bankAccountsTitle}
						</Link>
						{!incomplete ? (
							<Link
								className={cn(
									buttonVariants({ variant: "ghost" }),
									"min-h-11 justify-center text-center touch-manipulation",
								)}
								to="/playground/bank/onboarding"
								viewTransition
							>
								{t.bankGoOnboarding}
							</Link>
						) : null}
					</nav>
				</>
			)}
		</>
	);
}
