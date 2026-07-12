"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";
import { FormField } from "@/components/molecules/form-field";
import { AdminFormFeedback } from "@/components/molecules/admin-form-feedback";

type FormState = { error?: string };

interface TenantFormInitial {
  name: string;
  slug: string;
  status: string;
  databaseUrl: string;
  contactEmail: string;
  notes: string;
}

interface AdminTenantFormProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  initial?: TenantFormInitial;
  submitLabel?: string;
}

const STATUS_OPTIONS = [
  { label: "Trial", value: "TRIAL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

export function AdminTenantForm({ action, initial, submitLabel = "Save" }: AdminTenantFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [dbUrlRevealed, setDbUrlRevealed] = useState(false);
  const saved = state !== undefined && !state.error && !pending;

  return (
    <form action={formAction} className="flex flex-col gap-md">
      <div className="grid gap-md sm:grid-cols-2">
        <FormField id="name" label="Name">
          <Input id="name" name="name" required defaultValue={initial?.name} />
        </FormField>
        <FormField id="slug" label="Slug">
          <Input
            id="slug"
            name="slug"
            required
            defaultValue={initial?.slug}
            className="font-mono"
          />
        </FormField>
      </div>
      <FormField id="status" label="Status">
        <Select id="status" name="status" options={STATUS_OPTIONS} defaultValue={initial?.status ?? "TRIAL"} />
      </FormField>
      <FormField id="contactEmail" label="Contact email">
        <Input id="contactEmail" name="contactEmail" type="email" defaultValue={initial?.contactEmail} />
      </FormField>
      <FormField id="notes" label="Notes">
        <Textarea id="notes" name="notes" defaultValue={initial?.notes} rows={3} className="min-h-0" />
      </FormField>
      <FormField id="databaseUrl" label="Database URL">
        <div className="flex gap-sm">
          <Input
            id="databaseUrl"
            name="databaseUrl"
            required
            type={dbUrlRevealed ? "text" : "password"}
            defaultValue={initial?.databaseUrl}
            placeholder="postgresql://user:pass@host:5432/db"
            className="font-mono text-body-sm"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => setDbUrlRevealed((v) => !v)}
            className="shrink-0 px-md"
            aria-label={dbUrlRevealed ? "Hide database URL" : "Show database URL"}
          >
            <Icon icon={dbUrlRevealed ? EyeOff : Eye} size="sm" aria-hidden />
          </Button>
        </div>
      </FormField>
      {state?.error ? <AdminFormFeedback variant="error" message={state.error} /> : null}
      {saved ? <AdminFormFeedback variant="success" message="Saved successfully." /> : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
