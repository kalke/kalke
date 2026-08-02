# Security

## Reporting

Email security concerns to the repository owner. Do not open public issues for active exploits or leaked credentials.

## Practices

- Auth cookies are set by `auth.kalke.dev` (HttpOnly). The SPA uses `credentials: "include"` and never stores passwords.
- Playground extract uses a short-lived PAT minted after sign-in; do not commit tokens or `.env` files.
- Production build env (`VITE_AUTH_API_URL`, `VITE_PDE_API_URL`) points only at Kalke hosts.
- LGPD copy is honest: raw files are not stored; hash / structured result / consent audit may be kept.

## CI scanners

Pull requests and `main` runs include:

- `npm audit --production` (fails on high/critical)
- `gitleaks` (secret scan)

## Scope notes

Cloudflare API tokens and Wrangler secrets stay in GitHub Actions / Cloudflare — never in the repo.
