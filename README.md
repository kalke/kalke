# kalke

Henrique Kalke — software engineer.

→ **[kalke.dev](https://kalke.dev)** — who I am, what I like, what I build. Private playground at `/playground`.

---

## Local stack

Needs sibling repos `../kalke-auth` and `../personal-document-extractor`, Docker, and a `GROQ_API_KEY` in the PDE `.env`.

```bash
make setup   # env files + npm install
make up      # auth (:8090) + PDE (:8080) + Vite (:5173)
```

Open **http://localhost:5173** — demo login `demo@kalke.local` / `DemoPass123!`.

`make down` stops the Docker backends. Vite stops with Ctrl+C.

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
| [kalke-auth](https://github.com/kalke/kalke-auth) | Keycloak · OIDC · Go · Docker | Shared IdP (`auth.kalke.dev`) |
| [personal-document-extractor](https://github.com/kalke/personal-document-extractor) | Go · LLM · Postgres · Redis | BR docs → JSON (`pde.kalke.dev`) |
| [e-bank-api](https://github.com/kalke/e-bank-api) | Python · FastAPI | Bank events API (`ebank.kalke.dev`) |
| [kalke](https://github.com/kalke/kalke) | React · Vite · Workers | Code for [kalke.dev](https://kalke.dev) |

---
