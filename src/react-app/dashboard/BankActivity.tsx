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
			<p className="eyebrow">{t.pathBank}</p>
			<div className="bank-title-row">
				<h1>{t.bankActivityTitle}</h1>
				<span className="bank-demo-badge">{t.bankDemoBadge}</span>
			</div>
			<p className="section-intro">{t.bankActivityIntro}</p>

			<div className="cv-page-actions bank-page-actions">
				<Link className="btn btn-ghost" to="/playground/bank">
					{t.bankActivityBack}
				</Link>
			</div>

			<div className="bank-filters">
				{accounts.length > 1 ? (
					<label className="bank-filter-field">
						<span>{t.bankFilterAccount}</span>
						<select
							value={accountId}
							onChange={(e) => setAccountId(e.target.value)}
						>
							{accounts.map((a) => (
								<option key={a.id} value={a.id}>
									{a.display_number || a.id}
								</option>
							))}
						</select>
					</label>
				) : null}
				<label className="bank-filter-field">
					<span>{t.bankFilterPeriod}</span>
					<select
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
				</label>
				{period === "custom" ? (
					<>
						<label className="bank-filter-field">
							<span>{t.bankFilterFrom}</span>
							<input
								type="date"
								value={customFrom}
								onChange={(e) => setCustomFrom(e.target.value)}
							/>
						</label>
						<label className="bank-filter-field">
							<span>{t.bankFilterTo}</span>
							<input
								type="date"
								value={customTo}
								onChange={(e) => setCustomTo(e.target.value)}
							/>
						</label>
					</>
				) : null}
				<label className="bank-filter-field">
					<span>{t.bankFilterType}</span>
					<select value={txType} onChange={(e) => setTxType(e.target.value)}>
						<option value="all">{t.bankTypeAll}</option>
						<option value="transfer">{t.bankTypeTransfer}</option>
						<option value="grant">{t.bankTypeGrant}</option>
						<option value="withdraw">{t.bankTypeWithdraw}</option>
					</select>
				</label>
				<label className="bank-filter-field">
					<span>{t.bankFilterDirection}</span>
					<select
						value={direction}
						onChange={(e) => setDirection(e.target.value)}
					>
						<option value="all">{t.bankDirAll}</option>
						<option value="in">{t.bankDirIn}</option>
						<option value="out">{t.bankDirOut}</option>
					</select>
				</label>
				<div className="bank-filter-actions">
					<button
						type="button"
						className="btn btn-ghost"
						disabled={!!exporting}
						onClick={() => void onExport("csv")}
					>
						{exporting === "csv" ? t.loading : t.bankExportCsv}
					</button>
					<button
						type="button"
						className="btn btn-ghost"
						disabled={!!exporting}
						onClick={() => void onExport("pdf")}
					>
						{exporting === "pdf" ? t.loading : t.bankExportPdf}
					</button>
				</div>
			</div>

			{loading ? (
				<p className="playground-muted">{t.loading}</p>
			) : items.length === 0 ? (
				<p className="playground-muted">{t.bankActivityEmpty}</p>
			) : (
				<div className="bank-tx-groups">
					{groups.map((group) => (
						<section key={group.key} className="bank-tx-group">
							<h2 className="bank-tx-day">{group.label}</h2>
							<ul className="bank-tx-list">
								{group.items.map((tx) => (
									<li key={tx.id}>
										<button
											type="button"
											className="bank-tx-item bank-tx-item-btn"
											onClick={() => setSelected(tx)}
										>
											<div className="bank-tx-main">
												<div className="bank-tx-heading">
													<span
														className={`bank-tx-badge badge-${tx.badge || "other"}`}
													>
														{tx.badge || tx.type}
													</span>
													<strong className="bank-tx-type">
														{tx.title || tx.type}
													</strong>
												</div>
												<span
													className={`bank-tx-amount ${amountToneClass(tx.direction, tx.amount)}`}
												>
													{formatSignedBankMoney(
														tx.amount,
														tx.currency || "USD",
														lang,
														tx.direction,
													)}
												</span>
											</div>
											<div className="bank-tx-meta">
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
				<div className="cv-page-actions bank-page-actions">
					<button
						type="button"
						className="btn btn-ghost"
						disabled={loadingMore}
						onClick={() => void load(cursor, true)}
					>
						{t.bankActivityMore}
					</button>
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
