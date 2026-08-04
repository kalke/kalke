import type { ExtractionSummary } from "../api";
import type { Lang } from "../content";

export const CV_DOC_TYPE = "curriculum_vitae";

export type CvLanguage = { name?: string; level?: string };
export type CvExperience = {
	company?: string;
	title?: string;
	location?: string;
	start_date?: string;
	end_date?: string | null;
	current?: boolean;
	highlights?: string[];
};
export type CvEducation = {
	institution?: string;
	degree?: string;
	field?: string;
	start_date?: string;
	end_date?: string;
	details?: string;
};
export type CvCertification = { name?: string; issuer?: string; date?: string };

export type CvData = {
	full_name?: string;
	headline?: string;
	email?: string;
	phone?: string;
	location?: string;
	linkedin?: string;
	github?: string;
	website?: string;
	summary?: string;
	skills?: string[];
	languages?: CvLanguage[];
	experience?: CvExperience[];
	education?: CvEducation[];
	certifications?: CvCertification[];
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
	return v != null && typeof v === "object" && !Array.isArray(v);
}

export function extractCvPayload(result: unknown): CvData {
	if (!isPlainObject(result)) return {};
	const data = result.data;
	if (isPlainObject(data)) return data as CvData;
	if (isPlainObject(result.fields)) return result.fields as CvData;
	return result as CvData;
}

export function cvHistoryLabel(item: ExtractionSummary): string {
	const payload = extractCvPayload(item.result);
	if (payload.full_name?.trim()) return payload.full_name.trim();
	if (item.filename?.trim()) return item.filename.trim();
	return item.id.slice(0, 8);
}

export function formatCvDate(raw: string, lang: Lang): string {
	const s = raw.trim();
	if (!s) return "";
	let match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
	if (match) {
		const y = Number(match[1]);
		const m = Number(match[2]);
		const d = Number(match[3]);
		const date = new Date(Date.UTC(y, m - 1, d, 12));
		if (
			date.getUTCFullYear() === y &&
			date.getUTCMonth() === m - 1 &&
			date.getUTCDate() === d
		) {
			return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
				day: "numeric",
				month: "long",
				year: "numeric",
				timeZone: "UTC",
			}).format(date);
		}
	}
	match = /^(\d{4})-(\d{2})$/.exec(s);
	if (match) {
		const y = Number(match[1]);
		const m = Number(match[2]);
		const date = new Date(Date.UTC(y, m - 1, 1, 12));
		if (date.getUTCFullYear() === y && date.getUTCMonth() === m - 1) {
			return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
				month: "long",
				year: "numeric",
				timeZone: "UTC",
			}).format(date);
		}
	}
	return s;
}

export function formatSavedAt(iso: string, lang: Lang): string {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(d);
}

/** Flatten skills whether stored as string[] or grouped objects. */
export function flatCvSkills(skills: unknown): string[] {
	if (!Array.isArray(skills)) return [];
	if (skills.every((s) => typeof s === "string")) {
		return (skills as string[]).map((s) => s.trim()).filter(Boolean);
	}
	const out: string[] = [];
	for (const g of skills) {
		if (g == null || typeof g !== "object") continue;
		const items = (g as { items?: unknown }).items;
		if (!Array.isArray(items)) continue;
		for (const item of items) {
			if (typeof item === "string" && item.trim()) out.push(item.trim());
		}
	}
	return out;
}
