import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { ProgressBar } from "@/components/molecules/progress-bar";
import { StatusBadge } from "@/components/molecules/status-badge";
import { innovationContent } from "@/lib/content/projects";
import { cn } from "@/lib/utils/cn";

export function InnovationSection() {
  const { sectionTitle, status, project } = innovationContent;

  return (
    <section className="pb-xl">
      <div className="flex flex-col gap-xl">
        <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-headline-lg text-on-surface">{sectionTitle}</h2>
          <StatusBadge variant={status} />
        </div>

        <article className="overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest interactive-card hover:shadow-card-hover">
          <div className="flex flex-col lg:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-lg p-lg">
              <div className="flex items-center gap-sm text-on-tertiary-container">
                <Icon icon={Bot} size="sm" />
                <span className="text-label-md normal-case">
                  {project.badge}
                </span>
              </div>

              <div className="flex flex-col gap-sm">
                <h3 className="text-headline-md text-on-surface">
                  {project.title}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-col gap-sm">
                <ProgressBar value={project.progress} aria-label="Project completion progress" />
                <p className="text-body-sm text-on-surface-variant">
                  {project.milestone}
                </p>
              </div>

              <Link
                href={project.cta.href}
                className={cn(
                  "inline-flex w-fit items-center gap-sm rounded-button bg-primary px-lg py-sm",
                  "text-button text-on-primary transition-colors duration-150 hover:bg-on-surface",
                )}
              >
                {project.cta.label}
                <Icon icon={ArrowRight} size="sm" />
              </Link>
            </div>

            <div className="relative min-h-72 min-w-0 flex-1 border-t border-outline-variant lg:min-h-full lg:border-l lg:border-t-0">
              <Image
                src={project.image.src}
                alt={project.image.alt}
                width={480}
                height={480}
                className="h-full min-h-72 w-full object-cover lg:min-h-full"
              />
              <div className="absolute bottom-md left-md max-w-xs rounded-card border border-outline-variant bg-surface-container-lowest p-md shadow-card-hover">
                <p className="text-body-sm text-on-surface">
                  {project.overlay.text}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
