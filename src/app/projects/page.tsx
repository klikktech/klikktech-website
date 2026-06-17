import type { Metadata } from "next";
import { InnovationSection } from "@/components/organisms/innovation-section";
import { PageHero } from "@/components/organisms/page-hero";
import { SuccessStorySection } from "@/components/organisms/success-story-section";
import { projectsHeroContent } from "@/lib/content/projects";
import {
  MarketingContainer,
  MarketingLayout,
} from "@/components/templates/marketing-layout";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects and case studies from Klikktek's portfolio.",
};

export default function ProjectsPage() {
  return (
    <MarketingLayout>
      <MarketingContainer>
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
