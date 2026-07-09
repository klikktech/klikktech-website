"use client";

import { useState } from "react";
import { useActionState } from "react";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";
import { FormField } from "@/components/molecules/form-field";
import { AdminFormFeedback } from "@/components/molecules/admin-form-feedback";
import { cn } from "@/lib/utils/cn";

type FormState = { error?: string };

interface AdminDeleteTenantFormProps {
  tenantName: string;
  canDropDatabase: boolean;
  databaseName: string | null;
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
}

export function AdminDeleteTenantForm({
  tenantName,
  canDropDatabase,
  databaseName,
  action,
}: AdminDeleteTenantFormProps) {
  const [confirmation, setConfirmation] = useState("");
  const [state, formAction, pending] = useActionState(action, undefined);
  const isConfirmed = confirmation === tenantName;

  return (
    <form action={formAction} className="flex flex-col gap-md">
      <div className="flex items-start gap-sm rounded-button border border-error/20 bg-error-container/30 px-md py-sm">
        <Icon icon={AlertTriangle} size="sm" className="mt-0.5 shrink-0 text-error" aria-hidden />
        <p className="text-body-sm text-on-error-container">
          {canDropDatabase ? (
            <>
              This will permanently delete the tenant registry and drop the Postgres database
              {databaseName ? (
                <>
                  {" "}
                  <code className="font-mono text-on-surface">{databaseName}</code>
                </>
              ) : null}
              . This cannot be undone.
            </>
          ) : (
            <>
              This tenant&apos;s database was not created by the provisioner
              {databaseName ? (
                <>
                  {" "}
                  (<code className="font-mono text-on-surface">{databaseName}</code>)
                </>
              ) : null}
              . Only the registry record will be removed — you must delete the database manually.
            </>
          )}
        </p>
      </div>
      <FormField id="confirmation" label={`Type "${tenantName}" to confirm`}>
        <Input
          id="confirmation"
          name="confirmation"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder={tenantName}
          autoComplete="off"
        />
      </FormField>
      {state?.error ? <AdminFormFeedback variant="error" message={state.error} /> : null}
      <Button
        type="submit"
        disabled={pending || !isConfirmed}
        className={cn(
          "self-start",
          isConfirmed &&
            "border-error bg-error text-on-error hover:bg-error/90 focus-visible:ring-error",
        )}
      >
        {pending ? "Deleting…" : "Delete tenant"}
      </Button>
    </form>
  );
}
