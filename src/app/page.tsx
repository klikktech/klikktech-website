import { HashScrollHandler } from "@/components/molecules/hash-scroll-handler";
import { JsonLd } from "@/components/atoms/json-ld";
import { BookCallSection } from "@/components/organisms/book-call-section";
import { HeroSection } from "@/components/organisms/hero-section";
import { HowItWorksSection } from "@/components/organisms/how-it-works-section";
import { PortfolioFeatured } from "@/components/organisms/portfolio-featured";
import { ServicesSection } from "@/components/organisms/services-section";
import { TestimonialsSection } from "@/components/organisms/testimonials-section";
import {
  MarketingContainer,
  MarketingLayout,
} from "@/components/templates/marketing-layout";
import { createPageMetadata } from "@/lib/seo/metadata";
import { homePageSeo, siteFaqs } from "@/lib/seo/page-seo";
import {
  combineSchemas,
  faqSchema,
  webPageSchema,
} from "@/lib/seo/schema";
export const metadata = createPageMetadata({
  title: homePageSeo.title,
  description: homePageSeo.description,
  path: homePageSeo.path,
  keywords: [
    homePageSeo.primaryKeyword,
    ...homePageSeo.secondaryKeywords,
    ...homePageSeo.semanticKeywords,
  ],
  absoluteTitle: true,
});

const homeSchema = combineSchemas(
  webPageSchema({
    path: homePageSeo.path,
    title: homePageSeo.title,
    description: homePageSeo.description,
  }),
  faqSchema([...siteFaqs]),
);

export default function HomePage() {
  return (
    <MarketingLayout>
      <HashScrollHandler />
      <JsonLd data={homeSchema} />
      <MarketingContainer>
        <HeroSection />
        <ServicesSection />
        <HowItWorksSection />
        <PortfolioFeatured />
        <TestimonialsSection />
        <BookCallSection />
      </MarketingContainer>
    </MarketingLayout>
  );
}
