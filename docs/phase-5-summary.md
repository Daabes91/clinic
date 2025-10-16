# Phase 5 — Security Enhancements (Completed)

## Deliverables
- Replaced JWT placeholders with RSA-backed verification using Nimbus JOSE, audience/issuer checks, and role normalization (`RsaJwtVerifier`).
- Centralised security configuration via `SecurityProperties`, wiring CORS origins, rate limits, refresh TTL, and admin IP allowlist.
- Added Bucket4j-based rate limiting filter and admin IP filter to guard auth and booking endpoints, respecting `X-Forwarded-For` when behind proxies.
- Hardened Spring Security headers (CSP, HSTS, referrer policy, permissions policy) and mirrored them in both Next.js apps via global response headers.
- Introduced TOTP verification service for staff 2FA flows and sample env variables for RSA keys, rate limits, and allowlists.
- Updated UI clients to include credentials on fetch requests to support HttpOnly cookie strategies.

## Outstanding Tasks For Phase 6
- Wire production signing keys & refresh-token persistence, adding rotation endpoints and revocation storage.
- Implement end-to-end login flow consuming the new JWT/TOTP stack and returning HttpOnly cookies from the API.
- Extend rate limiting/metrics dashboards with observability hooks (Prometheus, structured logging) for alerting.
- Finalise CI/CD secrets management (key distribution, allowlist sync) and document operational runbooks for deployments.
