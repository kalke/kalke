import { useMemo, useState } from "react";
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
		<div className="extract-result surface-panel cv-result">
			<h2>{title ?? t.extracted}</h2>
			{cv.full_name ? <p className="cv-name">{cv.full_name}</p> : null}
			{cv.headline ? <p className="cv-headline">{cv.headline}</p> : null}
			{cv.summary ? <p className="cv-summary">{cv.summary}</p> : null}

			{contactBits.length ? (
				<section className="cv-section">
					<h3>{t.cvSectionContact}</h3>
					<ul className="cv-contact-list">
						{contactBits.map((bit) => (
							<li key={bit}>{bit}</li>
						))}
					</ul>
				</section>
			) : null}

			{skillGroups.length ? (
				<section className="cv-section cv-skills-section">
					<h3>{t.cvSectionSkills}</h3>
					{skillGroups.length > 1 ? (
						<nav className="cv-skill-nav" aria-label={t.cvSectionSkills}>
							{skillGroups.map((g) => (
								<a key={g.category} href={`#cv-skill-${g.category}`}>
									{skillCategoryLabel(g.category)}
								</a>
							))}
						</nav>
					) : null}
					<div className="cv-skill-groups">
						{skillGroups.map((g) => (
							<div
								key={g.category}
								id={`cv-skill-${g.category}`}
								className="cv-skill-group"
							>
								<h4>{skillCategoryLabel(g.category)}</h4>
								<ul className="cv-skills">
									{g.items.map((skill) => (
										<li key={skill}>{skill}</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>
			) : null}

			{cv.experience && cv.experience.length ? (
				<section className="cv-section">
					<h3>{t.cvSectionExperience}</h3>
					<ul className="cv-timeline">
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
								<li key={`${job.company}-${job.title}-${i}`}>
									<strong>
										{[job.title, job.company].filter(Boolean).join(" · ")}
									</strong>
									{range || job.location ? (
										<span className="cv-meta">
											{[range, job.location].filter(Boolean).join(" · ")}
										</span>
									) : null}
									{job.highlights && job.highlights.length ? (
										<ul className="cv-highlights">
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
				<section className="cv-section">
					<h3>{t.cvSectionEducation}</h3>
					<ul className="cv-timeline">
						{cv.education.map((ed, i) => {
							const start = ed.start_date
								? formatCvDate(ed.start_date, lang)
								: "";
							const end = ed.end_date ? formatCvDate(ed.end_date, lang) : "";
							const range = [start, end].filter(Boolean).join(" – ");
							return (
								<li key={`${ed.institution}-${ed.degree}-${i}`}>
									<strong>
										{[ed.degree, ed.field, ed.institution]
											.filter(Boolean)
											.join(" · ")}
									</strong>
									{range ? <span className="cv-meta">{range}</span> : null}
									{ed.details ? (
										<span className="cv-meta">{ed.details}</span>
									) : null}
								</li>
							);
						})}
					</ul>
				</section>
			) : null}

			{cv.languages && cv.languages.length ? (
				<section className="cv-section">
					<h3>{t.cvSectionLanguages}</h3>
					<ul className="cv-contact-list">
						{cv.languages.map((langItem, i) => (
							<li key={`${langItem.name}-${i}`}>
								{[langItem.name, langItem.level].filter(Boolean).join(" — ")}
							</li>
						))}
					</ul>
				</section>
			) : null}

			{cv.certifications && cv.certifications.length ? (
				<section className="cv-section">
					<h3>{t.cvSectionCertifications}</h3>
					<ul className="cv-timeline">
						{cv.certifications.map((c, i) => (
							<li key={`${c.name}-${i}`}>
								<strong>
									{[c.name, c.issuer].filter(Boolean).join(" · ")}
								</strong>
								{c.date ? (
									<span className="cv-meta">{formatCvDate(c.date, lang)}</span>
								) : null}
							</li>
						))}
					</ul>
				</section>
			) : null}

			<button
				type="button"
				className="btn btn-ghost"
				onClick={() => setShowJson((v) => !v)}
			>
				{showJson ? t.resultHideJson : t.resultJson}
			</button>
			{showJson ? (
				<pre className="playground-result-json">
					{JSON.stringify(result, null, 2)}
				</pre>
			) : null}
		</div>
	);
}
