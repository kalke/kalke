export const AUTH_BASE =
	import.meta.env.VITE_AUTH_API_URL ?? "https://auth.kalke.dev";
export const PDE_BASE =
	import.meta.env.VITE_PDE_API_URL ?? "https://pde.kalke.dev";

const WORKING_PAT_KEY = "kalke-working-pat";

export function getWorkingPat(): string {
	try {
		return sessionStorage.getItem(WORKING_PAT_KEY) ?? "";
	} catch {
		return "";
	}
}

export function setWorkingPat(token: string): void {
	try {
		if (token) sessionStorage.setItem(WORKING_PAT_KEY, token);
		else sessionStorage.removeItem(WORKING_PAT_KEY);
	} catch {
		/* ignore */
	}
}

export function clearWorkingPat(): void {
	setWorkingPat("");
}

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

export type Me = { email: string; permissions: string[] };

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

export async function extractDocument(
	pat: string,
	file: File,
	docType: string,
	consent = true,
): Promise<unknown> {
	const body = new FormData();
	body.append("file", file);
	if (consent) {
		body.append("consent", LGPD_POLICY_VERSION);
	}
	const res = await fetch(
		`${PDE_BASE}/v1/extract?doc_type=${encodeURIComponent(docType)}`,
		{
			method: "POST",
			headers: { Authorization: `Bearer ${pat}` },
			body,
		},
	);
	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		const msg =
			typeof data === "object" && data && "error" in data
				? String((data as { error: string }).error)
				: "extract_failed";
		throw new Error(msg);
	}
	return data;
}
