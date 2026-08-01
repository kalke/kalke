# Deploy kalke.dev + sandbox secrets checklist

## Cloudflare (already live)

Worker `kalke-dev` on `kalke.dev` / `www.kalke.dev`. CI deploys on push to `main` using:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Sibling services (create once)

### Neon (Postgres, free)

One Neon project, three databases (or three projects):

| Database | Used by |
|---|---|
| `kalke_auth` | Keycloak (`KC_DB_*`) |
| `e_bank` | e-bank-api (`DATABASE_URL`) |
| `pde` | personal-document-extractor (`DATABASE_URL`) |

No credit card required on Neon Free.

### Upstash Redis (free)

| Redis | Used by |
|---|---|
| `e-bank` | e-bank-api (`REDIS_URL` as `rediss://…`) |
| `pde` | PDE (`REDIS_ADDR` + `REDIS_PASSWORD`, `REDIS_TLS=true`) |

### Cloudflare Workers Paid

Required for Containers (~$5/mo). Enable before deploying auth / ebank / pde.

### Groq

`GROQ_API_KEY` for personal-document-extractor.

## Host map

| Host | Repo |
|---|---|
| `kalke.dev` | kalke (this site + sandbox) |
| `auth.kalke.dev` | kalke-auth |
| `ebank.kalke.dev` | e-bank-api |
| `pde.kalke.dev` | personal-document-extractor |

Deploy order: **kalke-auth → e-bank-api & PDE → kalke** (sandbox needs the IdP + APIs).

## GitHub secrets by repo

### kalke

`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

### kalke-auth

`CLOUDFLARE_*`, `KC_DB_URL`, `KC_DB_USERNAME`, `KC_DB_PASSWORD`, `KC_BOOTSTRAP_ADMIN_USERNAME`, `KC_BOOTSTRAP_ADMIN_PASSWORD`

### e-bank-api

`CLOUDFLARE_*`, `DATABASE_URL`, `REDIS_URL`, `OIDC_ISSUER`, `OIDC_AUDIENCE`

### personal-document-extractor

`CLOUDFLARE_*`, `DATABASE_URL`, `REDIS_ADDR`, `REDIS_PASSWORD`, `OIDC_ISSUER`, `GROQ_API_KEY`

## Demo sandbox user

Imported with the realm (change after first shared use):

- `demo@kalke.local` / `DemoPass123!`
- Roles: `extract:write`, `bank:write`
