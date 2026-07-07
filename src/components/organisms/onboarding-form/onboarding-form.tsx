"use client";

import { useActionState } from "react";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
import type { ThemeId } from "@/core/logic/feature-keys";

type FormState = { error?: string; success?: boolean };

interface OnboardingFormInitial {
  storeName: string;
  themeId: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  isStoreOpen: boolean;
}

interface OnboardingFormProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  availableThemes: ThemeId[];
  initial: OnboardingFormInitial;
}

export function OnboardingForm({ action, availableThemes, initial }: OnboardingFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  if (state?.success) {
    return (
      <p className="text-body-md text-on-surface">
        Thanks — your store is set up. You can close this page.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-md">
      <FormField id="storeName" label="Store name">
        <Input id="storeName" name="storeName" required defaultValue={initial.storeName} />
      </FormField>

      <FormField id="themeId" label="Theme">
        <Select
          id="themeId"
          name="themeId"
          options={availableThemes.map((id) => ({ label: id, value: id }))}
          defaultValue={initial.themeId || availableThemes[0]}
        />
      </FormField>

      <FormField id="logo" label="Logo">
        <Input id="logo" name="logo" type="file" accept="image/*" />
        {initial.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={initial.logoUrl} alt="Current logo" className="mt-sm h-10 w-auto object-contain" />
        ) : null}
      </FormField>

      <div className="grid grid-cols-3 gap-md">
        <FormField id="primaryColor" label="Primary color">
          <Input id="primaryColor" name="primaryColor" type="color" defaultValue={initial.primaryColor || "#111827"} />
        </FormField>
        <FormField id="secondaryColor" label="Secondary color">
          <Input id="secondaryColor" name="secondaryColor" type="color" defaultValue={initial.secondaryColor || "#6b7280"} />
        </FormField>
        <FormField id="accentColor" label="Accent color">
          <Input id="accentColor" name="accentColor" type="color" defaultValue={initial.accentColor || "#111827"} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-md">
        <FormField id="contactEmail" label="Contact email">
          <Input id="contactEmail" name="contactEmail" type="email" defaultValue={initial.contactEmail} />
        </FormField>
        <FormField id="contactPhone" label="Contact phone">
          <Input id="contactPhone" name="contactPhone" type="tel" defaultValue={initial.contactPhone} />
        </FormField>
      </div>

      <FormField id="currency" label="Currency">
        <Input id="currency" name="currency" required defaultValue={initial.currency || "USD"} />
      </FormField>

      <label className="flex items-center gap-sm text-body-sm text-on-surface">
        <input type="checkbox" name="isStoreOpen" defaultChecked={initial.isStoreOpen} />
        Store open
      </label>

      {state?.error ? <p className="text-body-sm text-error">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Complete setup"}
      </Button>
    </form>
  );
}
