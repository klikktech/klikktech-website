import { siteConfig } from "@/lib/constants/navigation";

/** Canonical site URL — set NEXT_PUBLIC_SITE_URL in production. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://klikktek.com";

export const siteSeoConfig = {
  name: siteConfig.name,
  legalName: "Klikktek",
  tagline: siteConfig.tagline,
  description:
    "Websites, Google review programs, lead follow-up, and 24/7 customer support for growing US businesses. More leads, stronger reputation, less manual work.",
  locale: "en_US",
  language: "en",
  country: "US",
  email: siteConfig.contactEmail,
  address: {
    streetAddress: "100 Tech Plaza",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    postalCode: "94105",
    addressCountry: "US",
  },
  /** Default OG/Twitter share image (1200×630 recommended). */
  defaultOgImage: "/images/og-default.jpg",
  twitterHandle: "@klikktek",
  services: [
    "Websites & Business Tools",
    "Google Reviews Program",
    "Lead Recovery",
    "24/7 Customer Support",
    "Local SEO",
    "Website Maintenance",
  ],
  areaServed: "United States",
} as const;

export const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
] as const;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl.replace(/\/$/, "")}${normalized}`;
}
