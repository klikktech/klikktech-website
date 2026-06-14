"use client";

import Link from "next/link";
import { Input } from "@/components/atoms/input";
import { homeCtaContent } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

const fieldClasses =
  "box-border h-11 rounded-button px-md py-0 leading-none";

export function CtaBanner() {
  const { title, description, placeholder, buttonLabel } = homeCtaContent;

  return (
    <section id="contact" className="scroll-mt-section py-xl">
      <div className="rounded-card bg-primary-container px-lg py-xl md:px-xl">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-lg text-center">
          <div className="flex w-full flex-col gap-md">
            <h2 className="text-headline-lg text-inverse-on-surface">{title}</h2>
            <p className="text-body-md text-inverse-on-surface/80">
              {description}
            </p>
          </div>

          <form
            className="w-full max-w-xl self-stretch sm:mx-auto"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div className="flex w-full gap-3  sm:items-center">
              <Input
                type="email"
                name="email"
                placeholder={placeholder}
                aria-label="Email address"
                className={cn(
                  fieldClasses,
                  "w-full min-w-0 flex-1 border-outline-variant bg-inverse-surface text-body-md text-inverse-on-surface placeholder:text-on-primary-container",
                )}
              />
              <Link
                href="/contact"
                className={cn(
                  fieldClasses,
                  "inline-flex w-full items-center justify-center border border-transparent",
                  "bg-surface-container-lowest text-button text-on-surface",
                  "transition-colors duration-150 hover:bg-surface-container-high",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
                  "sm:w-auto sm:whitespace-nowrap",
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
