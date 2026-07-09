"use client";

import { usePathname } from "next/navigation";
import { AdminNavLink } from "@/components/molecules/admin-nav-link";
import { adminNavLinks } from "@/lib/constants/admin-navigation";

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin navigation"
      className="flex gap-xs overflow-x-auto border-b border-outline-variant bg-surface-container-low px-md py-sm lg:hidden"
    >
      {adminNavLinks.map((link) => (
        <AdminNavLink
          key={link.href}
          href={link.href}
          label={link.label}
          icon={link.icon}
          isActive={link.isActive(pathname)}
          compact
        />
      ))}
    </nav>
  );
}
