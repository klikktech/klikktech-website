import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "accent" | "success" | "info" | "dark";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-container-low text-on-surface-variant",
  accent: "bg-secondary-container text-on-secondary-container",
  success: "bg-[#e6f4ea] text-[#1e6b3a]",
  info: "bg-tertiary-fixed text-on-tertiary-fixed",
  dark: "bg-primary-container text-inverse-on-surface",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-xs rounded-tag px-sm py-xs text-label-md normal-case",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
