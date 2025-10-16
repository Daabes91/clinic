# Phase 5 — Security Enhancements (Design Notes)

## Goals
- Replace placeholder JWT parsing with signed token validation (patient & staff) using public keys.
- Introduce refresh-token rotation endpoints and cookie strategies aligned with domain separation.
- Harden HTTP security headers for both Next.js apps and backend responses.
- Add basic rate limiting around high-risk endpoints (`/api/public/auth/*`, `/api/public/book`, `/api/admin/auth/*`).
- Wire 2FA hooks for staff login to enforce TOTP challenge when enabled.
- Document IP allowlisting strategy for admin API and staging environments.

## Backend Tasks
- Add `nimbus-jose-jwt` dependency and implement `JwtVerifier` with RSA public keys loaded from environment (`SECURITY_PATIENT_JWK`, `SECURITY_STAFF_JWK`).
- Introduce `StaffTwoFactorService` placeholder that checks a TOTP secret stored with `staff_users`.
- Implement `/api/admin/auth/login` with username/password + optional TOTP; issue signed access & refresh tokens.
- Create refresh endpoint `/api/admin/auth/refresh` rotating tokens and invalidating previous refresh IDs.
- Add `RateLimiterFilter` using token bucket (bucket4j) keyed on IP + endpoint.
- Expose security configuration properties via `SecurityProperties` (CORS, cookies, allowed origins, ip-allowlist).

## Frontend Tasks
- Next.js admin: update login page to call new auth endpoint and handle TOTP step; store session cookie via `HttpOnly` set-cookie.
- Public web: ensure booking submits include CSRF token header for authenticated flows; leverage `next/headers` middleware for SameSite configuration.
- Apply `next-safe-middleware` or custom headers to set CSP, X-Frame-Options, Referrer-Policy.

## DevOps
- Provide `.env` examples covering RSA public keys, rate limiting, CORS origins, IP allowlists.
- Document how to rotate keys and manage refresh token store (PostgreSQL table).

## Testing Strategy
- Unit tests for JWT verifier success/failure states.
- Integration tests verifying:
  - Unauthorized access blocked without valid token.
  - Role mismatch returns 403.
  - Refresh token rotation invalidates prior token.
  - Rate limiter responds with 429 after threshold.
- Manual test checklist for admin login with TOTP and public booking flows.
