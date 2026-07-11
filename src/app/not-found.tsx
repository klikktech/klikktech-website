import Link from "next/link";
import { MarketingLayout } from "@/components/templates/marketing-layout";

export default function NotFound() {
  return (
    <MarketingLayout>
      <div className="mx-auto flex max-w-content flex-col items-center gap-lg px-md py-3xl text-center">
        <p className="text-label-md font-semibold uppercase tracking-wider text-primary">
          404
        </p>
        <h1 className="font-display text-[32px] font-bold leading-tight text-on-surface sm:text-[40px]">
          Page not found
        </h1>
        <p className="max-w-prose text-body-lg text-on-surface-variant">
          The page you are looking for may have been moved or no longer exists.
          Explore our services, portfolio, or contact us to get back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-md">
          <Link
            href="/"
            className="inline-flex rounded-button bg-primary px-lg py-sm text-button text-on-primary transition-colors hover:bg-on-surface"
          >
            Go Home
          </Link>
          <Link
            href="/#services"
            className="inline-flex rounded-button border border-primary px-lg py-sm text-button text-primary transition-colors hover:bg-surface-container-low"
          >
            View Services
          </Link>
          <Link
            href="/#contact"
            className="inline-flex rounded-button border border-outline-variant px-lg py-sm text-button text-on-surface transition-colors hover:bg-surface-container-low"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
