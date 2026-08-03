import {
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
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
	const [panelStyle, setPanelStyle] = useState<CSSProperties>();
	const buttonRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const panelId = useId();

	useLayoutEffect(() => {
		if (!open) return;

		function place() {
			const btn = buttonRef.current;
			if (!btn) return;
			const rect = btn.getBoundingClientRect();
			setPanelStyle({
				top: rect.bottom + 9,
				right: Math.max(12, window.innerWidth - rect.right),
			});
		}

		place();
		window.addEventListener("resize", place);
		window.addEventListener("scroll", place, true);
		return () => {
			window.removeEventListener("resize", place);
			window.removeEventListener("scroll", place, true);
		};
	}, [open]);

	useEffect(() => {
		if (!open) return;
		function onDoc(e: PointerEvent) {
			const target = e.target as Node;
			if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) {
				return;
			}
			setOpen(false);
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false);
		}
		document.addEventListener("pointerdown", onDoc);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("pointerdown", onDoc);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	if (!user) return null;

	const panel = open ? (
		<>
			<button
				type="button"
				className="profile-backdrop"
				aria-label={t.accountClose}
				onClick={() => setOpen(false)}
			/>
			<div
				ref={panelRef}
				className="profile-panel surface-panel"
				id={panelId}
				role="dialog"
				aria-label={t.accountMenu}
				style={panelStyle}
			>
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
		</>
	) : null;

	return (
		<div className={`profile-menu ${open ? "is-open" : ""}`}>
			<button
				ref={buttonRef}
				type="button"
				className="profile-avatar"
				aria-label={t.accountMenu}
				aria-expanded={open}
				aria-controls={panelId}
				onClick={() => setOpen((v) => !v)}
			>
				{initials(user.email)}
			</button>
			{panel ? createPortal(panel, document.body) : null}
		</div>
	);
}
