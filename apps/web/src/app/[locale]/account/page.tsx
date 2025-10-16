import Link from "next/link";
import { Container } from "@clinic/ui-kit";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default function AccountPlaceholderPage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale as Locale;

  return (
    <div className="py-16">
      <Container className="mx-auto max-w-2xl rounded-3xl border border-slate-200 p-10 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Patient portal coming soon
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Logged-in patients will manage treatment plans, view invoices, and reschedule
          visits here. Follow-up authentication flows will be connected in Phase 5.
        </p>
        <Link
          href={`/${locale}/book`}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Explore bookings
        </Link>
      </Container>
    </div>
  );
}
