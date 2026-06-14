import type { LucideIcon } from "lucide-react";
import { Zap } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils/cn";

export type MetricCardData = {
  label: string;
  value: string;
  description: string;
  variant?: "dark" | "light" | "muted";
  icon?: "zap";
};

type MetricCardProps = {
  metric: MetricCardData;
  className?: string;
};

const iconMap: Record<NonNullable<MetricCardData["icon"]>, LucideIcon> = {
  zap: Zap,
};

export function MetricCard({ metric, className }: MetricCardProps) {
  const variant = metric.variant ?? "light";
  const MetricIcon = metric.icon ? iconMap[metric.icon] : null;

  return (
    <article
      className={cn(
        "flex h-full flex-col justify-between rounded-card border p-lg interactive-card hover:shadow-card-hover",
        variant === "dark" && "border-primary-container bg-primary text-on-primary",
        variant === "light" &&
          "border-outline-variant bg-surface-container-lowest",
        variant === "muted" &&
          "border-outline-variant bg-surface-container text-on-surface",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-md">
        <p
          className={cn(
            "text-label-md normal-case",
            variant === "dark"
              ? "text-on-primary/80"
              : "text-on-surface-variant",
          )}
        >
          {metric.label}
        </p>
        {MetricIcon ? (
          <Icon
            icon={MetricIcon}
            size="sm"
            className="text-on-tertiary-container"
          />
        ) : null}
      </div>

      <div className="mt-md flex flex-col gap-sm">
        <p className="text-headline-lg">{metric.value}</p>
        <p
          className={cn(
            "text-body-sm",
            variant === "dark"
              ? "text-on-primary/80"
              : "text-on-surface-variant",
          )}
        >
          {metric.description}
        </p>
      </div>
    </article>
  );
}
