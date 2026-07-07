"use client";

import { useActionState } from "react";
import { Button } from "@/components/atoms/button";

type FormState = { error?: string; link?: string };

interface AdminOnboardingLinkFormProps {
  action: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  completedAt: string | null;
}

export function AdminOnboardingLinkForm({ action, completedAt }: AdminOnboardingLinkFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <div className="flex flex-col gap-sm">
      {completedAt ? (
        <p className="text-body-sm text-on-surface-variant">Onboarded on {completedAt}.</p>
      ) : (
        <p className="text-body-sm text-on-surface-variant">Not onboarded yet.</p>
      )}
      <form action={formAction}>
        <Button type="submit" disabled={pending}>
          {pending ? "Generating…" : completedAt ? "Regenerate onboarding link" : "Generate onboarding link"}
        </Button>
      </form>
      {state?.error ? <p className="text-body-sm text-error">{state.error}</p> : null}
      {state?.link ? (
        <div className="rounded-button border border-outline-variant bg-surface-container-lowest px-md py-sm">
          <p className="text-body-sm text-on-surface-variant mb-xs">
            Share this link with the tenant — it won&apos;t be shown again after you leave this page.
          </p>
          <code className="text-body-sm text-on-surface break-all">{state.link}</code>
        </div>
      ) : null}
    </div>
  );
}
