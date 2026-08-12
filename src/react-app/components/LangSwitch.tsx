import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Lang } from "@/content";

type Props = {
	lang: Lang;
	onLang: (l: Lang) => void;
	labels?: { pt: string; en: string };
	className?: string;
};

export function LangSwitch({
	lang,
	onLang,
	labels = { pt: "PT", en: "EN" },
	className,
}: Props) {
	return (
		<div
			className={cn(
				"inline-flex rounded-md border border-border bg-bg-deep p-0.5",
				className,
			)}
			role="group"
			aria-label="Language"
		>
			<Button
				type="button"
				variant={lang === "pt" ? "secondary" : "ghost"}
				size="sm"
				className={cn(
					"h-7 min-w-9 px-2",
					lang === "pt" && "bg-surface text-fg shadow-sm",
				)}
				onClick={() => onLang("pt")}
				aria-pressed={lang === "pt"}
			>
				{labels.pt}
			</Button>
			<Button
				type="button"
				variant={lang === "en" ? "secondary" : "ghost"}
				size="sm"
				className={cn(
					"h-7 min-w-9 px-2",
					lang === "en" && "bg-surface text-fg shadow-sm",
				)}
				onClick={() => onLang("en")}
				aria-pressed={lang === "en"}
			>
				{labels.en}
			</Button>
		</div>
	);
}
