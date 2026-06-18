"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, X } from "lucide-react";
import { Icon } from "@/components/atoms/icon";

export function PaymentSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setVisible(true);
      // Clean the URL without reloading the page
      router.replace("/contact", { scroll: false });
    }
  }, [searchParams, router]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className="mb-lg mt-lg flex items-start gap-md rounded-card border border-[#a8d5b5] bg-[#e6f4ea] px-lg py-md"
    >
      <Icon
        icon={CheckCircle}
        size="md"
        className="mt-0.5 shrink-0 text-[#1e6b3a]"
        aria-hidden={false}
        aria-label="Success"
      />
      <div className="flex flex-1 flex-col gap-xs">
        <p className="text-body-md font-semibold text-[#1e6b3a]">
          Payment Successful
        </p>
        <p className="text-body-sm text-[#1e6b3a]/80">
          Your payment has been confirmed. Check your email for a receipt — we'll
          be in touch shortly.
        </p>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setVisible(false)}
        className="shrink-0 rounded-button p-xs text-[#1e6b3a]/60 transition-colors hover:text-[#1e6b3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6b3a]"
      >
        <Icon icon={X} size="sm" />
      </button>
    </div>
  );
}
