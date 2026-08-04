import { createContext } from "react";
import type { Me, TokenRow } from "../api";

export type DashboardContextValue = {
	user: Me | null;
	loading: boolean;
	busy: boolean;
	setBusy: (v: boolean) => void;
	error: string;
	setError: (v: string) => void;
	tokens: TokenRow[];
	refreshTokens: () => Promise<void>;
	afterAuth: (u: Me) => Promise<void>;
	logout: () => Promise<void>;
	setUser: (u: Me | null) => void;
};

export const DashboardContext = createContext<DashboardContextValue | null>(null);
