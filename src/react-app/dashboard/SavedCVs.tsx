import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listExtractions, type ExtractionSummary } from "../api";
import { copy, type Lang } from "../content";
import {
	CV_DOC_TYPE,
	cvHistoryLabel,
	formatSavedAt,
} from "./cvShared";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

export function SavedCVs({ lang }: Props) {
	const t = copy[lang].playground;
	const { setError } = useDashboard();
	const [items, setItems] = useState<ExtractionSummary[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoading(true);
			setError("");
			try {
				const rows = await listExtractions(CV_DOC_TYPE);
				if (!cancelled) setItems(rows);
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error ? err.message : t.cvHistoryLoadError,
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [setError, t.cvHistoryLoadError]);

	return (
		<>
			<p className="eyebrow">{t.pathCvSaved}</p>
			<h1>{t.cvHistoryTitle}</h1>
			<p className="section-intro">{t.cvHistoryHint}</p>

			<p className="cv-page-actions">
				<Link className="btn btn-ghost" to="/playground/cv">
					{t.cvBackToExtract}
				</Link>
			</p>

			{loading ? (
				<p className="playground-muted">{t.loading}</p>
			) : items.length === 0 ? (
				<p className="playground-muted">{t.cvHistoryEmpty}</p>
			) : (
				<ul className="cv-history-list">
					{items.map((item) => (
						<li key={item.id}>
							<Link
								className="cv-history-item"
								to={`/playground/cv/saved/${item.id}`}
							>
								<span className="cv-history-name">{cvHistoryLabel(item)}</span>
								<span className="cv-history-meta">
									{t.cvSavedAt} {formatSavedAt(item.created_at, lang)}
									{item.filename ? ` · ${item.filename}` : ""}
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
