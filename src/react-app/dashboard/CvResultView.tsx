import { useMemo, useState } from "react";
import { SurfacePanel } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copy, type Lang } from "../content";
import {
	extractCvPayload,
	formatCvDate,
	organizeCvSkills,
	type CvData,
} from "./cvShared";

type Props = {
	lang: Lang;
	result: unknown;
	/** Optional heading override (defaults to "Extracted") */
	title?: string;
};

export function CvResultView({ lang, result, title }: Props) {
	const t = copy[lang].playground;
	const [showJson, setShowJson] = useState(false);
	const cv: CvData = extractCvPayload(result);
	const skillGroups = useMemo(() => organizeCvSkills(cv.skills), [cv.skills]);

	const contactBits = [
		cv.email,
		cv.phone,
		cv.location,
		cv.linkedin,
		cv.github,
		cv.website,
	].filter((v): v is string => Boolean(v && String(v).trim()));

	function skillCategoryLabel(cat: string): string {
		return t.cvSkillCategories[cat] ?? cat;
	}

	return (
		<SurfacePanel className="my-4 grid gap-4">
			<h2 className="font-display text-xl font-semibold tracking-tight">
				{title ?? t.extracted}
			</h2>
			{cv.full_name ? (
				<p className="font-display text-xl font-semibold text-fg">
					{cv.full_name}
				</p>
			) : null}
			{cv.headline ? (
				<p className="font-display text-sm text-accent">{cv.headline}</p>
			) : null}
			{cv.summary ? (
				<p className="text-sm leading-relaxed text-muted">{cv.summary}</p>
			) : null}

			{contactBits.length ? (
				<section className="mt-2">
					<h3 className="mb-2 font-display text-xs font-semibold tracking-wide text-muted uppercase">
						{t.cvSectionContact}
					</h3>
					<ul className="grid gap-1 text-sm text-fg">
						{contactBits.map((bit) => (
							<li key={bit}>{bit}</li>
						))}
					</ul>
				</section>
			) : null}

			{skillGroups.length ? (
				<section className="mt-2">
					<h3 className="mb-2 font-display text-xs font-semibold tracking-wide text-muted uppercase">
						{t.cvSectionSkills}
					</h3>
					{skillGroups.length > 1 ? (
						<nav
							className="mb-3 flex flex-wrap gap-x-3 gap-y-2"
							aria-label={t.cvSectionSkills}
						>
							{skillGroups.map((g) => (
								<a
									key={g.category}
									href={`#cv-skill-${g.category}`}
									className="font-display text-sm text-accent underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none"
								>
									{skillCategoryLabel(g.category)}
								</a>
							))}
						</nav>
					) : null}
					<div className="grid gap-3.5">
						{skillGroups.map((g) => (
							<div
								key={g.category}
								id={`cv-skill-${g.category}`}
								className="scroll-mt-5"
							>
								<h4 className="mb-2 font-display text-sm font-semibold text-fg">
									{skillCategoryLabel(g.category)}
								</h4>
								<ul className="flex flex-wrap gap-1.5">
									{g.items.map((skill) => (
										<li key={skill}>
											<Badge variant="outline" className="border-accent/30 bg-accent/10 font-display text-xs font-normal text-fg">
												{skill}
											</Badge>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>
			) : null}

			{cv.experience && cv.experience.length ? (
				<section className="mt-2">
					<h3 className="mb-2 font-display text-xs font-semibold tracking-wide text-muted uppercase">
						{t.cvSectionExperience}
					</h3>
					<ul className="grid gap-3.5">
						{cv.experience.map((job, i) => {
							const start = job.start_date
								? formatCvDate(job.start_date, lang)
								: "";
							const end = job.current
								? t.cvPresent
								: job.end_date
									? formatCvDate(job.end_date, lang)
									: "";
							const range = [start, end].filter(Boolean).join(" – ");
							return (
								<li
									key={`${job.company}-${job.title}-${i}`}
									className="grid gap-0.5"
								>
									<strong className="text-[0.95rem] font-semibold text-fg">
										{[job.title, job.company].filter(Boolean).join(" · ")}
									</strong>
									{range || job.location ? (
										<span className="font-display text-xs text-muted">
											{[range, job.location].filter(Boolean).join(" · ")}
										</span>
									) : null}
									{job.highlights && job.highlights.length ? (
										<ul className="mt-1.5 grid gap-0.5 border-l border-border pl-3 text-sm leading-snug text-muted">
											{job.highlights.map((h) => (
												<li key={h}>{h}</li>
											))}
										</ul>
									) : null}
								</li>
							);
						})}
					</ul>
				</section>
			) : null}

			{cv.education && cv.education.length ? (
				<section className="mt-2">
					<h3 className="mb-2 font-display text-xs font-semibold tracking-wide text-muted uppercase">
						{t.cvSectionEducation}
					</h3>
					<ul className="grid gap-3.5">
						{cv.education.map((ed, i) => {
							const start = ed.start_date
								? formatCvDate(ed.start_date, lang)
								: "";
							const end = ed.end_date ? formatCvDate(ed.end_date, lang) : "";
							const range = [start, end].filter(Boolean).join(" – ");
							return (
								<li
									key={`${ed.institution}-${ed.degree}-${i}`}
									className="grid gap-0.5"
								>
									<strong className="text-[0.95rem] font-semibold text-fg">
										{[ed.degree, ed.field, ed.institution]
											.filter(Boolean)
											.join(" · ")}
									</strong>
									{range ? (
										<span className="font-display text-xs text-muted">
											{range}
										</span>
									) : null}
									{ed.details ? (
										<span className="font-display text-xs text-muted">
											{ed.details}
										</span>
									) : null}
								</li>
							);
						})}
					</ul>
				</section>
			) : null}

			{cv.languages && cv.languages.length ? (
				<section className="mt-2">
					<h3 className="mb-2 font-display text-xs font-semibold tracking-wide text-muted uppercase">
						{t.cvSectionLanguages}
					</h3>
					<ul className="grid gap-1 text-sm text-fg">
						{cv.languages.map((langItem, i) => (
							<li key={`${langItem.name}-${i}`}>
								{[langItem.name, langItem.level].filter(Boolean).join(" — ")}
							</li>
						))}
					</ul>
				</section>
			) : null}

			{cv.certifications && cv.certifications.length ? (
				<section className="mt-2">
					<h3 className="mb-2 font-display text-xs font-semibold tracking-wide text-muted uppercase">
						{t.cvSectionCertifications}
					</h3>
					<ul className="grid gap-3.5">
						{cv.certifications.map((c, i) => (
							<li key={`${c.name}-${i}`} className="grid gap-0.5">
								<strong className="text-[0.95rem] font-semibold text-fg">
									{[c.name, c.issuer].filter(Boolean).join(" · ")}
								</strong>
								{c.date ? (
									<span className="font-display text-xs text-muted">
										{formatCvDate(c.date, lang)}
									</span>
								) : null}
							</li>
						))}
					</ul>
				</section>
			) : null}

			<Button
				type="button"
				variant="ghost"
				onClick={() => setShowJson((v) => !v)}
			>
				{showJson ? t.resultHideJson : t.resultJson}
			</Button>
			{showJson ? (
				<pre className="mt-3 max-h-88 overflow-auto rounded-md border border-border bg-bg-deep/55 p-3.5 font-display text-xs leading-relaxed break-words whitespace-pre-wrap text-fg">
					{JSON.stringify(result, null, 2)}
				</pre>
			) : null}
		</SurfacePanel>
	);
}
