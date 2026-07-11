import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Bot, Globe, MessageSquareText, Star } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { Tag } from "@/components/atoms/tag";
import type { HeroFeatureItem } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

const iconMap: Record<HeroFeatureItem["icon"], LucideIcon> = {
  web: Globe,
  reviews: Star,
  chatbot: Bot,
  seo: MessageSquareText,
};

type ServiceOfferingCardProps = {
  feature: HeroFeatureItem;
  index: number;
  className?: string;
};

export function ServiceOfferingCard({
  feature,
  index,
  className,
}: ServiceOfferingCardProps) {
  const FeatureIcon = iconMap[feature.icon];
  const stepLabel = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "group flex min-w-0 flex-col gap-md border-l-4 border-on-tertiary-container bg-surface-container-lowest p-lg transition-shadow hover:shadow-card-hover",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-md">
        <span className="font-label text-on-tertiary-container">{stepLabel}</span>
        <span className="inline-flex size-9 items-center justify-center rounded-button bg-secondary-container text-on-tertiary-container">
          <Icon icon={FeatureIcon} size="sm" />
        </span>
      </div>

      <h3 className="font-display text-headline-md text-on-surface">
        {feature.title}
      </h3>

      <p className="text-body-md text-on-surface-variant">{feature.description}</p>

      {feature.tags?.length ? (
        <div className="flex flex-wrap gap-sm">
          {feature.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      ) : null}

      <Link
        href={feature.href}
        className="mt-auto inline-flex items-center gap-xs text-body-sm font-semibold text-on-tertiary-container transition-opacity hover:opacity-70"
      >
        Explore
        <Icon icon={ArrowRight} size="sm" />
      </Link>
    </article>
  );
}
