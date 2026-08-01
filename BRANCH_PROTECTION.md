# Protect `main` (all Kalke repos)

The GitHub token used by automation cannot change branch protection (403). Apply this once per repo as user **`kalke`** (repo owner).

## Settings → Branches → Add rule / Ruleset for `main`

Recommended **ruleset** (or classic branch protection):

1. **Require a pull request before merging**
   - Require approvals: optional for solo
   - Dismiss stale pull request approvals when new commits are pushed
2. **Require status checks to pass**
   - Require branches to be up to date before merging
   - Required checks (names must match Actions):

| Repo | Required checks |
|---|---|
| `kalke` | `Lint & build` |
| `kalke-auth` | `Validate realm`, `Docker build` |
| `e-bank-api` | `Lint`, `Tests`, `Docker build` |
| `personal-document-extractor` | `Lint and test`, `Docker build` |

3. **Block force pushes**
4. **Block deletions**
5. **Restrict who can push** to matching branches → only **`kalke`**
6. Do **not** allow administrators to bypass (or leave bypass only for yourself if you need emergency fixes)

## Effect

- Nobody else can push directly to `main`
- Deploys only run on `push` to `main` after checks (see each repo’s `.github/workflows/ci.yml`)
- CODEOWNERS (`@kalke`) is present for review routing

## Verify

```bash
# as kalke, should work via PR merge
# as another user / PAT without admin: git push origin main → rejected
```
