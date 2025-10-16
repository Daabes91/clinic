import Link from "next/link";
import { Container } from "@clinic/ui-kit";
import type { Locale } from "@/i18n/config";

export default function LocaleNotFound() {
  return (
    <div className="py-24">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for might have moved or no longer exists.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Back to home
        </Link>
      </Container>
    </div>
  );
}
