import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defaultLocale, locales } from "./i18n.config";

const publicFile = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.includes("/api/") || publicFile.test(pathname)) {
    return NextResponse.next();
  }

  const localeFromPath = pathname.split("/")[1];

  if (locales.includes(localeFromPath)) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
};
