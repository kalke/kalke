import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { bankAccounts, bankOpenAdditionalAccount, type BankAccount } from "../api";
import { copy, type Lang } from "../content";
import { formatBankMoney } from "./bankValidation";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

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
			<p className="eyebrow">{t.pathBank}</p>
			<div className="bank-title-row">
				<h1>{t.bankAccountsTitle}</h1>
				<span className="bank-demo-badge">{t.bankDemoBadge}</span>
			</div>
			<p className="section-intro">{t.bankAccountsIntro}</p>

			<div className="cv-page-actions bank-page-actions">
				<Link className="btn btn-ghost" to="/playground/bank">
					{t.bankTransferBack}
				</Link>
				<button
					type="button"
					className="btn btn-primary"
					disabled={busy || loading || rows.length === 0}
					onClick={onOpenExtra}
				>
					{busy ? t.bankOpenExtraBusy : t.bankOpenExtraAccount}
				</button>
				<Link className="btn btn-ghost" to="/playground/bank/transfer">
					{t.bankGoTransfer}
				</Link>
			</div>

			<label className="bank-search">
				<span>{t.bankAccountsSearch}</span>
				<input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					disabled={loading}
					autoComplete="off"
					spellCheck={false}
					enterKeyHint="search"
				/>
			</label>

			{loading ? (
				<p className="playground-muted">{t.bankLoading}</p>
			) : filtered.length === 0 ? (
				<section className="playground-panel bank-panel">
					<p>{t.bankAccountsEmpty}</p>
				</section>
			) : (
				<ul className="bank-account-list">
					{filtered.map((row) => (
						<li key={row.id} className="bank-account-card">
							<div className="bank-account-card-top">
								<code className="bank-account-number">
									{row.display_number || row.id}
								</code>
								<Link
									className="bank-eye"
									to="/playground/bank"
									aria-label={t.bankAccountsOpen}
									title={t.bankAccountsOpen}
								>
									<span aria-hidden="true">◉</span>
								</Link>
							</div>
							<p className="bank-account-holder">
								{row.holder_name || "—"}
							</p>
							<p className="bank-account-balance">
								{formatBankMoney(row.balance, row.currency, lang)}
							</p>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
