import Link from "next/link";
import type { ReactNode } from "react";
import { navigationForRole } from "@/lib/navigation";
import type { StaffUser } from "@/lib/auth";
import { SidebarNav } from "./sidebar-nav";
import { TopBar } from "./top-bar";

export function AppShell({
  staff,
  children
}: {
  staff: StaffUser;
  children: ReactNode;
}) {
  const navItems = navigationForRole(staff.role);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-72 flex-col bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-6 pb-12 pt-10 text-white shadow-2xl md:flex">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-2 text-xl font-semibold tracking-tight"
        >
          <div className="grid h-11 w-11 place-content-center rounded-2xl bg-white/15 shadow-inner">
            <span className="text-lg">🦷</span>
          </div>
          <span>Clinic Admin</span>
        </Link>
        <p className="mt-3 text-xs text-white/60">
          Seamless day-to-day operations for your clinic staff.
        </p>
        <div className="mt-10 flex-1">
          <SidebarNav items={navItems} />
        </div>
        <div className="mt-10 space-y-3 rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-5 text-xs text-white/80">
          <p className="font-semibold text-white">Need support?</p>
          <p>
            Email{" "}
            <a href="mailto:ops@clinic.com" className="font-semibold text-white">
              ops@clinic.com
            </a>{" "}
            or chat with our operations team.
          </p>
          <button className="w-full rounded-full border border-white/30 px-4 py-2 text-xs font-medium text-white hover:border-white/60 hover:bg-white/10">
            Open help center
          </button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <TopBar staff={staff} />
        <main className="flex-1 overflow-x-hidden px-6 pb-12 pt-10 md:px-12">
          <div className="mx-auto max-w-6xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
