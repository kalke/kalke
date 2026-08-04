import { useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { copy, siteMeta, type Lang } from "../content";
import { AuthGate } from "./AuthGate";
import { DashboardProvider } from "./DashboardProvider";
import { ProfileMenu } from "./ProfileMenu";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang; onLang: (l: Lang) => void };

function ShellInner({ lang, onLang }: Props) {
	const t = copy[lang].playground;
	const { user, loading, error } = useDashboard();

	useEffect(() => {
		document.title = t.pageTitle;
	}, [t.pageTitle]);

	return (
		<div className="page playground-page">
			<div className="atmosphere" aria-hidden="true" />
			<header className="topbar playground-topbar">
				<div className="playground-topbar-row">
					<Link className="brand-mark" to="/">
						{siteMeta.brand}
					</Link>
					<div className="topbar-end">
						<div className="lang-switch" role="group" aria-label="Language">
							<button
								type="button"
								className={lang === "pt" ? "is-active" : undefined}
								onClick={() => onLang("pt")}
								aria-pressed={lang === "pt"}
							>
								PT
							</button>
							<button
								type="button"
								className={lang === "en" ? "is-active" : undefined}
								onClick={() => onLang("en")}
								aria-pressed={lang === "en"}
							>
								EN
							</button>
						</div>
						{user ? <ProfileMenu lang={lang} /> : null}
					</div>
				</div>
				<nav className="nav dash-nav" aria-label={t.navAria}>
					<NavLink to="/playground" end>
						<span className="nav-label-full">{t.pathOverview}</span>
						<span className="nav-label-short">{t.pathOverviewShort}</span>
					</NavLink>
					{user ? (
						<>
							<NavLink to="/playground/api">
								<span className="nav-label-full">{t.pathApi}</span>
								<span className="nav-label-short">{t.pathApiShort}</span>
							</NavLink>
							<NavLink to="/playground/extract">
								<span className="nav-label-full">{t.pathExtract}</span>
								<span className="nav-label-short">{t.pathExtractShort}</span>
							</NavLink>
							<NavLink to="/playground/cv">
								<span className="nav-label-full">{t.pathCv}</span>
								<span className="nav-label-short">{t.pathCvShort}</span>
							</NavLink>
						</>
					) : null}
					<Link to="/">{t.backHome}</Link>
				</nav>
			</header>

			<main className="playground-main">
				{loading ? (
					<p className="playground-muted">{t.loading}</p>
				) : !user ? (
					<AuthGate lang={lang} />
				) : (
					<>
						<Outlet />
						{error ? <p className="playground-error">{error}</p> : null}
					</>
				)}
			</main>
		</div>
	);
}

export function PlaygroundShell({ lang, onLang }: Props) {
	return (
		<DashboardProvider>
			<ShellInner lang={lang} onLang={onLang} />
		</DashboardProvider>
	);
}
