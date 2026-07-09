"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils/cn";

type AdminNavLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  compact?: boolean;
};

export function AdminNavLink({ href, label, icon, isActive, compact }: AdminNavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-sm rounded-button px-md py-sm text-body-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
        isActive
          ? "bg-primary text-on-primary"
          : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
        compact && "shrink-0 whitespace-nowrap",
      )}
    >
      <Icon icon={icon} size="sm" aria-hidden />
      {label}
    </Link>
  );
}
