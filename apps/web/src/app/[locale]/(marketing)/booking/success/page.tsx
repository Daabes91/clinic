import Link from "next/link";
import { Container } from "@clinic/ui-kit";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default function BookingSuccessPage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale as Locale;

  return (
    <div className="bg-white py-20">
      <Container className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-blue-100 bg-blue-50 p-10 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
          ✓
        </span>
        <h1 className="text-2xl font-semibold text-slate-900">
          Appointment confirmed!
        </h1>
        <p className="text-sm text-slate-600">
          Check your inbox and WhatsApp for confirmation details. Add the visit to your
          calendar to stay on track.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-300"
          >
            Add to calendar (ICS)
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-300"
          >
            View WhatsApp confirmation
          </a>
        </div>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Return home
        </Link>
      </Container>
    </div>
  );
}
