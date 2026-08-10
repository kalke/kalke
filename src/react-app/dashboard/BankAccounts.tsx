import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { bankAccounts, type BankAccount } from "../api";
import { copy, type Lang } from "../content";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

function formatMoney(amount: string, currency: string, lang: Lang): string {
	const n = Number(amount);
	if (!Number.isFinite(n)) return `${amount} ${currency}`;
	return new Intl.NumberFormat(lang === "pt" ? "pt-BR" : "en-US", {
		style: "currency",
		currency: currency || "USD",
	}).format(n);
}

export function BankAccounts({ lang }: Props) {
	const t = copy[lang].playground;
	const { setError } = useDashboard();
	const [rows, setRows] = useState<BankAccount[]>([]);
	const [loading, setLoading] = useState(true);
	const [q, setQ] = useState("");

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoading(true);
			setError("");
			try {
				const data = await bankAccounts();
				if (!cancelled) setRows(data.accounts ?? []);
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
	}, [setError, t.bankLoadError]);

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

	return (
		<>
			<p className="eyebrow">{t.pathBank}</p>
			<div className="bank-title-row">
				<h1>{t.bankAccountsTitle}</h1>
				<span className="bank-demo-badge">{t.bankDemoBadge}</span>
			</div>
			<p className="section-intro">{t.bankAccountsIntro}</p>

			<p className="cv-page-actions">
				<Link className="btn btn-ghost" to="/playground/bank">
					{t.bankTransferBack}
				</Link>
				<Link className="btn btn-primary" to="/playground/bank/onboarding">
					{t.bankGoOnboarding}
				</Link>
			</p>

			<label className="bank-search">
				{t.bankAccountsSearch}
				<input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					disabled={loading}
				/>
			</label>

			{loading ? (
				<p className="playground-muted">{t.bankLoading}</p>
			) : filtered.length === 0 ? (
				<section className="playground-panel bank-panel">
					<p>{t.bankAccountsEmpty}</p>
				</section>
			) : (
				<div className="bank-accounts-table-wrap">
					<table className="bank-accounts-table">
						<thead>
							<tr>
								<th>{t.bankAccountId}</th>
								<th>{t.bankWizardFullName}</th>
								<th>{t.bankBalance}</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{filtered.map((row) => (
								<tr key={row.id}>
									<td>
										<code>{row.display_number || row.id}</code>
									</td>
									<td>{row.holder_name || "—"}</td>
									<td>{formatMoney(row.balance, row.currency, lang)}</td>
									<td>
										<Link
											className="bank-eye"
											to="/playground/bank"
											aria-label={t.bankAccountsOpen}
											title={t.bankAccountsOpen}
										>
											◉
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</>
	);
}
