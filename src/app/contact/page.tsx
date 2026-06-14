import type { Metadata } from "next";
import { ContactHero } from "@/components/organisms/contact-hero";
import { InquirySection } from "@/components/organisms/inquiry-section";
import { SocialProofGrid } from "@/components/organisms/social-proof-grid";
import {
  MarketingContainer,
  MarketingLayout,
} from "@/components/templates/marketing-layout";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Connect with the Klikktek team to discuss your next web project or SEO strategy.",
};

export default function ContactPage() {
  return (
    <MarketingLayout footerVariant="contact">
      <MarketingContainer>
        <ContactHero />
        <SocialProofGrid />
        <InquirySection />
      </MarketingContainer>
    </MarketingLayout>
  );
}
