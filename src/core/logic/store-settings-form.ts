import "server-only";

import { COLOR_PALETTE_IDS } from "./color-palettes";
import { saveUploadedImage } from "@/lib/uploads";

export interface StoreSettingsInput {
  storeName: string;
  themeId: string;
  logoUrl?: string | null;
  colorPaletteId: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  currency: string;
  isStoreOpen: boolean;
  storeAddress: string;
  storeLatitude: number | null;
  storeLongitude: number | null;
}

type ParseResult = { input: StoreSettingsInput } | { error: string };

function parseCoordinate(value: FormDataEntryValue | null): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function parseStoreSettingsFormData(
  formData: FormData,
  existingLogoUrl: string | null,
): Promise<ParseResult> {
  const storeName = String(formData.get("storeName") ?? "").trim();
  const currency = String(formData.get("currency") ?? "").trim();
  const storeAddress = String(formData.get("storeAddress") ?? "").trim();

  if (!storeName) return { error: "Store name is required." };
  if (!currency) return { error: "Currency is required." };
  if (!storeAddress) return { error: "Store address is required." };

  const submittedPalette = String(formData.get("colorPaletteId") ?? "");
  const colorPaletteId = (COLOR_PALETTE_IDS as readonly string[]).includes(submittedPalette)
    ? submittedPalette
    : "slate";

  const file = formData.get("logo");
  let logoUrl = existingLogoUrl;
  if (file instanceof File && file.size > 0) {
    try {
      logoUrl = await saveUploadedImage(file, "tenant-logos");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Failed to upload logo." };
    }
  }

  return {
    input: {
      storeName,
      themeId: "modern",
      logoUrl,
      colorPaletteId,
      contactEmail: String(formData.get("contactEmail") ?? "").trim() || null,
      contactPhone: String(formData.get("contactPhone") ?? "").trim() || null,
      currency,
      isStoreOpen: formData.get("isStoreOpen") === "on",
      storeAddress,
      storeLatitude: parseCoordinate(formData.get("storeLatitude")),
      storeLongitude: parseCoordinate(formData.get("storeLongitude")),
    },
  };
}
