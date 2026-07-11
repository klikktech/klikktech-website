import { siteSeoConfig, absoluteUrl } from "./site-config";

type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  const { address, email, name, legalName, description, areaServed } =
    siteSeoConfig;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name,
    legalName,
    url: absoluteUrl("/"),
    description,
    email,
    logo: absoluteUrl("/images/og-default.jpg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    },
    areaServed: {
      "@type": "Country",
      name: areaServed,
    },
    sameAs: [],
  };
}

export function localBusinessSchema(): JsonLd {
  const { address, email, name, description, areaServed } = siteSeoConfig;

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${absoluteUrl("/")}#localbusiness`,
    name,
    url: absoluteUrl("/"),
    description,
    email,
    image: absoluteUrl("/images/og-default.jpg"),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    },
    areaServed: {
      "@type": "Country",
      name: areaServed,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: siteSeoConfig.name,
    url: absoluteUrl("/"),
    description: siteSeoConfig.description,
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    inLanguage: siteSeoConfig.language,
  };
}

export function webPageSchema({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    about: { "@id": `${absoluteUrl("/")}#organization` },
    inLanguage: siteSeoConfig.language,
  };
}

export function faqSchema(
  items: { question: string; answer: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function combineSchemas(...schemas: JsonLd[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": schemas.map(({ "@context": _, ...rest }) => rest),
  };
}
