"use client";

import { useActionState } from "react";
import { Button } from "@/components/atoms/button";
import { AdminFormFeedback } from "@/components/molecules/admin-form-feedback";

type FormState = { error?: string };

interface AdminSyncTenantFormProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
}

export function AdminSyncTenantForm({ action }: AdminSyncTenantFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const synced = state !== undefined && !state.error && !pending;

  return (
    <form action={formAction} className="flex flex-col items-start gap-sm">
      <Button type="submit" disabled={pending}>
        {pending ? "Syncing…" : "Sync to tenant DB"}
      </Button>
      {state?.error ? <AdminFormFeedback variant="error" message={state.error} /> : null}
      {synced ? (
        <AdminFormFeedback variant="success" message="Synced successfully to tenant database." />
      ) : null}
    </form>
  );
}
