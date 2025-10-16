"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/lib/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  Layers,
  Folder,
  BarChart3,
  Settings
} from "lucide-react";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  calendar: Calendar,
  users: Users,
  stethoscope: Stethoscope,
  layers: Layers,
  folder: Folder,
  "bar-chart-3": BarChart3,
  settings: Settings
} as const;

export function SidebarNav({ items }: { items: NavigationItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-5">
      <p className="px-3 text-xs uppercase tracking-widest text-white/40">
        Overview
      </p>
      <div className="space-y-1.5">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const baseClass =
            "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition";
          const stateClass = isActive
            ? "bg-white text-emerald-700 shadow-lg shadow-emerald-900/20"
            : "text-white/70 hover:bg-white/10 hover:text-white";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${baseClass} ${stateClass}`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
