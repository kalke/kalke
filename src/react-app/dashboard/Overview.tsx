import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { copy, type Lang } from "../content";

type Props = { lang: Lang };

export function Overview({ lang }: Props) {
	const t = copy[lang].playground;

	const cards = [
		{
			to: "/playground/bank",
			path: t.pathBank,
			title: t.overviewBankCard,
			hint: t.overviewBankHint,
		},
		{
			to: "/playground/extract",
			path: t.pathExtract,
			title: t.overviewExtractCard,
			hint: t.overviewExtractHint,
		},
		{
			to: "/playground/cv",
			path: t.pathCv,
			title: t.overviewCvCard,
			hint: t.overviewCvHint,
		},
		{
			to: "/playground/cv/saved",
			path: t.pathCvSaved,
			title: t.overviewCvSavedCard,
			hint: t.overviewCvSavedHint,
		},
		{
			to: "/playground/profile",
			path: t.pathProfile,
			title: t.overviewProfileCard,
			hint: t.overviewProfileHint,
		},
	] as const;

	return (
		<>
			<p className="mb-2 font-display text-xs tracking-[0.18em] text-accent-cool uppercase">
				{t.pathOverview}
			</p>
			<h1 className="font-display mb-3 text-3xl font-semibold tracking-tight">
				{t.overviewTitle}
			</h1>
			<p className="mb-8 max-w-2xl text-muted">{t.overviewIntro}</p>

			<ul className="grid gap-3">
				{cards.map((card) => (
					<li key={card.to}>
						<Link to={card.to} className="block">
							<Card className="transition-colors hover:border-accent/45 hover:bg-surface/95">
								<CardContent className="grid gap-1.5 p-4 sm:p-5">
									<span className="font-display text-xs font-medium tracking-wide text-accent-cool">
										{card.path}
									</span>
									<strong className="font-display text-base font-semibold text-fg">
										{card.title}
									</strong>
									<span className="text-sm leading-snug text-muted">
										{card.hint}
									</span>
								</CardContent>
							</Card>
						</Link>
					</li>
				))}
			</ul>
		</>
	);
}
