"use client";

import { useCallback, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, Loader2 } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils/cn";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const PRESET_AMOUNTS = [250, 500, 1000, 2500, 5000];

// ─── Inner checkout form ─────────────────────────────────────────────────────

function CheckoutForm({
  amount,
  onSuccess,
  onCancel,
}: {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/contact?payment=success`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "An unexpected error occurred.");
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <p className="text-body-md font-semibold text-on-surface">
          Paying{" "}
          <span className="text-on-tertiary-container">
            ${amount.toLocaleString()}
          </span>
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="text-body-sm text-on-surface-variant underline underline-offset-2 hover:text-on-surface"
        >
          Change amount
        </button>
      </div>

      <PaymentElement />

      {errorMessage && (
        <p className="rounded-button bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className={cn(
          "inline-flex w-full items-center justify-center gap-sm rounded-button bg-primary px-lg py-sm",
          "text-button text-on-primary transition-colors duration-150",
          "hover:bg-on-surface disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <Icon icon={CreditCard} size="sm" />
            Pay ${amount.toLocaleString()}
          </>
        )}
      </button>
    </form>
  );
}

// ─── Amount + email selector ─────────────────────────────────────────────────

function AmountSelector({
  onConfirm,
}: {
  onConfirm: (amount: number, email: string) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    const amount = selected ?? Number(custom);
    if (!amount || amount < 1) {
      setError("Please select or enter a valid amount of at least $1.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address to receive your receipt.");
      return;
    }
    setError(null);
    onConfirm(amount, email);
  };

  return (
    <div className="flex flex-col gap-lg">
      {/* Preset amounts */}
      <div className="flex flex-col gap-sm">
        <p className="text-label-md text-on-surface-variant">Select Amount</p>
        <div className="grid grid-cols-3 gap-sm sm:grid-cols-5">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setSelected(amt);
                setCustom("");
                setError(null);
              }}
              className={cn(
                "rounded-button border px-md py-sm text-button transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
                selected === amt
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low",
              )}
            >
              ${amt.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Custom amount */}
      <div className="flex flex-col gap-sm">
        <label
          htmlFor="custom-amount"
          className="text-label-md text-on-surface-variant"
        >
          Or enter a custom amount
        </label>
        <div className="relative">
          <span className="absolute left-md top-1/2 -translate-y-1/2 text-body-md text-on-surface-variant">
            $
          </span>
          <input
            id="custom-amount"
            type="number"
            min="1"
            step="1"
            placeholder="0"
            value={custom}
            onChange={(e) => {
              setSelected(null);
              setCustom(e.target.value);
              setError(null);
            }}
            className={cn(
              "w-full rounded-button border border-outline-variant bg-surface-container-lowest",
              "py-sm pl-8 pr-md text-body-md text-on-surface placeholder:text-on-surface-variant",
              "focus:border-on-tertiary-container focus:outline-none focus:ring-2 focus:ring-on-tertiary-container/20",
            )}
          />
        </div>
      </div>

      {/* Email for receipt */}
      <div className="flex flex-col gap-sm">
        <label
          htmlFor="receipt-email"
          className="text-label-md text-on-surface-variant"
        >
          Email for Receipt
        </label>
        <input
          id="receipt-email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          className={cn(
            "w-full rounded-button border border-outline-variant bg-surface-container-lowest",
            "px-md py-sm text-body-md text-on-surface placeholder:text-on-surface-variant",
            "focus:border-on-tertiary-container focus:outline-none focus:ring-2 focus:ring-on-tertiary-container/20",
          )}
        />
        <p className="text-body-sm text-on-surface-variant">
          A payment confirmation will be sent to this address.
        </p>
      </div>

      {error && (
        <p className="rounded-button bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        className={cn(
          "inline-flex w-full items-center justify-center gap-sm rounded-button bg-primary px-lg py-sm",
          "text-button text-on-primary transition-colors duration-150 hover:bg-on-surface",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
        )}
      >
        <Icon icon={CreditCard} size="sm" />
        Continue to Payment
      </button>
    </div>
  );
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center gap-md py-lg text-center">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-[#e6f4ea] text-[#1e6b3a] text-2xl">
        ✓
      </span>
      <div className="flex flex-col gap-sm">
        <p className="text-headline-md text-on-surface">Payment Successful</p>
        <p className="text-body-md text-on-surface-variant">
          A confirmation receipt has been sent to{" "}
          <span className="font-semibold text-on-surface">{email}</span>.
          We&apos;ll be in touch shortly to confirm next steps.
        </p>
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

type Step = "select" | "checkout" | "success";

export function PaymentSection() {
  const [step, setStep] = useState<Step>("select");
  const [amount, setAmount] = useState<number | null>(null);
  const [email, setEmail] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleAmountConfirm = useCallback(
    async (selectedAmount: number, selectedEmail: string) => {
      setIsCreating(true);
      setFetchError(null);

      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: selectedAmount, email: selectedEmail }),
        });

        const data = await res.json();

        if (!res.ok) {
          setFetchError(data.error ?? "Something went wrong. Please try again.");
          setIsCreating(false);
          return;
        }

        setAmount(selectedAmount);
        setEmail(selectedEmail);
        setClientSecret(data.clientSecret);
        setStep("checkout");
      } catch {
        setFetchError("Network error. Please check your connection and try again.");
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  const handleCancel = useCallback(() => {
    setStep("select");
    setClientSecret(null);
    setAmount(null);
    setEmail("");
  }, []);

  const handleSuccess = useCallback(() => {
    setStep("success");
  }, []);

  return (
    <section className="pb-xl">
      <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-lg interactive-card hover:shadow-card-hover">

        {/* Header */}
        <div className="mb-lg flex flex-col gap-sm">
          <div className="flex items-center gap-sm">
            <span className="inline-flex size-8 items-center justify-center rounded-button bg-primary text-on-primary">
              <Icon icon={CreditCard} size="sm" />
            </span>
            <h2 className="text-headline-md text-on-surface">Make a Payment</h2>
          </div>
          <p className="text-body-md text-on-surface-variant" style={{ maxWidth: "480px" }}>
            Select a preset amount or enter a custom figure. A receipt will be
            emailed to you instantly on payment.
          </p>
        </div>

        {step === "select" && (
          <>
            <AmountSelector onConfirm={handleAmountConfirm} />
            {isCreating && (
              <div className="mt-md flex items-center gap-sm text-on-surface-variant">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-body-sm">Setting up payment…</span>
              </div>
            )}
            {fetchError && (
              <p className="mt-md rounded-button bg-error-container px-md py-sm text-body-sm text-on-error-container">
                {fetchError}
              </p>
            )}
          </>
        )}

        {step === "checkout" && clientSecret && amount && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#000000",
                  colorBackground: "#ffffff",
                  colorText: "#191c1e",
                  colorDanger: "#ba1a1a",
                  borderRadius: "6px",
                  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                },
              },
            }}
          >
            <CheckoutForm
              amount={amount}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </Elements>
        )}

        {step === "success" && <SuccessState email={email} />}

        <p className="mt-lg text-center text-body-sm text-on-surface-variant">
          Secured by{" "}
          <span className="font-semibold text-on-surface">Stripe</span> — your
          card details never touch our servers.
        </p>
      </div>
    </section>
  );
}
