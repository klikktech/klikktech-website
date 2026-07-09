"use client";

import { useActionState } from "react";
import { Button } from "@/components/atoms/button";
import { AdminFormFeedback } from "@/components/molecules/admin-form-feedback";
import { AdminSecretReveal } from "@/components/molecules/admin-secret-reveal";
import { Badge } from "@/components/atoms/badge";

type FormState = { error?: string; link?: string };

interface AdminOnboardingLinkFormProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  completedAt: string | null;
}

export function AdminOnboardingLinkForm({ action, completedAt }: AdminOnboardingLinkFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <div className="flex flex-col gap-md">
      <div className="flex items-center gap-sm">
        <span className="text-body-sm text-on-surface-variant">Status:</span>
        <Badge variant={completedAt ? "success" : "default"}>
          {completedAt ? "Complete" : "Pending"}
        </Badge>
      </div>
      {completedAt ? (
        <p className="text-body-sm text-on-surface-variant">Last onboarded on {completedAt}.</p>
      ) : (
        <p className="text-body-sm text-on-surface-variant">
          Generate a link for the tenant to configure their store.
        </p>
      )}
      <form action={formAction}>
        <Button type="submit" disabled={pending}>
          {pending ? "Generating…" : completedAt ? "Regenerate onboarding link" : "Generate onboarding link"}
        </Button>
      </form>
      {state?.error ? <AdminFormFeedback variant="error" message={state.error} /> : null}
      {state?.link ? (
        <AdminSecretReveal
          description="Share this link with the tenant — it won't be shown again after you leave this page."
          items={[{ label: "Onboarding link", value: state.link, copyLabel: "Copy link" }]}
        />
      ) : null}
    </div>
  );
}
