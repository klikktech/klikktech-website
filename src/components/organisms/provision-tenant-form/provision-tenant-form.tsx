"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
import { AdminFormFeedback } from "@/components/molecules/admin-form-feedback";
import { AdminSecretReveal } from "@/components/molecules/admin-secret-reveal";

type FormState = {
  error?: string;
  result?: { tenantId: string; adminEmail: string; tempPassword: string };
};

interface ProvisionTenantFormProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
}

export function ProvisionTenantForm({ action }: ProvisionTenantFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  if (state?.result) {
    return (
      <div className="flex flex-col gap-md">
        <AdminFormFeedback
          variant="success"
          message="Tenant provisioned — database created and migrated."
        />
        <AdminSecretReveal
          description="First admin login — shown once, won't be shown again after you leave this page."
          items={[
            { label: "Email", value: state.result.adminEmail, copyable: false },
            { label: "Password", value: state.result.tempPassword, copyLabel: "Copy password" },
          ]}
        />
        <Link href={`/admin/tenants/${state.result.tenantId}`}>
          <Button type="button">Go to tenant &amp; generate onboarding link</Button>
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-md">
      <div className="grid gap-md sm:grid-cols-2">
        <FormField id="name" label="Name">
          <Input id="name" name="name" required />
        </FormField>
        <FormField id="slug" label="Slug">
          <Input
            id="slug"
            name="slug"
            required
            placeholder="lowercase-hyphenated"
            className="font-mono"
          />
        </FormField>
      </div>
      <FormField id="contactEmail" label="Contact email">
        <Input id="contactEmail" name="contactEmail" type="email" required />
      </FormField>
      <FormField id="notes" label="Notes">
        <Textarea id="notes" name="notes" rows={3} className="min-h-0" />
      </FormField>
      {state?.error ? <AdminFormFeedback variant="error" message={state.error} /> : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Provisioning…" : "Provision tenant"}
      </Button>
    </form>
  );
}
