# Phase 4 — Admin App (Design Notes)

## Core Objectives
- Build an authenticated shell at `apps/admin` with role-aware navigation (ADMIN, RECEPTIONIST, DOCTOR).
- Adopt shadcn/ui primitives for layout, buttons, inputs, tables, charts placeholder hooks.
- Share typography, buttons, and layout helpers via `@clinic/ui-kit` to keep parity with public web.
- Provide API client scaffolding using `NEXT_PUBLIC_ADMIN_API_BASE_URL` for staff operations.
- Prepare protected routes with server components reading staff JWT from cookies (placeholder for now).

## Route Map
- `/login` — Staff sign-in page with email/password and 2FA prompt placeholder.
- `/dashboard` — Summary cards (appointments today, pending follow-ups) plus chart placeholder.
- `/appointments` — Calendar/table toggle with filters by doctor/status.
- `/patients` — Searchable table; link to patient profile (future expand).
- `/doctors` — CRUD shell; shows schedule availability.
- `/services` — Admin CRUD for services with EN/AR fields.
- `/plans` — Treatment plans & payments overview.
- `/reports` — KPI charts with date/doctor/service filters.
- `/settings` — Clinic info, notifications, security toggles.

## Layout Layers
- Root layout handles theme (light/dark), auth guard (redirect unauthenticated to `/login`), and context providers (query client, toast).
- Side-navigation component driven by role config: ADMIN sees all, RECEPTIONIST restricted, DOCTOR sees limited menu.
- Top bar with quick actions (new appointment, notifications) and account menu.

## Auth & State Strategy
- Placeholder `getCurrentStaff` util decodes mock JWT from cookies to determine role.
- Client provider uses `@tanstack/react-query` for data fetching; `react-hook-form` for forms.
- Protect routes by checking `currentStaff` inside `layout.tsx`, redirecting to `/login` if absent.
- Introduce `withRole` helper component to render children when role matches.

## UI Kit Extensions
- Add `AdminSection` wrapper, `StatCard` component, and `DataTable` placeholder into `@clinic/ui-kit`.
- Prepare token naming consistent with Tailwind design tokens.

## Integration Notes
- API client functions live under `apps/admin/src/lib/api-client.ts`; share DTOs across modules eventually.
- Environment variables: `NEXT_PUBLIC_ADMIN_API_BASE_URL`, `NEXT_PUBLIC_ANALYTICS_DISABLED`.
- All fetches add `credentials: "include"` to send HttpOnly cookie.
