"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/atoms/button";
import { AdminFormFeedback } from "@/components/molecules/admin-form-feedback";
import { ADDON_CATALOG, ADDON_KEYS, type AddonKey } from "@/core/logic/addon-catalog";

type FormState = { error?: string };

interface AdminAddonsEditorProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  initial: string[];
}

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
}

export function AdminAddonsEditor({ action, initial }: AdminAddonsEditorProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const saved = state !== undefined && !state.error && !pending;
  const [selected, setSelected] = useState<Set<AddonKey>>(
    () => new Set(initial.filter((key): key is AddonKey => (ADDON_KEYS as readonly string[]).includes(key)))
  );

  function toggle(key: AddonKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <form action={formAction} className="flex flex-col gap-md">
      {ADDON_KEYS.map((key) => {
        const addon = ADDON_CATALOG[key];
        return (
          <label key={key} className="flex items-start gap-sm rounded-button border border-outline-variant p-md">
            <input
              type="checkbox"
              name={key}
              checked={selected.has(key)}
              onChange={() => toggle(key)}
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
      {state?.error ? <AdminFormFeedback variant="error" message={state.error} /> : null}
      {saved ? <AdminFormFeedback variant="success" message="Add-ons updated." /> : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Update add-ons"}
      </Button>
    </form>
  );
}
