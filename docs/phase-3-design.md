# Phase 3 — Public Web App (Design Notes)

## Routing & Locales
- Default locale: `en`; secondary locale: `ar`.
- Locale-aware routes using Next.js App Router with `app/[locale]/` structure.
- Route coverage:
  - `/[locale]/` — Landing page.
  - `/[locale]/services` and `/[locale]/services/[slug]` — Services index/detail.
  - `/[locale]/book` — Booking flow (multi-step placeholder).
  - `/[locale]/booking/success` — Confirmation page with calendar/WhatsApp hints.
  - `/[locale]/blog` and `/[locale]/blog/[slug]` — Content placeholders.
  - `/[locale]/contact` — Contact CTA.
  - `/[locale]/account/*` — Auth-required shell for future patient portal.

## Layout & Navigation
- Shared layout provides header/footer with locale switcher.
- `@clinic/ui-kit` to host shared typography and button components; temporary placeholder components until real design assets arrive.

## API Client Strategy
- `lib/api-client.ts` exposes typed wrappers for services, doctors, availability, and booking.
- Uses `NEXT_PUBLIC_API_BASE_URL`; attaches locale header for multi-language responses.
- Placeholder responses returned when env variable is not configured (dev friendly).

## Booking Flow Placeholder
- Three-step wizard shell:
  1. Select service (fetches `GET /services`).
  2. Pick doctor/time (calls `POST /availability`).
  3. Enter patient info and submit `POST /book`.
- For Phase 3, forms are static with TODO markers for validation/integration.

## Tailwind & Metadata
- Global styles include light/RTL support toggled via locale metadata.
- Metadata per page for SEO; blog/service detail uses dynamic metadata builder.

