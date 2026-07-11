"use client";

import { useCallback, useRef, useState } from "react";
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

const SWIPE_THRESHOLD = 48;

export function ProjectCarousel({ images, className }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef(0);
  const pointerStartY = useRef(0);
  const isHorizontalSwipe = useRef(false);
  const activePointerId = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + images.length) % images.length);
      setDragOffset(0);
    },
    [images.length],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const finishDrag = useCallback(
    (deltaX: number) => {
      if (deltaX <= -SWIPE_THRESHOLD) {
        goTo(activeIndex + 1);
        return;
      }

      if (deltaX >= SWIPE_THRESHOLD) {
        goTo(activeIndex - 1);
        return;
      }

      setDragOffset(0);
    },
    [activeIndex, goTo],
  );

  const resetDrag = useCallback(() => {
    setIsDragging(false);
    isHorizontalSwipe.current = false;
    activePointerId.current = null;
    setDragOffset(0);
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (images.length <= 1 || event.button !== 0) {
        return;
      }

      activePointerId.current = event.pointerId;
      pointerStartX.current = event.clientX;
      pointerStartY.current = event.clientY;
      isHorizontalSwipe.current = false;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [images.length],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (
        activePointerId.current !== event.pointerId ||
        images.length <= 1
      ) {
        return;
      }

      const deltaX = event.clientX - pointerStartX.current;
      const deltaY = event.clientY - pointerStartY.current;

      if (!isHorizontalSwipe.current) {
        if (
          Math.abs(deltaX) < 8 &&
          Math.abs(deltaY) < 8
        ) {
          return;
        }

        if (Math.abs(deltaX) <= Math.abs(deltaY)) {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          resetDrag();
          return;
        }

        isHorizontalSwipe.current = true;
      }

      event.preventDefault();
      setDragOffset(deltaX);
    },
    [images.length, resetDrag],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerId.current !== event.pointerId) {
        return;
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      if (isHorizontalSwipe.current) {
        finishDrag(event.clientX - pointerStartX.current);
      }

      resetDrag();
    },
    [finishDrag, resetDrag],
  );

  const handlePointerCancel = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerId.current !== event.pointerId) {
        return;
      }

      resetDrag();
    },
    [resetDrag],
  );

  if (images.length === 0) {
    return null;
  }

  const hasMultipleImages = images.length > 1;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-card border border-outline-variant",
        className,
      )}
    >
      <div
        ref={trackRef}
        role={hasMultipleImages ? "region" : undefined}
        aria-roledescription={hasMultipleImages ? "carousel" : undefined}
        aria-label={hasMultipleImages ? "Project screenshots" : undefined}
        className={cn(
          "relative touch-pan-y select-none",
          hasMultipleImages && "cursor-grab active:cursor-grabbing",
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className={cn(
            "flex",
            !isDragging && "transition-transform duration-300 ease-out",
          )}
          style={{
            transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {images.map((image, index) => (
            <div
              key={image.src}
              className="aspect-[16/10] w-full shrink-0"
              aria-hidden={index !== activeIndex}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={1280}
                height={800}
                draggable={false}
                className="aspect-[16/10] h-full w-full object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {hasMultipleImages ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={goPrev}
            className={cn(
              "absolute left-md top-1/2 z-10 -translate-y-1/2",
              "inline-flex size-8 items-center justify-center rounded-full",
              "bg-surface-container-lowest/80 text-on-surface shadow-card-hover backdrop-blur-sm",
              "opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100",
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
              "absolute right-md top-1/2 z-10 -translate-y-1/2",
              "inline-flex size-8 items-center justify-center rounded-full",
              "bg-surface-container-lowest/80 text-on-surface shadow-card-hover backdrop-blur-sm",
              "opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100",
              "hover:bg-surface-container-lowest focus-visible:opacity-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
            )}
          >
            <Icon icon={ChevronRight} size="sm" />
          </button>

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

          <span
            aria-hidden
            className="absolute right-md top-md z-10 rounded-tag bg-inverse-surface/70 px-sm py-xs text-label-md text-inverse-on-surface backdrop-blur-sm normal-case"
          >
            {activeIndex + 1} / {images.length}
          </span>
        </>
      ) : null}
    </div>
  );
}
