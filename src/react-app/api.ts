const AUTH_BASE =
	import.meta.env.VITE_AUTH_API_URL ?? "https://auth.kalke.dev";
const PDE_BASE =
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

export type Me = { email: string; permissions: string[] };

export type TokenRow = {
	id: string;
	name: string;
	prefix: string;
	created_at: string;
	last_used_at?: string;
};

export async function login(email: string, password: string): Promise<Me> {
	const res = await authFetch("/v1/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});
	if (!res.ok) throw new Error("login_failed");
	return res.json();
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

export async function extractDocument(
	pat: string,
	file: File,
	docType: string,
): Promise<unknown> {
	const body = new FormData();
	body.append("file", file);
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
