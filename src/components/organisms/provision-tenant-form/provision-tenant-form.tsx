"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
import { CopyButton } from "@/components/molecules/copy-button";
import { PLAN_IDS } from "@/core/logic/feature-keys";

type FormState = {
  error?: string;
  result?: { tenantId: string; adminEmail: string; tempPassword: string };
};

interface ProvisionTenantFormProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
}

const PLAN_OPTIONS = PLAN_IDS.map((id) => ({ label: id, value: id }));

export function ProvisionTenantForm({ action }: ProvisionTenantFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  if (state?.result) {
    return (
      <div className="flex flex-col gap-md">
        <p className="text-body-sm text-[#1e6b3a]">
          Tenant provisioned — database created and migrated.
        </p>
        <div className="rounded-button border border-outline-variant bg-surface-container-low px-md py-sm">
          <p className="text-body-sm text-on-surface-variant mb-sm">
            First admin login — shown once, won&apos;t be shown again after you leave this page.
          </p>
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-sm">
              <span className="text-body-sm text-on-surface-variant">Email:</span>
              <code className="font-mono text-body-sm text-on-surface">{state.result.adminEmail}</code>
            </div>
            <div className="flex items-center gap-sm">
              <span className="text-body-sm text-on-surface-variant">Password:</span>
              <code className="font-mono text-body-sm text-on-surface">{state.result.tempPassword}</code>
              <CopyButton value={state.result.tempPassword} label="Copy password" />
            </div>
          </div>
        </div>
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
          <Input id="slug" name="slug" required placeholder="lowercase-hyphenated" />
        </FormField>
      </div>
      <div className="grid gap-md sm:grid-cols-2">
        <FormField id="planId" label="Plan">
          <Select id="planId" name="planId" options={PLAN_OPTIONS} defaultValue="basic" />
        </FormField>
        <FormField id="contactEmail" label="Contact email">
          <Input id="contactEmail" name="contactEmail" type="email" required />
        </FormField>
      </div>
      <FormField id="notes" label="Notes">
        <Textarea id="notes" name="notes" rows={3} className="min-h-0" />
      </FormField>
      {state?.error ? <p className="text-body-sm text-error">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Provisioning…" : "Provision tenant"}
      </Button>
    </form>
  );
}
