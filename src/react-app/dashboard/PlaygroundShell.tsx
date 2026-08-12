import { Suspense, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { Atmosphere, BrandMark, ContentWidth, Page, Topbar } from "@/components/layout";
import { LangSwitch } from "@/components/LangSwitch";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { copy, siteMeta, type Lang } from "../content";
import { AuthGate } from "./AuthGate";
import { DashboardProvider } from "./DashboardProvider";
import { ProfileMenu } from "./ProfileMenu";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang; onLang: (l: Lang) => void };

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
	cn(
		"rounded-md px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		isActive
			? "bg-surface text-fg"
			: "text-muted hover:bg-surface/60 hover:text-fg",
	);

function RouteFallback() {
	return (
		<div className="grid gap-4 py-6" aria-busy="true" aria-label="Loading">
			<Skeleton className="h-8 w-48" />
			<Skeleton className="h-24 w-full" />
			<Skeleton className="h-24 w-full" />
		</div>
	);
}

function ShellInner({ lang, onLang }: Props) {
	const t = copy[lang].playground;
	const { user, loading, error } = useDashboard();

	useEffect(() => {
		document.title = t.pageTitle;
	}, [t.pageTitle]);

	return (
		<Page>
			<Atmosphere />
			<Topbar className="playground-topbar">
				<ContentWidth className="flex flex-col gap-3 py-3">
					<div className="flex h-10 items-center justify-between gap-3">
						<BrandMark to="/">{siteMeta.brand}</BrandMark>
						<div className="flex items-center gap-2 sm:gap-3">
							<LangSwitch lang={lang} onLang={onLang} />
							{user ? <ProfileMenu lang={lang} /> : null}
						</div>
					</div>
					<nav
						className="flex flex-wrap items-center gap-1 overflow-x-auto pb-1"
						aria-label={t.navAria}
					>
						<NavLink to="/playground" end viewTransition className={navLinkClass}>
							<span className="hidden sm:inline">{t.pathOverview}</span>
							<span className="sm:hidden">{t.pathOverviewShort}</span>
						</NavLink>
						{user ? (
							<>
								<NavLink
									to="/playground/bank"
									viewTransition
									className={navLinkClass}
								>
									<span className="hidden sm:inline">{t.pathBank}</span>
									<span className="sm:hidden">{t.pathBankShort}</span>
								</NavLink>
								<NavLink
									to="/playground/extract"
									viewTransition
									className={navLinkClass}
								>
									<span className="hidden sm:inline">{t.pathExtract}</span>
									<span className="sm:hidden">{t.pathExtractShort}</span>
								</NavLink>
								<NavLink
									to="/playground/cv"
									end
									viewTransition
									className={navLinkClass}
								>
									<span className="hidden sm:inline">{t.pathCv}</span>
									<span className="sm:hidden">{t.pathCvShort}</span>
								</NavLink>
								<NavLink
									to="/playground/cv/saved"
									viewTransition
									className={navLinkClass}
								>
									<span className="hidden sm:inline">{t.pathCvSaved}</span>
									<span className="sm:hidden">{t.pathCvSavedShort}</span>
								</NavLink>
							</>
						) : null}
						<Link
							to="/"
							viewTransition
							className="rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-fg"
						>
							{t.backHome}
						</Link>
					</nav>
				</ContentWidth>
			</Topbar>

			<main className="relative mx-auto w-full max-w-[var(--max-content)] px-4 py-8 sm:px-6 sm:py-10">
				{loading ? (
					<p className="text-muted">{t.loading}</p>
				) : !user ? (
					<AuthGate lang={lang} />
				) : (
					<>
						<Suspense fallback={<RouteFallback />}>
							<Outlet />
						</Suspense>
						{error ? (
							<p className="mt-4 text-sm text-danger" role="alert">
								{error}
							</p>
						) : null}
					</>
				)}
			</main>
		</Page>
	);
}

export function PlaygroundShell({ lang, onLang }: Props) {
	return (
		<DashboardProvider>
			<ShellInner lang={lang} onLang={onLang} />
		</DashboardProvider>
	);
}
