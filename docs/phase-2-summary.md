# Phase 2 — Backend Namespace Split (Completed)

## Deliverables
- Public vs admin module scaffolding with dedicated controllers, DTOs, and service shells (`ServiceController`, `AppointmentAdminController`).
- Spring Security configuration separating `/api/public/**` and `/api/admin/**`, wiring distinct JWT filters and CORS policies.
- Patient/staff JWT token service placeholders and authentication filters ready for real token validation.
- Centralized CORS configuration with environment-driven origins for public and admin frontends.
- Flyway baseline migration establishing core tables (patients, doctors, services, staff_users, appointments).
- Gradle dependencies aligned with the new configuration (security, actuator, validation).

## Outstanding Tasks For Phase 3
- Implement real JWT parsing/validation and integrate with token issuers.
- Introduce repositories and persistence logic backing the service layer.
- Flesh out DTO mappers and pagination/filtering for list endpoints.
- Add integration tests covering role-based authorization and namespace separation.
- Build out the booking flow endpoints (`availability`, `book`) with domain logic.
