import { Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/atoms/icon";

type StatusBadgeVariant = "completed" | "ongoing";

type StatusBadgeProps = {
  variant: StatusBadgeVariant;
  className?: string;
};

const config: Record<
  StatusBadgeVariant,
  { label: string; className: string; icon: typeof Check }
> = {
  completed: {
    label: "Completed",
    className: "bg-[#e6f4ea] text-[#1e6b3a]",
    icon: Check,
  },
  ongoing: {
    label: "Ongoing",
    className: "bg-secondary-container text-on-secondary-container",
    icon: RefreshCw,
  },
};

export function StatusBadge({ variant, className }: StatusBadgeProps) {
  const { label, className: variantClassName, icon } = config[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-xs rounded-tag px-sm py-xs text-label-md normal-case",
        variantClassName,
        className,
      )}
    >
      <Icon icon={icon} size="sm" />
      {label}
    </span>
  );
}
