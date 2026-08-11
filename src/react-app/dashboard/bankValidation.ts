/** Shared age / mask helpers for bank onboarding (mirror API rules). */

export function digitsOnly(value: string): string {
	return (value || "").replace(/\D/g, "");
}

export function ageYears(isoDate: string, today = new Date()): number {
	const [y, m, d] = isoDate.split("-").map(Number);
	if (!y || !m || !d) return -1;
	let years = today.getFullYear() - y;
	const beforeBirthday =
		today.getMonth() + 1 < m ||
		(today.getMonth() + 1 === m && today.getDate() < d);
	if (beforeBirthday) years -= 1;
	return years;
}

export function isAdult(isoDate: string): boolean {
	return ageYears(isoDate) >= 18;
}

export function maskPhone(value: string): string {
	const d = digitsOnly(value).slice(0, 11);
	if (d.length <= 2) return d;
	if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
	if (d.length <= 10)
		return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
	return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskCep(value: string): string {
	const d = digitsOnly(value).slice(0, 8);
	if (d.length <= 5) return d;
	return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export function isEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function formatBankMoney(
	amount: string,
	currency: string,
	lang: "pt" | "en",
): string {
	const n = Number(amount);
	if (!Number.isFinite(n)) return `${amount} ${currency}`.trim();
	return new Intl.NumberFormat(lang === "pt" ? "pt-BR" : "en-US", {
		style: "currency",
		currency: currency || (lang === "pt" ? "BRL" : "USD"),
	}).format(n);
}
