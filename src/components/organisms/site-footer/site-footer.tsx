import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, Share2 } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { NewsletterForm } from "@/components/molecules/newsletter-form";
import {
  contactFooterColumns,
  contactFooterTagline,
  footerColumns,
  footerConnectLinks,
  siteConfig,
} from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";
import { MarketingContainer } from "@/components/templates/marketing-layout/marketing-container";

type FooterVariant = "default" | "contact";

type SiteFooterProps = {
  showNewsletter?: boolean;
  variant?: FooterVariant;
  className?: string;
};

export function SiteFooter({
  showNewsletter = false,
  variant = "default",
  className,
}: SiteFooterProps) {
  if (variant === "contact") {
    return (
      <footer
        className={cn(
          "mt-auto border-t border-outline-variant bg-surface-container",
          className,
        )}
      >
        <MarketingContainer className="py-xl">
          <div className="flex flex-col gap-xl lg:flex-row">
            <div className="flex min-w-0 flex-[1.2] flex-col gap-md">
              <Link
                href="/"
                className={cn(
             "inline-flex shrink-0 items-center",
              "rounded-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
            )}
              >
              <Image
                src={siteConfig.logo.src}
                alt={siteConfig.logo.alt}
                width={siteConfig.logo.width}
                height={siteConfig.logo.height}
                className="h-8 w-auto"
                priority
              />
              </Link>
              <p className="text-body-sm text-on-surface-variant">
                {contactFooterTagline}
              </p>
            </div>

            <div className="flex min-w-0 flex-[2] flex-col gap-xl sm:flex-row">
              {contactFooterColumns.map((column) => (
                <FooterColumn
                  key={column.title}
                  title={column.title}
                  links={column.links}
                  linkClassName="font-label text-body-sm underline underline-offset-4"
                  className="min-w-0 flex-1"
                />
              ))}
            </div>
          </div>
        </MarketingContainer>
      </footer>
    );
  }

  return (
    <footer
      className={cn(
        "mt-auto border-t border-outline-variant bg-surface-container",
        className,
      )}
    >
      <MarketingContainer className="py-xl">
        <div className="flex flex-col gap-xl md:flex-row md:flex-wrap lg:flex-nowrap">
          <div className="flex min-w-0 flex-col gap-md md:flex-[1_1_calc(50%-24px)] lg:flex-1">
            <Link
              href="/"
              className={cn(
                "inline-flex shrink-0 items-center",
                "rounded-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
              )}
            >
              <Image
                src={siteConfig.logo.src}
                alt={siteConfig.logo.alt}
                width={siteConfig.logo.width}
                height={siteConfig.logo.height}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-body-sm text-on-surface-variant">
              {siteConfig.copyright}
            </p>
          </div>

          {footerColumns.map((column) => (
            <FooterColumn
              key={column.title}
              title={column.title}
              links={column.links}
              className="min-w-0 md:flex-[1_1_calc(50%-24px)] lg:flex-1"
            />
          ))}

          <div className="flex min-w-0 flex-col gap-md md:basis-full lg:flex-1">
            <h3 className="text-label-md text-on-surface-variant">Connect</h3>
            <div className="flex items-center gap-md">
              <SocialIcon href="#" label="Share">
                <Icon icon={Share2} size="sm" aria-hidden={false} aria-label="Share" />
              </SocialIcon>
              <SocialIcon href={`mailto:${siteConfig.contactEmail}`} label="Email">
                <Icon icon={Mail} size="sm" aria-hidden={false} aria-label="Email" />
              </SocialIcon>
            </div>
            <ul className="flex flex-col gap-sm">
              {footerConnectLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-xs text-body-sm text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    {link.label}
                    <Icon icon={ArrowUpRight} size="sm" />
                  </Link>
                </li>
              ))}
            </ul>
            {showNewsletter ? (
              <div className="mt-md flex flex-col gap-sm">
                <h4 className="text-label-md text-on-surface-variant">
                  Newsletter
                </h4>
                <NewsletterForm placeholder="Email address" />
              </div>
            ) : null}
          </div>
        </div>
      </MarketingContainer>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  linkClassName,
  className,
}: {
  title: string;
  links: { label: string; href: string }[];
  linkClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-md", className)}>
      <h3 className="text-label-md text-on-surface-variant">{title}</h3>
      <ul className="flex flex-col gap-sm">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link
              href={link.href}
              className={cn(
                "text-body-sm text-on-surface-variant transition-colors hover:text-on-surface",
                linkClassName,
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-button border border-outline-variant bg-surface-container-lowest text-on-surface-variant transition-colors hover:text-on-surface"
    >
      {children}
    </Link>
  );
}
