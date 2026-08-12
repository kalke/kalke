import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { bankAccounts, bankOpenAdditionalAccount, type BankAccount } from "../api";
import { copy, type Lang } from "../content";
import { SurfacePanel } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatBankMoney } from "./bankValidation";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

function isIncomplete(row: BankAccount): boolean {
	const status = row.onboarding_status;
	return status !== "completed" && status !== "skipped";
}

export function BankAccounts({ lang }: Props) {
	const t = copy[lang].playground;
	const { busy, setBusy, setError } = useDashboard();
	const [rows, setRows] = useState<BankAccount[]>([]);
	const [loading, setLoading] = useState(true);
	const [q, setQ] = useState("");

	const reload = useCallback(async () => {
		const data = await bankAccounts();
		setRows(data.accounts ?? []);
	}, []);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoading(true);
			setError("");
			try {
				await reload();
			} catch (err) {
				if (!cancelled) {
					setRows([]);
					setError(err instanceof Error ? err.message : t.bankLoadError);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [reload, setError, t.bankLoadError]);

	const filtered = useMemo(() => {
		const needle = q.trim().toLowerCase();
		if (!needle) return rows;
		return rows.filter((row) => {
			const hay = [
				row.display_number,
				row.holder_name,
				row.id,
				row.account_number,
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return hay.includes(needle);
		});
	}, [rows, q]);

	const canOpenExtra =
		rows.length > 0 && rows.every((row) => !isIncomplete(row));

	async function onOpenExtra() {
		setBusy(true);
		setError("");
		try {
			await bankOpenAdditionalAccount(crypto.randomUUID());
			await reload();
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankOpenExtraError);
		} finally {
			setBusy(false);
		}
	}

	return (
		<>
			<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
				{t.pathBank}
			</p>
			<div className="mb-1 flex flex-wrap items-baseline gap-x-3.5 gap-y-2.5">
				<h1 className="font-display m-0 text-3xl font-semibold tracking-tight">
					{t.bankAccountsTitle}
				</h1>
				<Badge
					variant="outline"
					className="border-accent/45 bg-accent/10 text-[0.68rem] font-semibold tracking-[0.08em] text-accent uppercase"
				>
					{t.bankDemoBadge}
				</Badge>
			</div>
			<p className="mb-8 text-muted">{t.bankAccountsIntro}</p>

			<div className="mb-6 flex flex-wrap gap-2">
				<Link
					className={buttonVariants({ variant: "ghost" })}
					to="/playground/bank"
					viewTransition
				>
					{t.bankTransferBack}
				</Link>
				<Button
					type="button"
					disabled={busy || loading || !canOpenExtra}
					onClick={onOpenExtra}
				>
					{busy ? t.bankOpenExtraBusy : t.bankOpenExtraAccount}
				</Button>
				<Link
					className={buttonVariants({ variant: "ghost" })}
					to="/playground/bank/transfer"
					viewTransition
				>
					{t.bankGoTransfer}
				</Link>
			</div>

			<div className="mb-6 grid max-w-md gap-2">
				<Label htmlFor="bank-accounts-search">{t.bankAccountsSearch}</Label>
				<Input
					id="bank-accounts-search"
					value={q}
					onChange={(e) => setQ(e.target.value)}
					disabled={loading}
					autoComplete="off"
					spellCheck={false}
					enterKeyHint="search"
				/>
			</div>

			{loading ? (
				<p className="text-sm text-muted">{t.bankLoading}</p>
			) : filtered.length === 0 ? (
				<SurfacePanel className="grid gap-4">
					<p className="text-fg">{t.bankAccountsEmpty}</p>
					<div>
						<Button asChild>
							<Link to="/playground/bank/onboarding" viewTransition>
								{t.bankOpenAccount}
							</Link>
						</Button>
					</div>
				</SurfacePanel>
			) : (
				<ul className="m-0 grid list-none gap-3 p-0">
					{filtered.map((row) => {
						const incomplete = isIncomplete(row);
						const href = incomplete
							? "/playground/bank/onboarding"
							: "/playground/bank";
						return (
							<li key={row.id}>
								<Link
									to={href}
									viewTransition
									className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
									aria-label={
										incomplete
											? t.bankContinueOnboarding
											: t.bankAccountsOpen
									}
								>
									<SurfacePanel
										className={cn(
											"p-4 transition-colors hover:border-accent/40",
											incomplete && "border-accent/35",
										)}
									>
										<div className="mb-2 flex items-start justify-between gap-3">
											<code className="rounded bg-bg-deep px-1.5 py-0.5 text-sm text-fg">
												{row.display_number || row.id}
											</code>
											{incomplete ? (
												<Badge
													variant="outline"
													className="border-accent/50 bg-accent/10 text-[0.65rem] tracking-wide text-accent uppercase"
												>
													{t.bankStatusIncomplete}
												</Badge>
											) : (
												<span
													className="shrink-0 text-accent"
													aria-hidden="true"
												>
													◉
												</span>
											)}
										</div>
										<p className="mb-1 text-sm text-muted">
											{row.holder_name || "—"}
										</p>
										<p className="font-display m-0 text-lg font-semibold text-fg">
											{formatBankMoney(row.balance, row.currency, lang)}
										</p>
										{incomplete ? (
											<p className="mt-2 text-xs text-accent">
												{t.bankIncompleteHint}
											</p>
										) : null}
									</SurfacePanel>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</>
	);
}
