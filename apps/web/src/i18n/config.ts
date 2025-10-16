import { defaultLocale, locales } from "../../i18n.config";

export { defaultLocale, locales };

export type Locale = (typeof locales)[number];

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && locales.includes(value as Locale);
}
