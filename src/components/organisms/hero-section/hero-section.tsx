import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Icon } from "@/components/atoms/icon";
import { homeHeroContent } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

export function HeroSection() {
  const { badge, title, titleAccent, description, primaryCta, secondaryCta } =
    homeHeroContent;

  return (
    <section className="relative overflow-hidden pt-xl pb-lg">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-secondary-container/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 left-1/4 size-56 rounded-full bg-tertiary-fixed/50 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-lg text-center">
        <Badge variant="accent">{badge}</Badge>

        <div className="flex flex-col gap-md">
          <h1 className="text-balance font-display text-[32px] font-bold leading-tight tracking-[-0.01em] text-on-surface sm:text-[40px] lg:text-[52px] lg:leading-[60px]">
            {title}{" "}
            <span className="text-on-tertiary-container">{titleAccent}</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant">{description}</p>
        </div>

        <div className="flex w-full flex-col gap-md sm:w-auto sm:flex-row">
          <Link
            href={primaryCta.href}
            className={cn(
              "inline-flex items-center justify-center gap-sm rounded-button bg-primary px-lg py-sm",
              "text-button text-on-primary transition-colors duration-150 hover:bg-on-surface",
            )}
          >
            {primaryCta.label}
            <Icon icon={ArrowRight} size="sm" />
          </Link>
          <Link
            href={secondaryCta.href}
            className={cn(
              "inline-flex items-center justify-center rounded-button border border-outline-variant bg-surface-container-lowest px-lg py-sm",
              "text-button text-on-surface transition-colors duration-150 hover:bg-surface-container-low",
            )}
          >
            {secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
