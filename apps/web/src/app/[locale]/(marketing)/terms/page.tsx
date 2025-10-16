import { Container } from "@clinic/ui-kit";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default function TermsPage({
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
        <h1 className="text-3xl font-semibold text-slate-900">Terms & conditions</h1>
        <p className="text-sm text-slate-600">
          Appointment times are reserved exclusively for you. Please notify us at least 24
          hours in advance to reschedule or cancel to avoid a fee.
        </p>
        <p className="text-sm text-slate-600">
          Clinical recommendations are provided by licensed dentists following an in-person
          assessment. The booking platform facilitates appointments and reminders but does
          not replace medical advice.
        </p>
      </Container>
    </div>
  );
}
