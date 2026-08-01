# kalke

Henrique Kalke — software engineer.

→ **[kalke.dev](https://kalke.dev)** — who I am, what I like, what I build, and a live **sandbox** (OIDC login via [kalke-auth](https://github.com/kalke/kalke-auth)).

---

## Stack

| Area | Tech |
|------|------|
| Backend | Go, Python, FastAPI, TypeScript |
| Data | PostgreSQL, Redis, Kafka |
| Cloud | AWS, Docker, Cloudflare Workers / Containers |
| Auth / APIs | OIDC, OpenAPI |
| Frontend (this repo) | React 19, Vite, Hono |

---

## Projects

| Repo | Stack | |
|------|-------|---|
| [kalke-auth](https://github.com/kalke/kalke-auth) | Keycloak · OIDC · Docker | Shared IdP (`auth.kalke.dev`) |
| [personal-document-extractor](https://github.com/kalke/personal-document-extractor) | Go · LLM · Postgres · Redis | BR docs → JSON (`pde.kalke.dev`) |
| [e-bank-api](https://github.com/kalke/e-bank-api) | Python · FastAPI | Bank events API (`ebank.kalke.dev`) |
| [kalke](https://github.com/kalke/kalke) | React · Vite · Workers | Code for [kalke.dev](https://kalke.dev) |

---

## This repository

```bash
npm install
npm run dev
npm run build
npm run deploy   # or push to main → GitHub Actions
```

Optional Vite env (defaults target production hosts):

```bash
VITE_OIDC_AUTHORITY=https://auth.kalke.dev/realms/kalke
VITE_OIDC_CLIENT_ID=kalke-spa
VITE_EBANK_API_URL=https://ebank.kalke.dev
VITE_PDE_API_URL=https://pde.kalke.dev
```

Push to `main` → lint, build, deploy on Cloudflare.

See [DEPLOY.md](DEPLOY.md) and [BRANCH_PROTECTION.md](BRANCH_PROTECTION.md).

---

[kalke.dev](https://kalke.dev) · [LinkedIn](https://www.linkedin.com/in/henriquekalke/) · [henriquekalke@icloud.com](mailto:henriquekalke@icloud.com)
