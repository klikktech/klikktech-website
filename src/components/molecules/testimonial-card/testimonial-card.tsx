import { Star } from "lucide-react";
import { Avatar } from "@/components/atoms/avatar";
import { Icon } from "@/components/atoms/icon";
import type { TestimonialItem } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

type TestimonialCardProps = {
  testimonial: TestimonialItem;
  className?: string;
};

export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-lg rounded-card border border-outline-variant bg-surface-container-lowest p-lg interactive-card hover:shadow-card-hover",
        className,
      )}
    >
      <div className="flex items-center gap-xs text-on-tertiary-container">
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon key={index} icon={Star} size="sm" className="fill-current" />
        ))}
      </div>

      <blockquote className="flex-1 text-body-md italic text-on-surface">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <footer className="flex items-center gap-md">
        <Avatar name={testimonial.name} alt={testimonial.name} size="md" />
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
