import { useEffect, useState } from "react";
import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
			<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
				{t.pathCvSaved}
			</p>
			<h1 className="font-display mb-3 text-3xl font-semibold tracking-tight">
				{t.cvHistoryTitle}
			</h1>
			<p className="mb-6 max-w-2xl text-muted">{t.cvHistoryHint}</p>

			<p className="mb-6 flex flex-wrap gap-2">
				<Link
					className={buttonVariants({ variant: "ghost" })}
					to="/playground/cv"
				>
					{t.cvBackToExtract}
				</Link>
			</p>

			{loading ? (
				<div className="grid gap-3">
					<Skeleton className="h-14 w-full" />
					<Skeleton className="h-14 w-full" />
					<p className="text-sm text-muted">{t.loading}</p>
				</div>
			) : items.length === 0 ? (
				<p className="text-muted">{t.cvHistoryEmpty}</p>
			) : (
				<ul className="flex flex-col gap-1">
					{items.map((item) => (
						<li key={item.id}>
							<Link
								className="flex w-full flex-col items-start gap-0.5 border-b border-border/80 py-2.5 transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
								to={`/playground/cv/saved/${item.id}`}
							>
								<span className="font-display text-[0.95rem] font-semibold">
									{cvHistoryLabel(item)}
								</span>
								<span className="text-sm text-muted">
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
