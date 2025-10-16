# Phase 6 — DevOps & Deploy (Design Notes)

## Architecture Targets
- Public web (`apps/web`) and admin app (`apps/admin`) deployed via Vercel with preview builds on branches and production deploys on main tags.
- Backend API (`apps/api`) deployed to Fly.io (or AWS ECS alternative) with zero-downtime rolling deploys and Flyway migrations during release.
- Shared PostgreSQL instance provisioned via managed service (Supabase/RDS/Aiven); migrations triggered automatically from CI.
- Object storage (S3/GCS) configured for asset uploads; CDN (Vercel / CloudFront) handles static caching.

## CI/CD Strategy
- GitHub Actions pipeline orchestrating test, build, and deploy stages.
- Jobs:
  - `lint-test` (monorepo pnpm install, run lint/build checks).
  - `web-deploy` and `admin-deploy` using Vercel CLI with environment-specific tokens.
  - `api-deploy` building Docker image, running Fly.io deploy, and applying migrations.
- Use reusable workflow for branch protection (PR validation) and separate release workflow on tag pushes.
- Secrets stored in GitHub Encrypted Secrets (VERCEL_TOKEN, VERCEL_ORG_ID, etc), Fly.io secrets stored via `fly secrets set`.

## Environment Management
- Add `.env.production.example` for web/admin showing required runtime vars.
- Provide `apps/api/docker/Dockerfile` and `fly.toml` skeleton.
- Document environment toggles (`NEXT_PUBLIC_*`, JWT issuers, database URLs).

## Observability
- Enable Vercel Analytics off for admin via env flag.
- Backend: expose `/actuator/health` and integrate with Fly.io checks.
- Logging: structure with MDC (requestId, userId, role) and ship to centralized log store (Datadog/New Relic).
- Monitoring: GitHub Actions status badges, uptime checks via BetterStack.

## Release Process
- Feature branches -> PR -> CI validate.
- Merge to `main` triggers staging deployment (Fly staging app + Vercel preview alias).
- Tag `vX.Y.Z` triggers production deploy for all three apps with pre-deploy DB migration.

## Checklists To Deliver
- GitHub Actions workflows.
- Dockerfile + Fly config.
- Environment variable reference docs.
- Runbooks for deploy/rollback and post-deploy validation.
