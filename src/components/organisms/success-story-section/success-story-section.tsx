import Image from "next/image";
import { Tag } from "@/components/atoms/tag";
import { MetricCard } from "@/components/molecules/metric-card";
import { StatusBadge } from "@/components/molecules/status-badge";
import { successStoryContent } from "@/lib/content/projects";

export function SuccessStorySection() {
  const { sectionTitle, status, caseStudy, metrics } = successStoryContent;

  return (
    <section className="py-xl">
      <div className="flex flex-col gap-xl">
        <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-headline-lg text-on-surface">{sectionTitle}</h2>
          <StatusBadge variant={status} />
        </div>

        <div className="flex flex-col gap-md lg:flex-row">
          <article className="min-w-0 flex-[2] overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest interactive-card hover:shadow-card-hover">
            <div className="relative">
              <Image
                src={caseStudy.image.src}
                alt={caseStudy.image.alt}
                width={800}
                height={480}
                className="aspect-[5/3] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-container/95 to-transparent p-lg pt-24">
                <p className="text-label-md text-inverse-on-surface">
                  {caseStudy.badge}
                </p>
                <h3 className="mt-sm text-headline-md text-inverse-on-surface">
                  {caseStudy.title}
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-lg p-lg">
              <p className="text-body-md text-on-surface-variant">
                {caseStudy.description}
              </p>
              <div className="flex flex-wrap gap-sm">
                {caseStudy.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </article>

          <div className="flex min-w-0 flex-1 flex-col gap-md">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
