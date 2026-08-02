import { useContext } from "react";
import { DashboardContext } from "./dashboard-context";

export function useDashboard() {
	const ctx = useContext(DashboardContext);
	if (!ctx) throw new Error("useDashboard outside provider");
	return ctx;
}
