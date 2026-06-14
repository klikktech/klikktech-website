import { Brain } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils/cn";

type SatisfactionStatCardProps = {
  value: string;
  description: string;
  className?: string;
};

export function SatisfactionStatCard({
  value,
  description,
  className,
}: SatisfactionStatCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-lg rounded-card border border-outline-variant bg-surface-container-lowest p-lg interactive-card hover:shadow-card-hover",
        className,
      )}
    >
      <span className="inline-flex size-12 items-center justify-center rounded-card bg-secondary-container text-on-tertiary-container">
        <Icon icon={Brain} size="lg" aria-hidden={false} aria-label="Satisfaction metric" />
      </span>
      <div className="flex flex-col gap-sm">
        <h3 className="text-headline-md text-on-surface">{value}</h3>
        <p className="text-body-md text-on-surface-variant">{description}</p>
      </div>
    </article>
  );
}
