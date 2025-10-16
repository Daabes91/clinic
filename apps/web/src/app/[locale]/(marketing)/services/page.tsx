import Link from "next/link";
import { Container, SectionTitle } from "@clinic/ui-kit";
import {
  fetchDoctorsByService,
  fetchServices,
  type ClinicService
} from "@/lib/api-client";
import type { Locale } from "@/i18n/config";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function ServicesPage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale as Locale;
  const services = await fetchServices(locale);
  const doctors = await fetchDoctorsByService(locale);

  const doctorsByService: Record<string, number> = services.reduce(
    (acc, service) => {
      acc[service.slug] = doctors.length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="py-12">
      <Container className="space-y-12">
        <SectionTitle
          eyebrow="Our treatments"
          title="Explore treatments designed around your goals"
          description="Every service includes a comprehensive consultation and follow-up."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.slug}
              locale={locale}
              service={service}
              doctorCount={doctorsByService[service.slug] ?? 0}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

function ServiceCard({
  locale,
  service,
  doctorCount
}: {
  locale: Locale;
  service: ClinicService;
  doctorCount: number;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 p-6 transition hover:border-blue-200 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
      <p className="mt-3 flex-1 text-sm text-slate-600">{service.summary}</p>
      <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-widest text-slate-400">
        <span>{doctorCount} doctors available</span>
        <Link
          href={`/${locale}/services/${service.slug}`}
          className="text-blue-600 hover:text-blue-700"
        >
          Learn more
        </Link>
      </div>
    </article>
  );
}
