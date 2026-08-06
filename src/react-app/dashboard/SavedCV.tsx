import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getExtraction, type ExtractionSummary } from "../api";
import { copy, type Lang } from "../content";
import { CvResultView } from "./CvResultView";
import { extractCvPayload, formatSavedAt } from "./cvShared";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

export function SavedCV({ lang }: Props) {
	const { id = "" } = useParams();
	const t = copy[lang].playground;
	const { setError } = useDashboard();
	const [item, setItem] = useState<ExtractionSummary | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			if (!id) {
				setError(t.cvNotFound);
				setLoading(false);
				return;
			}
			setLoading(true);
			setError("");
			try {
				const row = await getExtraction(id);
				if (!cancelled) setItem(row);
			} catch (err) {
				if (!cancelled) {
					setItem(null);
					setError(
						err instanceof Error ? err.message : t.cvNotFound,
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [id, setError, t.cvNotFound]);

	const name = item
		? extractCvPayload(item.result).full_name?.trim() ||
			item.filename?.trim() ||
			t.cvHistoryTitle
		: t.cvHistoryTitle;

	return (
		<>
			<p className="eyebrow">{t.pathCvSaved}</p>
			<h1>{name}</h1>
			{item ? (
				<p className="section-intro">
					{t.cvSavedAt} {formatSavedAt(item.created_at, lang)}
					{item.filename ? ` · ${item.filename}` : ""}
				</p>
			) : (
				<p className="section-intro">{t.cvHistoryHint}</p>
			)}

			<p className="cv-page-actions">
				<Link className="btn btn-ghost" to="/playground/cv/saved">
					{t.cvBackToSaved}
				</Link>
				<Link className="btn btn-ghost" to="/playground/cv">
					{t.cvBackToExtract}
				</Link>
			</p>

			{loading ? (
				<p className="playground-muted">{t.loading}</p>
			) : item ? (
				<CvResultView lang={lang} result={item.result} title={t.extracted} />
			) : (
				<p className="playground-muted">{t.cvNotFound}</p>
			)}
		</>
	);
}
