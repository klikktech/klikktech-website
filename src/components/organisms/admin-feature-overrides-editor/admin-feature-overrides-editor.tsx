"use client";

import { useActionState } from "react";
import { Select } from "@/components/atoms/select";
import { Button } from "@/components/atoms/button";
import { AdminFormFeedback } from "@/components/molecules/admin-form-feedback";
import { FEATURE_KEYS, FEATURE_LABELS, type FeatureKey } from "@/core/logic/feature-keys";

type OverrideValue = "" | "enabled" | "disabled";
type FormState = { error?: string };

interface AdminFeatureOverridesEditorProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  initial: Partial<Record<FeatureKey, OverrideValue>>;
}

const OPTIONS = [
  { label: "Inherit", value: "" },
  { label: "Force on", value: "enabled" },
  { label: "Force off", value: "disabled" },
];

export function AdminFeatureOverridesEditor({ action, initial }: AdminFeatureOverridesEditorProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const saved = state !== undefined && !state.error && !pending;

  return (
    <form action={formAction} className="flex flex-col gap-md">
      <div className="overflow-x-auto rounded-button border border-outline-variant">
        <table className="w-full min-w-[28rem] text-body-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low text-left">
              <th className="px-md py-sm font-medium text-on-surface-variant">Feature</th>
              <th className="px-md py-sm font-medium text-on-surface-variant">Override</th>
            </tr>
          </thead>
          <tbody>
            {FEATURE_KEYS.map((key) => (
              <tr key={key} className="border-b border-outline-variant last:border-b-0">
                <td className="px-md py-sm">
                  <span className="font-medium text-on-surface">{FEATURE_LABELS[key]}</span>
                  <span className="mt-xs block font-mono text-body-sm text-on-surface-variant">{key}</span>
                </td>
                <td className="px-md py-sm">
                  <Select
                    id={key}
                    name={key}
                    options={OPTIONS}
                    defaultValue={initial[key] ?? ""}
                    className="text-body-sm"
                    aria-label={`Override for ${FEATURE_LABELS[key]}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {state?.error ? <AdminFormFeedback variant="error" message={state.error} /> : null}
      {saved ? <AdminFormFeedback variant="success" message="Overrides saved." /> : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save overrides"}
      </Button>
    </form>
  );
}
