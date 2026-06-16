"use client";

import Link from "next/link";
import { homeCtaContent } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

export function CtaBanner() {
  const { title, description, placeholder, buttonLabel } = homeCtaContent;

  return (
    <section id="contact" className="scroll-mt-section py-xl">
      <div className="rounded-card bg-primary-container px-lg py-xl md:px-xl">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-lg text-center">

          <div className="flex w-full flex-col gap-md">
            <h2 className="text-headline-lg text-inverse-on-surface">{title}</h2>
            <p className="text-body-md text-inverse-on-surface/80">{description}</p>
          </div>

          {/* w-full + max-w in px avoids Tailwind v4 spacing-token conflict with max-w-xl */}
          <form
            className="w-full self-stretch"
            style={{ maxWidth: "560px", margin: "0 auto" }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div
              className="w-full"
              style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}
            >
              <input
                type="email"
                name="email"
                placeholder={placeholder}
                aria-label="Email address"
                style={{ flex: "1 1 0%", minWidth: 0 }}
                className={cn(
                  "h-11 rounded-button border border-outline-variant",
                  "bg-inverse-surface px-md text-body-md text-inverse-on-surface",
                  "placeholder:text-on-primary-container",
                  "focus:border-on-tertiary-container focus:outline-none focus:ring-2 focus:ring-on-tertiary-container/20",
                )}
              />
              <Link
                href="/contact"
                style={{ flexShrink: 0, whiteSpace: "nowrap" }}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-button border border-transparent px-lg",
                  "bg-surface-container-lowest text-button text-on-surface",
                  "transition-colors duration-150 hover:bg-surface-container-high",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
                )}
              >
                {buttonLabel}
              </Link>
            </div>
          </form>

        </div>
      </div>
    </section>
  );
}
