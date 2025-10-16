import { Container } from "@clinic/ui-kit";
import { BookingWizard } from "@/components/booking-wizard";
import { fetchServices } from "@/lib/api-client";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function BookPage({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale as Locale;
  const services = await fetchServices(locale);

  const preselectedService =
    typeof searchParams?.service === "string" ? searchParams.service : undefined;

  const orderedServices = services.sort((a, b) => {
    if (preselectedService === a.slug) return -1;
    if (preselectedService === b.slug) return 1;
    return 0;
  });

  return (
    <div className="bg-slate-50 py-12">
      <Container className="space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">
            Book your appointment
          </h1>
          <p className="text-sm text-slate-500">
            Choose a service, confirm the time, and we&apos;ll send instant confirmation.
          </p>
        </div>
        <BookingWizard locale={locale} services={orderedServices} />
      </Container>
    </div>
  );
}
