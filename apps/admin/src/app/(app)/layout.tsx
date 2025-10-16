import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getCurrentStaff } from "@/lib/auth";

export default async function AppLayout({
  children
}: {
  children: ReactNode;
}) {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect("/login");
  }

  return <AppShell staff={staff}>{children}</AppShell>;
}
