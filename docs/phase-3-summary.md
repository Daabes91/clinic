# Phase 3 — Public Web App (Completed)

## Deliverables
- Locale-aware App Router structure with redirects, middleware, and layouts under `app/[locale]`, covering landing, services, booking, blog, contact, and legal pages.
- Shared marketing components (`SiteHeader`, `SiteFooter`, `BookingWizard`) leveraging the `@clinic/ui-kit` package.
- API client stubs with typed helpers for services, doctors, availability, and bookings that gracefully fall back to placeholder data when the public API is offline.
- Booking wizard multi-step shell prepared for service selection, scheduling, and patient details capture.
- Locale switcher, RTL support hooks, and placeholder blog content for English/Arabic experience parity.

## Outstanding Tasks For Phase 4
- Scaffold admin authentication handshake with the backend to reuse shared UI kit tokens/components.
- Extend `@clinic/ui-kit` with design system primitives (inputs, tables, badges) ready for admin dashboards.
- Implement shadcn/ui integration, navigation layout, and role-based menu guards in the admin app.
- Connect to live API endpoints once persistence layer is available (services, appointments).
- Prepare Cypress/Playwright smoke tests covering booking happy path and locale toggling.
