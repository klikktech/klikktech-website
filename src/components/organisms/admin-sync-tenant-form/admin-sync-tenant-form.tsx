"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";

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
      {state?.error ? (
        <p className="text-body-sm text-error">{state.error}</p>
      ) : synced ? (
        <p className="inline-flex items-center gap-xs text-body-sm text-[#1e6b3a]">
          <Icon icon={CheckCircle2} size="sm" aria-hidden />
          Synced successfully.
        </p>
      ) : null}
    </form>
  );
}
