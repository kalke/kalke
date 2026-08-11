import { useEffect, useState } from "react";
import { Link } from "react-router";
import { bankAccount, type BankAccount } from "../api";
import { copy, type Lang } from "../content";
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
			<p className="eyebrow">{t.pathBank}</p>
			<div className="bank-title-row">
				<h1>{t.bankTitle}</h1>
				<span className="bank-demo-badge">{t.bankDemoBadge}</span>
			</div>
			<p className="section-intro">{t.bankIntro}</p>

			{loading ? (
				<p className="playground-muted">{t.bankLoading}</p>
			) : missing || !account ? (
				<section className="playground-panel bank-panel">
					<p>{t.bankNoAccount}</p>
					<div className="cv-page-actions bank-page-actions">
						<Link className="btn btn-primary" to="/playground/bank/onboarding">
							{t.bankOpenAccount}
						</Link>
					</div>
				</section>
			) : (
				<>
					<section className="surface-panel bank-balance-panel">
						<p className="path-label">{t.bankBalance}</p>
						<p className="bank-balance">
							{formatBankMoney(account.balance, account.currency, lang)}
						</p>
						<p className="playground-muted bank-balance-meta">
							{t.bankAccountId}:{" "}
							<code>{account.display_number || account.id}</code>
							{account.holder_name ? ` · ${account.holder_name}` : null}
						</p>
					</section>

					<nav className="bank-action-grid" aria-label={t.bankTitle}>
						<Link className="btn btn-primary" to="/playground/bank/transfer">
							{t.bankGoTransfer}
						</Link>
						<Link className="btn btn-ghost" to="/playground/bank/activity">
							{t.bankGoActivity}
						</Link>
						<Link className="btn btn-ghost" to="/playground/bank/accounts">
							{t.bankAccountsTitle}
						</Link>
						<Link className="btn btn-ghost" to="/playground/bank/onboarding">
							{t.bankGoOnboarding}
						</Link>
					</nav>
				</>
			)}
		</>
	);
}
