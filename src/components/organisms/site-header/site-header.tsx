import Image from "next/image";
import Link from "next/link";
import { NavLink } from "@/components/molecules/nav-link";
import { MobileNav } from "@/components/molecules/mobile-nav";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { mainNavLinks, siteConfig } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";
import { MarketingContainer } from "@/components/templates/marketing-layout/marketing-container";
import { HeaderScheduleLink } from "@/components/molecules/header-schedule-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/80 bg-surface/90 shadow-[0_1px_0_0_rgba(25,28,30,0.04)] backdrop-blur-md dark:shadow-[0_1px_0_0_rgba(0,0,0,0.3)]">
      <MarketingContainer>
        <div className="flex h-[var(--header-height)] items-center gap-md">
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
              priority
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="ml-auto hidden items-center gap-xl lg:flex"
          >
            {mainNavLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-sm lg:ml-0">
            <ThemeToggle className="hidden sm:inline-flex" />
            <div
              aria-hidden
              className="hidden h-6 w-px bg-outline-variant lg:block"
            />
            <HeaderScheduleLink className="hidden lg:inline-flex" />
            <MobileNav />
          </div>
        </div>
      </MarketingContainer>
    </header>
  );
}
