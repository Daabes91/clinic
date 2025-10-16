import Link from "next/link";
import { Container } from "@clinic/ui-kit";
import type { Locale } from "@/i18n/config";

export function SiteFooter({ locale }: { locale: Locale }) {
  const localePath = (segment: string) =>
    `/${locale}${segment.length ? `/${segment}` : ""}`;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-50 py-12">
      <Container className="grid gap-8 md:grid-cols-3">
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900">Clinic</h3>
          <p className="text-sm text-slate-600">
            Modern dental care with patient-first booking and follow-up.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link href={localePath("services")} className="hover:text-slate-900">
                Services
              </Link>
            </li>
            <li>
              <Link href={localePath("blog")} className="hover:text-slate-900">
                Blog
              </Link>
            </li>
            <li>
              <Link href={localePath("contact")} className="hover:text-slate-900">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Visit Us</h4>
          <p className="mt-3 text-sm text-slate-600">
            123 Smile Avenue,
            <br />
            Downtown Dubai, UAE
          </p>
          <p className="mt-2 text-sm text-slate-600">
            +971 55 000 0000
            <br />
            hello@clinic.com
          </p>
        </div>
      </Container>
      <Container className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row">
        <p>© {year} Clinic. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href={localePath("privacy")} className="hover:text-slate-900">
            Privacy
          </Link>
          <Link href={localePath("terms")} className="hover:text-slate-900">
            Terms
          </Link>
        </div>
      </Container>
    </footer>
  );
}
