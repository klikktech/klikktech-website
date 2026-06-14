import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type IconSize = "sm" | "md" | "lg";

type IconProps = {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
};

const sizeStyles: Record<IconSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export function Icon({
  icon: IconComponent,
  size = "md",
  className,
  "aria-hidden": ariaHidden = true,
  "aria-label": ariaLabel,
}: IconProps) {
  return (
    <IconComponent
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={cn("shrink-0", sizeStyles[size], className)}
    />
  );
}
