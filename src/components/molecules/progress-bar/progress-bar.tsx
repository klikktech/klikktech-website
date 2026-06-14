import { cn } from "@/lib/utils/cn";

type ProgressBarProps = {
  value: number;
  className?: string;
  "aria-label"?: string;
};

export function ProgressBar({
  value,
  className,
  "aria-label": ariaLabel = "Project progress",
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedValue}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-surface-container-high",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-on-tertiary-container transition-all duration-300"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
