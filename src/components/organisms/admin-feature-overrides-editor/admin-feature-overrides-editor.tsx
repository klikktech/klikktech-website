"use client";

import { useActionState } from "react";
import { Select } from "@/components/atoms/select";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
import { FEATURE_KEYS, type FeatureKey } from "@/core/logic/feature-keys";

type OverrideValue = "" | "enabled" | "disabled";
type FormState = { error?: string };

interface AdminFeatureOverridesEditorProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  initial: Partial<Record<FeatureKey, OverrideValue>>;
}

const OPTIONS = [
  { label: "Inherit from plan", value: "" },
  { label: "Force on", value: "enabled" },
  { label: "Force off", value: "disabled" },
];

export function AdminFeatureOverridesEditor({ action, initial }: AdminFeatureOverridesEditorProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-md">
      {FEATURE_KEYS.map((key) => (
        <FormField key={key} id={key} label={key}>
          <Select id={key} name={key} options={OPTIONS} defaultValue={initial[key] ?? ""} />
        </FormField>
      ))}
      {state?.error ? <p className="text-body-sm text-error">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save overrides"}
      </Button>
    </form>
  );
}
