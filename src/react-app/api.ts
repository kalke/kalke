export const AUTH_BASE =
	import.meta.env.VITE_AUTH_API_URL ?? "https://auth.kalke.dev";
export const PDE_BASE =
	import.meta.env.VITE_PDE_API_URL ?? "https://pde.kalke.dev";

async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
	return fetch(`${AUTH_BASE}${path}`, {
		...init,
		credentials: "include",
		headers: {
			...(init.body ? { "Content-Type": "application/json" } : {}),
			...init.headers,
		},
	});
}

export type Me = { name?: string; email: string; permissions: string[] };

export type TokenRow = {
	id: string;
	name: string;
	prefix: string;
	created_at: string;
	last_used_at?: string;
};

export type SignupPending = {
	ok: boolean;
	status: "pending_verification";
	email: string;
	resend_after_seconds: number;
	expires_in_seconds: number;
};

export type EmailAuthPending = SignupPending;

async function parseResend(
	res: Response,
): Promise<{ ok: boolean; resend_after_seconds: number }> {
	const data = (await res.json().catch(() => ({}))) as {
		ok?: boolean;
		resend_after_seconds?: number;
		error?: string;
	};
	if (res.status === 429) {
		return {
			ok: false,
			resend_after_seconds: data.resend_after_seconds ?? 120,
		};
	}
	if (!res.ok) throw new Error("resend_failed");
	return {
		ok: true,
		resend_after_seconds: data.resend_after_seconds ?? 120,
	};
}

