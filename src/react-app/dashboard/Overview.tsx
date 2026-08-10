import { Link } from "react-router";
import { copy, type Lang } from "../content";

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
				<li>
					<Link className="dash-card" to="/playground/cv">
						<span className="path-label">{t.pathCv}</span>
						<strong>{t.overviewCvCard}</strong>
						<span>{t.overviewCvHint}</span>
					</Link>
				</li>
				<li>
					<Link className="dash-card" to="/playground/cv/saved">
						<span className="path-label">{t.pathCvSaved}</span>
						<strong>{t.overviewCvSavedCard}</strong>
						<span>{t.overviewCvSavedHint}</span>
					</Link>
				</li>
				<li>
					<Link className="dash-card" to="/playground/bank">
						<span className="path-label">{t.pathBank}</span>
						<strong>{t.overviewBankCard}</strong>
						<span>{t.overviewBankHint}</span>
					</Link>
				</li>
			</ul>
		</>
	);
}
