import type { Metadata } from "next";
import { defaultLocale } from "@/i18n/config";
import "../styles/globals.css";

const title = {
  default: "Clinic — Exceptional Dental Care",
  template: "%s | Clinic"
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.example-clinic.com"),
  title,
  description:
    "Clinic marketing and booking experience for prospective and returning patients.",
  openGraph: {
    title,
    description:
      "Discover our dental services, doctors, and effortless booking experience.",
    url: "/",
    siteName: "Clinic",
    locale: defaultLocale,
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