export async function login(email: string, password: string): Promise<Me> {
	const res = await authFetch("/v1/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});
	if (!res.ok) throw new Error("login_failed");
	return res.json();
}

export async function passwordlessStart(email: string): Promise<EmailAuthPending> {
	const res = await authFetch("/v1/auth/login/email", {
		method: "POST",
		body: JSON.stringify({ email }),
	});
	if (!res.ok) throw new Error("passwordless_failed");
	return res.json();
}

export async function passwordlessVerify(email: string, code: string): Promise<Me> {
	const res = await authFetch("/v1/auth/login/email/verify", {
		method: "POST",
		body: JSON.stringify({ email, code }),
	});
	if (!res.ok) throw new Error("verify_failed");
	return res.json();
}

export async function passwordlessResend(
	email: string,
): Promise<{ ok: boolean; resend_after_seconds: number }> {
	const res = await authFetch("/v1/auth/login/email/resend", {
		method: "POST",
		body: JSON.stringify({ email }),
	});
	return parseResend(res);
}

export async function forgotPasswordStart(email: string): Promise<EmailAuthPending> {
	const res = await authFetch("/v1/auth/password/forgot", {
		method: "POST",
		body: JSON.stringify({ email }),
	});
	if (!res.ok) throw new Error("forgot_failed");
	return res.json();
}

export async function forgotPasswordVerify(
	email: string,
	code: string,
	newPassword: string,
): Promise<Me | { ok: true; email: string }> {
	const res = await authFetch("/v1/auth/password/forgot/verify", {
		method: "POST",
		body: JSON.stringify({ email, code, new_password: newPassword }),
	});
	if (res.status === 400) {
		const data = (await res.json().catch(() => ({}))) as { error?: string };
		throw new Error(data.error ?? "bad_request");
	}
	if (!res.ok) throw new Error("verify_failed");
	return res.json();
}

export async function forgotPasswordResend(
	email: string,
): Promise<{ ok: boolean; resend_after_seconds: number }> {
	const res = await authFetch("/v1/auth/password/forgot/resend", {
		method: "POST",
		body: JSON.stringify({ email }),
	});
	return parseResend(res);
}

export function oauthStartURL(
	provider: "google" | "github" | "apple",
	returnTo = typeof window !== "undefined" ? window.location.href : "",
): string {
	const u = new URL(`${AUTH_BASE}/v1/auth/oauth/${provider}`);
	if (returnTo) u.searchParams.set("return_to", returnTo);
	return u.toString();
}

export async function signupStart(
	name: string,
	email: string,
	password: string,
): Promise<SignupPending> {
	const res = await authFetch("/v1/auth/signup", {
		method: "POST",
		body: JSON.stringify({ name, email, password }),
	});
	if (!res.ok) throw new Error("signup_failed");
	return res.json();
}

export async function signupVerify(email: string, code: string): Promise<Me> {
	const res = await authFetch("/v1/auth/signup/verify", {
		method: "POST",
		body: JSON.stringify({ email, code }),
	});
	if (!res.ok) throw new Error("verify_failed");
	return res.json();
}

export async function signupResend(
	email: string,
): Promise<{ ok: boolean; resend_after_seconds: number }> {
	const res = await authFetch("/v1/auth/signup/resend", {
		method: "POST",
		body: JSON.stringify({ email }),
	});
	return parseResend(res);
}

export async function changePassword(
	currentPassword: string,
	newPassword: string,
): Promise<void> {
	const res = await authFetch("/v1/auth/password", {
		method: "POST",
		body: JSON.stringify({
			current_password: currentPassword,
			new_password: newPassword,
		}),
	});
	if (res.status === 401) throw new Error("invalid_credentials");
	if (res.status === 400) {
		const data = (await res.json().catch(() => ({}))) as { error?: string };
		throw new Error(data.error ?? "bad_request");
	}
	if (!res.ok) throw new Error("password_change_failed");
}

export async function updateProfile(name: string): Promise<Me> {
	const res = await authFetch("/v1/auth/me", {
		method: "PATCH",
		body: JSON.stringify({ name }),
	});
	if (res.status === 400) {
		const data = (await res.json().catch(() => ({}))) as { error?: string };
		throw new Error(data.error ?? "bad_request");
	}
	if (!res.ok) throw new Error("profile_update_failed");
	return res.json();
}

export async function emailChangeStart(email: string): Promise<EmailAuthPending> {
	const res = await authFetch("/v1/auth/email/change", {
		method: "POST",
		body: JSON.stringify({ email }),
	});
	if (res.status === 409) throw new Error("email_taken");
	if (res.status === 400) {
		const data = (await res.json().catch(() => ({}))) as { error?: string };
		throw new Error(data.error ?? "bad_request");
	}
	if (!res.ok) throw new Error("email_change_failed");
	return res.json();
}

export async function emailChangeVerify(email: string, code: string): Promise<Me> {
	const res = await authFetch("/v1/auth/email/change/verify", {
		method: "POST",
		body: JSON.stringify({ email, code }),
	});
	if (res.status === 409) throw new Error("email_taken");
	if (!res.ok) throw new Error("verify_failed");
	return res.json();
}

export async function emailChangeResend(
	email: string,
): Promise<{ ok: boolean; resend_after_seconds: number }> {
	const res = await authFetch("/v1/auth/email/change/resend", {
		method: "POST",
		body: JSON.stringify({ email }),
	});
	return parseResend(res);
}

export async function logout(): Promise<void> {
	await authFetch("/v1/auth/logout", { method: "POST" });
}

export async function me(): Promise<Me | null> {
	const res = await authFetch("/v1/auth/me");
	if (res.status === 401) return null;
	if (!res.ok) throw new Error("me_failed");
	return res.json();
}

export async function listTokens(): Promise<TokenRow[]> {
	const res = await authFetch("/v1/tokens");
	if (!res.ok) throw new Error("list_failed");
	const data = (await res.json()) as { tokens: TokenRow[] };
	return data.tokens ?? [];
}

export async function createToken(name: string): Promise<{ id: string; token: string; prefix: string; name: string }> {
	const res = await authFetch("/v1/tokens", {
		method: "POST",
		body: JSON.stringify({ name }),
	});
	if (!res.ok) throw new Error("create_failed");
	return res.json();
}

export async function revokeToken(id: string): Promise<void> {
	const res = await authFetch(`/v1/tokens/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("revoke_failed");
}

export const LGPD_POLICY_VERSION = "lgpd-extract-v1";
export const LGPD_CV_STORE_POLICY = "lgpd-cv-store-v1";

export function consentPolicyForDocType(docType: string): string {
	return docType === "curriculum_vitae"
		? LGPD_CV_STORE_POLICY
		: LGPD_POLICY_VERSION;
}

export type ExtractionSummary = {
	id: string;
	created_at: string;
	doc_type: string;
	filename?: string;
	content_sha256: string;
	status: string;
	result: unknown;
};

export async function listExtractions(
	docType?: string,
): Promise<ExtractionSummary[]> {
	const q = docType
		? `?doc_type=${encodeURIComponent(docType)}`
		: "";
	const res = await authFetch(`/v1/extractions${q}`);
	if (!res.ok) {
		const data = (await res.json().catch(() => ({}))) as { error?: string };
		throw new Error(data.error || "list_failed");
	}
	const data = (await res.json()) as { extractions?: ExtractionSummary[] };
	return data.extractions ?? [];
}

export async function getExtraction(id: string): Promise<ExtractionSummary> {
	const res = await authFetch(`/v1/extractions/${encodeURIComponent(id)}`);
	if (!res.ok) {
		const data = (await res.json().catch(() => ({}))) as { error?: string };
		throw new Error(data.error || "get_failed");
	}
	return res.json();
}

export type ExtractProgress = {
	/** 0–100 overall progress shown in the UI */
	percent: number;
	stage: "upload" | "extract";
};

export async function extractDocument(
	file: File,
	docType: string,
	consent = true,
	onProgress?: (progress: ExtractProgress) => void,
	opts?: { refresh?: boolean },
): Promise<unknown> {
	const body = new FormData();
	body.append("file", file);
	if (consent) {
		body.append("consent", consentPolicyForDocType(docType));
	}

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		// Cookie session on auth BFF — never send a PAT from the browser.
		const qs = new URLSearchParams({ doc_type: docType });
		if (opts?.refresh) qs.set("refresh", "1");
		xhr.open("POST", `${AUTH_BASE}/v1/extract?${qs.toString()}`);
		xhr.withCredentials = true;
		xhr.responseType = "json";

		xhr.upload.onprogress = (event) => {
			if (!onProgress || !event.lengthComputable || event.total <= 0) return;
			const uploadPct = Math.min(90, Math.round((event.loaded / event.total) * 90));
			onProgress({ percent: uploadPct, stage: "upload" });
		};

		xhr.upload.onload = () => {
			onProgress?.({ percent: 92, stage: "extract" });
		};

		xhr.onload = () => {
			const data =
				xhr.response && typeof xhr.response === "object"
					? xhr.response
					: (() => {
							try {
								return JSON.parse(xhr.responseText || "{}");
							} catch {
								return {};
							}
						})();
			if (xhr.status >= 200 && xhr.status < 300) {
				onProgress?.({ percent: 100, stage: "extract" });
				resolve(data);
				return;
			}
			const msg =
				typeof data === "object" && data && "error" in data
					? String((data as { error: string }).error)
					: "extract_failed";
			reject(new Error(msg));
		};

		xhr.onerror = () => reject(new Error("extract_failed"));
		xhr.onabort = () => reject(new Error("extract_failed"));
		onProgress?.({ percent: 4, stage: "upload" });
		xhr.send(body);
	});
}

/* ── Demo bank (AUTH_BASE /v1/bank/*) ─────────────────────────────── */

export const BANK_TOS_POLICY = "demo-bank-tos-v1";
export const BANK_DD_POLICY = "demo-dd-v1";

export type BankMeta = {
	demo: boolean;
	welcome_amount: string;
	currency: string;
	disclaimer: string;
	features: string[];
};

export type BankAccount = {
	id: string;
	balance: string;
	currency: string;
	kind: string;
	status: string;
	onboarding_status: string;
	demo_credited: boolean;
	demo: boolean;
	account_number?: number | null;
	digit?: number | null;
	display_number?: string | null;
	holder_name?: string | null;
};

export type BankTransaction = {
	id: string;
	account_id: string;
	amount: string;
	type: string;
	counterparty_account_id?: string | null;
	memo?: string | null;
	created_at: string;
};

export type BankTransactionsPage = {
	transactions: BankTransaction[];
	next_cursor: string | null;
	demo: boolean;
};

export type BankOnboardingDoc = {
	id: string;
	doc_type: string;
	status: string;
	pde_extraction_id?: string | null;
};

export type BankOnboardingStatus = {
	onboarding_status: string;
	session_id?: string | null;
	session_status?: string | null;
	documents: BankOnboardingDoc[];
	skippable: boolean;
	demo: boolean;
};

export type BankTransferResult = {
	origin: {
		id: string;
		balance: string;
		display_number?: string | null;
	};
	destination: {
		id: string;
		balance: string;
		display_number?: string | null;
	};
	demo?: boolean;
};

export type BankResolveResult = {
	account_id: string;
	account_display: string;
	holder_name: string;
	document_masked?: string | null;
	demo?: boolean;
};

export type BankCepResult = {
	cep: string;
	street: string;
	neighborhood: string;
	city: string;
	state: string;
	demo?: boolean;
};

export type BankOnboardingCompleteInput = {
	full_name: string;
	birth_date: string;
	document_number: string;
	cep: string;
	street: string;
	number: string;
	complement?: string;
	neighborhood?: string;
	city?: string;
	state?: string;
	email: string;
	phone: string;
	terms_accepted: boolean;
	accepted_at?: string;
};

async function bankJson<T>(path: string, init: RequestInit = {}): Promise<T> {
	const res = await authFetch(path, init);
	const data = (await res.json().catch(() => ({}))) as T & {
		error?: string;
		message?: string;
		detail?: string;
	};
	if (!res.ok) {
		const detail =
			typeof data === "object" && data
				? data.error || data.message || data.detail
				: undefined;
		throw new Error(detail ? String(detail) : `bank_${res.status}`);
	}
	return data;
}

export async function bankMeta(): Promise<BankMeta> {
	return bankJson<BankMeta>("/v1/bank/meta");
}

export async function bankBootstrap(): Promise<BankAccount> {
	return bankJson<BankAccount>("/v1/bank/bootstrap", { method: "POST" });
}

export async function bankAccount(): Promise<BankAccount> {
	return bankJson<BankAccount>("/v1/bank/account");
}

export async function bankAccounts(): Promise<{
	accounts: BankAccount[];
	demo: boolean;
}> {
	return bankJson("/v1/bank/accounts");
}

export async function bankAccountDetail(display: string): Promise<BankAccount> {
	return bankJson(`/v1/bank/accounts/${encodeURIComponent(display)}`);
}

export async function bankTransactions(
	limit = 20,
	cursor?: string | null,
): Promise<BankTransactionsPage> {
	const params = new URLSearchParams();
	params.set("limit", String(limit));
	if (cursor) params.set("cursor", cursor);
	return bankJson<BankTransactionsPage>(
		`/v1/bank/transactions?${params.toString()}`,
	);
}

export async function bankTransferResolve(input: {
	account?: string;
	document?: string;
}): Promise<BankResolveResult> {
	return bankJson<BankResolveResult>("/v1/bank/transfers/resolve", {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export async function bankTransfer(input: {
	destination_account_id?: string;
	destination_account?: string;
	destination_document?: string;
	amount: string;
	memo?: string;
	idempotencyKey?: string;
}): Promise<BankTransferResult> {
	const { idempotencyKey, ...body } = input;
	return bankJson<BankTransferResult>("/v1/bank/transfer", {
		method: "POST",
		headers: idempotencyKey
			? { "Idempotency-Key": idempotencyKey }
			: undefined,
		body: JSON.stringify(body),
	});
}

export async function bankCepLookup(cep: string): Promise<BankCepResult> {
	return bankJson(`/v1/bank/cep/${encodeURIComponent(cep)}`);
}

export async function bankOnboarding(): Promise<BankOnboardingStatus> {
	return bankJson<BankOnboardingStatus>("/v1/bank/onboarding");
}

export async function bankOnboardingStart(): Promise<BankOnboardingStatus> {
	return bankJson<BankOnboardingStatus>("/v1/bank/onboarding/start", {
		method: "POST",
	});
}

export async function bankOnboardingConsent(
	policyVersion: string,
): Promise<{ ok: boolean; policy_version: string }> {
	return bankJson("/v1/bank/onboarding/consent", {
		method: "POST",
		body: JSON.stringify({ policy_version: policyVersion }),
	});
}

export async function bankOnboardingSkip(
	idempotencyKey?: string,
): Promise<BankAccount> {
	return bankJson<BankAccount>("/v1/bank/onboarding/skip", {
		method: "POST",
		headers: idempotencyKey
			? { "Idempotency-Key": idempotencyKey }
			: undefined,
	});
}

export async function bankOnboardingDocuments(input: {
	doc_type: "identity_document" | "address_proof";
	pde_extraction_id?: string | null;
	summary?: Record<string, unknown> | null;
}): Promise<BankOnboardingStatus> {
	return bankJson<BankOnboardingStatus>("/v1/bank/onboarding/documents", {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export async function bankOnboardingComplete(
	input: BankOnboardingCompleteInput,
	idempotencyKey?: string,
): Promise<BankAccount> {
	return bankJson<BankAccount>("/v1/bank/onboarding/complete", {
		method: "POST",
		headers: idempotencyKey
			? { "Idempotency-Key": idempotencyKey }
			: undefined,
		body: JSON.stringify(input),
	});
}
