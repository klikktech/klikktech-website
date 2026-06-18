"use client";

import { useState } from "react";
import { ArrowRight, AtSign, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import { ContactInfoBlock } from "@/components/molecules/contact-info-block";
import { FormField } from "@/components/molecules/form-field";
import { Icon } from "@/components/atoms/icon";
import { contactInquiryContent } from "@/lib/content/contact";
import { cn } from "@/lib/utils/cn";

const contactDetails = [
  {
    icon: AtSign,
    label: "Email",
    value: "contact@klikktek.com",
    href: "mailto:contact@klikktek.com",
  },
  {
    icon: Phone,
    label: "US — Alex Sohani",
    value: "+1 312 477 6452",
    href: "tel:+13124776452",
  },
  {
    icon: Phone,
    label: "IN — Ankit Sohani",
    value: "+91 90107 93439",
    href: "tel:+919010793439",
  },
  {
    icon: Phone,
    label: "IN — Sumanth Sara",
    value: "+91 95025 68873",
    href: "tel:+919502568873",
  },
];

type FormValues = {
  fullName: string;
  email: string;
  serviceInterest: string;
  projectBrief: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.serviceInterest) {
    errors.serviceInterest = "Please select a service.";
  }

  if (!values.projectBrief.trim()) {
    errors.projectBrief = "Please describe your project.";
  } else if (values.projectBrief.trim().length < 20) {
    errors.projectBrief = "Please provide at least 20 characters.";
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-body-sm text-error" role="alert">
      {message}
    </p>
  );
}

export function InquirySection() {
  const { title, description, serviceOptions, submitLabel } =
    contactInquiryContent;

  const [values, setValues] = useState<FormValues>({
    fullName: "",
    email: "",
    serviceInterest: "",
    projectBrief: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (field: keyof FormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first errored field
      const firstKey = Object.keys(validationErrors)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pb-xl">
      <div className="flex flex-col gap-xl lg:flex-row">

        {/* Left column */}
        <div className="flex min-w-0 flex-1 flex-col gap-lg">
          <div className="flex flex-col gap-md">
            <h2 className="text-headline-lg text-on-surface">{title}</h2>
            <p
              className="text-body-md text-on-surface-variant"
              style={{ maxWidth: "480px" }}
            >
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-md">
            {contactDetails.map((detail) => (
              <ContactInfoBlock
                key={detail.value}
                icon={detail.icon}
                label={detail.label}
                value={detail.value}
                href={detail.href}
              />
            ))}
          </div>
        </div>

        {/* Right column — form */}
        <div className="min-w-0 flex-1 rounded-card border border-outline-variant bg-surface-container-lowest p-lg interactive-card hover:shadow-card-hover">

          {submitted ? (
            /* Success state */
            <div className="flex flex-col items-center gap-md py-lg text-center">
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-[#e6f4ea]">
                <Icon
                  icon={CheckCircle}
                  size="lg"
                  className="text-[#1e6b3a]"
                  aria-hidden={false}
                  aria-label="Success"
                />
              </span>
              <div className="flex flex-col gap-sm">
                <p className="text-headline-md text-on-surface">
                  Enquiry Sent
                </p>
                <p
                  className="text-body-md text-on-surface-variant"
                  style={{ maxWidth: "360px" }}
                >
                  Thanks, {values.fullName.split(" ")[0]}. We&apos;ve received
                  your message and will reply to{" "}
                  <span className="font-semibold text-on-surface">
                    {values.email}
                  </span>{" "}
                  within one business day.
                </p>
              </div>
            </div>
          ) : (
            /* Form */
            <form
              noValidate
              className="flex flex-col gap-lg"
              onSubmit={handleSubmit}
            >
              <FormField id="fullName" label="Full Name">
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Jane Doe"
                  value={values.fullName}
                  onChange={set("fullName")}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  className={cn(errors.fullName && "border-error")}
                />
                <FieldError message={errors.fullName} />
              </FormField>

              <FormField id="email" label="Corporate Email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@company.com"
                  value={values.email}
                  onChange={set("email")}
                  aria-invalid={!!errors.email}
                  className={cn(errors.email && "border-error")}
                />
                <FieldError message={errors.email} />
              </FormField>

              <FormField id="serviceInterest" label="Service Interest">
                <Select
                  id="serviceInterest"
                  name="serviceInterest"
                  placeholder="Select a service"
                  options={serviceOptions}
                  value={values.serviceInterest}
                  onChange={set("serviceInterest")}
                  aria-invalid={!!errors.serviceInterest}
                  className={cn(errors.serviceInterest && "border-error")}
                />
                <FieldError message={errors.serviceInterest} />
              </FormField>

              <FormField id="projectBrief" label="Project Brief">
                <Textarea
                  id="projectBrief"
                  name="projectBrief"
                  placeholder="Describe your goals, timeline, and constraints..."
                  value={values.projectBrief}
                  onChange={set("projectBrief")}
                  aria-invalid={!!errors.projectBrief}
                  className={cn(errors.projectBrief && "border-error")}
                />
                <FieldError message={errors.projectBrief} />
              </FormField>

              {serverError && (
                <p className="rounded-button bg-error-container px-md py-sm text-body-sm text-on-error-container">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending…" : submitLabel}
                {!isSubmitting && <Icon icon={ArrowRight} size="sm" />}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
