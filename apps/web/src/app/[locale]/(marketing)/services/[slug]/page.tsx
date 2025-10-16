import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@clinic/ui-kit";
import {
  fetchDoctorsByService,
  fetchServiceBySlug
} from "@/lib/api-client";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

type PageParams = { locale: string; slug: string };

export async function generateMetadata({
  params
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { locale, slug } = params;
  if (!isLocale(locale)) {
    return {};
  }

  try {
    const service = await fetchServiceBySlug(locale, slug);
    return {
      title: `${service.name} — Clinic`,
      description: service.summary
    };
  } catch {
    return {};
  }
}

export default async function ServiceDetailPage({
  params
}: {
  params: PageParams;
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale as Locale;

  try {
    const service = await fetchServiceBySlug(locale, params.slug);
    const doctors = await fetchDoctorsByService(locale, params.slug);

    return (
      <div className="bg-gradient-to-b from-white to-blue-50 py-12">
        <Container className="grid gap-12 lg:grid-cols-3">
          <article className="lg:col-span-2 space-y-6 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-blue-100">
            <p className="text-xs uppercase tracking-widest text-blue-600">
              Dental service
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">{service.name}</h1>
            <p className="text-base text-slate-600">{service.summary}</p>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">What to expect</h2>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Initial consultation tailored to your oral health goals.</li>
                <li>• Digital imaging and diagnostics for precision planning.</li>
                <li>• Personal follow-up with reminders via WhatsApp and email.</li>
              </ul>
            </section>
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-slate-900 p-6 text-white">
              <h3 className="text-lg font-semibold">Book this treatment</h3>
              <p className="mt-2 text-sm text-slate-200">
                Select your preferred doctor and time to confirm instantly.
              </p>
              <Link
                href={`/${locale}/book?service=${params.slug}`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
              >
                Book appointment
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-slate-900">
                Doctors offering this service
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {doctors.map((doctor) => (
                  <li key={doctor.id} className="rounded-lg bg-slate-50 p-3">
                    <p className="font-medium text-slate-900">{doctor.name}</p>
                    <p className="text-xs text-slate-500">{doctor.specialty}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </div>
    );
  } catch {
    notFound();
  }
}
