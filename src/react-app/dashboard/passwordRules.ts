export type PasswordRules = {
	minLength: boolean;
	hasLetter: boolean;
	hasNumber: boolean;
	matches: boolean;
};

export function evaluatePassword(
	password: string,
	confirm = "",
): PasswordRules {
	return {
		minLength: password.length >= 10,
		hasLetter: /[A-Za-zÀ-ÿ]/.test(password),
		hasNumber: /\d/.test(password),
		matches: confirm.length > 0 && password === confirm,
	};
}

export function passwordIsStrong(rules: PasswordRules, requireMatch: boolean): boolean {
	return (
		rules.minLength &&
		rules.hasLetter &&
		rules.hasNumber &&
		(!requireMatch || rules.matches)
	);
}
