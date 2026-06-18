import { JsonLd } from "@/components/atoms/json-ld";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { PageHero } from "@/components/organisms/page-hero";
import { ServicesBentoGrid } from "@/components/organisms/services-bento-grid";
import { ServicesOverview } from "@/components/organisms/services-overview";
import {
  servicesHeroContent,
  servicesOverviewContent,
} from "@/lib/content/services";
import { createPageMetadata } from "@/lib/seo/metadata";
import { servicesPageSeo } from "@/lib/seo/page-seo";
import {
  breadcrumbSchema,
  combineSchemas,
  serviceSchema,
  webPageSchema,
} from "@/lib/seo/schema";
import {
  MarketingContainer,
  MarketingLayout,
} from "@/components/templates/marketing-layout";

export const metadata = createPageMetadata({
  title: servicesPageSeo.title,
  description: servicesPageSeo.description,
  path: servicesPageSeo.path,
  keywords: [
    servicesPageSeo.primaryKeyword,
    ...servicesPageSeo.secondaryKeywords,
    ...servicesPageSeo.semanticKeywords,
  ],
});

const servicesSchema = combineSchemas(
  webPageSchema({
    path: servicesPageSeo.path,
    title: servicesPageSeo.title,
    description: servicesPageSeo.description,
  }),
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]),
  ...servicesOverviewContent.items.map((item) =>
    serviceSchema({
      name: item.title,
      description: item.description,
    }),
  ),
);

export default function ServicesPage() {
  return (
    <MarketingLayout showFooterNewsletter>
      <JsonLd data={servicesSchema} />
      <MarketingContainer>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services" },
          ]}
        />
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
