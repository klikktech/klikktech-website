import type { Metadata } from "next";
import { CtaBanner } from "@/components/organisms/cta-banner";
import { HeroSection } from "@/components/organisms/hero-section";
import { PortfolioFeatured } from "@/components/organisms/portfolio-featured";
import { ServicesPreview } from "@/components/organisms/services-preview";
import { TestimonialsSection } from "@/components/organisms/testimonials-section";
import {
  MarketingContainer,
  MarketingLayout,
} from "@/components/templates/marketing-layout";

export const metadata: Metadata = {
  title: {
    absolute: "Klikktek | Precision Intelligence",
  },
  description:
    "Functional web solutions and strategic SEO for growing businesses.",
};

export default function HomePage() {
  return (
    <MarketingLayout>
      <MarketingContainer>
        <HeroSection />
        <ServicesPreview />
        <PortfolioFeatured />
        <TestimonialsSection />
        <CtaBanner />
      </MarketingContainer>
    </MarketingLayout>
  );
}
