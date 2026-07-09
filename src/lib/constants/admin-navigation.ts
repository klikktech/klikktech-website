import type { LucideIcon } from "lucide-react";
import { Building2, Plus } from "lucide-react";

export type AdminNavLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
};

export const adminNavLinks: AdminNavLink[] = [
  {
    label: "Tenants",
    href: "/admin",
    icon: Building2,
    isActive: (pathname) =>
      pathname === "/admin" ||
      (pathname.startsWith("/admin/tenants/") && pathname !== "/admin/tenants/new"),
  },
  {
    label: "New tenant",
    href: "/admin/tenants/new",
    icon: Plus,
    isActive: (pathname) => pathname === "/admin/tenants/new",
  },
];
