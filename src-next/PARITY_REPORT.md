# src-next Parity Report

Date: 2026-04-15

## Automated parity checks
Command: `./scripts/verify-src-next-parity.sh`

Result:
- PASS: Route paths match (`src/app/routes.ts` vs `src-next/app/routes.tsx`)
- PASS: Index route exists in both routers
- PASS: All API wrappers point to original `src/app/api/*` modules
- PASS: Legacy bridge pages are wired to original functional screens
- PASS: `npm run build:next` succeeds

## Route parity map
- `/` -> new `HomePage` in `src-next`
- `/committees` -> new `CommitteesPage` in `src-next`
- `/schedule` -> new `SchedulePage` in `src-next`
- `/submissions` -> new `SubmissionsPage` in `src-next`
- `/register` -> legacy bridge `RegistrationSimple`
- `/login` -> legacy bridge `Login`
- `/dashboard` -> legacy bridge `Dashboard`
- `/admin` -> legacy bridge `AdminPanel`
- `*` -> new `NotFoundPage` in `src-next`

## Backend contract parity
`src-next/shared/api/*` are direct re-exports of original API modules:
- `authApi.ts`
- `conferenceApi.ts`
- `participantApi.ts`
- `submissionApi.ts`
- `fileManagerApi.ts`
- `baseApi.ts`

This preserves endpoint paths, payload shapes, error handling, and response mapping exactly.

## Remaining blockers for 100% runtime parity proof
- Backend API runtime smoke test is not yet confirmed in this run because local API process on `http://localhost:5010` could not be started to completion in-session.
- Manual E2E verification is still required for final sign-off:
  - registration (basic + account create + existing account link)
  - login + role redirect
  - dashboard participant update + file upload + submission create/update
  - admin approvals/rejections + conference settings CRUD + program PDF download

## Migration rule status
- `frontend/src` was not replaced.
- Replacement remains blocked until manual runtime parity with backend is confirmed 100%.
