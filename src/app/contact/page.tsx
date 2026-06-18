import { JsonLd } from "@/components/atoms/json-ld";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { ContactHero } from "@/components/organisms/contact-hero";
import { InquirySection } from "@/components/organisms/inquiry-section";
import { SocialProofGrid } from "@/components/organisms/social-proof-grid";
import { createPageMetadata } from "@/lib/seo/metadata";
import { contactPageSeo, siteFaqs } from "@/lib/seo/page-seo";
import {
  breadcrumbSchema,
  combineSchemas,
  contactPageSchema,
  faqSchema,
  webPageSchema,
} from "@/lib/seo/schema";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentSection } from "@/components/organisms/payment-section";
import { PaymentSuccessBanner } from "@/components/organisms/payment-section/payment-success-banner";
import {
  MarketingContainer,
  MarketingLayout,
} from "@/components/templates/marketing-layout";

export const metadata = createPageMetadata({
  title: contactPageSeo.title,
  description: contactPageSeo.description,
  path: contactPageSeo.path,
  keywords: [
    contactPageSeo.primaryKeyword,
    ...contactPageSeo.secondaryKeywords,
    ...contactPageSeo.semanticKeywords,
  ],
});

const contactSchema = combineSchemas(
  contactPageSchema(),
  webPageSchema({
    path: contactPageSeo.path,
    title: contactPageSeo.title,
    description: contactPageSeo.description,
  }),
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]),
  faqSchema(siteFaqs.slice(0, 3)),
);

export default function ContactPage() {
  return (
    <MarketingLayout footerVariant="contact">
      <JsonLd data={contactSchema} />
      <MarketingContainer>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Contact" },
          ]}
        />
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
