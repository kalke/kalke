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
					/not found|onboarding|complete onboarding/i.test(msg) ||
					msg.includes("bank_404") ||
					msg.includes("bank_400") ||
					msg.includes("404")
				) {
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
							<Link to="/playground/bank/onboarding">{t.bankOpenAccount}</Link>
						</Button>
					</div>
				</SurfacePanel>
			) : (
				<>
					<SurfacePanel className="mb-5">
						<p className="mb-1 font-display text-xs tracking-[0.18em] text-muted uppercase">
							{t.bankBalance}
						</p>
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
					</SurfacePanel>

					<nav
						className="grid grid-cols-1 gap-2 sm:grid-cols-2"
						aria-label={t.bankTitle}
					>
						<Link
							className={cn(
								buttonVariants(),
								"min-h-11 justify-center text-center touch-manipulation",
							)}
							to="/playground/bank/transfer"
						>
							{t.bankGoTransfer}
						</Link>
						<Link
							className={cn(
								buttonVariants({ variant: "ghost" }),
								"min-h-11 justify-center text-center touch-manipulation",
							)}
							to="/playground/bank/activity"
						>
							{t.bankGoActivity}
						</Link>
						<Link
							className={cn(
								buttonVariants({ variant: "ghost" }),
								"min-h-11 justify-center text-center touch-manipulation",
							)}
							to="/playground/bank/accounts"
						>
							{t.bankAccountsTitle}
						</Link>
						<Link
							className={cn(
								buttonVariants({ variant: "ghost" }),
								"min-h-11 justify-center text-center touch-manipulation",
							)}
							to="/playground/bank/onboarding"
						>
							{t.bankGoOnboarding}
						</Link>
					</nav>
				</>
			)}
		</>
	);
}
