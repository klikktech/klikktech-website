import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { cn } from "@/lib/utils/cn";

type MarketingLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function MarketingLayout({ children, className }: MarketingLayoutProps) {
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
      <SiteFooter />
    </div>
  );
}

export { MarketingContainer } from "./marketing-container";
