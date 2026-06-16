import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Icon } from "@/components/atoms/icon";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-lg">
      <ol className="flex flex-wrap items-center gap-xs text-body-sm text-on-surface-variant">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-xs">
              {index > 0 ? (
                <Icon
                  icon={ChevronRight}
                  size="sm"
                  className="text-on-surface-variant/60"
                  aria-hidden
                />
              ) : null}
              {isLast || !item.href ? (
                <span
                  className="font-medium text-on-surface"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
