import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactHero } from "@/components/organisms/contact-hero";
import { InquirySection } from "@/components/organisms/inquiry-section";
import { PaymentSection } from "@/components/organisms/payment-section";
import { PaymentSuccessBanner } from "@/components/organisms/payment-section/payment-success-banner";
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
        {/* Suspense required because PaymentSuccessBanner reads searchParams */}
        <Suspense fallback={null}>
          <PaymentSuccessBanner />
        </Suspense>
        <ContactHero />
        <InquirySection />
        <PaymentSection />
      </MarketingContainer>
    </MarketingLayout>
  );
}
