// Local copy of retail-software's core/logic/features.ts. No shared package
// between the two repos — keep this in sync manually whenever a feature key
// or add-on changes on the retail-software side.
import { ADDON_KEYS, type AddonKey } from "./addon-catalog";

export const FEATURE_KEYS = ["pos", ...ADDON_KEYS] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  pos: "Point of Sale",
  wishlist: "Wishlist",
  sale_popup: "Sale popup",
  whatsapp: "WhatsApp chat",
  faqs: "FAQs page",
};

const BASE_FEATURES: Record<FeatureKey, boolean> = {
  pos: true,
  wishlist: false,
  sale_popup: false,
  whatsapp: false,
  faqs: false,
};

interface FeatureOverrides {
  enabled?: string[];
  disabled?: string[];
}

// Resolves base -> enabledAddons -> tenant-override layers into one effective
// set, most specific wins. Mirrors retail-software's resolveFeatures().
export function resolveFeatures(tenant: { enabledAddons: unknown; featureOverrides: unknown }): Set<FeatureKey> {
  const effective = new Set<FeatureKey>(FEATURE_KEYS.filter((key) => BASE_FEATURES[key]));

  const addons = (tenant.enabledAddons as string[] | null) ?? [];
  for (const key of addons) {
    if ((ADDON_KEYS as readonly string[]).includes(key)) effective.add(key as AddonKey);
  }

  const overrides = tenant.featureOverrides as FeatureOverrides | null;
  overrides?.enabled?.forEach((key) => effective.add(key as FeatureKey));
  overrides?.disabled?.forEach((key) => effective.delete(key as FeatureKey));

  return effective;
}
