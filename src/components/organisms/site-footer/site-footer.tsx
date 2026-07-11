import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { HeaderScheduleLink } from "@/components/molecules/header-schedule-link";
import { NavLink } from "@/components/molecules/nav-link";
import {
  footerColumns,
  footerCtaContent,
  siteConfig,
} from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";
import { MarketingContainer } from "@/components/templates/marketing-layout/marketing-container";

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "mt-auto border-t border-outline-variant bg-surface-container",
        className,
      )}
    >
      <MarketingContainer className="py-xl">
        <div className="grid gap-xl lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,0.8fr))_minmax(0,1.1fr)] lg:gap-lg">
          <div className="flex min-w-0 flex-col gap-md lg:pr-lg">
            <Link
              href="/"
              className={cn(
                "inline-flex shrink-0 items-center rounded-button",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
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
            <p className="max-w-sm text-body-sm text-on-surface-variant">
              {siteConfig.tagline}
            </p>
            <Link
              href={`mailto:${siteConfig.contactEmail}`}
              className="inline-flex w-fit items-center gap-sm rounded-button text-body-sm text-on-surface-variant transition-colors hover:text-on-tertiary-container"
            >
              <Icon icon={Mail} size="sm" aria-hidden={false} aria-label="Email" />
              {siteConfig.contactEmail}
            </Link>
          </div>

          {footerColumns.map((column) => (
            <FooterColumn
              key={column.title}
              title={column.title}
              links={column.links}
            />
          ))}

          <div className="flex min-w-0 flex-col gap-md rounded-card border border-outline-variant bg-surface-container-lowest p-lg lg:self-start">
            <p className="text-label-md text-on-tertiary-container">
              {footerCtaContent.eyebrow}
            </p>
            <div className="flex flex-col gap-sm">
              <h3 className="font-display text-headline-md text-on-surface">
                {footerCtaContent.title}
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                {footerCtaContent.description}
              </p>
            </div>
            <HeaderScheduleLink className="inline-flex w-full sm:w-auto" />
          </div>
        </div>
      </MarketingContainer>

      <div className="border-t border-outline-variant/70 bg-surface-container-low">
        <MarketingContainer className="flex flex-col gap-sm py-md sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-on-surface-variant">
            {siteConfig.copyright}
          </p>
          <NavLink
            href="/#contact"
            label="Book a discovery call"
            className="inline-flex items-center gap-xs border-b-0 pb-0 hover:text-on-tertiary-container"
          />
        </MarketingContainer>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-md", className)}>
      <h3 className="text-label-md text-on-surface-variant">{title}</h3>
      <ul className="flex flex-col gap-sm">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <NavLink
              href={link.href}
              label={link.label}
              className="border-b-0 pb-0 text-body-sm hover:text-on-tertiary-container"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
