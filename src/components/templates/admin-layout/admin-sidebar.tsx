"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminNavLink } from "@/components/molecules/admin-nav-link";
import { adminNavLinks } from "@/lib/constants/admin-navigation";
import { siteConfig } from "@/lib/constants/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-outline-variant bg-surface-container-low lg:flex">
      <div className="border-b border-outline-variant px-lg py-md">
        <Link
          href="/admin"
          className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2"
        >
          <Image
            src={siteConfig.logo.src}
            alt={siteConfig.logo.alt}
            width={siteConfig.logo.width}
            height={siteConfig.logo.height}
            className="h-7 w-auto"
          />
        </Link>
        <p className="mt-sm text-label-md text-on-surface-variant">Super admin</p>
      </div>
      <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-xs p-md">
        {adminNavLinks.map((link) => (
          <AdminNavLink
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            isActive={link.isActive(pathname)}
          />
        ))}
      </nav>
      <div className="border-t border-outline-variant p-md">
        <Link
          href="/"
          className="text-body-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
