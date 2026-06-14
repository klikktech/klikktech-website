import { cn } from "@/lib/utils/cn";

type TagProps = React.HTMLAttributes<HTMLSpanElement>;

export function Tag({ className, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-tag bg-surface-container px-sm py-xs",
        "text-label-md text-on-surface-variant normal-case",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
