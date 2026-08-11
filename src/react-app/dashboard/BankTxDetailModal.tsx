import { useEffect, useState } from "react";
import {
	bankTransactionDetail,
	bankTransactionReceiptPdf,
	type BankTransaction,
} from "../api";
import { copy, type Lang } from "../content";
import {
	amountToneClass,
	formatSignedBankMoney,
} from "./bankStatementFormat";

type Props = {
	lang: Lang;
	tx: BankTransaction;
	onClose: () => void;
};

function formatWhen(iso: string, lang: Lang): string {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(d);
}

export function BankTxDetailModal({ lang, tx, onClose }: Props) {
	const t = copy[lang].playground;
	const [detail, setDetail] = useState<BankTransaction | null>(null);
	const [loading, setLoading] = useState(true);
	const [downloading, setDownloading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			setLoading(true);
			setError("");
			try {
				const row = await bankTransactionDetail(tx.id);
				if (!cancelled) setDetail(row);
			} catch (err) {
				if (!cancelled) {
					setDetail(tx);
					setError(
						err instanceof Error ? err.message : t.bankTxDetailError,
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [tx, t.bankTxDetailError]);

	const row = detail ?? tx;
	const currency = row.currency || "USD";

	const download = async () => {
		setDownloading(true);
		setError("");
		try {
			await bankTransactionReceiptPdf(row.id);
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankReceiptError);
		} finally {
			setDownloading(false);
		}
	};

	return (
		<div className="bank-modal" role="dialog" aria-modal="true">
			<button
				type="button"
				className="bank-modal-backdrop"
				aria-label={t.bankTxClose}
				onClick={onClose}
			/>
			<div className="bank-modal-card bank-tx-modal-card">
				<div className="bank-title-row">
					<h2>{row.title || row.type}</h2>
					<span className={`bank-tx-badge badge-${row.badge || "other"}`}>
						{row.badge || row.type}
					</span>
				</div>
				{loading ? <p className="playground-muted">{t.loading}</p> : null}
				{error ? <p className="form-error">{error}</p> : null}
				<dl className="bank-tx-detail-grid">
					<div>
						<dt>{t.bankTxAmount}</dt>
						<dd
							className={`bank-tx-amount ${amountToneClass(row.direction, row.amount)}`}
						>
							{formatSignedBankMoney(
								row.amount,
								currency,
								lang,
								row.direction,
							)}
						</dd>
					</div>
					<div>
						<dt>{t.bankTxWhen}</dt>
						<dd>{formatWhen(row.created_at, lang)}</dd>
					</div>
					{row.subtitle ? (
						<div>
							<dt>{t.bankTxCounterparty}</dt>
							<dd>{row.subtitle}</dd>
						</div>
					) : null}
					{row.memo ? (
						<div>
							<dt>{t.bankTxMemo}</dt>
							<dd>{row.memo}</dd>
						</div>
					) : null}
					<div>
						<dt>ID</dt>
						<dd>
							<code>{row.id}</code>
						</dd>
					</div>
				</dl>
				<div className="cv-page-actions bank-page-actions">
					<button
						type="button"
						className="btn btn-primary"
						disabled={downloading}
						onClick={() => void download()}
					>
						{downloading ? t.loading : t.bankReceiptDownload}
					</button>
					<button type="button" className="btn btn-ghost" onClick={onClose}>
						{t.bankTxClose}
					</button>
				</div>
			</div>
		</div>
	);
}
