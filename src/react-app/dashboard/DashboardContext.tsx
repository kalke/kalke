import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import {
	clearWorkingPat,
	createToken,
	getWorkingPat,
	listTokens,
	logout as apiLogout,
	me,
	setWorkingPat,
	type Me,
	type TokenRow,
} from "../api";

type DashboardContextValue = {
	user: Me | null;
	loading: boolean;
	busy: boolean;
	setBusy: (v: boolean) => void;
	error: string;
	setError: (v: string) => void;
	tokens: TokenRow[];
	refreshTokens: () => Promise<void>;
	ensureWorkingPat: () => Promise<string>;
	afterAuth: (u: Me) => Promise<void>;
	logout: () => Promise<void>;
	setUser: (u: Me | null) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<Me | null>(null);
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [tokens, setTokens] = useState<TokenRow[]>([]);

	const refreshTokens = useCallback(async () => {
		setTokens(await listTokens());
	}, []);

	const ensureWorkingPat = useCallback(async () => {
		const existing = getWorkingPat();
		if (existing) return existing;
		const created = await createToken("session");
		setWorkingPat(created.token);
		await refreshTokens();
		return created.token;
	}, [refreshTokens]);

	const afterAuth = useCallback(
		async (u: Me) => {
			setUser(u);
			setError("");
			const created = await createToken("session");
			setWorkingPat(created.token);
			await refreshTokens();
		},
		[refreshTokens],
	);

	const logout = useCallback(async () => {
		await apiLogout();
		setUser(null);
		setTokens([]);
		clearWorkingPat();
		setError("");
	}, []);

	useEffect(() => {
		me()
			.then(async (u) => {
				setUser(u);
				if (u) await refreshTokens();
			})
			.catch(() => setUser(null))
			.finally(() => setLoading(false));
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
			ensureWorkingPat,
			afterAuth,
			logout,
			setUser,
		}),
		[
			user,
			loading,
			busy,
			error,
			tokens,
			refreshTokens,
			ensureWorkingPat,
			afterAuth,
			logout,
		],
	);

	return (
		<DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
	);
}

export function useDashboard(): DashboardContextValue {
	const ctx = useContext(DashboardContext);
	if (!ctx) throw new Error("useDashboard outside provider");
	return ctx;
}
