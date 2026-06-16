"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils/cn";

type CarouselImage = {
  src: string;
  alt: string;
};

type ProjectCarouselProps = {
  images: CarouselImage[];
  className?: string;
};

export function ProjectCarousel({ images, className }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const current = images[activeIndex];

  if (images.length === 0) return null;

  return (
    <div className={cn("group relative overflow-hidden rounded-card border border-outline-variant", className)}>
      {/* Image — explicit width/height so Next.js knows the intrinsic size;
          w-full + aspect ratio locks it to the card width without overflow */}
      <Image
        key={current.src}
        src={current.src}
        alt={current.alt}
        width={1280}
        height={800}
        className="aspect-[16/10] w-full object-cover transition-opacity duration-300"
        priority={activeIndex === 0}
      />

      {/* Prev / Next + dots + counter — only when more than one image */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={goPrev}
            className={cn(
              "absolute left-md top-1/2 -translate-y-1/2 z-10",
              "inline-flex size-8 items-center justify-center rounded-full",
              "bg-surface-container-lowest/80 text-on-surface shadow-card-hover backdrop-blur-sm",
              "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
              "hover:bg-surface-container-lowest focus-visible:opacity-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
            )}
          >
            <Icon icon={ChevronLeft} size="sm" />
          </button>

          <button
            type="button"
            aria-label="Next image"
            onClick={goNext}
            className={cn(
              "absolute right-md top-1/2 -translate-y-1/2 z-10",
              "inline-flex size-8 items-center justify-center rounded-full",
              "bg-surface-container-lowest/80 text-on-surface shadow-card-hover backdrop-blur-sm",
              "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
              "hover:bg-surface-container-lowest focus-visible:opacity-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
            )}
          >
            <Icon icon={ChevronRight} size="sm" />
          </button>

          {/* Dot indicators */}
          <div
            role="tablist"
            aria-label="Image navigation"
            className="absolute bottom-md left-1/2 z-10 flex -translate-x-1/2 items-center gap-xs"
          >
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`View image ${index + 1} of ${images.length}`}
                onClick={() => goTo(index)}
                className={cn(
                  "rounded-full transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-1",
                  index === activeIndex
                    ? "size-2 bg-surface-container-lowest"
                    : "size-1.5 bg-surface-container-lowest/50 hover:bg-surface-container-lowest/80",
                )}
              />
            ))}
          </div>

          {/* Slide counter chip */}
          <span
            aria-hidden
            className="absolute right-md top-md z-10 rounded-tag bg-inverse-surface/70 px-sm py-xs text-label-md text-inverse-on-surface backdrop-blur-sm normal-case"
          >
            {activeIndex + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}
