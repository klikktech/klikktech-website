import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/page-hero";
import { ServicesBentoGrid } from "@/components/organisms/services-bento-grid";
import { ServicesOverview } from "@/components/organisms/services-overview";
import {
  servicesHeroContent,
} from "@/lib/content/services";
import {
  MarketingContainer,
  MarketingLayout,
} from "@/components/templates/marketing-layout";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom web applications, intelligent chatbots, and SEO strategies for growing businesses.",
};

export default function ServicesPage() {
  return (
    <MarketingLayout showFooterNewsletter>
      <MarketingContainer>
        <PageHero
          label={servicesHeroContent.label}
          title={servicesHeroContent.title}
          description={servicesHeroContent.description}
        />
        <ServicesBentoGrid />
        <ServicesOverview />
      </MarketingContainer>
    </MarketingLayout>
  );
}
