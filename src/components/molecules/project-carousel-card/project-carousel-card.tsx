import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Icon } from "@/components/atoms/icon";
import { ProjectCarousel } from "@/components/molecules/project-carousel";
import type { ProjectPreviewItem } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

type ProjectCarouselCardProps = {
  project: ProjectPreviewItem;
  className?: string;
};

export function ProjectCarouselCard({
  project,
  className,
}: ProjectCarouselCardProps) {
  if (project.upcoming) {
    return (
      <article className={cn("flex flex-col gap-md", className)}>
        {/* Upcoming placeholder — mirrors the carousel card height */}
        <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-lg rounded-card border border-dashed border-outline-variant bg-surface-container-low">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
            <Icon icon={Clock} size="lg" />
          </span>
          <div className="flex flex-col items-center gap-sm text-center">
            <p className="text-label-md text-on-tertiary-container normal-case">
              In Development
            </p>
            <p className="max-w-[200px] text-body-sm text-on-surface-variant">
              Stay tuned — this project is on its way.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-sm">
          <Badge variant="accent">{project.badge}</Badge>
          <h3 className="text-headline-md text-on-surface">{project.title}</h3>
          <p className="text-body-md text-on-surface-variant">
            {project.description}
          </p>
          <Link
            href={project.href}
            className={cn(
              "mt-xs inline-flex w-fit items-center gap-xs text-label-md text-on-surface normal-case",
              "transition-opacity duration-150 hover:opacity-70",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2 rounded-button",
            )}
          >
            Get in touch
            <Icon icon={ArrowRight} size="sm" />
          </Link>
        </div>
      </article>
    );
  }

  const images =
    project.images && project.images.length > 0
      ? project.images
      : [{ src: project.image, alt: project.imageAlt }];

  return (
    <article className={cn("flex flex-col gap-md", className)}>
      <ProjectCarousel images={images} />

      <div className="flex flex-col gap-sm">
        <Badge variant="dark">{project.badge}</Badge>
        <h3 className="text-headline-md text-on-surface">{project.title}</h3>
        <p className="text-body-md text-on-surface-variant">
          {project.description}
        </p>
        <Link
          href={project.href}
          className={cn(
            "mt-xs inline-flex w-fit items-center gap-xs text-label-md text-on-surface normal-case",
            "transition-opacity duration-150 hover:opacity-70",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2 rounded-button",
          )}
        >
          View project
          <Icon icon={ArrowRight} size="sm" />
        </Link>
      </div>
    </article>
  );
}
