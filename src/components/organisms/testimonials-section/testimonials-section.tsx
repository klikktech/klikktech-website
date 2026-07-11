import { TestimonialCard } from "@/components/molecules/testimonial-card";
import { homeTestimonialsContent } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

export function TestimonialsSection() {
  const { label, title, description, items } = homeTestimonialsContent;

  return (
    <section id="reviews" className="scroll-mt-section pt-lg pb-xl">
      <div className="flex flex-col gap-xl">
        <div className="flex max-w-2xl flex-col gap-md">
          <span className="text-label-md text-on-tertiary-container">{label}</span>
          <h2 className="font-display text-headline-lg text-on-surface">{title}</h2>
          <p className="text-body-md text-on-surface-variant">{description}</p>
        </div>

        <div className="flex flex-col gap-md lg:flex-row">
          {items.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              className={cn(
                "min-w-0 flex-1",
                index === 1 && "lg:translate-y-6",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
