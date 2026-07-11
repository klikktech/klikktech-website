import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Lora } from "next/font/google";
import { JsonLd } from "@/components/atoms/json-ld";
import { siteSeoConfig, siteUrl } from "@/lib/seo/site-config";
import { themeInitScript } from "@/lib/theme/theme";
import {
  combineSchemas,
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo/schema";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const globalSchema = combineSchemas(
  organizationSchema(),
  localBusinessSchema(),
  websiteSchema(),
);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteSeoConfig.name,
    template: `%s | ${siteSeoConfig.name}`,
  },
  description: siteSeoConfig.description,
  applicationName: siteSeoConfig.name,
  authors: [{ name: siteSeoConfig.name, url: siteUrl }],
  creator: siteSeoConfig.name,
  publisher: siteSeoConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: siteSeoConfig.locale,
    siteName: siteSeoConfig.name,
    title: siteSeoConfig.name,
    description: siteSeoConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    site: siteSeoConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${lora.variable} ${inter.variable} ${jetbrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col font-body">
        <JsonLd data={globalSchema} />
        {children}
      </body>
    </html>
  );
}
