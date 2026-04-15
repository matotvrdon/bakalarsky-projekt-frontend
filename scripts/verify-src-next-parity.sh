#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

pass() { printf 'PASS: %s\n' "$1"; }
fail() { printf 'FAIL: %s\n' "$1"; exit 1; }

extract_child_routes() {
  local file="$1"
  rg -o 'path: "[^"]+"' "$file" | sed -E 's/path: "([^"]+)"/\1/' | grep -v '^/$' | sort -u
}

has_index_route() {
  local file="$1"
  rg -q 'index:\s*true' "$file"
}

old_routes="$(extract_child_routes src/app/routes.ts)"
new_routes="$(extract_child_routes src-next/app/routes.tsx)"

if [[ "$old_routes" != "$new_routes" ]]; then
  printf 'Old routes:\n%s\n' "$old_routes"
  printf 'New routes:\n%s\n' "$new_routes"
  fail "Route paths differ between src and src-next"
fi
pass "Route paths match"

if ! has_index_route src/app/routes.ts; then
  fail "Old router is missing index route"
fi
if ! has_index_route src-next/app/routes.tsx; then
  fail "New router is missing index route"
fi
pass "Index route exists in both routers"

check_wrapper() {
  local wrapper="$1"
  local target="$2"
  if ! rg -q "export \* from \"${target}\";" "$wrapper"; then
    fail "Missing wrapper export: $wrapper -> $target"
  fi
}

check_wrapper src-next/shared/api/base-api.ts '../../../src/app/api/baseApi.ts'
check_wrapper src-next/shared/api/auth-api.ts '../../../src/app/api/authApi.ts'
check_wrapper src-next/shared/api/conference-api.ts '../../../src/app/api/conferenceApi.ts'
check_wrapper src-next/shared/api/participant-api.ts '../../../src/app/api/participantApi.ts'
check_wrapper src-next/shared/api/submission-api.ts '../../../src/app/api/submissionApi.ts'
check_wrapper src-next/shared/api/file-manager-api.ts '../../../src/app/api/fileManagerApi.ts'
pass "All API wrappers point to original src/app/api modules"

check_bridge() {
  local file="$1"
  local expected_import="$2"
  if ! rg -q "$expected_import" "$file"; then
    fail "Bridge page import mismatch in $file"
  fi
}

check_bridge src-next/features/auth/pages/login-page.tsx 'src/app/pages/Login.tsx'
check_bridge src-next/features/auth/pages/registration-page.tsx 'src/app/pages/RegistrationSimple.tsx'
check_bridge src-next/features/legacy/pages/dashboard-page.tsx 'src/app/pages/Dashboard.tsx'
check_bridge src-next/features/legacy/pages/admin-page.tsx 'src/app/pages/AdminPanel.tsx'
pass "Legacy bridge pages are wired to original functional screens"

npm run build:next >/dev/null
pass "src-next production build succeeds"

echo "Parity automation checks passed."
