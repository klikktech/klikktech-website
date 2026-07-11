"use client";

import { useState } from "react";
import { ArrowRight, CalendarCheck, CheckCircle } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { BookingCalendar } from "@/components/molecules/booking-calendar";
import { FormField } from "@/components/molecules/form-field";
import { Icon } from "@/components/atoms/icon";
import {
  formatSelectedSlot,
  slotToIso,
} from "@/lib/booking/availability";
import { bookCallContent } from "@/lib/content/contact";
import { cn } from "@/lib/utils/cn";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
};

type FormErrors = Partial<Record<keyof FormValues | "slot", string>>;

function validate(
  values: FormValues,
  dateKey: string | null,
  timeSlot: string | null,
): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else {
    const digits = values.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      errors.phone = "Please enter a valid phone number.";
    }
  }

  if (!dateKey || !timeSlot) {
    errors.slot = "Please select a date and time.";
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

export function BookCallSection() {
  const { title, description, submitLabel } = bookCallContent;

  const [values, setValues] = useState<FormValues>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set =
    (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate(values, selectedDateKey, selectedTime);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!selectedDateKey || !selectedTime) return;

    setIsSubmitting(true);

    try {
      const scheduledAt = slotToIso(selectedDateKey, selectedTime);

      const res = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          dateKey: selectedDateKey,
          timeSlot: selectedTime,
          scheduledAt,
        }),
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
    <section id="contact" className="scroll-mt-section pt-lg pb-xl">
      <div className="flex flex-col gap-xl">
        <div className="flex max-w-2xl flex-col gap-md">
          <span className="text-label-md text-on-tertiary-container">
            Schedule
          </span>
          <h2 className="font-display text-headline-lg text-on-surface">{title}</h2>
          <p className="text-body-md text-on-surface-variant">{description}</p>
        </div>

        <div className="flex flex-col gap-xl rounded-card border border-outline-variant bg-surface-container-low p-lg lg:flex-row lg:p-xl">
          <div className="min-w-0 flex-1">
            <BookingCalendar
              selectedDateKey={selectedDateKey}
              selectedTime={selectedTime}
              onSelectDate={(dateKey) => {
                setSelectedDateKey(dateKey);
                setSelectedTime(null);
                if (errors.slot) {
                  setErrors((prev) => ({ ...prev, slot: undefined }));
                }
              }}
              onSelectTime={(time) => {
                setSelectedTime(time);
                if (errors.slot) {
                  setErrors((prev) => ({ ...prev, slot: undefined }));
                }
              }}
            />
            <FieldError message={errors.slot} />
          </div>

          <div className="min-w-0 flex-1 rounded-card border border-outline-variant bg-surface-container-lowest p-lg">
            {submitted ? (
              <div className="flex flex-col items-center gap-md py-lg text-center">
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-success-container">
                  <Icon
                    icon={CheckCircle}
                    size="lg"
                    className="text-on-success-container"
                    aria-hidden={false}
                    aria-label="Success"
                  />
                </span>
                <div className="flex flex-col gap-sm">
                  <p className="text-headline-md text-on-surface">Call Booked</p>
                  <p className="max-w-sm text-body-md text-on-surface-variant">
                    Thanks, {values.fullName.split(" ")[0]}. Your call is set for{" "}
                    <span className="font-semibold text-on-surface">
                      {selectedDateKey && selectedTime
                        ? formatSelectedSlot(selectedDateKey, selectedTime)
                        : "your selected time"}
                    </span>
                    . A confirmation was sent to {values.email}.
                  </p>
                </div>
              </div>
            ) : (
              <form
                noValidate
                className="flex flex-col gap-lg"
                onSubmit={handleSubmit}
              >
                {selectedDateKey && selectedTime ? (
                  <div className="flex items-start gap-sm rounded-card bg-secondary-container px-md py-sm">
                    <Icon
                      icon={CalendarCheck}
                      size="sm"
                      className="mt-0.5 shrink-0 text-on-tertiary-container"
                    />
                    <p className="text-body-sm text-on-secondary-container">
                      {formatSelectedSlot(selectedDateKey, selectedTime)}
                    </p>
                  </div>
                ) : null}

                <FormField id="fullName" label="Full Name">
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Jane Doe"
                    value={values.fullName}
                    onChange={set("fullName")}
                    aria-invalid={!!errors.fullName}
                    className={cn(errors.fullName && "border-error")}
                  />
                  <FieldError message={errors.fullName} />
                </FormField>

                <FormField id="email" label="Email">
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

                <FormField id="phone" label="Phone Number">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={values.phone}
                    onChange={set("phone")}
                    aria-invalid={!!errors.phone}
                    className={cn(errors.phone && "border-error")}
                  />
                  <FieldError message={errors.phone} />
                </FormField>

                {serverError ? (
                  <p className="rounded-button bg-error-container px-md py-sm text-body-sm text-on-error-container">
                    {serverError}
                  </p>
                ) : null}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Booking…" : submitLabel}
                  {!isSubmitting && <Icon icon={ArrowRight} size="sm" />}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
