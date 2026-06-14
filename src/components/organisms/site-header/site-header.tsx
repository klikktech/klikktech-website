import Link from "next/link";
import { NavLink } from "@/components/molecules/nav-link";
import { MobileNav } from "@/components/molecules/mobile-nav";
import { mainNavLinks, siteConfig } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";
import { MarketingContainer } from "@/components/templates/marketing-layout/marketing-container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface/95 backdrop-blur-sm">
      <MarketingContainer>
        <div className="flex h-16 items-center gap-md">
          <div className="flex min-w-0 flex-1 items-center">
            <Link
              href="/"
              className={cn(
                "font-display text-body-md font-bold text-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
              )}
            >
              {siteConfig.name}
            </Link>
          </div>

          <nav
            aria-label="Main navigation"
            className="hidden shrink-0 items-center gap-lg lg:flex"
          >
            {mainNavLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-sm sm:gap-md">
            <MobileNav />
            <Link
              href="/contact"
              className={cn(
                "hidden rounded-button bg-primary px-md py-sm text-button text-on-primary sm:inline-flex sm:px-lg",
                "transition-colors duration-150 ease-in-out hover:bg-on-surface",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
              )}
            >
              Get Started
            </Link>
          </div>
        </div>
      </MarketingContainer>
    </header>
  );
}
