import { Badge } from "@/components/atoms/badge";
import { Avatar } from "@/components/atoms/avatar";
import { cn } from "@/lib/utils/cn";

type FeaturedCaseStudyCardProps = {
  badge: string;
  quote: string;
  name: string;
  role: string;
  className?: string;
};

export function FeaturedCaseStudyCard({
  badge,
  quote,
  name,
  role,
  className,
}: FeaturedCaseStudyCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-lg rounded-card border border-outline-variant bg-surface-container-lowest p-lg interactive-card hover:shadow-card-hover",
        className,
      )}
    >
      <Badge variant="accent">{badge}</Badge>
      <blockquote className="text-headline-md text-on-surface max-lg:text-body-lg">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <footer className="mt-auto flex items-center gap-md">
        <Avatar name={name} alt={name} size="md" />
        <div className="flex flex-col gap-xs">
          <cite className="text-body-sm font-semibold not-italic text-on-surface">
            {name}
          </cite>
          <p className="text-body-sm text-on-surface-variant">{role}</p>
        </div>
      </footer>
    </article>
  );
}
