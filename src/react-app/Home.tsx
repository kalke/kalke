import {
	lazy,
	Suspense,
	useEffect,
	useId,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { Link } from "react-router";
import { TerminalHero } from "./components/TerminalHero";
import { Atmosphere, BrandMark, ContentWidth, Page } from "./components/layout";
import { LangSwitch } from "./components/LangSwitch";
import { Button, buttonVariants } from "./components/ui/button";
import { cn } from "./lib/utils";
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
			className={cn(
				"section reveal mx-auto max-w-[var(--max-content)] px-4 py-16 sm:px-6 sm:py-20",
				className,
			)}
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
		<Page>
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
			>
				Skip to content
			</a>
			<Atmosphere />

			<header
				ref={topbarRef}
				className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md"
			>
				<ContentWidth className="flex h-14 items-center justify-between gap-4">
					<BrandMark href="#top" className="shrink-0">
						{siteMeta.brand}
					</BrandMark>
					<div className="flex items-center gap-2 sm:gap-3">
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="sm:hidden"
							aria-expanded={navOpen}
							aria-controls={navId}
							onClick={() => setNavOpen((v) => !v)}
						>
							{t.navMenu}
						</Button>
						<nav
							id={navId}
							aria-label={t.navAria}
							className={cn(
								"absolute left-0 right-0 top-14 z-40 flex flex-col gap-1 border-b border-border bg-bg p-4 sm:static sm:flex sm:flex-row sm:items-center sm:gap-4 sm:border-0 sm:bg-transparent sm:p-0",
								navOpen ? "flex" : "hidden sm:flex",
							)}
						>
							{t.nav.map((item) =>
								item.href.startsWith("/") ? (
									<Link
										key={item.href}
										to={item.href}
										viewTransition
										className="rounded-md px-2 py-2 text-sm text-muted transition-colors hover:text-fg sm:py-1"
										onClick={() => setNavOpen(false)}
									>
										{item.label}
									</Link>
								) : (
									<a
										key={item.href}
										href={item.href}
										className="rounded-md px-2 py-2 text-sm text-muted transition-colors hover:text-fg sm:py-1"
										onClick={() => setNavOpen(false)}
									>
										{item.label}
									</a>
								),
							)}
						</nav>
						<LangSwitch
							lang={lang}
							onLang={onLang}
							labels={t.langSwitch}
						/>
					</div>
				</ContentWidth>
			</header>

			<main id="main">
				<section
					id="top"
					className="relative mx-auto grid min-h-[min(92svh,56rem)] max-w-[var(--max-content)] items-end gap-8 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-2 lg:items-center"
				>
					<div className="hero-visual relative order-first min-h-[18rem] lg:order-last lg:min-h-[28rem]">
						<Suspense
							fallback={
								<div className="cat-scene cat-scene-fallback absolute inset-0" />
							}
						>
							<CatScene />
						</Suspense>
						<div className="hero-glow pointer-events-none absolute inset-0" />
						<div className="hero-scrim pointer-events-none absolute inset-0" />
					</div>
					<div className="relative z-10 flex flex-col gap-4">
						<p className="font-display text-sm tracking-[0.2em] text-accent uppercase">
							{siteMeta.brand}
						</p>
						<h1 className="font-display text-4xl leading-tight font-semibold tracking-tight text-fg sm:text-5xl lg:text-6xl">
							{t.hero.headline}
						</h1>
						<p className="max-w-xl text-base text-muted sm:text-lg">
							{t.hero.support}
						</p>
						<TerminalHero key={lang} lang={lang} />
						<div className="mt-2 flex flex-wrap gap-3">
							{t.hero.primaryCta.href.startsWith("/") ? (
								<Link
									className={buttonVariants()}
									to={t.hero.primaryCta.href}
									viewTransition
								>
									{t.hero.primaryCta.label}
								</Link>
							) : (
								<a
									className={buttonVariants()}
									href={t.hero.primaryCta.href}
								>
									{t.hero.primaryCta.label}
								</a>
							)}
							{t.hero.secondaryCta.href.startsWith("/") ? (
								<Link
									className={buttonVariants({ variant: "ghost" })}
									to={t.hero.secondaryCta.href}
									viewTransition
								>
									{t.hero.secondaryCta.label}
								</Link>
							) : (
								<a
									className={buttonVariants({ variant: "ghost" })}
									href={t.hero.secondaryCta.href}
								>
									{t.hero.secondaryCta.label}
								</a>
							)}
						</div>
					</div>
				</section>

				<RevealSection id="about" className="about">
					<p className="eyebrow mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
						{t.about.eyebrow}
					</p>
					<h2 className="font-display mb-6 text-3xl font-semibold tracking-tight">
						{t.about.title}
					</h2>
					<div className="prose max-w-2xl space-y-4 text-muted">
						{t.about.paragraphs.map((p) => (
							<p key={p.slice(0, 32)}>{p}</p>
						))}
					</div>
				</RevealSection>

				<RevealSection id="work" className="builds">
					<p className="eyebrow mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
						{t.builds.eyebrow}
					</p>
					<h2 className="font-display mb-3 text-3xl font-semibold tracking-tight">
						{t.builds.title}
					</h2>
					<p className="section-intro mb-8 max-w-2xl text-muted">
						{t.builds.intro}
					</p>
					<ul className="builds-list grid gap-4">
						{t.builds.items.map((item) => (
							<li
								key={item.name}
								className={cn(
									"rounded-lg border border-border bg-surface/80 p-5",
									item.featured && "border-accent/40 ring-1 ring-accent/20",
								)}
							>
								<div className="build-head mb-3 flex flex-wrap items-start justify-between gap-3">
									<h3 className="font-display text-xl font-semibold">
										{item.href.startsWith("/") ? (
											<Link
												className="hover:text-accent"
												to={item.href}
												viewTransition
											>
												{item.name}
											</Link>
										) : (
											<a
												href={item.href}
												target="_blank"
												rel="noreferrer"
												className="hover:text-accent"
											>
												{item.name}
											</a>
										)}
									</h3>
									<div className="tags flex flex-wrap gap-2">
										{item.tags.map((tag) => (
											<span
												key={tag}
												className="rounded-md border border-border px-2 py-0.5 text-xs text-muted"
											>
												{tag}
											</span>
										))}
									</div>
								</div>
								<p className="text-muted">{item.blurb}</p>
								{item.cta && item.href.startsWith("/") ? (
									<p className="build-cta mt-4">
										<Link
											className={buttonVariants()}
											to={item.href}
											viewTransition
										>
											{item.cta}
										</Link>
									</p>
								) : null}
							</li>
						))}
					</ul>
				</RevealSection>

				<RevealSection id="stack" className="stack">
					<p className="eyebrow mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
						{t.stack.eyebrow}
					</p>
					<h2 className="font-display mb-3 text-3xl font-semibold tracking-tight">
						{t.stack.title}
					</h2>
					<p className="section-intro mb-8 max-w-2xl text-muted">
						{t.stack.intro}
					</p>
					<ul className="stack-list grid gap-4 sm:grid-cols-2">
						{t.stack.groups.map((group) => (
							<li
								key={group.area}
								className="rounded-lg border border-border bg-surface/60 p-5"
							>
								<h3 className="font-display mb-2 text-lg font-semibold">
									{group.area}
								</h3>
								<p className="text-sm text-muted">
									{group.items.join(" · ")}
								</p>
							</li>
						))}
					</ul>
				</RevealSection>

				<RevealSection id="likes" className="likes">
					<p className="eyebrow mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
						{t.likes.eyebrow}
					</p>
					<h2 className="font-display mb-8 text-3xl font-semibold tracking-tight">
						{t.likes.title}
					</h2>
					<ul className="likes-list grid gap-4 sm:grid-cols-2">
						{t.likes.items.map((item) => (
							<li
								key={item.title}
								className="rounded-lg border border-border bg-surface/60 p-5"
							>
								<h3 className="font-display mb-2 text-lg font-semibold">
									{item.title}
								</h3>
								<p className="text-sm text-muted">{item.text}</p>
							</li>
						))}
					</ul>
				</RevealSection>

				<RevealSection id="contact" className="contact">
					<p className="eyebrow mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
						{t.contact.eyebrow}
					</p>
					<h2 className="font-display mb-3 text-3xl font-semibold tracking-tight">
						{t.contact.title}
					</h2>
					<p className="section-intro mb-8 max-w-2xl text-muted">
						{t.contact.text}
					</p>
					<ul className="contact-links grid gap-3 sm:grid-cols-2">
						{t.contact.links.map((link) => {
							const isMailto = link.href.startsWith("mailto:");
							const isDownload = Boolean(link.download);
							return (
								<li key={link.label}>
									<a
										className="contact-card flex flex-col gap-1 rounded-lg border border-border bg-surface/70 p-4 transition-colors hover:border-accent/40 hover:bg-surface"
										href={link.href}
										{...(isDownload
											? { download: link.download }
											: isMailto
												? undefined
												: { target: "_blank", rel: "noreferrer" })}
									>
										<span className="font-display text-sm font-semibold">
											{link.label}
										</span>
										<span className="text-sm text-muted">{link.note}</span>
									</a>
								</li>
							);
						})}
					</ul>
				</RevealSection>
			</main>

			<footer className="border-t border-border py-10">
				<ContentWidth>
					<p className="flex flex-wrap items-center gap-2 text-sm text-muted">
						<span className="font-display font-semibold text-fg">
							{siteMeta.brand}
						</span>
						<span aria-hidden>·</span>
						<span>{t.footer}</span>
					</p>
				</ContentWidth>
			</footer>
		</Page>
	);
}
