# Phase 6 — DevOps & Deploy (Completed)

## Deliverables
- GitHub Actions pipelines for CI (lint/tests), staging deploys on `main`, and production releases on semantic tags (`.github/workflows/*.yml`).
- Dockerised Spring Boot API with Fly.io configuration for production and staging (`apps/api/Dockerfile`, `apps/api/fly.toml`, `apps/api/fly.staging.toml`).
- Environment templates for public web, admin app, and API outlining required secrets and feature flags (`apps/web/.env.production.example`, `apps/admin/.env.production.example`, `apps/api/.env.example`).
- Deployment runbook documenting prereqs, release flow, rollback steps, and monitoring strategy (`docs/deployment-runbook.md`).
- Hardened Next.js security headers aligned with backend policies (`apps/web/next.config.mjs`, `apps/admin/next.config.mjs`).

## Outcomes
- Consistent multi-app deployment process with automated checks and migrations.
- Clear separation of staging vs production environments with dedicated Fly.io apps and Vercel configs.
- Ready-to-configure secrets management and monitoring hooks for ongoing operations.

