import { lazy, Suspense, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { TerminalHero } from "./components/TerminalHero";
import { copy, siteMeta, type Lang } from "./content";
import { useReveal } from "./hooks/useReveal";

const CatScene = lazy(() => import("./components/CatScene"));

function RevealSection({
	id,
	className,
	children,
}: {
	id?: string;
	className?: string;
	children: ReactNode;
}) {
	const ref = useReveal<HTMLElement>();
	return (
		<section
			id={id}
			ref={ref}
			className={`section reveal ${className ?? ""}`.trim()}
		>
			{children}
		</section>
	);
}

type Props = { lang: Lang; onLang: (l: Lang) => void };

export function Home({ lang, onLang }: Props) {
	const t = copy[lang];
	const [navOpen, setNavOpen] = useState(false);
	const navId = useId();
	const topbarRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!navOpen) return;
		function onDoc(e: MouseEvent) {
			if (!topbarRef.current?.contains(e.target as Node)) setNavOpen(false);
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") setNavOpen(false);
		}
		document.addEventListener("mousedown", onDoc);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDoc);
			document.removeEventListener("keydown", onKey);
		};
	}, [navOpen]);

	return (
		<div className="page">
			<div className="atmosphere" aria-hidden="true" />

			<header className={`topbar ${navOpen ? "nav-open" : ""}`} ref={topbarRef}>
				<a className="brand-mark" href="#top">
					{siteMeta.brand}
				</a>
				<div className="topbar-end">
					<button
						type="button"
						className="nav-toggle"
						aria-expanded={navOpen}
						aria-controls={navId}
						onClick={() => setNavOpen((v) => !v)}
					>
						{t.navMenu}
					</button>
					<nav className="nav" id={navId} aria-label={t.navAria}>
						{t.nav.map((item) =>
							item.href.startsWith("/") ? (
								<Link
									key={item.href}
									to={item.href}
									onClick={() => setNavOpen(false)}
								>
									{item.label}
								</Link>
							) : (
								<a
									key={item.href}
									href={item.href}
									onClick={() => setNavOpen(false)}
								>
									{item.label}
								</a>
							),
						)}
					</nav>
					<div className="lang-switch" role="group" aria-label="Language">
						<button
							type="button"
							className={lang === "pt" ? "is-active" : undefined}
							onClick={() => onLang("pt")}
							aria-pressed={lang === "pt"}
						>
							{t.langSwitch.pt}
						</button>
						<button
							type="button"
							className={lang === "en" ? "is-active" : undefined}
							onClick={() => onLang("en")}
							aria-pressed={lang === "en"}
						>
							{t.langSwitch.en}
						</button>
					</div>
				</div>
			</header>

			<main>
				<section id="top" className="hero">
					<div className="hero-visual" aria-hidden="true">
						<Suspense fallback={<div className="cat-scene cat-scene-fallback" />}>
							<CatScene />
						</Suspense>
						<div className="hero-glow" />
						<div className="hero-scrim" />
					</div>
					<div className="hero-copy">
						<p className="hero-brand">{siteMeta.brand}</p>
						<h1 className="hero-title">{t.hero.headline}</h1>
						<p className="hero-support">{t.hero.support}</p>
						<TerminalHero key={lang} lang={lang} />
						<div className="hero-actions">
							{t.hero.primaryCta.href.startsWith("/") ? (
								<Link className="btn btn-primary" to={t.hero.primaryCta.href}>
									{t.hero.primaryCta.label}
								</Link>
							) : (
								<a className="btn btn-primary" href={t.hero.primaryCta.href}>
									{t.hero.primaryCta.label}
								</a>
							)}
							{t.hero.secondaryCta.href.startsWith("/") ? (
								<Link className="btn btn-ghost" to={t.hero.secondaryCta.href}>
									{t.hero.secondaryCta.label}
								</Link>
							) : (
								<a className="btn btn-ghost" href={t.hero.secondaryCta.href}>
									{t.hero.secondaryCta.label}
								</a>
							)}
						</div>
					</div>
				</section>

				<RevealSection id="about" className="about">
					<p className="eyebrow">{t.about.eyebrow}</p>
					<h2>{t.about.title}</h2>
					<div className="prose">
						{t.about.paragraphs.map((p) => (
							<p key={p.slice(0, 32)}>{p}</p>
						))}
					</div>
				</RevealSection>

				<RevealSection id="work" className="builds">
					<p className="eyebrow">{t.builds.eyebrow}</p>
					<h2>{t.builds.title}</h2>
					<p className="section-intro">{t.builds.intro}</p>
					<ul className="builds-list">
						{t.builds.items.map((item) => (
							<li key={item.name} className={item.featured ? "is-featured" : undefined}>
								<div className="build-head">
									<h3>
										{item.href.startsWith("/") ? (
											<Link to={item.href}>{item.name}</Link>
										) : (
											<a href={item.href} target="_blank" rel="noreferrer">
												{item.name}
											</a>
										)}
									</h3>
									<div className="tags">
										{item.tags.map((tag) => (
											<span key={tag}>{tag}</span>
										))}
									</div>
								</div>
								<p>{item.blurb}</p>
								{item.cta && item.href.startsWith("/") ? (
									<p className="build-cta">
										<Link className="btn btn-primary" to={item.href}>
											{item.cta}
										</Link>
									</p>
								) : null}
							</li>
						))}
					</ul>
				</RevealSection>

				<RevealSection id="stack" className="stack">
					<p className="eyebrow">{t.stack.eyebrow}</p>
					<h2>{t.stack.title}</h2>
					<p className="section-intro">{t.stack.intro}</p>
					<ul className="stack-list">
						{t.stack.groups.map((group) => (
							<li key={group.area}>
								<h3>{group.area}</h3>
								<p>{group.items.join(" · ")}</p>
							</li>
						))}
					</ul>
				</RevealSection>

				<RevealSection id="likes" className="likes">
					<p className="eyebrow">{t.likes.eyebrow}</p>
					<h2>{t.likes.title}</h2>
					<ul className="likes-list">
						{t.likes.items.map((item) => (
							<li key={item.title}>
								<h3>{item.title}</h3>
								<p>{item.text}</p>
							</li>
						))}
					</ul>
				</RevealSection>

				<RevealSection id="contact" className="contact">
					<p className="eyebrow">{t.contact.eyebrow}</p>
					<h2>{t.contact.title}</h2>
					<p className="section-intro">{t.contact.text}</p>
					<ul className="contact-links">
						{t.contact.links.map((link) => {
							const isMailto = link.href.startsWith("mailto:");
							const isDownload = Boolean(link.download);
							return (
								<li key={link.label}>
									<a
										className="contact-card"
										href={link.href}
										{...(isDownload
											? { download: link.download }
											: isMailto
												? undefined
												: { target: "_blank", rel: "noreferrer" })}
									>
										<span className="contact-label">{link.label}</span>
										<span className="contact-note">{link.note}</span>
									</a>
								</li>
							);
						})}
					</ul>
				</RevealSection>
			</main>

			<footer className="footer">
				<p>
					<span className="brand-mark">{siteMeta.brand}</span>
					<span className="footer-sep">·</span>
					<span>{t.footer}</span>
				</p>
			</footer>
		</div>
	);
}
