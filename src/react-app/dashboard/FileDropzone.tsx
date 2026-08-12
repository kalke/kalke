import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
		<div className="grid gap-2">
			<input
				ref={inputRef}
				id={inputId}
				className="sr-only"
				type="file"
				accept={accept}
				onChange={onChange}
				disabled={disabled}
			/>
			{!file ? (
				<label
					htmlFor={inputId}
					className={cn(
						"grid cursor-pointer justify-items-center gap-1 rounded-md border border-dashed border-accent/35 bg-gradient-to-b from-accent/10 to-transparent bg-bg-deep/45 px-4 py-5 text-center text-muted transition-colors",
						dragging &&
							"-translate-y-px border-accent/70 from-accent/20 text-fg",
						!disabled && "hover:border-accent/70 hover:from-accent/20 hover:text-fg",
						disabled && "pointer-events-none opacity-50",
					)}
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
					<span
						className="mb-1 grid size-8 place-items-center rounded-full border border-accent/35 font-display text-base leading-none text-accent"
						aria-hidden="true"
					>
						↑
					</span>
					<span className="text-sm text-fg">{dropHint}</span>
					<span className="font-display text-xs text-accent underline underline-offset-2">
						{dropBrowse}
					</span>
				</label>
			) : (
				<div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 rounded-md border border-accent/30 bg-bg-deep/55 p-3.5">
					<div
						className="grid size-10 place-items-center rounded border border-accent/35 bg-accent-soft font-display text-[0.68rem] font-bold tracking-wide text-accent"
						aria-hidden="true"
					>
						{fileKind(file) === "pdf" ? "PDF" : "IMG"}
					</div>
					<div className="grid min-w-0 gap-0.5">
						<strong
							className="truncate text-sm font-semibold text-fg"
							title={file.name}
						>
							{file.name}
						</strong>
						<span className="font-display text-xs text-muted">
							{formatBytes(file.size)}
						</span>
					</div>
					<div className="col-span-full flex flex-wrap gap-1.5">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={disabled}
							onClick={() => inputRef.current?.click()}
						>
							{dropReplace}
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={disabled}
							onClick={() => pick(null)}
						>
							{dropRemove}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
