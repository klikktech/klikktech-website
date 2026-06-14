"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { cn } from "@/lib/utils/cn";

type NewsletterFormProps = {
  className?: string;
  buttonLabel?: string;
  placeholder?: string;
};

export function NewsletterForm({
  className,
  buttonLabel = "Join",
  placeholder = "Email",
}: NewsletterFormProps) {
  return (
    <form
      className={cn("w-full", className)}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="email"
          name="email"
          placeholder={placeholder}
          aria-label="Email address"
          className="box-border h-11 w-full min-w-0 flex-1 py-0 leading-none"
        />
        <Button
          type="submit"
          className="box-border h-11 w-full shrink-0 py-0 sm:w-auto"
        >
          {buttonLabel}
        </Button>
      </div>
    </form>
  );
}
