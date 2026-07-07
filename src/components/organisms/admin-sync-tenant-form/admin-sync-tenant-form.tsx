"use client";

import { useActionState } from "react";
import { Button } from "@/components/atoms/button";

type FormState = { error?: string };

interface AdminSyncTenantFormProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
}

export function AdminSyncTenantForm({ action }: AdminSyncTenantFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col items-start gap-sm">
      <Button type="submit" disabled={pending}>
        {pending ? "Syncing…" : "Sync to tenant DB"}
      </Button>
      {state?.error ? (
        <p className="text-body-sm text-error">{state.error}</p>
      ) : state ? (
        <p className="text-body-sm text-on-surface-variant">Synced successfully.</p>
      ) : null}
    </form>
  );
}
