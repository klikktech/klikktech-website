import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/atoms/badge";
import type { ProjectPreviewItem } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

type ProjectCardProps = {
  project: ProjectPreviewItem;
  className?: string;
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link
      href={project.href}
      className={cn(
        "group flex flex-col gap-md transition-opacity hover:opacity-95",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-card border border-outline-variant interactive-card transition-shadow hover:shadow-card-hover">
        <Image
          src={project.image}
          alt={project.imageAlt}
          width={640}
          height={400}
          className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute left-md top-md">
          <Badge variant="dark">{project.badge}</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-sm">
        <h3 className="text-headline-md text-on-surface">{project.title}</h3>
        <p className="text-body-md text-on-surface-variant">
          {project.description}
        </p>
      </div>
    </Link>
  );
}
