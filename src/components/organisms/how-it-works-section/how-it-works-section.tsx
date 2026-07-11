import { ProcessTimelineStep } from "@/components/molecules/process-timeline-step";
import { homeHowItWorksContent } from "@/lib/content/home";

export function HowItWorksSection() {
  const { label, title, steps } = homeHowItWorksContent;

  return (
    <section id="how-it-works" className="scroll-mt-section pt-lg pb-xl">
      <div className="flex flex-col gap-xl lg:flex-row lg:gap-xl">
        <div className="flex min-w-0 flex-col gap-md lg:max-w-sm lg:pt-md">
          <span className="text-label-md text-on-tertiary-container">{label}</span>
          <h2 className="font-display text-headline-lg text-on-surface">{title}</h2>
          <p className="text-body-md text-on-surface-variant">
            No bloated timelines. You always know what happens next and when your
            team can expect to go live.
          </p>
        </div>

        <div className="min-w-0 flex-1">
          {steps.map((step, index) => (
            <ProcessTimelineStep
              key={step.id}
              step={step}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
