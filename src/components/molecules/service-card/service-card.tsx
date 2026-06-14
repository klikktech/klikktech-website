import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Code2,
  Headphones,
  Search,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { Tag } from "@/components/atoms/tag";
import type { ServicePreviewItem } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

const iconMap: Record<ServicePreviewItem["icon"], LucideIcon> = {
  web: Code2,
  chatbot: Bot,
  seo: Search,
  support: Headphones,
};

type ServiceCardProps = {
  service: ServicePreviewItem;
  className?: string;
};

export function ServiceCard({ service, className }: ServiceCardProps) {
  const isDark = service.variant === "dark";
  const ServiceIcon = iconMap[service.icon];

  return (
    <article
      className={cn(
        "group interactive-card flex h-full w-full min-w-0 flex-col rounded-card border p-lg hover:shadow-card-hover",
        isDark
          ? "border-primary-container bg-primary-container text-inverse-on-surface"
          : "border-outline-variant bg-surface-container-lowest",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-md">
        <Icon
          icon={ServiceIcon}
          size="lg"
          className={isDark ? "text-on-tertiary-container" : "text-on-surface"}
        />
        <div className="flex min-w-0 w-full flex-col gap-sm">
          <h3
            className={cn(
              "w-full text-headline-md",
              isDark ? "text-inverse-on-surface" : "text-on-surface",
            )}
          >
            {service.title}
          </h3>
          <p
            className={cn(
              "w-full text-body-md",
              isDark ? "text-on-primary-container" : "text-on-surface-variant",
            )}
          >
            {service.description}
          </p>
        </div>
      </div>

      {service.tags?.length ? (
        <div className="mt-lg flex flex-wrap gap-sm">
          {service.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      ) : null}

      {service.ctaLabel ? (
        <Link
          href={service.href}
          className="mt-lg inline-flex items-center gap-xs text-label-md text-inverse-on-surface normal-case transition-opacity hover:opacity-80"
        >
          {service.ctaLabel}
          <Icon icon={ArrowRight} size="sm" />
        </Link>
      ) : null}
    </article>
  );
}
