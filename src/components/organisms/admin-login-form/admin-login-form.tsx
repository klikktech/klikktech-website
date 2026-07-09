"use client";

import { useActionState, useId } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
import { AdminFormFeedback } from "@/components/molecules/admin-form-feedback";

type LoginState = { error?: string };

interface AdminLoginFormProps {
  action: (state: LoginState | undefined, formData: FormData) => Promise<LoginState>;
}

export function AdminLoginForm({ action }: AdminLoginFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const fieldId = useId();

  return (
    <form action={formAction} className="flex flex-col gap-md">
      <FormField id={`${fieldId}-email`} label="Email">
        <Input
          id={`${fieldId}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </FormField>
      <FormField id={`${fieldId}-password`} label="Password">
        <Input
          id={`${fieldId}-password`}
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </FormField>
      {state?.error ? <AdminFormFeedback variant="error" message={state.error} /> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
