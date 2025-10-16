import Link from "next/link";
import { Container, SectionTitle } from "@clinic/ui-kit";
import { fetchDoctorsByService, fetchServices } from "@/lib/api-client";
import type { Locale } from "@/i18n/config";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function LocaleHomePage({
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

  return (
    <div className="flex flex-col gap-16 py-12">
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
              Modern dental experience
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Healthy smiles start with seamless bookings and trusted doctors.
            </h1>
            <p className="text-base text-slate-600">
              Discover tailored treatments, expert specialists, and convenient
              appointment options built for your schedule.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/book`}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Book an appointment
              </Link>
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
              >
                Explore services
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-blue-100">
            <h3 className="text-lg font-semibold text-slate-900">Why patients choose us</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Coordinated care plans tailored to every smile.</li>
              <li>• WhatsApp, email, and calendar reminders built-in.</li>
              <li>• Multilingual team ready to support Arabic & English speakers.</li>
            </ul>
          </div>
        </Container>
      </section>

      <section>
        <Container className="space-y-10">
          <SectionTitle
            eyebrow="Treatments"
            title="Featured dental services"
            description="Comprehensive care across general, cosmetic, and orthodontic specialties."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/${locale}/services/${service.slug}`}
                className="group rounded-2xl border border-slate-200 p-6 transition hover:border-blue-200 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm text-slate-600">{service.summary}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600">
                  View details →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <Container className="space-y-10">
          <SectionTitle
            eyebrow="Our team"
            title="Dentists dedicated to patient-first care"
            description="Meet the specialists behind every treatment plan."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="rounded-2xl border border-slate-700 bg-slate-800 p-6"
              >
                <h3 className="text-lg font-semibold">{doctor.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{doctor.specialty}</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-blue-200">
                  Languages: {doctor.languages.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl bg-blue-50 p-10 text-center shadow-inner">
          <h2 className="text-2xl font-semibold text-slate-900">
            Ready to transform your oral health?
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Secure your appointment in minutes and receive direct confirmation via email
            and WhatsApp.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Start booking
            </Link>
            <a
              href="tel:+971550000000"
              className="inline-flex items-center justify-center rounded-full border border-blue-200 px-6 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-300"
            >
              Call us
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
