# Project Phases Roadmap

## Phase 1 — Monorepo Foundations (Completed)
- Establish pnpm workspace with `apps/` (public web, admin) and `packages/` (shared UI kit).
- Scaffold shared configuration: TypeScript, ESLint, Prettier, Tailwind base presets.
- Provide environment variable contracts for each app.

## Phase 2 — Backend Namespace Split (Completed)
- Restructure Spring Boot project into public vs admin API modules.
- Introduce request/response DTO segregation and Flyway baseline.
- Add security configuration shell for JWT auth, role mapping, and CORS policies.

## Phase 3 — Public Web App (Completed)
- Implement Next.js marketing shell with i18n routing and booking flow placeholders.
- Wire Public API client, navigation, and translation scaffolding.
- Ensure ISR/SEO defaults and booking success flow skeleton.

## Phase 4 — Admin App (Completed)
- Implement Next.js (App Router) admin dashboard shell with shadcn/ui integration.
- Configure role-based layouts, navigation guards, and placeholder feature pages.
- Add calendar, reports, and finance view stubs connected to Admin API client.

## Phase 5 — Security Enhancements (Completed)
- Finalize JWT flows (patient/staff), refresh rotation, 2FA hooks, and IP allowlisting.
- Configure rate limiting, robots policies, and strict SameSite cookie settings.
- Add integration tests covering unauthorized/forbidden access paths.

## Phase 6 — DevOps & Deploy (Completed)
- Configure CI/CD pipelines per app (Vercel) and backend (Render/Fly/AWS).
- Add environment templates, secrets management guides, and health check monitoring.
- Deliver deployment runbooks and verification checklists.
