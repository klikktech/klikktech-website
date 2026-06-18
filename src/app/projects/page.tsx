import { JsonLd } from "@/components/atoms/json-ld";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { InnovationSection } from "@/components/organisms/innovation-section";
import { PageHero } from "@/components/organisms/page-hero";
import { SuccessStorySection } from "@/components/organisms/success-story-section";
import { projectsHeroContent } from "@/lib/content/projects";
import { createPageMetadata } from "@/lib/seo/metadata";
import { projectsPageSeo } from "@/lib/seo/page-seo";
import { projectsSeoCatalog } from "@/lib/seo/projects-seo";
import {
  breadcrumbSchema,
  combineSchemas,
  creativeWorkSchema,
  webPageSchema,
} from "@/lib/seo/schema";
import {
  MarketingContainer,
  MarketingLayout,
} from "@/components/templates/marketing-layout";

export const metadata = createPageMetadata({
  title: projectsPageSeo.title,
  description: projectsPageSeo.description,
  path: projectsPageSeo.path,
  keywords: [
    projectsPageSeo.primaryKeyword,
    ...projectsPageSeo.secondaryKeywords,
    ...projectsPageSeo.semanticKeywords,
  ],
});

const projectsSchema = combineSchemas(
  webPageSchema({
    path: projectsPageSeo.path,
    title: projectsPageSeo.title,
    description: projectsPageSeo.description,
  }),
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
  ]),
  ...projectsSeoCatalog.map((project) =>
    creativeWorkSchema({
      name: project.title,
      description: project.metaDescription,
      path: `/projects#${project.slug}`,
      image: project.image,
      keywords: [project.primaryKeyword, ...project.secondaryKeywords],
      datePublished: project.datePublished,
    }),
  ),
);

export default function ProjectsPage() {
  return (
    <MarketingLayout showFooterNewsletter>
      <JsonLd data={projectsSchema} />
      <MarketingContainer>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Projects" },
          ]}
        />
        <PageHero
          title={projectsHeroContent.title}
          description={projectsHeroContent.description}
        />
        <SuccessStorySection />
        <InnovationSection />
      </MarketingContainer>
    </MarketingLayout>
  );
}
