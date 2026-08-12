import { Link } from "react-router";
import { copy, type Lang } from "../content";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

function initials(name: string | undefined, email: string): string {
	const fromName = (name ?? "").trim();
	if (fromName) {
		const parts = fromName.split(/\s+/).filter(Boolean);
		if (parts.length >= 2) {
			return (parts[0][0] + parts[1][0]).toUpperCase();
		}
		return fromName.slice(0, 2).toUpperCase();
	}
	const local = email.split("@")[0] ?? email;
	const parts = local.split(/[._-]+/).filter(Boolean);
	if (parts.length >= 2) {
		return (parts[0][0] + parts[1][0]).toUpperCase();
	}
	return local.slice(0, 2).toUpperCase();
}

export function ProfileMenu({ lang }: Props) {
	const t = copy[lang].playground;
	const { user, logout, busy } = useDashboard();

	if (!user) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="secondary"
					size="icon"
					className="rounded-full font-display text-xs font-semibold"
					aria-label={t.accountMenu}
				>
					{initials(user.name, user.email)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64">
				<DropdownMenuLabel className="font-normal">
					<p className="text-xs text-muted">{t.signedInAs}</p>
					{user.name ? (
						<p className="font-display truncate text-sm font-semibold text-fg">
							{user.name}
						</p>
					) : null}
					<p className="truncate text-sm text-muted">{user.email}</p>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link to="/playground/profile" viewTransition>
						{t.profileMenuLink}
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={busy}
					onSelect={() => {
						void logout();
					}}
				>
					{t.logout}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
