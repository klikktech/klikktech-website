"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
import { AddressAutocomplete } from "@/components/molecules/address-autocomplete";
import { PalettePreviewCard } from "@/components/molecules/palette-preview-card";
import { AdminFormFeedback } from "@/components/molecules/admin-form-feedback";
import { COLOR_PALETTES, COLOR_PALETTE_IDS, type ColorPaletteId } from "@/core/logic/color-palettes";

type FormState = { error?: string };

export interface AdminStoreSettingsInitial {
  storeName: string;
  logoUrl: string;
  colorPaletteId: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  isStoreOpen: boolean;
  storeAddress: string;
  storeLatitude: number | null;
  storeLongitude: number | null;
}

interface AdminStoreSettingsFormProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  initial: AdminStoreSettingsInitial;
}

export function AdminStoreSettingsForm({ action, initial }: AdminStoreSettingsFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const saved = state !== undefined && !state.error && !pending;
  const [colorPaletteId, setColorPaletteId] = useState<ColorPaletteId>(
    (COLOR_PALETTE_IDS as readonly string[]).includes(initial.colorPaletteId)
      ? (initial.colorPaletteId as ColorPaletteId)
      : "slate",
  );

  return (
    <form action={formAction} className="flex flex-col gap-lg">
      <div className="grid gap-md sm:grid-cols-2">
        <FormField id="storeName" label="Store name">
          <Input id="storeName" name="storeName" required defaultValue={initial.storeName} />
        </FormField>
        <FormField id="currency" label="Currency">
          <Input id="currency" name="currency" required defaultValue={initial.currency || "USD"} />
        </FormField>
      </div>

      <FormField id="logo" label="Logo">
        <Input id="logo" name="logo" type="file" accept="image/*" />
        {initial.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={initial.logoUrl} alt="Current logo" className="mt-sm h-10 w-auto object-contain" />
        ) : null}
      </FormField>

      <AddressAutocomplete
        defaultAddress={initial.storeAddress}
        defaultLatitude={initial.storeLatitude}
        defaultLongitude={initial.storeLongitude}
        required
      />

      <div className="grid gap-md sm:grid-cols-2">
        <FormField id="contactEmail" label="Contact email">
          <Input id="contactEmail" name="contactEmail" type="email" defaultValue={initial.contactEmail} />
        </FormField>
        <FormField id="contactPhone" label="Contact phone">
          <Input id="contactPhone" name="contactPhone" type="tel" defaultValue={initial.contactPhone} />
        </FormField>
      </div>

      <label className="flex items-center gap-sm text-body-sm text-on-surface">
        <input type="checkbox" name="isStoreOpen" defaultChecked={initial.isStoreOpen} />
        Store open
      </label>

      <div>
        <p className="mb-md text-label-md text-on-surface-variant">Color preset</p>
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

      {state?.error ? <AdminFormFeedback variant="error" message={state.error} /> : null}
      {saved ? <AdminFormFeedback variant="success" message="Store settings saved and synced." /> : null}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save store settings"}
      </Button>
    </form>
  );
}
