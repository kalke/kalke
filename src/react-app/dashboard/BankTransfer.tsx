import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { bankTransfer } from "../api";
import { copy, type Lang } from "../content";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

export function BankTransfer({ lang }: Props) {
	const t = copy[lang].playground;
	const { busy, setBusy, setError } = useDashboard();
	const [destination, setDestination] = useState("");
	const [amount, setAmount] = useState("");
	const [memo, setMemo] = useState("");
	const [ok, setOk] = useState("");
	const [newBalance, setNewBalance] = useState("");

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		setBusy(true);
		setError("");
		setOk("");
		setNewBalance("");
		try {
			const result = await bankTransfer({
				destination_account_id: destination.trim(),
				amount: amount.trim(),
				memo: memo.trim() || undefined,
			});
			setOk(t.bankTransferOk);
			setNewBalance(result.origin.balance);
			setAmount("");
			setMemo("");
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

			<p className="cv-page-actions">
				<Link className="btn btn-ghost" to="/playground/bank">
					{t.bankTransferBack}
				</Link>
			</p>

			<form className="playground-form extract-form" onSubmit={onSubmit}>
				<label>
					{t.bankTransferDest}
					<input
						value={destination}
						onChange={(e) => setDestination(e.target.value)}
						required
						disabled={busy}
						autoComplete="off"
						spellCheck={false}
					/>
				</label>
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
					disabled={busy || !destination.trim() || !amount.trim()}
				>
					{t.bankTransferSubmit}
				</button>
			</form>

			{ok ? (
				<section className="surface-panel bank-panel">
					<p>{ok}</p>
					{newBalance ? (
						<p className="playground-muted">
							{t.bankBalance}: <code>{newBalance}</code>
						</p>
					) : null}
				</section>
			) : null}
		</>
	);
}
