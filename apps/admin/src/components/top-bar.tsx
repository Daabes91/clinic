import Link from "next/link";
import { Search, CalendarPlus, Bell, CircleUserRound } from "lucide-react";
import type { StaffUser } from "@/lib/auth";

export function TopBar({ staff }: { staff: StaffUser }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/40 bg-white/70 px-8 backdrop-blur-md">
      <div className="hidden items-center gap-3 text-sm text-slate-600 lg:flex">
        <span className="text-xs uppercase tracking-widest text-slate-400">
          Welcome back,
        </span>
        <span className="text-base font-semibold text-slate-900">{staff.name}</span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs uppercase tracking-widest text-emerald-700">
          {staff.role}
        </span>
      </div>

      <div className="flex flex-1 items-center gap-4 lg:pl-8">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200/70 bg-white px-4 py-2 shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-200">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-300"
            placeholder="Search patients, doctors, or plans"
          />
        </div>
        <Link
          href="/appointments/new"
          className="hidden items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-500 md:inline-flex"
        >
          <CalendarPlus className="h-4 w-4" />
          New booking
        </Link>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          title="Notifications"
          type="button"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 md:flex"
          title="My account"
          type="button"
        >
          <CircleUserRound className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
