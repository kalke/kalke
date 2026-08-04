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

export type CvSkillGroup = {
	category: string;
	items: string[];
};

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
	/** Categorized groups (new) or legacy flat string[] */
	skills?: CvSkillGroup[] | string[];
	languages?: CvLanguage[];
	experience?: CvExperience[];
	education?: CvEducation[];
	certifications?: CvCertification[];
};

export const SKILL_CATEGORY_ORDER = [
	"frontend",
	"backend",
	"mobile",
	"devops",
	"cloud",
	"data",
	"tools",
	"soft",
	"other",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORY_ORDER)[number];

const SKILL_CATEGORY_ALIASES: Record<string, SkillCategory> = {
	frontend: "frontend",
	"front-end": "frontend",
	"front end": "frontend",
	front: "frontend",
	ui: "frontend",
	web: "frontend",
	backend: "backend",
	"back-end": "backend",
	"back end": "backend",
	back: "backend",
	server: "backend",
	api: "backend",
	mobile: "mobile",
	android: "mobile",
	ios: "mobile",
	devops: "devops",
	sre: "devops",
	infra: "devops",
	infrastructure: "devops",
	ops: "devops",
	platform: "devops",
	cloud: "cloud",
	aws: "cloud",
	gcp: "cloud",
	azure: "cloud",
	data: "data",
	ml: "data",
	ai: "data",
	analytics: "data",
	database: "data",
	databases: "data",
	tools: "tools",
	tooling: "tools",
	soft: "soft",
	"soft skills": "soft",
	softskills: "soft",
	other: "other",
	misc: "other",
	general: "other",
};

/** Keyword hints used only for legacy flat skill lists. */
const SKILL_HINTS: Record<SkillCategory, string[]> = {
	frontend: [
		"react",
		"vue",
		"angular",
		"svelte",
		"next",
		"nuxt",
		"typescript",
		"javascript",
		"html",
		"css",
		"sass",
		"tailwind",
		"webpack",
		"vite",
		"redux",
		"zustand",
		"jquery",
		"storybook",
		"figma",
	],
	backend: [
		"go",
		"golang",
		"java",
		"spring",
		"kotlin",
		"python",
		"django",
		"flask",
		"fastapi",
		"node",
		"nestjs",
		"express",
		"php",
		"laravel",
		"ruby",
		"rails",
		"csharp",
		"c#",
		".net",
		"dotnet",
		"rust",
		"graphql",
		"grpc",
		"rest",
		"postgres",
		"postgresql",
		"mysql",
		"mongodb",
		"redis",
		"sql",
		"prisma",
		"hibernate",
	],
	mobile: [
		"android",
		"ios",
		"swift",
		"swiftui",
		"kotlin multiplatform",
		"flutter",
		"react native",
		"expo",
		"xamarin",
	],
	devops: [
		"docker",
		"kubernetes",
		"k8s",
		"terraform",
		"ansible",
		"jenkins",
		"github actions",
		"gitlab ci",
		"ci/cd",
		"cicd",
		"prometheus",
		"grafana",
		"helm",
		"nginx",
		"linux",
		"bash",
		"shell",
	],
	cloud: [
		"aws",
		"gcp",
		"azure",
		"cloudflare",
		"lambda",
		"ecs",
		"eks",
		"s3",
		"ec2",
		"vercel",
		"netlify",
		"heroku",
	],
	data: [
		"spark",
		"hadoop",
		"kafka",
		"airflow",
		"dbt",
		"snowflake",
		"bigquery",
		"pandas",
		"numpy",
		"tensorflow",
		"pytorch",
		"scikit",
		"machine learning",
		"data science",
		"etl",
	],
	tools: [
		"git",
		"jira",
		"confluence",
		"notion",
		"postman",
		"insomnia",
		"vscode",
		"vim",
		"datadog",
		"sentry",
		"new relic",
	],
	soft: [
		"leadership",
		"comunicação",
		"communication",
		"mentoring",
		"agile",
		"scrum",
		"kanban",
		"teamwork",
		"problem solving",
	],
	other: [],
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

function canonicalizeCategory(raw: string): SkillCategory {
	const key = raw.trim().toLowerCase();
	if (!key) return "other";
	if (SKILL_CATEGORY_ALIASES[key]) return SKILL_CATEGORY_ALIASES[key];
	for (const known of SKILL_CATEGORY_ORDER) {
		if (key.includes(known)) return known;
	}
	return "other";
}

function guessCategory(skill: string): SkillCategory {
	const key = skill.trim().toLowerCase();
	for (const cat of SKILL_CATEGORY_ORDER) {
		if (cat === "other") continue;
		for (const hint of SKILL_HINTS[cat]) {
			if (key === hint || key.includes(hint) || hint.includes(key)) {
				return cat;
			}
		}
	}
	return "other";
}

function isSkillGroupArray(v: unknown): v is CvSkillGroup[] {
	if (!Array.isArray(v) || v.length === 0) return false;
	return v.every(
		(g) =>
			g != null &&
			typeof g === "object" &&
			!Array.isArray(g) &&
			("category" in g || "items" in g),
	);
}

function isStringArray(v: unknown): v is string[] {
	return Array.isArray(v) && v.every((x) => typeof x === "string");
}

/** Normalize skills into ordered category groups for display. */
export function organizeCvSkills(skills: CvData["skills"]): CvSkillGroup[] {
	if (!skills || !Array.isArray(skills) || skills.length === 0) return [];

	const merged = new Map<SkillCategory, string[]>();
	const seen = new Map<SkillCategory, Set<string>>();

	function add(cat: SkillCategory, item: string) {
		const name = item.trim();
		if (!name) return;
		const key = name.toLowerCase();
		if (!seen.has(cat)) seen.set(cat, new Set());
		if (seen.get(cat)!.has(key)) return;
		seen.get(cat)!.add(key);
		if (!merged.has(cat)) merged.set(cat, []);
		merged.get(cat)!.push(name);
	}

	if (isSkillGroupArray(skills)) {
		for (const g of skills) {
			const cat = canonicalizeCategory(String(g.category ?? "other"));
			const items = Array.isArray(g.items) ? g.items : [];
			for (const item of items) {
				if (typeof item === "string") add(cat, item);
			}
		}
	} else if (isStringArray(skills)) {
		for (const skill of skills) add(guessCategory(skill), skill);
	} else if (isPlainObject(skills)) {
		for (const [catRaw, items] of Object.entries(skills)) {
			const cat = canonicalizeCategory(catRaw);
			if (!Array.isArray(items)) continue;
			for (const item of items) {
				if (typeof item === "string") add(cat, item);
			}
		}
	}

	return SKILL_CATEGORY_ORDER.filter((cat) => (merged.get(cat)?.length ?? 0) > 0).map(
		(cat) => ({ category: cat, items: merged.get(cat)! }),
	);
}
