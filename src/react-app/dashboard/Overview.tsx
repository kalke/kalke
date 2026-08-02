import { Link } from "react-router-dom";
import { copy, type Lang } from "../content";
import { PasswordPanel } from "./PasswordPanel";

type Props = { lang: Lang };

export function Overview({ lang }: Props) {
	const t = copy[lang].playground;

	return (
		<>
			<p className="eyebrow">{t.pathOverview}</p>
			<h1>{t.overviewTitle}</h1>
			<p className="section-intro">{t.overviewIntro}</p>

			<ul className="dash-cards">
				<li>
					<Link className="dash-card" to="/playground/api">
						<span className="path-label">{t.pathApi}</span>
						<strong>{t.overviewApiCard}</strong>
						<span>{t.overviewApiHint}</span>
					</Link>
				</li>
				<li>
					<Link className="dash-card" to="/playground/extract">
						<span className="path-label">{t.pathExtract}</span>
						<strong>{t.overviewExtractCard}</strong>
						<span>{t.overviewExtractHint}</span>
					</Link>
				</li>
			</ul>

			<section className="playground-panel" aria-labelledby="password-title">
				<PasswordPanel lang={lang} />
			</section>
		</>
	);
}
