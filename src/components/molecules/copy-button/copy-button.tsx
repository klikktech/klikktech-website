"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils/cn";

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyButton({ value, label = "Copy", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleCopy}
      className={cn("shrink-0", className)}
    >
      <Icon icon={copied ? Check : Copy} size="sm" aria-hidden />
      {copied ? "Copied" : label}
    </Button>
  );
}
