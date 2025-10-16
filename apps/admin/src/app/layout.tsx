import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/components/providers";

const title = {
  default: "Clinic Admin",
  template: "%s | Clinic Admin"
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://admin.example-clinic.com"),
  title,
  description: "Internal operations portal for clinic staff.",
  openGraph: {
    title,
    description: "Manage appointments, treatment plans, and clinic operations.",
    url: "/",
    siteName: "Clinic Admin",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-100 text-slate-900 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
