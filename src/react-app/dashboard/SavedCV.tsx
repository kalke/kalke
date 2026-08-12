import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
			<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
				{t.pathCvSaved}
			</p>
			<h1 className="font-display mb-3 text-3xl font-semibold tracking-tight">
				{name}
			</h1>
			{item ? (
				<p className="mb-6 max-w-2xl text-muted">
					{t.cvSavedAt} {formatSavedAt(item.created_at, lang)}
					{item.filename ? ` · ${item.filename}` : ""}
				</p>
			) : (
				<p className="mb-6 max-w-2xl text-muted">{t.cvHistoryHint}</p>
			)}

			<p className="mb-6 flex flex-wrap gap-2">
				<Link
					className={buttonVariants({ variant: "ghost" })}
					to="/playground/cv/saved"
				>
					{t.cvBackToSaved}
				</Link>
				<Link
					className={buttonVariants({ variant: "ghost" })}
					to="/playground/cv"
				>
					{t.cvBackToExtract}
				</Link>
			</p>

			{loading ? (
				<div className="grid gap-3">
					<Skeleton className="h-40 w-full" />
					<p className="text-sm text-muted">{t.loading}</p>
				</div>
			) : item ? (
				<CvResultView lang={lang} result={item.result} title={t.extracted} />
			) : (
				<p className="text-muted">{t.cvNotFound}</p>
			)}
		</>
	);
}
