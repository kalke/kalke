import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { bankTransfer, bankTransferResolve, type BankResolveResult } from "../api";
import { copy, type Lang } from "../content";
import { digitsOnly, formatBankMoney } from "./bankValidation";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

export function BankTransfer({ lang }: Props) {
	const t = copy[lang].playground;
	const { busy, setBusy, setError } = useDashboard();
	const [mode, setMode] = useState<"account" | "document">("account");
	const [destination, setDestination] = useState("");
	const [amount, setAmount] = useState("");
	const [memo, setMemo] = useState("");
	const [resolved, setResolved] = useState<BankResolveResult | null>(null);
	const [ok, setOk] = useState("");
	const [newBalance, setNewBalance] = useState("");

	async function onResolve(e: FormEvent) {
		e.preventDefault();
		setBusy(true);
		setError("");
		setOk("");
		setResolved(null);
		try {
			const value = destination.trim();
			const result = await bankTransferResolve(
				mode === "account"
					? { account: value }
					: { document: digitsOnly(value) },
			);
			setResolved(result);
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankTransferError);
		} finally {
			setBusy(false);
		}
	}

	async function onConfirm(e: FormEvent) {
		e.preventDefault();
		if (!resolved) return;
		setBusy(true);
		setError("");
		setOk("");
		try {
			const result = await bankTransfer({
				destination_account: resolved.account_display,
				amount: amount.trim(),
				memo: memo.trim() || undefined,
				idempotencyKey: crypto.randomUUID(),
			});
			setOk(t.bankTransferOk);
			setNewBalance(result.origin.balance);
			setAmount("");
			setMemo("");
			setResolved(null);
			setDestination("");
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankTransferError);
		} finally {
			setBusy(false);
		}
	}

	return (
		<>
			<p className="eyebrow">{t.pathBank}</p>
			<div className="bank-title-row">
				<h1>{t.bankTransferTitle}</h1>
				<span className="bank-demo-badge">{t.bankDemoBadge}</span>
			</div>
			<p className="section-intro">{t.bankTransferIntro}</p>

			<div className="cv-page-actions bank-page-actions">
				<Link className="btn btn-ghost" to="/playground/bank">
					{t.bankTransferBack}
				</Link>
			</div>

			<form className="playground-form extract-form bank-transfer-form" onSubmit={onResolve}>
				<div className="bank-mode-toggle" role="group" aria-label={t.bankTransferDest}>
					<button
						type="button"
						className={mode === "account" ? "btn btn-primary" : "btn btn-ghost"}
						onClick={() => {
							setMode("account");
							setResolved(null);
						}}
					>
						{t.bankTransferDest}
					</button>
					<button
						type="button"
						className={mode === "document" ? "btn btn-primary" : "btn btn-ghost"}
						onClick={() => {
							setMode("document");
							setResolved(null);
						}}
					>
						CPF
					</button>
				</div>
				<label>
					{mode === "account" ? t.bankTransferDest : "CPF"}
					<input
						value={destination}
						onChange={(e) => setDestination(e.target.value)}
						required
						disabled={busy}
						autoComplete="off"
						spellCheck={false}
						placeholder={mode === "account" ? "1-7" : "000.000.000-00"}
						inputMode={mode === "document" ? "numeric" : "text"}
					/>
				</label>
				<button
					className="btn btn-primary"
					type="submit"
					disabled={busy || !destination.trim()}
				>
					{t.bankTransferResolve}
				</button>
			</form>

			{resolved ? (
				<form className="playground-form extract-form bank-transfer-form" onSubmit={onConfirm}>
					<section className="surface-panel bank-panel bank-resolve-panel">
						<p className="bank-resolve-holder">
							{t.bankTransferHolder}: <strong>{resolved.holder_name}</strong>
						</p>
						<p className="playground-muted bank-resolve-meta">
							<code>{resolved.account_display}</code>
							{resolved.document_masked
								? ` · ${resolved.document_masked}`
								: null}
						</p>
					</section>
					<label>
						{t.bankTransferAmount}
						<input
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							required
							disabled={busy}
							inputMode="decimal"
							placeholder="25.50"
						/>
					</label>
					<label>
						{t.bankTransferMemo}
						<input
							value={memo}
							onChange={(e) => setMemo(e.target.value)}
							disabled={busy}
							maxLength={280}
						/>
					</label>
					<button
						className="btn btn-primary"
						type="submit"
						disabled={busy || !amount.trim()}
					>
						{t.bankTransferConfirm}
					</button>
				</form>
			) : null}

			{ok ? (
				<section className="surface-panel bank-panel">
					<p>{ok}</p>
					{newBalance ? (
						<p className="playground-muted">
							{t.bankBalance}:{" "}
							<code>{formatBankMoney(newBalance, "USD", lang)}</code>
						</p>
					) : null}
				</section>
			) : null}
		</>
	);
}
