import { TestimonialCard } from "@/components/molecules/testimonial-card";
import { homeTestimonialsContent } from "@/lib/content/home";

export function TestimonialsSection() {
  const { title, description, items } = homeTestimonialsContent;

  return (
    <section className="py-xl">
      <div className="flex flex-col gap-xl">
        <div className="mx-auto flex max-w-2xl flex-col gap-md text-center">
          <h2 className="text-headline-lg text-on-surface">{title}</h2>
          <p className="text-body-md text-on-surface-variant">{description}</p>
        </div>

        <div className="flex flex-col gap-md lg:flex-row">
          {items.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              className="min-w-0 flex-1"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
