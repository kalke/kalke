import type { BankAccount } from "../api";

const COMPLETE_STATUSES = new Set(["completed", "skipped"]);

/** True when the holder still needs the onboarding wizard (canonical API statuses). */
export function isBankOnboardingIncomplete(
	row: Pick<BankAccount, "onboarding_status">,
): boolean {
	return !COMPLETE_STATUSES.has(row.onboarding_status);
}
