import { useEffect, useState } from "react";
import {
	bankTransactionDetail,
	bankTransactionReceiptPdf,
	type BankTransaction,
} from "../api";
import { copy, type Lang } from "../content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
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
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 pr-6">
						<DialogTitle className="m-0">
							{row.title || row.type}
						</DialogTitle>
						<TxBadge badge={row.badge} type={row.type} />
					</div>
					<DialogDescription className="sr-only">
						{t.bankTxAmount}:{" "}
						{formatSignedBankMoney(
							row.amount,
							currency,
							lang,
							row.direction,
						)}
					</DialogDescription>
				</DialogHeader>

				{loading ? <p className="text-sm text-muted">{t.loading}</p> : null}
				{error ? (
					<p className="text-sm text-danger" role="alert">
						{error}
					</p>
				) : null}

				<dl className="m-0 grid gap-3">
					<div>
						<dt className="mb-0.5 text-xs text-muted">{t.bankTxAmount}</dt>
						<dd
							className={cn(
								"font-display m-0 text-[0.95rem] tabular-nums",
								toneClass(row.direction, row.amount),
							)}
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
						<dt className="mb-0.5 text-xs text-muted">{t.bankTxWhen}</dt>
						<dd className="m-0 [overflow-wrap:anywhere]">
							{formatWhen(row.created_at, lang)}
						</dd>
					</div>
					{row.subtitle ? (
						<div>
							<dt className="mb-0.5 text-xs text-muted">
								{t.bankTxCounterparty}
							</dt>
							<dd className="m-0 [overflow-wrap:anywhere]">{row.subtitle}</dd>
						</div>
					) : null}
					{row.memo ? (
						<div>
							<dt className="mb-0.5 text-xs text-muted">{t.bankTxMemo}</dt>
							<dd className="m-0 [overflow-wrap:anywhere]">{row.memo}</dd>
						</div>
					) : null}
					<div>
						<dt className="mb-0.5 text-xs text-muted">ID</dt>
						<dd className="m-0">
							<code className="rounded bg-bg-deep px-1 py-0.5 text-xs">
								{row.id}
							</code>
						</dd>
					</div>
				</dl>

				<DialogFooter className="gap-2 sm:justify-start">
					<Button
						type="button"
						disabled={downloading}
						onClick={() => void download()}
					>
						{downloading ? t.loading : t.bankReceiptDownload}
					</Button>
					<Button type="button" variant="ghost" onClick={onClose}>
						{t.bankTxClose}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
