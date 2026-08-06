import {
	useId,
	useRef,
	useState,
	type ChangeEvent,
	type DragEvent,
	type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router";
import {
	extractDocument,
	listExtractions,
	type ExtractProgress,
} from "../api";
import { copy, type Lang } from "../content";
import { CV_DOC_TYPE } from "./cvShared";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

function formatBytes(n: number): string {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function fileKind(file: File): "pdf" | "image" | "other" {
	if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) return "pdf";
	if (file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(file.name)) {
		return "image";
	}
	return "other";
}

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
	const [dragging, setDragging] = useState(false);
	const [progress, setProgress] = useState<ExtractProgress | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const fileInputId = useId();

	function pickFile(next: File | null) {
		setFile(next);
		setError("");
		setProgress(null);
	}

	function onFileChange(e: ChangeEvent<HTMLInputElement>) {
		pickFile(e.target.files?.[0] ?? null);
		e.target.value = "";
	}

	function onDrop(e: DragEvent<HTMLLabelElement>) {
		e.preventDefault();
		setDragging(false);
		if (busy) return;
		const next = e.dataTransfer.files?.[0] ?? null;
		if (next) pickFile(next);
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
			<p className="eyebrow">{t.pathCv}</p>
			<h1>{t.cvTitle}</h1>
			<p className="section-intro">{t.cvHint}</p>

			<p className="cv-page-actions">
				<Link className="btn btn-ghost" to="/playground/cv/saved">
					{t.cvViewSaved}
				</Link>
			</p>

			<form className="playground-form extract-form" onSubmit={onExtract}>
				<div className="file-field">
					<span className="file-field-label">{t.chooseFile}</span>
					<input
						ref={inputRef}
						id={fileInputId}
						className="file-input-hidden"
						type="file"
						accept="image/*,.pdf,application/pdf"
						onChange={onFileChange}
						disabled={busy}
					/>
					{!file ? (
						<label
							htmlFor={fileInputId}
							className={`file-dropzone${dragging ? " is-dragging" : ""}`}
							onDragEnter={(e) => {
								e.preventDefault();
								if (!busy) setDragging(true);
							}}
							onDragOver={(e) => {
								e.preventDefault();
								if (!busy) setDragging(true);
							}}
							onDragLeave={(e) => {
								e.preventDefault();
								if (e.currentTarget.contains(e.relatedTarget as Node)) return;
								setDragging(false);
							}}
							onDrop={onDrop}
						>
							<span className="file-dropzone-icon" aria-hidden="true">
								↑
							</span>
							<span className="file-dropzone-title">{t.dropHint}</span>
							<span className="file-dropzone-browse">{t.dropBrowse}</span>
						</label>
					) : (
						<div className={`file-selected kind-${fileKind(file)}`}>
							<div className="file-selected-badge" aria-hidden="true">
								{fileKind(file) === "pdf" ? "PDF" : "IMG"}
							</div>
							<div className="file-selected-meta">
								<strong title={file.name}>{file.name}</strong>
								<span>{formatBytes(file.size)}</span>
							</div>
							<div className="file-selected-actions">
								<button
									type="button"
									className="btn btn-ghost"
									disabled={busy}
									onClick={() => inputRef.current?.click()}
								>
									{t.dropReplace}
								</button>
								<button
									type="button"
									className="btn btn-ghost"
									disabled={busy}
									onClick={() => pickFile(null)}
								>
									{t.dropRemove}
								</button>
							</div>
						</div>
					)}
				</div>

				{progress ? (
					<div
						className={`extract-progress${progress.stage === "extract" ? " is-extracting" : ""}`}
						role="status"
						aria-live="polite"
					>
						<div className="extract-progress-head">
							<span>{progressLabel}</span>
							<span>{Math.round(progress.percent)}%</span>
						</div>
						<div
							className="extract-progress-track"
							aria-valuemin={0}
							aria-valuemax={100}
							aria-valuenow={Math.round(progress.percent)}
							role="progressbar"
						>
							<span
								className="extract-progress-fill"
								style={{ width: `${Math.max(4, progress.percent)}%` }}
							/>
						</div>
					</div>
				) : null}

				<label className={`playground-consent${consent ? " is-checked" : ""}`}>
					<input
						type="checkbox"
						checked={consent}
						onChange={(e) => setConsent(e.target.checked)}
						required
						disabled={busy}
					/>
					<span className="playground-consent-copy">
						<span className="playground-consent-title">{t.cvConsentTitle}</span>
						<span className="playground-consent-text">{t.cvConsentLabel}</span>
					</span>
				</label>
				<button
					className="btn btn-primary"
					type="submit"
					disabled={busy || !consent || !file}
				>
					{busy ? t.extracting : t.extract}
				</button>
			</form>
		</>
	);
}
