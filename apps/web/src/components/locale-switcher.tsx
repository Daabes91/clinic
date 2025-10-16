"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  const buildHref = (nextLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    return segments.join("/") || "/";
  };

  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-500">
      <span className="sr-only">Select language</span>
      <select
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value as Locale;
          window.location.assign(buildHref(nextLocale));
        }}
      >
        {locales.map((availableLocale) => (
          <option key={availableLocale} value={availableLocale}>
            {availableLocale.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
