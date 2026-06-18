import Image from "next/image";
import Link from "next/link";
import { Check, Code2, LineChart } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Icon } from "@/components/atoms/icon";
import { MetricCard } from "@/components/molecules/metric-card";
import { servicesBentoContent } from "@/lib/content/services";
import { cn } from "@/lib/utils/cn";

const techStack = ["Next.js", "React", "Angular", "TypeScript", "Node.js", "Python Flask", "FastAPI", "PostgreSQL", "Tailwind CSS", "AWS", "GCP", "Gemini Enterprise"];

const webAppDeliverables = [
  "Full project discovery and architecture planning",
  "Responsive UI built to your brand guidelines",
  "REST or GraphQL API with secure authentication",
  "Performance-optimised, Lighthouse 90+ score",
  "Deployment setup with CI/CD pipeline",
  "30-day post-launch support included",
];

export function ServicesBentoGrid() {
  const { webApplications, metrics, chatbots, seo, cta } = servicesBentoContent;

  return (
    <section className="py-xl">
      <div className="flex flex-col gap-md">

        {/* Row 1: Web Applications + Metrics */}
        <div className="flex flex-col gap-md lg:flex-row">
          <article className="flex min-w-0 flex-[2] flex-col overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest interactive-card hover:shadow-card-hover">
            <div className="flex flex-col gap-lg p-lg">

              {/* Header */}
              <div className="flex items-start gap-md">
                <Icon icon={Code2} size="lg" className="text-on-surface" />
                <div className="flex flex-col gap-sm">
                  <h2 className="text-headline-md text-on-surface">
                    {webApplications.title}
                  </h2>
                  <p className="text-body-md text-on-surface-variant">
                    {webApplications.description}
                  </p>
                </div>
              </div>

              {/* Feature tiles */}
              <div className="flex flex-col gap-md sm:flex-row sm:flex-wrap">
                {webApplications.features.map((feature) => (
                  <div
                    key={feature.title}
                    className="min-w-0 rounded-card border border-outline-variant bg-surface-container-low p-md sm:flex-[1_1_calc(50%-8px)]"
                  >
                    <h3 className="text-body-md font-semibold text-on-surface">
                      {feature.title}
                    </h3>
                    <p className="mt-sm text-body-sm text-on-surface-variant">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tech stack */}
              <div className="flex flex-col gap-sm">
                <p className="text-label-md text-on-surface-variant">Tech Stack</p>
                <div className="flex flex-wrap gap-sm">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-tag border border-outline-variant bg-surface-container px-sm py-xs text-label-md text-on-surface-variant normal-case"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-outline-variant" />

              {/* What you get checklist */}
              <div className="flex flex-col gap-sm">
                <p className="text-label-md text-on-surface-variant">What's Included</p>
                <ul className="grid grid-cols-1 gap-sm sm:grid-cols-2">
                  {webAppDeliverables.map((item) => (
                    <li key={item} className="flex items-start gap-sm">
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-tertiary-container">
                        <Icon icon={Check} size="sm" />
                      </span>
                      <span className="text-body-sm text-on-surface-variant">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </article>

          <div className="flex min-w-0 flex-1 flex-col gap-md">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>

        {/* Row 2: Intelligent Chatbots */}
        <article className="overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest interactive-card hover:shadow-card-hover">
          <div className="flex flex-col lg:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-lg p-lg">
              <Badge variant="accent">{chatbots.badge}</Badge>
              <div className="flex flex-col gap-sm">
                <h2 className="text-headline-md text-on-surface">
                  {chatbots.title}
                </h2>
                <p className="text-body-md text-on-surface-variant">
                  {chatbots.description}
                </p>
              </div>

              <ul className="flex flex-col gap-md">
                {chatbots.features.map((feature) => (
                  <li key={feature.title} className="flex gap-md">
                    <span className="mt-xs inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-tertiary-container">
                      <Icon icon={Check} size="sm" />
                    </span>
                    <div className="flex flex-col gap-xs">
                      <p className="text-body-md font-semibold text-on-surface">
                        {feature.title}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative min-w-0 border-t border-outline-variant lg:w-64 lg:shrink-0 lg:border-l lg:border-t-0">
              <Image
                src={chatbots.image.src}
                alt={chatbots.image.alt}
                width={256}
                height={256}
                className="h-48 w-full object-cover lg:h-full"
              />
            </div>
          </div>
        </article>

        {/* Row 3: SEO + CTA */}
        <div className="flex flex-col gap-md lg:flex-row">
          <article className="flex min-w-0 flex-[2] flex-col gap-lg rounded-card border border-outline-variant bg-surface-container-lowest p-lg interactive-card hover:shadow-card-hover">
            <div className="flex items-start gap-md">
              <Icon icon={LineChart} size="lg" className="text-on-surface" />
              <div className="flex flex-col gap-sm">
                <h2 className="text-headline-md text-on-surface">{seo.title}</h2>
                <p className="text-body-md text-on-surface-variant">
                  {seo.description}
                </p>
              </div>
            </div>

            <ul className="flex flex-col">
              {seo.rows.map((row, index) => (
                <li key={row.label}>
                  <div
                    className={cn(
                      "flex items-center justify-between gap-md py-md",
                      index > 0 && "border-t border-outline-variant",
                    )}
                  >
                    <span className="text-body-md text-on-surface">{row.label}</span>
                    <span className="text-label-md text-on-tertiary-container normal-case">
                      {row.tag}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="flex min-w-0 flex-1 flex-col justify-between gap-lg rounded-card border border-outline-variant bg-surface-container-low p-lg interactive-card hover:shadow-card-hover">
            <div className="flex flex-col gap-sm">
              <h2 className="text-headline-md text-on-surface">{cta.title}</h2>
              <p className="text-body-md text-on-surface-variant">
                {cta.description}
              </p>
            </div>

            <div className="flex flex-col gap-sm sm:flex-row lg:flex-col">
              <Link
                href={cta.primaryCta.href}
                className={cn(
                  "inline-flex items-center justify-center rounded-button bg-primary px-lg py-sm",
                  "text-button text-on-primary transition-colors duration-150 hover:bg-on-surface",
                )}
              >
                {cta.primaryCta.label}
              </Link>
              <Link
                href={cta.secondaryCta.href}
                className={cn(
                  "inline-flex items-center justify-center rounded-button border border-primary bg-transparent px-lg py-sm",
                  "text-button text-primary transition-colors duration-150 hover:bg-surface-container",
                )}
              >
                {cta.secondaryCta.label}
              </Link>
            </div>
          </article>
        </div>

      </div>
    </section>
  );
}
