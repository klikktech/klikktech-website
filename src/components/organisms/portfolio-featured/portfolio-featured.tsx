import { ProjectCarouselCard } from "@/components/molecules/project-carousel-card";
import { homePortfolioContent } from "@/lib/content/home";

export function PortfolioFeatured() {
  const { label, title, items } = homePortfolioContent;

  return (
    <section id="projects" className="scroll-mt-section pt-lg pb-xl">
      <div className="flex flex-col gap-xl">
        <div className="flex flex-col gap-md">
          <span className="text-label-md text-on-tertiary-container">
            {label}
          </span>
          <h2 className="font-display text-headline-lg text-on-surface">{title}</h2>
        </div>

        <div className="flex flex-col gap-xl md:flex-row">
          {items.map((project) => (
            <ProjectCarouselCard
              key={project.id}
              project={project}
              className="min-w-0 md:flex-1"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
