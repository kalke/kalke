import { User, UserManager, WebStorageStateStore } from "oidc-client-ts";

const authority =
	import.meta.env.VITE_OIDC_AUTHORITY ?? "https://auth.kalke.dev/realms/kalke";
const clientId = import.meta.env.VITE_OIDC_CLIENT_ID ?? "kalke-spa";

export const apiUrls = {
	ebank: import.meta.env.VITE_EBANK_API_URL ?? "https://ebank.kalke.dev",
	pde: import.meta.env.VITE_PDE_API_URL ?? "https://pde.kalke.dev",
};

let manager: UserManager | null = null;

function getManager(): UserManager {
	if (manager) return manager;
	manager = new UserManager({
		authority,
		client_id: clientId,
		redirect_uri: `${window.location.origin}/`,
		post_logout_redirect_uri: `${window.location.origin}/`,
		response_type: "code",
		scope: "openid profile email",
		automaticSilentRenew: true,
		userStore: new WebStorageStateStore({ store: window.sessionStorage }),
	});
	return manager;
}

export async function completeLoginIfNeeded(): Promise<User | null> {
	const params = new URLSearchParams(window.location.search);
	if (!params.has("code")) {
		return getUser();
	}
	try {
		const user = await getManager().signinRedirectCallback();
		window.history.replaceState({}, document.title, window.location.pathname);
		return user;
	} catch {
		window.history.replaceState({}, document.title, window.location.pathname);
		return null;
	}
}

export async function getUser(): Promise<User | null> {
	try {
		return await getManager().getUser();
	} catch {
		return null;
	}
}

export async function login(): Promise<void> {
	await getManager().signinRedirect();
}

export async function logout(): Promise<void> {
	await getManager().signoutRedirect();
}

export function accessToken(user: User | null): string | null {
	return user?.access_token ?? null;
}
