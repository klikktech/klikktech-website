"use client";

import { useActionState } from "react";
import { Select } from "@/components/atoms/select";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
import { AdminFormFeedback } from "@/components/molecules/admin-form-feedback";
import { FEATURE_KEYS, FEATURE_LABELS, type FeatureKey } from "@/core/logic/feature-keys";

type OverrideValue = "" | "enabled" | "disabled";
type FormState = { error?: string };

interface AdminFeatureOverridesEditorProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  initial: Partial<Record<FeatureKey, OverrideValue>>;
}

const OPTIONS = [
  { label: "Inherit from base/add-ons", value: "" },
  { label: "Force on", value: "enabled" },
  { label: "Force off", value: "disabled" },
];

export function AdminFeatureOverridesEditor({ action, initial }: AdminFeatureOverridesEditorProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const saved = state !== undefined && !state.error && !pending;

  return (
    <form action={formAction} className="flex flex-col gap-md">
      {FEATURE_KEYS.map((key) => (
        <FormField key={key} id={key} label={FEATURE_LABELS[key]}>
          <Select id={key} name={key} options={OPTIONS} defaultValue={initial[key] ?? ""} />
          <p className="mt-xs font-mono text-body-sm text-on-surface-variant">{key}</p>
        </FormField>
      ))}
      {state?.error ? <AdminFormFeedback variant="error" message={state.error} /> : null}
      {saved ? <AdminFormFeedback variant="success" message="Overrides saved." /> : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save overrides"}
      </Button>
    </form>
  );
}
