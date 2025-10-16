# Clinic Platform Monorepo

This repository hosts the multi-app clinic platform split into public web, admin, and backend services with a shared UI kit.

## Structure
- `apps/web` — Patient-facing Next.js app.
- `apps/admin` — Staff-facing Next.js app.
- `apps/api` — Spring Boot backend exposing public/admin API namespaces.
- `packages/ui-kit` — Shared component library consumed by both web apps.

See `docs/project-phases.md` for the phased delivery plan.

