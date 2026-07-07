"use client";

import { useActionState } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";

type LoginState = { error?: string };

interface AdminLoginFormProps {
  action: (state: LoginState | undefined, formData: FormData) => Promise<LoginState>;
}

export function AdminLoginForm({ action }: AdminLoginFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-md">
      <FormField id="email" label="Email">
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </FormField>
      <FormField id="password" label="Password">
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </FormField>
      {state?.error ? (
        <p className="rounded-button bg-error-container px-md py-sm text-body-sm text-on-error-container">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
