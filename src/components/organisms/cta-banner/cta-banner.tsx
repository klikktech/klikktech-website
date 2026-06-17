"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { homeCtaContent } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

export function CtaBanner() {
  const { title, description, placeholder, buttonLabel } = homeCtaContent;

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (value: string) => {
    if (!value.trim()) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email address.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/cta-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-section py-xl">
      <div className="rounded-card bg-primary-container px-lg py-xl md:px-xl">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-lg text-center">

          <div className="flex w-full flex-col gap-md">
            <h2 className="text-headline-lg text-inverse-on-surface">{title}</h2>
            <p className="text-body-md text-inverse-on-surface/80">{description}</p>
          </div>

          {submitted ? (
            /* Success state */
            <div className="flex items-center gap-sm rounded-card bg-[#e6f4ea] px-lg py-md">
              <Icon
                icon={CheckCircle}
                size="md"
                className="shrink-0 text-[#1e6b3a]"
                aria-hidden={false}
                aria-label="Success"
              />
              <p className="text-body-md font-semibold text-[#1e6b3a]">
                Got it — we'll be in touch at{" "}
                <span className="font-bold">{email}</span> within one business day.
              </p>
            </div>
          ) : (
            <form
              className="w-full self-stretch"
              style={{ maxWidth: "560px", margin: "0 auto" }}
              onSubmit={handleSubmit}
              noValidate
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div style={{ flex: "1 1 0%", minWidth: 0 }}>
                  <input
                    type="email"
                    name="email"
                    placeholder={placeholder}
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    aria-invalid={!!error}
                    className={cn(
                      "h-11 w-full rounded-button border border-outline-variant",
                      "bg-inverse-surface px-md text-body-md text-inverse-on-surface",
                      "placeholder:text-on-primary-container",
                      "focus:border-on-tertiary-container focus:outline-none focus:ring-2 focus:ring-on-tertiary-container/20",
                      error && "border-error",
                    )}
                  />
                  {error && (
                    <p className="mt-xs text-left text-body-sm text-error" role="alert">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ flexShrink: 0, whiteSpace: "nowrap" }}
                  className={cn(
                    "inline-flex h-11 items-center justify-center rounded-button border border-transparent px-lg",
                    "bg-surface-container-lowest text-button text-on-surface",
                    "transition-colors duration-150 hover:bg-surface-container-high",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
                  )}
                >
                  {isSubmitting ? "Sending…" : buttonLabel}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </section>
  );
}
