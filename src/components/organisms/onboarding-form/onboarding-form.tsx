"use client";

import { useActionState, useRef, useState } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
import { AddressAutocomplete } from "@/components/molecules/address-autocomplete";
import { PalettePreviewCard } from "@/components/molecules/palette-preview-card";
import { cn } from "@/lib/utils/cn";
import { COLOR_PALETTES, COLOR_PALETTE_IDS, type ColorPaletteId } from "@/core/logic/color-palettes";
import { ADDON_CATALOG, ADDON_KEYS, type AddonKey } from "@/core/logic/addon-catalog";

type FormState = { error?: string; success?: boolean };

interface OnboardingFormInitial {
  storeName: string;
  logoUrl: string;
  colorPaletteId: string;
  enabledAddons: string[];
  contactEmail: string;
  contactPhone: string;
  currency: string;
  isStoreOpen: boolean;
  storeAddress: string;
  storeLatitude: number | null;
  storeLongitude: number | null;
}

interface OnboardingFormProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  initial: OnboardingFormInitial;
}

const STEPS = ["Store info", "Color preset", "Add-ons", "Review"] as const;

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
}

export function OnboardingForm({ action, initial }: OnboardingFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(action, undefined);
  const [step, setStep] = useState(0);
  const [colorPaletteId, setColorPaletteId] = useState<ColorPaletteId>(
    (COLOR_PALETTE_IDS as readonly string[]).includes(initial.colorPaletteId)
      ? (initial.colorPaletteId as ColorPaletteId)
      : "slate"
  );
  const [selectedAddons, setSelectedAddons] = useState<Set<AddonKey>>(
    () =>
      new Set(
        initial.enabledAddons.filter((key): key is AddonKey => (ADDON_KEYS as readonly string[]).includes(key))
      )
  );
  const [storeAddress, setStoreAddress] = useState(initial.storeAddress);

  if (state?.success) {
    return <p className="text-body-md text-on-surface">Thanks — your store is set up. You can close this page.</p>;
  }

  function toggleAddon(key: AddonKey) {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const currency = initial.currency || "USD";
  const totalCents = [...selectedAddons].reduce((sum, key) => sum + ADDON_CATALOG[key].priceCents, 0);

  return (
    <form ref={formRef} action={formAction} className="flex max-w-lg flex-col gap-md">
      <ol className="flex gap-sm text-body-sm text-on-surface-variant">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={cn(
              "flex-1 border-b-2 pb-xs text-center",
              index === step ? "border-primary font-medium text-on-surface" : "border-outline-variant"
            )}
          >
            {label}
          </li>
        ))}
      </ol>

      <div className={cn("flex flex-col gap-md", step !== 0 && "hidden")}>
        <FormField id="storeName" label="Store name">
          <Input id="storeName" name="storeName" required defaultValue={initial.storeName} />
        </FormField>
        <FormField id="logo" label="Logo">
          <Input id="logo" name="logo" type="file" accept="image/*" />
          {initial.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={initial.logoUrl} alt="Current logo" className="mt-sm h-10 w-auto object-contain" />
          ) : null}
        </FormField>
        <div className="grid grid-cols-2 gap-md">
          <FormField id="contactEmail" label="Contact email">
            <Input id="contactEmail" name="contactEmail" type="email" defaultValue={initial.contactEmail} />
          </FormField>
          <FormField id="contactPhone" label="Contact phone">
            <Input id="contactPhone" name="contactPhone" type="tel" defaultValue={initial.contactPhone} />
          </FormField>
        </div>
        <FormField id="currency" label="Currency">
          <Input id="currency" name="currency" required defaultValue={currency} />
        </FormField>
        <AddressAutocomplete
          defaultAddress={initial.storeAddress}
          defaultLatitude={initial.storeLatitude}
          defaultLongitude={initial.storeLongitude}
          required
          onAddressChange={setStoreAddress}
        />
        <label className="flex items-center gap-sm text-body-sm text-on-surface">
          <input type="checkbox" name="isStoreOpen" defaultChecked={initial.isStoreOpen} />
          Store open
        </label>
      </div>

      <div className={cn("flex flex-col gap-md", step !== 1 && "hidden")}>
        <input type="hidden" name="colorPaletteId" value={colorPaletteId} />
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
          {COLOR_PALETTE_IDS.map((id) => (
            <PalettePreviewCard
              key={id}
              palette={COLOR_PALETTES[id]}
              selected={colorPaletteId === id}
              onSelect={() => setColorPaletteId(id)}
            />
          ))}
        </div>
      </div>

      <div className={cn("flex flex-col gap-md", step !== 2 && "hidden")}>
        {ADDON_KEYS.map((key) => {
          const addon = ADDON_CATALOG[key];
          return (
            <label key={key} className="flex items-start gap-sm rounded-button border border-outline-variant p-md">
              <input
                type="checkbox"
                name={key}
                checked={selectedAddons.has(key)}
                onChange={() => toggleAddon(key)}
                className="mt-xs"
              />
              <span className="flex-1">
                <span className="flex items-center justify-between gap-sm">
                  <span className="text-body-md font-medium text-on-surface">{addon.label}</span>
                  <span className="shrink-0 text-body-sm text-on-surface-variant">
                    {formatPrice(addon.priceCents, addon.currency)}
                  </span>
                </span>
                <span className="block text-body-sm text-on-surface-variant">{addon.description}</span>
              </span>
            </label>
          );
        })}
        <p className="text-body-md font-medium text-on-surface">Total: {formatPrice(totalCents, currency)}</p>
      </div>

      <div className={cn("flex flex-col gap-lg", step !== 3 && "hidden")}>
        <div>
          <p className="mb-sm text-label-md text-on-surface-variant">Store address</p>
          <p className="text-body-sm text-on-surface">{storeAddress || "—"}</p>
        </div>
        <div>
          <p className="mb-sm text-label-md text-on-surface-variant">Color preset</p>
          <PalettePreviewCard palette={COLOR_PALETTES[colorPaletteId]} selected />
        </div>
        <div>
          <p className="mb-sm text-label-md text-on-surface-variant">Add-ons</p>
          {selectedAddons.size === 0 ? (
            <p className="text-body-sm text-on-surface-variant">None selected.</p>
          ) : (
            <ul className="flex flex-col gap-xs text-body-sm text-on-surface">
              {[...selectedAddons].map((key) => (
                <li key={key} className="flex justify-between">
                  <span>{ADDON_CATALOG[key].label}</span>
                  <span>{formatPrice(ADDON_CATALOG[key].priceCents, ADDON_CATALOG[key].currency)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-sm text-body-md font-medium text-on-surface">Total: {formatPrice(totalCents, currency)}</p>
        </div>
      </div>

      {state?.error ? <p className="text-body-sm text-error">{state.error}</p> : null}

      <div className="flex justify-between gap-sm">
        {step > 0 ? (
          <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)}>
            Next
          </Button>
        ) : (
          <Button
            type="button"
            disabled={pending}
            onClick={() => formRef.current?.requestSubmit()}
          >
            {pending ? "Saving…" : "Complete setup"}
          </Button>
        )}
      </div>
    </form>
  );
}
