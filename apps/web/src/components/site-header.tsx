import Link from "next/link";
import { Container } from "@clinic/ui-kit";
import type { Locale } from "@/i18n/config";
import { LocaleSwitcher } from "./locale-switcher";

const navItems: Array<{ label: string; path: string }> = [
  { label: "Services", path: "services" },
  { label: "Doctors", path: "services#doctors" },
  { label: "Blog", path: "blog" },
  { label: "Contact", path: "contact" }
];

export function SiteHeader({ locale }: { locale: Locale }) {
  const localePath = (segment: string) =>
    `/${locale}${segment.length ? `/${segment}` : ""}`;

  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href={localePath("")} className="text-lg font-semibold text-slate-900">
          Clinic
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={localePath(item.path)}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              prefetch
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LocaleSwitcher locale={locale} />
          <Link
            href={localePath("book")}
            className="inline-flex items-center justify-center rounded-full border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Book Appointment
          </Link>
        </div>
      </Container>
    </header>
  );
}
