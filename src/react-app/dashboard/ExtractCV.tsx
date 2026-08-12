import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	extractDocument,
	listExtractions,
	type ExtractProgress,
} from "../api";
import { copy, type Lang } from "../content";
import { CV_DOC_TYPE } from "./cvShared";
import { FileDropzone } from "./FileDropzone";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

function isUnauthorized(err: unknown): boolean {
	if (!(err instanceof Error)) return false;
	const msg = err.message.toLowerCase();
	return msg === "unauthorized" || msg.includes("unauthorized");
}

function friendlyExtractError(err: unknown, fallback: string): string {
	if (!(err instanceof Error)) return fallback;
	return err.message || fallback;
}

export function ExtractCV({ lang }: Props) {
	const t = copy[lang].playground;
	const navigate = useNavigate();
	const { busy, setBusy, setError } = useDashboard();
	const [file, setFile] = useState<File | null>(null);
	const [consent, setConsent] = useState(false);
	const [progress, setProgress] = useState<ExtractProgress | null>(null);

	function pickFile(next: File | null) {
		setFile(next);
		setError("");
		setProgress(null);
	}

	async function onExtract(e: FormEvent) {
		e.preventDefault();
		if (!consent) {
			setError(t.consentRequired);
			return;
		}
		if (!file) {
			setError(t.extractEmpty);
			return;
		}
		setBusy(true);
		setError("");
		setProgress({ percent: 2, stage: "upload" });
		try {
			await extractDocument(file, CV_DOC_TYPE, consent, setProgress);
			const items = await listExtractions(CV_DOC_TYPE);
			const newest = items[0];
			if (newest?.id) {
				navigate(`/playground/cv/saved/${newest.id}`);
				return;
			}
			navigate("/playground/cv/saved");
		} catch (err) {
			if (isUnauthorized(err)) {
				setError(t.needToken);
			} else {
				setError(friendlyExtractError(err, t.extractError));
			}
			setProgress(null);
		} finally {
			setBusy(false);
		}
	}

	const progressLabel =
		progress?.stage === "upload" ? t.uploadProgress : t.extractProgress;

	return (
		<>
			<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
				{t.pathCv}
			</p>
			<h1 className="font-display mb-3 text-3xl font-semibold tracking-tight">
				{t.cvTitle}
			</h1>
			<p className="mb-6 max-w-2xl text-muted">{t.cvHint}</p>

			<p className="mb-6 flex flex-wrap gap-2">
				<Link
					className={buttonVariants({ variant: "ghost" })}
					to="/playground/cv/saved"
					viewTransition
				>
					{t.cvViewSaved}
				</Link>
			</p>

			<form className="grid w-full max-w-md gap-4" onSubmit={onExtract}>
				<div className="grid gap-2">
					<span className="font-display text-xs text-muted">{t.chooseFile}</span>
					<FileDropzone
						file={file}
						onFile={pickFile}
						disabled={busy}
						dropHint={t.dropHint}
						dropBrowse={t.dropBrowse}
						dropReplace={t.dropReplace}
						dropRemove={t.dropRemove}
					/>
				</div>

				{progress ? (
					<div
						className="grid gap-2 rounded-md border border-border bg-bg-deep/50 p-3"
						role="status"
						aria-live="polite"
					>
						<div className="flex justify-between gap-3 font-display text-xs text-muted">
							<span>{progressLabel}</span>
							<span>{Math.round(progress.percent)}%</span>
						</div>
						<div
							className="h-1.5 overflow-hidden rounded-full bg-fg/5"
							aria-valuemin={0}
							aria-valuemax={100}
							aria-valuenow={Math.round(progress.percent)}
							role="progressbar"
						>
							<span
								className="block h-full rounded-full bg-gradient-to-r from-[#c4872f] via-accent to-accent-cool transition-[width] duration-250"
								style={{
									width: `${Math.max(4, progress.percent)}%`,
									...(progress.stage === "extract"
										? {
												backgroundSize: "200% 100%",
												animation:
													"extract-shimmer 1.1s linear infinite",
											}
										: {}),
								}}
							/>
						</div>
					</div>
				) : null}

				<label
					className={cn(
						"grid cursor-pointer grid-cols-[auto_1fr] items-start gap-3 rounded-md border border-accent/25 bg-gradient-to-br from-accent/[0.07] to-transparent bg-bg-deep/55 p-4 transition-colors hover:border-accent/40",
						consent &&
							"border-accent/55 from-accent/15 bg-surface/70 shadow-[0_0_0_1px_rgba(231,163,57,0.08)]",
					)}
				>
					<input
						type="checkbox"
						className="mt-1 size-4 shrink-0 accent-accent"
						checked={consent}
						onChange={(e) => setConsent(e.target.checked)}
						required
						disabled={busy}
					/>
					<span className="grid min-w-0 gap-1.5">
						<span className="font-display text-sm font-semibold tracking-wide text-accent">
							{t.cvConsentTitle}
						</span>
						<span className="text-sm leading-relaxed text-muted">
							{t.cvConsentLabel}
						</span>
					</span>
				</label>
				<Button type="submit" disabled={busy || !consent || !file}>
					{busy ? t.extracting : t.extract}
				</Button>
			</form>
		</>
	);
}
