import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { bankTransactions, type BankTransaction } from "../api";
import { copy, type Lang } from "../content";
import { formatBankMoney } from "./bankValidation";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

function formatWhen(iso: string, lang: Lang): string {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(d);
}

export function BankActivity({ lang }: Props) {
	const t = copy[lang].playground;
	const { setError } = useDashboard();
	const [items, setItems] = useState<BankTransaction[]>([]);
	const [cursor, setCursor] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);

	const load = useCallback(
		async (nextCursor?: string | null, append = false) => {
			if (append) setLoadingMore(true);
			else setLoading(true);
			setError("");
			try {
				const page = await bankTransactions(20, nextCursor ?? undefined);
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
		[setError, t.bankActivityLoadError],
	);

	useEffect(() => {
		void load();
	}, [load]);

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

			{loading ? (
				<p className="playground-muted">{t.loading}</p>
			) : items.length === 0 ? (
				<p className="playground-muted">{t.bankActivityEmpty}</p>
			) : (
				<ul className="bank-tx-list">
					{items.map((tx) => (
						<li key={tx.id} className="bank-tx-item">
							<div className="bank-tx-main">
								<strong className="bank-tx-type">{tx.type}</strong>
								<span className="bank-tx-amount">
									{formatBankMoney(tx.amount, "USD", lang)}
								</span>
							</div>
							<div className="bank-tx-meta">
								<span>
									{t.bankTxWhen}: {formatWhen(tx.created_at, lang)}
								</span>
								{tx.counterparty_account_id ? (
									<span className="bank-tx-counterparty">
										{t.bankTxCounterparty}:{" "}
										<code>{tx.counterparty_account_id}</code>
									</span>
								) : null}
								{tx.memo ? (
									<span className="bank-tx-memo">
										{t.bankTxMemo}: {tx.memo}
									</span>
								) : null}
							</div>
						</li>
					))}
				</ul>
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
		</>
	);
}
