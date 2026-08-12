import type { BankAccount } from "../api";

const COMPLETE_STATUSES = new Set(["completed", "skipped"]);

/** True when this account still needs the onboarding wizard. */
export function isBankOnboardingIncomplete(
	row: Pick<BankAccount, "onboarding_status">,
): boolean {
	return !COMPLETE_STATUSES.has(row.onboarding_status);
}

export function bankOnboardingPath(accountId?: string | null): string {
	if (!accountId) return "/playground/bank/onboarding";
	return `/playground/bank/onboarding?account=${encodeURIComponent(accountId)}`;
}
