# Protect `main` — only `kalke` may push directly

## Apply now (one command)

This Cursor agent **cannot** set branch protection (GitHub App token → HTTP 403). Run locally as **`kalke`**:

```bash
gh auth login -h github.com   # account: kalke, scopes including repo admin
cd kalke
chmod +x scripts/apply-branch-protection.sh
./scripts/apply-branch-protection.sh
```

That creates an active ruleset `protect-main` on:

- `kalke/kalke`
- `kalke/kalke-auth`
- `kalke/e-bank-api`
- `kalke/personal-document-extractor`

### What it enforces

| Who | Push to `main` |
|---|---|
| **`kalke`** | Allowed (ruleset bypass) |
| Anyone else | Blocked — must open a PR |

Also: no force-push, no branch delete, required status checks (per-repo job names), dismiss stale reviews.

### Verify

```bash
gh api repos/kalke/kalke/rulesets --jq '.[] | {name,enforcement}'
# expect: protect-main / active
```

Or GitHub → each repo → **Settings → Rules → Rulesets**.

## Manual UI (alternative)

Settings → Rules → New branch ruleset → target `main`:

1. Require a pull request before merging  
2. Require status checks (see table below)  
3. Block force pushes / deletions  
4. Bypass list → add user **`kalke`** (always)

| Repo | Required checks |
|---|---|
| `kalke` | `Lint & build` |
| `kalke-auth` | `Validate realm`, `Docker build` |
| `e-bank-api` | `Lint`, `Tests`, `Docker build` |
| `personal-document-extractor` | `Lint and test`, `Docker build` |

Deploys already only run on `push` to `main` after CI (see each repo’s `.github/workflows/ci.yml`).
