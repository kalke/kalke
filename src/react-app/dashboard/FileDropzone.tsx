import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";

type Props = {
	file: File | null;
	onFile: (file: File | null) => void;
	disabled?: boolean;
	accept?: string;
	dropHint: string;
	dropBrowse: string;
	dropReplace: string;
	dropRemove: string;
};

function fileKind(file: File): "pdf" | "img" {
	return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
		? "pdf"
		: "img";
}

function formatBytes(n: number): string {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileDropzone({
	file,
	onFile,
	disabled,
	accept = "image/*,.pdf,application/pdf",
	dropHint,
	dropBrowse,
	dropReplace,
	dropRemove,
}: Props) {
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = useState(false);

	function pick(next: File | null) {
		onFile(next);
		setDragging(false);
	}

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		pick(e.target.files?.[0] ?? null);
		e.target.value = "";
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		if (disabled) return;
		const dropped = e.dataTransfer.files?.[0] ?? null;
		pick(dropped);
	}

	return (
		<div className="file-field">
			<input
				ref={inputRef}
				id={inputId}
				className="file-input-hidden"
				type="file"
				accept={accept}
				onChange={onChange}
				disabled={disabled}
			/>
			{!file ? (
				<label
					htmlFor={inputId}
					className={`file-dropzone${dragging ? " is-dragging" : ""}`}
					onDragEnter={(e) => {
						e.preventDefault();
						if (!disabled) setDragging(true);
					}}
					onDragOver={(e) => {
						e.preventDefault();
						if (!disabled) setDragging(true);
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
					<span className="file-dropzone-title">{dropHint}</span>
					<span className="file-dropzone-browse">{dropBrowse}</span>
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
							disabled={disabled}
							onClick={() => inputRef.current?.click()}
						>
							{dropReplace}
						</button>
						<button
							type="button"
							className="btn btn-ghost"
							disabled={disabled}
							onClick={() => pick(null)}
						>
							{dropRemove}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
