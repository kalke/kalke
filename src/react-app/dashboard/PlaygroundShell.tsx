import { useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { copy, siteMeta, type Lang } from "../content";
import { AuthGate } from "./AuthGate";
import { DashboardProvider } from "./DashboardProvider";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang; onLang: (l: Lang) => void };

function ShellInner({ lang, onLang }: Props) {
	const t = copy[lang].playground;
	const { user, loading, logout, busy, error } = useDashboard();

	useEffect(() => {
		document.title = t.pageTitle;
	}, [t.pageTitle]);

	return (
		<div className="page playground-page">
			<div className="atmosphere" aria-hidden="true" />
			<header className="topbar">
				<Link className="brand-mark" to="/">
					{siteMeta.brand}
				</Link>
				<div className="topbar-end">
					<nav className="nav dash-nav" aria-label={t.navAria}>
						<NavLink to="/playground" end>
							{t.pathOverview}
						</NavLink>
						{user ? (
							<>
								<NavLink to="/playground/api">{t.pathApi}</NavLink>
								<NavLink to="/playground/extract">{t.pathExtract}</NavLink>
							</>
						) : null}
						<Link to="/">{t.backHome}</Link>
					</nav>
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
				</div>
			</header>

			<main className="playground-main">
				{loading ? (
					<p className="playground-muted">{t.loading}</p>
				) : !user ? (
					<AuthGate lang={lang} />
				) : (
					<>
						<div className="playground-auth">
							<p>
								<span className="path-label">{t.signedInAs}</span>{" "}
								<strong>{user.email}</strong>
							</p>
							<button
								className="btn btn-ghost"
								type="button"
								onClick={() => void logout()}
								disabled={busy}
							>
								{t.logout}
							</button>
						</div>
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
