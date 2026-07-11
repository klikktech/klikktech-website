import type { ProcessStepItem } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

type ProcessTimelineStepProps = {
  step: ProcessStepItem;
  isLast?: boolean;
  className?: string;
};

export function ProcessTimelineStep({
  step,
  isLast = false,
  className,
}: ProcessTimelineStepProps) {
  return (
    <div className={cn("flex gap-lg", className)}>
      <div className="flex flex-col items-center">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-on-tertiary-container bg-surface-container-lowest font-display text-body-sm font-bold text-on-tertiary-container">
          {step.step}
        </span>
        {!isLast ? (
          <span className="mt-sm w-px flex-1 bg-outline-variant" aria-hidden />
        ) : null}
      </div>

      <article className="min-w-0 flex-1 pb-xl">
        <div className="flex flex-wrap items-center gap-sm">
          <h3 className="font-display text-headline-md text-on-surface">
            {step.title}
          </h3>
          <span className="rounded-tag bg-tertiary-fixed px-sm py-xs text-body-sm font-medium text-on-tertiary-fixed">
            {step.duration}
          </span>
        </div>
        <p className="mt-sm text-body-md text-on-surface-variant">
          {step.description}
        </p>
      </article>
    </div>
  );
}
