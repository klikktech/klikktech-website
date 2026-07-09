"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export type AdminSectionNavItem = {
  id: string;
  label: string;
};

type AdminSectionNavProps = {
  items: AdminSectionNavItem[];
  className?: string;
};

export function AdminSectionNav({ items, className }: AdminSectionNavProps) {
  return (
    <nav
      aria-label="Page sections"
      className={cn(
        "mb-lg flex gap-xs overflow-x-auto rounded-card border border-outline-variant bg-surface-container-low p-xs",
        className,
      )}
    >
      {items.map((item) => (
        <Link
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            "shrink-0 rounded-button px-md py-sm text-body-sm font-medium text-on-surface-variant",
            "transition-colors hover:bg-surface-container-high hover:text-on-surface",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
