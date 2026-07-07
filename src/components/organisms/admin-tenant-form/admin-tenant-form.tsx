"use client";

import { useActionState } from "react";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
import { PLAN_IDS } from "@/core/logic/feature-keys";

type FormState = { error?: string };

interface TenantFormInitial {
  name: string;
  slug: string;
  status: string;
  planId: string;
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

const PLAN_OPTIONS = PLAN_IDS.map((id) => ({ label: id, value: id }));

export function AdminTenantForm({ action, initial, submitLabel = "Save" }: AdminTenantFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-md">
      <FormField id="name" label="Name">
        <Input id="name" name="name" required defaultValue={initial?.name} />
      </FormField>
      <FormField id="slug" label="Slug">
        <Input id="slug" name="slug" required defaultValue={initial?.slug} />
      </FormField>
      <div className="grid grid-cols-2 gap-md">
        <FormField id="status" label="Status">
          <Select id="status" name="status" options={STATUS_OPTIONS} defaultValue={initial?.status ?? "TRIAL"} />
        </FormField>
        <FormField id="planId" label="Plan">
          <Select id="planId" name="planId" options={PLAN_OPTIONS} defaultValue={initial?.planId ?? "basic"} />
        </FormField>
      </div>
      <FormField id="databaseUrl" label="Database URL">
        <Input
          id="databaseUrl"
          name="databaseUrl"
          required
          defaultValue={initial?.databaseUrl}
          placeholder="postgresql://user:pass@host:5432/db"
        />
      </FormField>
      <FormField id="contactEmail" label="Contact email">
        <Input id="contactEmail" name="contactEmail" type="email" defaultValue={initial?.contactEmail} />
      </FormField>
      <FormField id="notes" label="Notes">
        <Input id="notes" name="notes" defaultValue={initial?.notes} />
      </FormField>
      {state?.error ? <p className="text-body-sm text-error">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
