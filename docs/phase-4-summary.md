# Phase 4 — Admin App (Completed)

## Deliverables
- Role-aware application shell with protected routes under `app/(app)` redirecting unauthenticated users to `/login`.
- Navigation driven by role configuration with server-side guard (`getCurrentStaff`) and mock fallback for development.
- Dashboard, appointments, patients, doctors, services, plans, reports, and settings pages scaffolded with UI kit components and placeholders for future data integrations.
- Shared UI kit expanded with card, badge, stat, and table placeholder components to support admin UX.
- Admin API client helpers prepared with credentialed fetch wrappers and mock data for offline development.
- Auth layout and login screen providing the baseline for future password + 2FA flows.

## Outstanding Tasks For Phase 5
- Implement real JWT validation, refresh handling, and 2FA challenge for staff sessions.
- Replace mock data with live integrations to `/api/admin/*` endpoints; add optimistic updates where appropriate.
- Build calendar, data tables, and chart components (shadcn/ui + TanStack Table/Recharts) wired to API clients.
- Add end-to-end tests covering login redirects, role-based navigation, and core workflows (bookings, reports).
- Harden security headers, session timeout handling, and audit logging across admin actions.
