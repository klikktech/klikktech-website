import { siteConfig } from "@/lib/constants/navigation";

/** Canonical site URL — set NEXT_PUBLIC_SITE_URL in production. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://klikktek.com";

export const siteSeoConfig = {
  name: siteConfig.name,
  legalName: "Klikktek",
  tagline: siteConfig.tagline,
  description:
    "Custom web applications, AI chatbots, and strategic SEO for growing US businesses. Build fast, rank higher, and convert more leads.",
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
    "Custom Web Application Development",
    "AI Chatbot Development",
    "Technical SEO",
    "Local SEO",
    "Website Maintenance",
  ],
  areaServed: "United States",
} as const;

export const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/services", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/projects", changeFrequency: "weekly" as const, priority: 0.85 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
] as const;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl.replace(/\/$/, "")}${normalized}`;
}
