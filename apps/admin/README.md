# Admin App

Next.js admin dashboard for staff, served at `admin.<clinic>.com`.

## Phase Coverage
- Phase 1: placeholder package definition with initial dependencies.
- Phase 4: role-aware layout shell, protected routes, and API client scaffolding.

## Highlights
- Auth-protected App Router grouping with `/login` and main workspace under `/dashboard`, `/appointments`, etc.
- Navigation and layout driven by staff roles (`ADMIN`, `RECEPTIONIST`, `DOCTOR`).
- Shared UI kit cards, badges, and data table placeholders keep styling consistent with public site.
- Admin API client (`src/lib/api-client.ts`) ready for integration with `/api/admin/*` endpoints.
