import { Avatar } from "@/components/atoms/avatar";
import type { CompactTestimonial } from "@/lib/content/contact";
import { cn } from "@/lib/utils/cn";

type CompactTestimonialCardProps = {
  testimonial: CompactTestimonial;
  className?: string;
};

export function CompactTestimonialCard({
  testimonial,
  className,
}: CompactTestimonialCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-lg rounded-card border border-outline-variant bg-surface-container-lowest p-lg interactive-card hover:shadow-card-hover",
        className,
      )}
    >
      <blockquote className="flex-1 text-body-md italic text-on-surface">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <footer className="flex items-center gap-md">
        <Avatar name={testimonial.name} alt={testimonial.name} size="sm" />
        <div className="flex flex-col gap-xs">
          <cite className="text-body-sm font-semibold not-italic text-on-surface">
            {testimonial.name}
          </cite>
          <p className="text-body-sm text-on-surface-variant">
            {testimonial.role}
          </p>
        </div>
      </footer>
    </article>
  );
}
