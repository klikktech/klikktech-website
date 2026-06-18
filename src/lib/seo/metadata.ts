import type { Metadata } from "next";
import { absoluteUrl, siteSeoConfig, siteUrl } from "./site-config";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** Use for home page to bypass the title template. */
  absoluteTitle?: boolean;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  absoluteTitle = false,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(siteSeoConfig.defaultOgImage);
  const resolvedTitle = absoluteTitle ? title : title;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords?.join(", "),
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: siteSeoConfig.locale,
      url: canonical,
      siteName: siteSeoConfig.name,
      title: resolvedTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteSeoConfig.name} — ${siteSeoConfig.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteSeoConfig.twitterHandle,
      title: resolvedTitle,
      description,
      images: [ogImage],
    },
  };
}
