"use server";

import {
  getTenantByOnboardingToken,
  completeOnboarding,
  type OnboardingInput,
} from "@/core/logic/tenants";
import { syncOnboardingToTenant } from "@/core/logic/tenant-sync";
import { applyEnabledAddons } from "@/core/logic/tenant-addons";
import { COLOR_PALETTE_IDS } from "@/core/logic/color-palettes";
import { ADDON_KEYS } from "@/core/logic/addon-catalog";
import { saveUploadedImage } from "@/lib/uploads";

type FormState = { error?: string; success?: boolean };

async function resolveLogoUrl(
  formData: FormData,
  existingLogoUrl: string | null
): Promise<{ logoUrl: string | null; error?: string }> {
  const file = formData.get("logo");
  if (file instanceof File && file.size > 0) {
    try {
      const logoUrl = await saveUploadedImage(file, "tenant-logos");
      return { logoUrl };
    } catch (err) {
      return { logoUrl: existingLogoUrl, error: err instanceof Error ? err.message : "Failed to upload logo." };
    }
  }
  return { logoUrl: existingLogoUrl };
}

export async function completeOnboardingAction(
  token: string,
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const tenant = await getTenantByOnboardingToken(token);
  if (!tenant) {
    return { error: "This onboarding link is invalid or has expired." };
  }

  const storeName = String(formData.get("storeName") ?? "").trim();
  const currency = String(formData.get("currency") ?? "").trim();
  if (!storeName) return { error: "Store name is required." };
  if (!currency) return { error: "Currency is required." };

  const submittedPalette = String(formData.get("colorPaletteId") ?? "");
  const colorPaletteId = (COLOR_PALETTE_IDS as readonly string[]).includes(submittedPalette)
    ? submittedPalette
    : "slate";

  const selectedAddons = ADDON_KEYS.filter((key) => formData.get(key) === "on");

  const { logoUrl, error: logoError } = await resolveLogoUrl(formData, tenant.logoUrl);
  if (logoError) return { error: logoError };

  await applyEnabledAddons(tenant.id, selectedAddons, (tenant.enabledAddons as string[]) ?? []);

  const input: OnboardingInput = {
    storeName,
    themeId: "modern",
    logoUrl,
    colorPaletteId,
    contactEmail: String(formData.get("contactEmail") ?? "").trim() || null,
    contactPhone: String(formData.get("contactPhone") ?? "").trim() || null,
    currency,
    isStoreOpen: formData.get("isStoreOpen") === "on",
  };

  const updated = await completeOnboarding(tenant.id, input);

  const result = await syncOnboardingToTenant(updated);
  if (!result.ok) return { error: `Saved, but failed to sync to your store: ${result.error}` };

  return { success: true };
}
