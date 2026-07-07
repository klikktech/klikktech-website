"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
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
      <p className="text-body-sm text-on-surface-variant">
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
      {state?.error ? <p className="text-body-sm text-error">{state.error}</p> : null}
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
