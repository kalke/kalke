import type { BankTransaction } from "../api";
import type { Lang } from "../content";

export type StatementGroup = {
	key: string;
	label: string;
	items: BankTransaction[];
};

function startOfLocalDay(d: Date): Date {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function dayKey(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

export function groupTransactionsByDay(
	items: BankTransaction[],
	lang: Lang,
): StatementGroup[] {
	const today = startOfLocalDay(new Date());
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const todayKey = dayKey(today);
	const yesterdayKey = dayKey(yesterday);

	const buckets = new Map<string, BankTransaction[]>();
	for (const tx of items) {
		const d = new Date(tx.created_at);
		const key = Number.isNaN(d.getTime()) ? "unknown" : dayKey(d);
		const list = buckets.get(key) ?? [];
		list.push(tx);
		buckets.set(key, list);
	}

	const keys = [...buckets.keys()].sort((a, b) => b.localeCompare(a));
	return keys.map((key) => {
		let label: string;
		if (key === todayKey) {
			label = lang === "pt" ? "Hoje" : "Today";
		} else if (key === yesterdayKey) {
			label = lang === "pt" ? "Ontem" : "Yesterday";
		} else if (key === "unknown") {
			label = "—";
		} else {
			const [y, m, d] = key.split("-").map(Number);
			label = new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
				dateStyle: "full",
			}).format(new Date(y, m - 1, d));
		}
		return { key, label, items: buckets.get(key) ?? [] };
	});
}

export function formatSignedBankMoney(
	amount: string,
	currency: string,
	lang: Lang,
	direction?: string,
): string {
	const n = Number(amount);
	const abs = Number.isFinite(n) ? Math.abs(n) : 0;
	const formatted = new Intl.NumberFormat(lang === "pt" ? "pt-BR" : "en-US", {
		style: "currency",
		currency: currency || "USD",
	}).format(abs);
	const out = direction === "out" || (Number.isFinite(n) && n < 0);
	return out ? `−${formatted}` : `+${formatted}`;
}

export function amountToneClass(direction?: string, amount?: string): string {
	if (direction === "in") return "is-credit";
	if (direction === "out") return "is-debit";
	const n = Number(amount);
	if (Number.isFinite(n) && n < 0) return "is-debit";
	if (Number.isFinite(n) && n > 0) return "is-credit";
	return "";
}

/** Inclusive UTC calendar day bounds as YYYY-MM-DD for API filters. */
export function presetRange(
	preset: "7d" | "30d" | "this_month" | "last_month",
	now = new Date(),
): { from: string; to: string } {
	const iso = (d: Date) => dayKey(d);
	const end = startOfLocalDay(now);
	if (preset === "7d") {
		const start = new Date(end);
		start.setDate(start.getDate() - 6);
		return { from: iso(start), to: iso(end) };
	}
	if (preset === "30d") {
		const start = new Date(end);
		start.setDate(start.getDate() - 29);
		return { from: iso(start), to: iso(end) };
	}
	if (preset === "this_month") {
		const start = new Date(end.getFullYear(), end.getMonth(), 1);
		return { from: iso(start), to: iso(end) };
	}
	const start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
	const last = new Date(end.getFullYear(), end.getMonth(), 0);
	return { from: iso(start), to: iso(last) };
}
