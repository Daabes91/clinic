import { Container } from "@clinic/ui-kit";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default function ContactPage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale as Locale;

  return (
    <div className="bg-slate-50 py-12">
      <Container className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-slate-900">
            Schedule a visit or ask a question
          </h1>
          <p className="text-sm text-slate-600">
            Reach our reception team via WhatsApp, phone, or the contact form below.
            We respond within one business hour.
          </p>
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Call</h2>
              <p className="text-sm text-slate-600">+971 55 000 0000</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">WhatsApp</h2>
              <p className="text-sm text-slate-600">+971 55 000 0000</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Email</h2>
              <p className="text-sm text-slate-600">hello@clinic.com</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Visit</h2>
              <p className="text-sm text-slate-600">
                123 Smile Avenue, Downtown Dubai, UAE
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500">
              Full name
            </label>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500">
              Message
            </label>
            <textarea
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="How can we help?"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Submit
          </button>
        </form>
      </Container>
    </div>
  );
}
