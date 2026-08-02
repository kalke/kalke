#!/usr/bin/env bash
# Protect `main` — only kalke may push/bypass; everyone else needs a PR.
# Requires YOUR credentials (repo admin), not the Cursor cloud token:
#
#   gh auth login -h github.com   # as kalke, with repo admin
#   ./scripts/apply-branch-protection.sh
#
# Prefers repository rulesets; falls back to classic branch protection when
# the account plan blocks rulesets on private repos.
#
set -euo pipefail

OWNER="${OWNER:-kalke}"
ACTOR_LOGIN="${ACTOR_LOGIN:-kalke}"
REPOS=(kalke kalke-auth e-bank-api personal-document-extractor)

if ! command -v gh >/dev/null; then
  echo "gh CLI is required" >&2
  exit 1
fi

ACTOR_ID="$(gh api "users/${ACTOR_LOGIN}" --jq .id)"
ME="$(gh api user --jq .login 2>/dev/null || true)"
if [[ -z "${ME}" || "${ME}" == *"message"* ]]; then
  echo "Not authenticated with a user PAT/OAuth token." >&2
  echo "The Cursor cloud GitHub App cannot create rulesets (403)." >&2
  echo "Run: gh auth login -h github.com   # as ${ACTOR_LOGIN}" >&2
  exit 1
fi
if [[ "${ME}" != "${ACTOR_LOGIN}" ]]; then
  echo "Authenticated as '${ME}', but this script must run as '${ACTOR_LOGIN}'." >&2
  exit 1
fi
echo "Bypass actor: ${ACTOR_LOGIN} (id=${ACTOR_ID})"
echo "Authenticated as: ${ME}"

checks_for_repo() {
  case "$1" in
    kalke)
      echo '[{"context":"Lint & build"}]'
      ;;
    kalke-auth)
      echo '[{"context":"Validate realm"},{"context":"Go test"},{"context":"Docker build"}]'
      ;;
    e-bank-api)
      echo '[{"context":"Lint"},{"context":"Tests"},{"context":"Docker build"}]'
      ;;
    personal-document-extractor)
      echo '[{"context":"Lint and test"},{"context":"Docker build"}]'
      ;;
    *)
      echo '[]'
      ;;
  esac
}

contexts_csv() {
  # Convert [{"context":"A"},{"context":"B"}] → "A","B" for classic API.
  case "$1" in
    kalke) echo '"Lint & build"' ;;
    kalke-auth) echo '"Validate realm","Go test","Docker build"' ;;
    e-bank-api) echo '"Lint","Tests","Docker build"' ;;
    personal-document-extractor) echo '"Lint and test","Docker build"' ;;
    *) echo '' ;;
  esac
}

apply_ruleset() {
  local full="$1"
  local checks_json="$2"
  local existing
  existing="$(gh api "repos/${full}/rulesets" --jq '.[] | select(.name=="protect-main") | .id' 2>/dev/null || true)"
  if [[ -n "${existing}" ]]; then
    echo "Deleting existing ruleset id=${existing}"
    gh api --method DELETE "repos/${full}/rulesets/${existing}" >/dev/null
  fi

  gh api --method POST "repos/${full}/rulesets" \
    -H "Accept: application/vnd.github+json" \
    --input - >/dev/null <<EOF
{
  "name": "protect-main",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "bypass_actors": [
    {
      "actor_id": ${ACTOR_ID},
      "actor_type": "User",
      "bypass_mode": "always"
    }
  ],
  "rules": [
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "do_not_enforce_on_create": false,
        "required_status_checks": ${checks_json}
      }
    },
    { "type": "non_fast_forward" },
    { "type": "deletion" }
  ]
}
EOF
}

apply_classic() {
  local full="$1"
  local contexts="$2"
  # Classic protection: require PR, status checks, no force-push/delete.
  # Restriction: only ${ACTOR_LOGIN} may push (everyone else blocked from direct push).
  gh api --method PUT "repos/${full}/branches/main/protection" \
    -H "Accept: application/vnd.github+json" \
    --input - >/dev/null <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": [${contexts}]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": {
    "users": ["${ACTOR_LOGIN}"],
    "teams": [],
    "apps": []
  },
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": false
}
EOF
}

apply_repo() {
  local repo="$1"
  local full="${OWNER}/${repo}"
  local checks_json
  local contexts
  echo ""
  echo "==> ${full}"

  checks_json="$(checks_for_repo "${repo}")"
  contexts="$(contexts_csv "${repo}")"

  if apply_ruleset "${full}" "${checks_json}" 2>/tmp/kalke-protect-err.$$; then
    echo "Ruleset protect-main active on ${full}"
    rm -f /tmp/kalke-protect-err.$$
    return 0
  fi

  local err
  err="$(cat /tmp/kalke-protect-err.$$ 2>/dev/null || true)"
  rm -f /tmp/kalke-protect-err.$$
  echo "Rulesets unavailable (${err%%$'\n'*}); trying classic branch protection..."

  if apply_classic "${full}" "${contexts}"; then
    echo "Classic branch protection active on ${full} (push restricted to ${ACTOR_LOGIN})"
    return 0
  fi

  echo "FAILED to protect ${full}" >&2
  return 1
}

fail=0
for repo in "${REPOS[@]}"; do
  apply_repo "${repo}" || fail=1
done

echo ""
if [[ "${fail}" -ne 0 ]]; then
  echo "Some repos failed. Fix auth/plan, then re-run." >&2
  exit 1
fi
echo "Done. main requires a PR for everyone except ${ACTOR_LOGIN}."
echo "Verify:"
echo "  gh api repos/${OWNER}/kalke-auth/rulesets --jq '.[].name' 2>/dev/null || \\"
echo "  gh api repos/${OWNER}/kalke-auth/branches/main/protection --jq '{checks:.required_status_checks.contexts,users:.restrictions.users}'"
