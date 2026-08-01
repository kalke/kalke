/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_OIDC_AUTHORITY?: string;
	readonly VITE_OIDC_CLIENT_ID?: string;
	readonly VITE_EBANK_API_URL?: string;
	readonly VITE_PDE_API_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
