import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Icon } from "@/components/atoms/icon";
import { homeHeroContent } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

export function HeroSection() {
  const { badge, title, titleAccent, description, primaryCta, secondaryCta, image, overlayCard } =
    homeHeroContent;

  return (
    <section className="pt-xl">
      <div className="flex w-full flex-col gap-xl md:flex-row md:items-start md:gap-lg lg:gap-xl">
        <div className="flex min-w-0 flex-[3] basis-full flex-col items-start gap-lg md:basis-0">
          <Badge variant="accent">{badge}</Badge>

          <div className="flex w-full min-w-0 flex-col gap-md">
            <h1 className="w-full text-balance font-display text-[28px] font-bold leading-9 tracking-[-0.01em] text-on-surface sm:text-[32px] sm:leading-10 lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.02em]">
              {title}{" "}
              <span className="text-on-tertiary-container">{titleAccent}</span>
            </h1>
            <p className="w-full text-body-lg text-on-surface-variant">
              {description}
            </p>
          </div>

          <div className="flex w-full flex-col gap-md sm:flex-row sm:flex-wrap">
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
                "inline-flex items-center justify-center rounded-button border border-primary bg-transparent px-lg py-sm",
                "text-button text-primary transition-colors duration-150 hover:bg-surface-container-low",
              )}
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="relative min-w-0 flex-[2] basis-full md:basis-0">
          <div className="overflow-hidden rounded-card border border-outline-variant">
            <Image
              src={image.src}
              alt={image.alt}
              width={800}
              height={560}
              priority
              className="aspect-[10/7] w-full object-cover"
            />
          </div>

          <div className="absolute bottom-md left-md max-w-[220px] rounded-card border border-outline-variant bg-surface-container-lowest p-md shadow-card-hover">
            <p className="text-label-md text-on-surface-variant">
              {overlayCard.label}
            </p>
            <div className="mt-sm flex items-center gap-sm">
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#e6f4ea] text-[#1e6b3a]">
                <Icon icon={Check} size="sm" aria-hidden={false} aria-label="Verified" />
              </span>
              <p className="text-body-sm font-semibold text-on-surface">
                {overlayCard.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
