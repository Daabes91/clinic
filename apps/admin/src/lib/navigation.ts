import type { StaffRole } from "./auth";

export type NavigationItem = {
  label: string;
  href: string;
  icon: "layout-dashboard" | "calendar" | "users" | "stethoscope" | "layers" | "folder" | "bar-chart-3" | "settings";
  roles: StaffRole[];
};

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "layout-dashboard",
    roles: ["ADMIN", "RECEPTIONIST", "DOCTOR"]
  },
  {
    label: "Appointments",
    href: "/appointments",
    icon: "calendar",
    roles: ["ADMIN", "RECEPTIONIST", "DOCTOR"]
  },
  {
    label: "Patients",
    href: "/patients",
    icon: "users",
    roles: ["ADMIN", "RECEPTIONIST"]
  },
  {
    label: "Doctors",
    href: "/doctors",
    icon: "stethoscope",
    roles: ["ADMIN"]
  },
  {
    label: "Services",
    href: "/services",
    icon: "layers",
    roles: ["ADMIN"]
  },
  {
    label: "Plans",
    href: "/plans",
    icon: "folder",
    roles: ["ADMIN", "RECEPTIONIST"]
  },
  {
    label: "Reports",
    href: "/reports",
    icon: "bar-chart-3",
    roles: ["ADMIN", "RECEPTIONIST"]
  },
  {
    label: "Settings",
    href: "/settings",
    icon: "settings",
    roles: ["ADMIN"]
  }
];

export function navigationForRole(role: StaffRole): NavigationItem[] {
  return navigationItems.filter((item) => item.roles.includes(role));
}
