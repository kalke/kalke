import { useEffect, useState, type ReactNode } from "react";
import { copy, detectLang, siteMeta, type Lang } from "./content";
import { useReveal } from "./hooks/useReveal";
import { Sandbox } from "./Sandbox";
import "./App.css";

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

export default function App() {
	const [lang, setLang] = useState<Lang>(() => detectLang());
	const t = copy[lang];
	const meta = siteMeta[lang];

	useEffect(() => {
		document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
		document.title = meta.title;
		const description = document.querySelector('meta[name="description"]');
		description?.setAttribute("content", meta.description);
		window.localStorage.setItem("kalke-lang", lang);
	}, [lang, meta.description, meta.title]);

	function switchLang(next: Lang) {
		setLang(next);
	}

	return (
		<div className="page">
			<div className="atmosphere" aria-hidden="true" />

			<header className="topbar">
				<a className="brand-mark" href="#top">
					{siteMeta.brand}
				</a>
				<div className="topbar-end">
					<nav className="nav" aria-label={t.navAria}>
						{t.nav.map((item) => (
							<a key={item.href} href={item.href}>
								{item.label}
							</a>
						))}
					</nav>
					<div className="lang-switch" role="group" aria-label="Language">
						<button
							type="button"
							className={lang === "pt" ? "is-active" : undefined}
							onClick={() => switchLang("pt")}
							aria-pressed={lang === "pt"}
						>
							{t.langSwitch.pt}
						</button>
						<button
							type="button"
							className={lang === "en" ? "is-active" : undefined}
							onClick={() => switchLang("en")}
							aria-pressed={lang === "en"}
						>
							{t.langSwitch.en}
						</button>
					</div>
				</div>
			</header>

			<main>
				<section id="top" className="hero">
					<div className="hero-copy">
						<h1 className="hero-title">{t.hero.headline}</h1>
						<p className="hero-support">{t.hero.support}</p>
						<div className="hero-actions">
							<a className="btn btn-primary" href={t.hero.primaryCta.href}>
								{t.hero.primaryCta.label}
							</a>
							<a className="btn btn-ghost" href={t.hero.secondaryCta.href}>
								{t.hero.secondaryCta.label}
							</a>
						</div>
					</div>
					<div className="hero-visual" aria-hidden="true">
						<div className="hero-glow" />
						<div className="hero-grain" />
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

				<RevealSection id="builds" className="builds">
					<p className="eyebrow">{t.builds.eyebrow}</p>
					<h2>{t.builds.title}</h2>
					<p className="section-intro">{t.builds.intro}</p>
					<ul className="builds-list">
						{t.builds.items.map((item) => (
							<li key={item.name}>
								<div className="build-head">
									<h3>
										<a href={item.href} target="_blank" rel="noreferrer">
											{item.name}
										</a>
									</h3>
									<div className="tags">
										{item.tags.map((tag) => (
											<span key={tag}>{tag}</span>
										))}
									</div>
								</div>
								<p>{item.blurb}</p>
							</li>
						))}
					</ul>
				</RevealSection>

				<RevealSection id="sandbox" className="sandbox">
					<Sandbox lang={lang} />
				</RevealSection>

				<RevealSection id="contact" className="contact">
					<p className="eyebrow">{t.contact.eyebrow}</p>
					<h2>{t.contact.title}</h2>
					<p className="section-intro">{t.contact.text}</p>
					<ul className="contact-links">
						{t.contact.links.map((link) => (
							<li key={link.label}>
								<a
									href={link.href}
									{...(link.href.startsWith("mailto:")
										? {}
										: { target: "_blank", rel: "noreferrer" })}
								>
									<span className="contact-label">{link.label}</span>
									<span className="contact-note">{link.note}</span>
								</a>
							</li>
						))}
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
