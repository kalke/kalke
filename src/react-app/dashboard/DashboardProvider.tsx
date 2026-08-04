import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
	listTokens,
	logout as apiLogout,
	me,
	type Me,
	type TokenRow,
} from "../api";
import { DashboardContext } from "./dashboard-context";

export function DashboardProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<Me | null>(null);
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [tokens, setTokens] = useState<TokenRow[]>([]);

	const refreshTokens = useCallback(async () => {
		setTokens(await listTokens());
	}, []);

	const afterAuth = useCallback(
		async (u: Me) => {
			setUser(u);
			setError("");
			try {
				await refreshTokens();
			} catch {
				/* token list is non-blocking */
			}
		},
		[refreshTokens],
	);

	const logout = useCallback(async () => {
		await apiLogout();
		setUser(null);
		setTokens([]);
		setError("");
	}, []);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			let next: Me | null = null;
			try {
				next = await Promise.race([
					me(),
					new Promise<Me | null>((_, reject) => {
						window.setTimeout(() => reject(new Error("me_timeout")), 10_000);
					}),
				]);
			} catch {
				next = null;
			}
			if (cancelled) return;
			setUser(next);
			setLoading(false);
			if (!next) return;
			try {
				await refreshTokens();
			} catch {
				/* token list is non-blocking for demo access */
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [refreshTokens]);

	const value = useMemo(
		() => ({
			user,
			loading,
			busy,
			setBusy,
			error,
			setError,
			tokens,
			refreshTokens,
			afterAuth,
			logout,
			setUser,
		}),
		[user, loading, busy, error, tokens, refreshTokens, afterAuth, logout],
	);

	return (
		<DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
	);
}
