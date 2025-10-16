import { Container } from "@clinic/ui-kit";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default function PrivacyPage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale as Locale;

  return (
    <div className="py-12">
      <Container className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">Privacy policy</h1>
        <p className="text-sm text-slate-600">
          We process patient data exclusively to manage bookings, medical treatments, and
          communications. Data is encrypted at rest and access is role-restricted to staff
          within the admin application.
        </p>
        <p className="text-sm text-slate-600">
          WhatsApp integrations are powered by vetted providers with signed business
          agreements. Email confirmations are sent through HIPAA-compliant transactional
          email services. Patients can request data deletion by contacting our reception
          team.
        </p>
      </Container>
    </div>
  );
}
