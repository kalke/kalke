import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
	bankAccounts,
	bankStatementExport,
	bankTransactions,
	type BankAccount,
	type BankTransaction,
	type BankTransactionFilters,
} from "../api";
import { copy, type Lang } from "../content";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
	amountToneClass,
	formatSignedBankMoney,
	groupTransactionsByDay,
	presetRange,
} from "./bankStatementFormat";
import { BankTxDetailModal } from "./BankTxDetailModal";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

type PeriodPreset = "7d" | "30d" | "this_month" | "last_month" | "custom" | "all";

const selectClassName = cn(
	"flex h-10 w-full min-w-[8rem] rounded-md border border-input bg-bg-deep px-3 py-2 text-sm text-fg shadow-sm",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
	"disabled:cursor-not-allowed disabled:opacity-50",
);

function toneClass(direction?: string, amount?: string): string {
	const tone = amountToneClass(direction, amount);
	if (tone === "is-credit") return "text-[#2f7d4a]";
	if (tone === "is-debit") return "text-[#a14a2d]";
	return "";
}

function TxBadge({ badge, type }: { badge?: string; type: string }) {
	const kind = badge || type || "other";
	const credit = kind === "transfer_in" || kind === "grant";
	const debit = kind === "transfer_out" || kind === "withdraw";
	return (
		<Badge
			variant="outline"
			className={cn(
				"shrink-0 text-[0.65rem] tracking-wide uppercase",
				credit && "border-[#2f7d4a]/40 text-[#2f7d4a]",
				debit && "border-[#a14a2d]/40 text-[#a14a2d]",
				!credit && !debit && "border-border text-muted",
			)}
		>
			{kind}
		</Badge>
	);
}

