#!/usr/bin/env bash
# Apply "only kalke can push/bypass on main" rulesets to all Kalke repos.
# Requires YOUR credentials (repo admin), not the Cursor cloud token:
#
#   gh auth login -h github.com   # as kalke, with repo admin
#   ./scripts/apply-branch-protection.sh
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
echo "Bypass actor: ${ACTOR_LOGIN} (id=${ACTOR_ID})"
echo "Authenticated as: $(gh api user --jq .login)"

apply_repo() {
  local repo="$1"
  local full="${OWNER}/${repo}"
  echo ""
  echo "==> ${full}"

  # Remove prior ruleset with the same name (idempotent re-run).
  local existing
  existing="$(gh api "repos/${full}/rulesets" --jq '.[] | select(.name=="protect-main") | .id' || true)"
  if [[ -n "${existing}" ]]; then
    echo "Deleting existing ruleset id=${existing}"
    gh api --method DELETE "repos/${full}/rulesets/${existing}" >/dev/null
  fi

  # Required status checks differ per repo (must match Actions job names).
  local checks_json='[]'
  case "${repo}" in
    kalke)
      checks_json='[{"context":"Lint & build"}]'
      ;;
    kalke-auth)
      checks_json='[{"context":"Validate realm"},{"context":"Docker build"}]'
      ;;
    e-bank-api)
      checks_json='[{"context":"Lint"},{"context":"Tests"},{"context":"Docker build"}]'
      ;;
    personal-document-extractor)
      checks_json='[{"context":"Lint and test"},{"context":"Docker build"}]'
      ;;
  esac

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

  echo "Ruleset protect-main active on ${full}"
}

for repo in "${REPOS[@]}"; do
  apply_repo "${repo}"
done

echo ""
echo "Done. main requires a PR for everyone except ${ACTOR_LOGIN} (bypass)."
echo "Verify: Settings → Rules → Rulesets on each repo, or:"
echo "  gh api repos/${OWNER}/kalke/rulesets --jq '.[].name'"
