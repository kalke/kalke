import type { ReactNode } from "react";
import { about, builds, contact, hero, likes, nav, site } from "./content";
import { useReveal } from "./hooks/useReveal";
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
	return (
		<div className="page">
			<div className="atmosphere" aria-hidden="true" />

			<header className="topbar">
				<a className="brand-mark" href="#topo">
					{site.brand}
				</a>
				<nav className="nav" aria-label="Principal">
					{nav.map((item) => (
						<a key={item.href} href={item.href}>
							{item.label}
						</a>
					))}
				</nav>
			</header>

			<main>
				<section id="topo" className="hero">
					<div className="hero-copy">
						<p className="brand-hero">{site.brand}</p>
						<h1 className="hero-title">{hero.headline}</h1>
						<p className="hero-support">{hero.support}</p>
						<div className="hero-actions">
							<a className="btn btn-primary" href={hero.primaryCta.href}>
								{hero.primaryCta.label}
							</a>
							<a className="btn btn-ghost" href={hero.secondaryCta.href}>
								{hero.secondaryCta.label}
							</a>
						</div>
					</div>
					<div className="hero-visual" aria-hidden="true">
						<div className="hero-glow" />
						<div className="hero-grain" />
					</div>
				</section>

				<RevealSection id="sobre" className="about">
					<p className="eyebrow">{about.eyebrow}</p>
					<h2>{about.title}</h2>
					<div className="prose">
						{about.paragraphs.map((p) => (
							<p key={p.slice(0, 24)}>{p}</p>
						))}
					</div>
				</RevealSection>

				<RevealSection id="gostos" className="likes">
					<p className="eyebrow">{likes.eyebrow}</p>
					<h2>{likes.title}</h2>
					<ul className="likes-list">
						{likes.items.map((item) => (
							<li key={item.title}>
								<h3>{item.title}</h3>
								<p>{item.text}</p>
							</li>
						))}
					</ul>
				</RevealSection>

				<RevealSection id="projetos" className="builds">
					<p className="eyebrow">{builds.eyebrow}</p>
					<h2>{builds.title}</h2>
					<p className="section-intro">{builds.intro}</p>
					<ul className="builds-list">
						{builds.items.map((item) => (
							<li key={item.name}>
								<div className="build-head">
									<h3>{item.name}</h3>
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

				<RevealSection id="contato" className="contact">
					<p className="eyebrow">{contact.eyebrow}</p>
					<h2>{contact.title}</h2>
					<p className="section-intro">{contact.text}</p>
					<ul className="contact-links">
						{contact.links.map((link) => (
							<li key={link.label}>
								<a href={link.href}>
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
					<span className="brand-mark">{site.brand}</span>
					<span className="footer-sep">·</span>
					<span>feito com React, Vite e Cloudflare</span>
				</p>
			</footer>
		</div>
	);
}
