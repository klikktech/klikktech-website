import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { cn } from "@/lib/utils/cn";
import { MarketingContainer } from "./marketing-container";

type MarketingLayoutProps = {
  children: React.ReactNode;
  className?: string;
  showFooterNewsletter?: boolean;
  footerVariant?: "default" | "contact";
};

type MarketingSectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
};

export function MarketingLayout({
  children,
  className,
  showFooterNewsletter = false,
  footerVariant = "default",
}: MarketingLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-full flex-1 flex-col overflow-x-clip bg-surface text-on-surface",
        className,
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:rounded-button focus:bg-primary focus:px-lg focus:py-sm focus:text-button focus:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter
        showNewsletter={showFooterNewsletter}
        variant={footerVariant}
      />
    </div>
  );
}

export function MarketingSection({
  children,
  className,
  containerClassName,
  id,
}: MarketingSectionProps) {
  return (
    <section
      id={id}
      className={cn("py-xl", id && "scroll-mt-section", className)}
    >
      <MarketingContainer className={containerClassName}>
        {children}
      </MarketingContainer>
    </section>
  );
}

export { MarketingContainer } from "./marketing-container";