export function BankActivity({ lang }: Props) {
	const t = copy[lang].playground;
	const { setError } = useDashboard();
	const [items, setItems] = useState<BankTransaction[]>([]);
	const [cursor, setCursor] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);
	const [selected, setSelected] = useState<BankTransaction | null>(null);
	const [accounts, setAccounts] = useState<BankAccount[]>([]);
	const [accountId, setAccountId] = useState("");
	const [period, setPeriod] = useState<PeriodPreset>("30d");
	const [customFrom, setCustomFrom] = useState("");
	const [customTo, setCustomTo] = useState("");
	const [txType, setTxType] = useState("all");
	const [direction, setDirection] = useState("all");

	const dateBounds = useMemo(() => {
		if (period === "all") return { from: undefined, to: undefined };
		if (period === "custom") {
			return {
				from: customFrom || undefined,
				to: customTo || undefined,
			};
		}
		return presetRange(period);
	}, [period, customFrom, customTo]);

	const filterBase: Omit<BankTransactionFilters, "limit" | "cursor"> =
		useMemo(
			() => ({
				account_id: accountId || undefined,
				from: dateBounds.from,
				to: dateBounds.to,
				type: txType,
				direction,
			}),
			[accountId, dateBounds, txType, direction],
		);

	const load = useCallback(
		async (nextCursor?: string | null, append = false) => {
			if (append) setLoadingMore(true);
			else setLoading(true);
			setError("");
			try {
				const page = await bankTransactions({
					...filterBase,
					limit: 20,
					cursor: nextCursor ?? undefined,
				});
				const rows = page.transactions;
				setItems((prev) => (append ? [...prev, ...rows] : rows));
				const exhausted = rows.length < 20;
				setCursor(exhausted ? null : page.next_cursor);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : t.bankActivityLoadError,
				);
			} finally {
				setLoading(false);
				setLoadingMore(false);
			}
		},
		[filterBase, setError, t.bankActivityLoadError],
	);

	useEffect(() => {
		void (async () => {
			try {
				const res = await bankAccounts();
				setAccounts(res.accounts);
				setAccountId((prev) => prev || res.accounts[0]?.id || "");
			} catch {
				/* list still works with default account */
			}
		})();
	}, []);

	useEffect(() => {
		void load();
	}, [load]);

	const groups = useMemo(
		() => groupTransactionsByDay(items, lang),
		[items, lang],
	);

	const onExport = async (fmt: "csv" | "pdf") => {
		setExporting(fmt);
		setError("");
		try {
			await bankStatementExport(fmt, filterBase);
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankExportError);
		} finally {
			setExporting(null);
		}
	};

	return (
		<>
			<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
				{t.pathBank}
			</p>
			<div className="mb-1 flex flex-wrap items-baseline gap-x-3.5 gap-y-2.5">
				<h1 className="font-display m-0 text-3xl font-semibold tracking-tight">
					{t.bankActivityTitle}
				</h1>
				<Badge
					variant="outline"
					className="border-accent/45 bg-accent/10 text-[0.68rem] font-semibold tracking-[0.08em] text-accent uppercase"
				>
					{t.bankDemoBadge}
				</Badge>
			</div>
			<p className="mb-8 text-muted">{t.bankActivityIntro}</p>

			<div className="mb-6 flex flex-wrap gap-2">
				<Link
					className={buttonVariants({ variant: "ghost" })}
					to="/playground/bank"
				>
					{t.bankActivityBack}
				</Link>
			</div>

			<div className="mb-6 flex flex-wrap items-end gap-x-4 gap-y-3 border-y border-border py-3.5">
				{accounts.length > 1 ? (
					<div className="grid min-w-[8rem] gap-1">
						<Label className="text-xs text-muted">{t.bankFilterAccount}</Label>
						<select
							className={selectClassName}
							value={accountId}
							onChange={(e) => setAccountId(e.target.value)}
						>
							{accounts.map((a) => (
								<option key={a.id} value={a.id}>
									{a.display_number || a.id}
								</option>
							))}
						</select>
					</div>
				) : null}
				<div className="grid min-w-[8rem] gap-1">
					<Label className="text-xs text-muted">{t.bankFilterPeriod}</Label>
					<select
						className={selectClassName}
						value={period}
						onChange={(e) => setPeriod(e.target.value as PeriodPreset)}
					>
						<option value="7d">{t.bankPeriod7d}</option>
						<option value="30d">{t.bankPeriod30d}</option>
						<option value="this_month">{t.bankPeriodThisMonth}</option>
						<option value="last_month">{t.bankPeriodLastMonth}</option>
						<option value="custom">{t.bankPeriodCustom}</option>
						<option value="all">{t.bankPeriodAll}</option>
					</select>
				</div>
				{period === "custom" ? (
					<>
						<div className="grid min-w-[8rem] gap-1">
							<Label className="text-xs text-muted">{t.bankFilterFrom}</Label>
							<Input
								type="date"
								value={customFrom}
								onChange={(e) => setCustomFrom(e.target.value)}
							/>
						</div>
						<div className="grid min-w-[8rem] gap-1">
							<Label className="text-xs text-muted">{t.bankFilterTo}</Label>
							<Input
								type="date"
								value={customTo}
								onChange={(e) => setCustomTo(e.target.value)}
							/>
						</div>
					</>
				) : null}
				<div className="grid min-w-[8rem] gap-1">
					<Label className="text-xs text-muted">{t.bankFilterType}</Label>
					<select
						className={selectClassName}
						value={txType}
						onChange={(e) => setTxType(e.target.value)}
					>
						<option value="all">{t.bankTypeAll}</option>
						<option value="transfer">{t.bankTypeTransfer}</option>
						<option value="grant">{t.bankTypeGrant}</option>
						<option value="withdraw">{t.bankTypeWithdraw}</option>
					</select>
				</div>
				<div className="grid min-w-[8rem] gap-1">
					<Label className="text-xs text-muted">{t.bankFilterDirection}</Label>
					<select
						className={selectClassName}
						value={direction}
						onChange={(e) => setDirection(e.target.value)}
					>
						<option value="all">{t.bankDirAll}</option>
						<option value="in">{t.bankDirIn}</option>
						<option value="out">{t.bankDirOut}</option>
					</select>
				</div>
				<div className="ml-auto flex flex-wrap gap-2">
					<Button
						type="button"
						variant="ghost"
						disabled={!!exporting}
						onClick={() => void onExport("csv")}
					>
						{exporting === "csv" ? t.loading : t.bankExportCsv}
					</Button>
					<Button
						type="button"
						variant="ghost"
						disabled={!!exporting}
						onClick={() => void onExport("pdf")}
					>
						{exporting === "pdf" ? t.loading : t.bankExportPdf}
					</Button>
				</div>
			</div>

			{loading ? (
				<p className="text-sm text-muted">{t.loading}</p>
			) : items.length === 0 ? (
				<p className="text-sm text-muted">{t.bankActivityEmpty}</p>
			) : (
				<div className="flex flex-col gap-5">
					{groups.map((group) => (
						<section key={group.key}>
							<h2 className="font-display mb-1.5 text-sm font-semibold capitalize text-muted">
								{group.label}
							</h2>
							<ul className="m-0 flex list-none flex-col p-0">
								{group.items.map((tx) => (
									<li key={tx.id} className="border-b border-border last:border-0">
										<button
											type="button"
											className="w-full rounded-lg px-1.5 py-3.5 text-left text-inherit transition-colors hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-none"
											onClick={() => setSelected(tx)}
										>
											<div className="mb-1 flex items-baseline justify-between gap-3">
												<div className="flex min-w-0 flex-wrap items-center gap-2">
													<TxBadge badge={tx.badge} type={tx.type} />
													<strong className="font-display text-[0.95rem] font-semibold [overflow-wrap:anywhere]">
														{tx.title || tx.type}
													</strong>
												</div>
												<span
													className={cn(
														"font-display shrink-0 text-[0.95rem] whitespace-nowrap tabular-nums",
														toneClass(tx.direction, tx.amount),
													)}
												>
													{formatSignedBankMoney(
														tx.amount,
														tx.currency || "USD",
														lang,
														tx.direction,
													)}
												</span>
											</div>
											<div className="min-w-0 text-xs text-muted">
												<span>{tx.subtitle || "—"}</span>
											</div>
										</button>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			)}

			{cursor != null && items.length > 0 ? (
				<div className="mt-6 flex flex-wrap gap-2">
					<Button
						type="button"
						variant="ghost"
						disabled={loadingMore}
						onClick={() => void load(cursor, true)}
					>
						{t.bankActivityMore}
					</Button>
				</div>
			) : null}

			{selected ? (
				<BankTxDetailModal
					lang={lang}
					tx={selected}
					onClose={() => setSelected(null)}
				/>
			) : null}
		</>
	);
}
