# Deploy

Push to `main` deploys the site Worker to Cloudflare.

Required GitHub Actions secret **names**:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Playground calls `auth.kalke.dev` and `pde.kalke.dev` from the browser; deploy those services first.
