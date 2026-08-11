import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import {
	bankAccounts,
	bankTransferChallenge,
	bankTransferChallengeResend,
	bankTransferConfirm,
	bankTransferResolve,
	type BankAccount,
	type BankResolveResult,
	type BankTransferChallenge,
} from "../api";
import { copy, type Lang } from "../content";
import { digitsOnly, formatBankMoney } from "./bankValidation";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

export function BankTransfer({ lang }: Props) {
	const t = copy[lang].playground;
	const { busy, setBusy, setError } = useDashboard();
	const [accounts, setAccounts] = useState<BankAccount[]>([]);
	const [sourceId, setSourceId] = useState("");
	const [mode, setMode] = useState<"account" | "document">("account");
	const [destination, setDestination] = useState("");
	const [amount, setAmount] = useState("");
	const [memo, setMemo] = useState("");
	const [resolved, setResolved] = useState<BankResolveResult | null>(null);
	const [challenge, setChallenge] = useState<BankTransferChallenge | null>(null);
	const [code, setCode] = useState("");
	const [ok, setOk] = useState("");
	const [newBalance, setNewBalance] = useState("");

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const data = await bankAccounts();
				if (cancelled) return;
				const rows = data.accounts ?? [];
				setAccounts(rows);
				if (rows[0]?.id) setSourceId((prev) => prev || rows[0].id);
			} catch {
				/* listed later via transfer errors */
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	async function onResolve(e: FormEvent) {
		e.preventDefault();
		setBusy(true);
		setError("");
		setOk("");
		setResolved(null);
		setChallenge(null);
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

	async function onSendCode(e: FormEvent) {
		e.preventDefault();
		if (!resolved) return;
		setBusy(true);
		setError("");
		setOk("");
		try {
			const result = await bankTransferChallenge({
				destination_account: resolved.account_display,
				source_account_id: sourceId || undefined,
				amount: amount.trim(),
				memo: memo.trim() || undefined,
			});
			setChallenge(result);
			setCode("");
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankTransferError);
		} finally {
			setBusy(false);
		}
	}

	async function onConfirm(e: FormEvent) {
		e.preventDefault();
		if (!challenge) return;
		setBusy(true);
		setError("");
		setOk("");
		try {
			const result = await bankTransferConfirm(code.trim());
			setOk(t.bankTransferOk);
			setNewBalance(result.origin.balance);
			setAmount("");
			setMemo("");
			setResolved(null);
			setDestination("");
			setChallenge(null);
			setCode("");
			try {
				const data = await bankAccounts();
				setAccounts(data.accounts ?? []);
			} catch {
				/* ignore refresh failure */
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankTransferError);
		} finally {
			setBusy(false);
		}
	}

	async function onResend() {
		setBusy(true);
		setError("");
		try {
			const result = await bankTransferChallengeResend();
			setChallenge(result);
		} catch (err) {
			setError(err instanceof Error ? err.message : t.bankTransferError);
		} finally {
			setBusy(false);
		}
	}

	function resetChallenge() {
		setChallenge(null);
		setCode("");
		setError("");
	}

	const codeHint = t.bankTransferCodeHint.replace(
		"{email}",
		challenge?.email_masked || "…",
	);

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

			{!challenge ? (
				<>
					<form
						className="playground-form extract-form bank-transfer-form"
						onSubmit={onResolve}
					>
						{accounts.length > 0 ? (
							<label>
								{t.bankTransferSource}
								<select
									value={sourceId}
									onChange={(e) => setSourceId(e.target.value)}
									disabled={busy}
								>
									{accounts.map((row) => (
										<option key={row.id} value={row.id}>
											{(row.display_number || row.id) +
												" · " +
												formatBankMoney(row.balance, row.currency, lang)}
										</option>
									))}
								</select>
							</label>
						) : null}
						<div
							className="bank-mode-toggle"
							role="group"
							aria-label={t.bankTransferDest}
						>
							<button
								type="button"
								className={
									mode === "account" ? "btn btn-primary" : "btn btn-ghost"
								}
								onClick={() => {
									setMode("account");
									setResolved(null);
								}}
							>
								{t.bankTransferDest}
							</button>
							<button
								type="button"
								className={
									mode === "document" ? "btn btn-primary" : "btn btn-ghost"
								}
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
								placeholder={mode === "account" ? "2-9" : "000.000.000-00"}
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
						<form
							className="playground-form extract-form bank-transfer-form"
							onSubmit={onSendCode}
						>
							<section className="surface-panel bank-panel bank-resolve-panel">
								<p className="bank-resolve-holder">
									{t.bankTransferHolder}:{" "}
									<strong>{resolved.holder_name}</strong>
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
								{t.bankTransferSendCode}
							</button>
						</form>
					) : null}
				</>
			) : (
				<form
					className="playground-form extract-form bank-transfer-form"
					onSubmit={onConfirm}
				>
					<section className="surface-panel bank-panel bank-resolve-panel">
						<p className="bank-resolve-holder">{codeHint}</p>
						<p className="playground-muted bank-resolve-meta">
							{challenge.amount ? (
								<>
									{t.bankTransferAmount}:{" "}
									<strong>
										{formatBankMoney(challenge.amount, "USD", lang)}
									</strong>
								</>
							) : null}
							{challenge.destination_display ? (
								<>
									<br />
									<code>{challenge.destination_display}</code>
									{challenge.destination_holder
										? ` · ${challenge.destination_holder}`
										: null}
								</>
							) : null}
						</p>
					</section>
					<label>
						{t.bankTransferCode}
						<input
							className="bank-otp-input"
							value={code}
							onChange={(e) =>
								setCode(digitsOnly(e.target.value).slice(0, 6))
							}
							required
							disabled={busy}
							inputMode="numeric"
							autoComplete="one-time-code"
							placeholder="000000"
							maxLength={6}
						/>
					</label>
					<button
						className="btn btn-primary"
						type="submit"
						disabled={busy || code.trim().length < 6}
					>
						{t.bankTransferConfirm}
					</button>
					<div className="bank-onboarding-actions">
						<button
							type="button"
							className="btn btn-ghost"
							disabled={busy}
							onClick={() => void onResend()}
						>
							{busy ? t.bankTransferResendBusy : t.bankTransferResend}
						</button>
						<button
							type="button"
							className="btn btn-ghost"
							disabled={busy}
							onClick={resetChallenge}
						>
							{t.bankTransferChange}
						</button>
					</div>
				</form>
			)}

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
