"use server";

import {
  getTenantByOnboardingToken,
  completeOnboarding,
} from "@/core/logic/tenants";
import { syncOnboardingToTenant } from "@/core/logic/tenant-sync";
import { applyEnabledAddons } from "@/core/logic/tenant-addons";
import { parseStoreSettingsFormData } from "@/core/logic/store-settings-form";
import { ADDON_KEYS } from "@/core/logic/addon-catalog";

type FormState = { error?: string; success?: boolean };

export async function completeOnboardingAction(
  token: string,
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const tenant = await getTenantByOnboardingToken(token);
  if (!tenant) {
    return { error: "This onboarding link is invalid or has expired." };
  }

  const parsed = await parseStoreSettingsFormData(formData, tenant.logoUrl);
  if ("error" in parsed) return { error: parsed.error };

  const selectedAddons = ADDON_KEYS.filter((key) => formData.get(key) === "on");
  await applyEnabledAddons(tenant.id, selectedAddons, (tenant.enabledAddons as string[]) ?? []);

  const updated = await completeOnboarding(tenant.id, parsed.input);

  const result = await syncOnboardingToTenant(updated);
  if (!result.ok) return { error: `Saved, but failed to sync to your store: ${result.error}` };

  return { success: true };
}
