# src-next Rebuild Layer

Paralelný nový frontend pre postupný rebuild bez zásahu do `src`.

## Štruktúra
- `app`: router + app bootstrap pre novú verziu
- `shared/ui`: shadcn primitive komponenty (Button, Card, Input, Dialog, Table, ...)
- `shared/api`: wrappers na existujúce backend API kontrakty zo `src/app/api`
- `features/shared/components`: layout + reusable app komponenty
- `features/public/pages`: nové vizuálne stránky (`home`, `schedule`, `committees`, `submissions`, `root`)
- `features/auth/pages`: bridge stránky (`login`, `register`) na pôvodné funkcionality
- `features/legacy/pages`: bridge stránky (`dashboard`, `admin`) pre 100% backend parity počas migrácie
- `features/misc/pages`: utility stránky (`404`)
- `features/dashboard/components`: sekcie pre participant dashboard
- `features/admin/components`: editory pre admin settings (termíny, entry, strava, ubytovanie, program)

## Spustenie paralelnej verzie
- `npm run dev:next` a otvoriť `/index.next.html`
- `npm run build:next` pre build test novej verzie
- `./scripts/verify-src-next-parity.sh` pre automatický parity smoke check

## Poznámka
`src` ostáva nedotknutý, kým nebude potvrdená 100% funkčná parita s backendom.
