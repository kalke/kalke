import { useEffect, useId, useRef, useState } from "react";
import { copy, type Lang } from "../content";
import { PasswordPanel } from "./PasswordPanel";
import { useDashboard } from "./useDashboard";

type Props = { lang: Lang };

function initials(email: string): string {
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
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const panelId = useId();

	useEffect(() => {
		if (!open) return;
		function onDoc(e: MouseEvent) {
			if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false);
		}
		document.addEventListener("mousedown", onDoc);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDoc);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	if (!user) return null;

	return (
		<div className={`profile-menu ${open ? "is-open" : ""}`} ref={rootRef}>
			<button
				type="button"
				className="profile-avatar"
				aria-label={t.accountMenu}
				aria-expanded={open}
				aria-controls={panelId}
				onClick={() => setOpen((v) => !v)}
			>
				{initials(user.email)}
			</button>
			{open ? (
				<div className="profile-panel surface-panel" id={panelId} role="dialog" aria-label={t.accountMenu}>
					<div className="profile-panel-head">
						<p className="path-label">{t.signedInAs}</p>
						<p className="profile-email">{user.email}</p>
						<button
							type="button"
							className="btn btn-ghost profile-close"
							onClick={() => setOpen(false)}
						>
							{t.accountClose}
						</button>
					</div>
					<section className="profile-password" aria-labelledby="password-title">
						<PasswordPanel lang={lang} />
					</section>
					<button
						type="button"
						className="btn btn-ghost profile-logout"
						onClick={() => void logout()}
						disabled={busy}
					>
						{t.logout}
					</button>
				</div>
			) : null}
		</div>
	);
}
