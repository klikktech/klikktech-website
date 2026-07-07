// Local copy of retail-software's core/logic/features.ts. No shared package
// between the two repos — keep this in sync manually whenever a feature key,
// plan, or theme changes on the retail-software side.
export const FEATURE_KEYS = ["pos", "theme_classic", "theme_minimal"] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];

export const PLAN_IDS = ["basic", "premium"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

const BASE_FEATURES: Record<FeatureKey, boolean> = {
  pos: true,
  theme_classic: false,
  theme_minimal: false,
};

const PLAN_FEATURES: Record<string, FeatureKey[]> = {
  basic: [],
  premium: ["theme_classic", "theme_minimal"],
};

interface FeatureOverrides {
  enabled?: string[];
  disabled?: string[];
}

// Resolves base -> plan -> tenant-override layers into one effective set, most specific wins.
export function resolveFeatures(tenant: {
  planId: string;
  featureOverrides: unknown;
}): Set<FeatureKey> {
  const effective = new Set<FeatureKey>(FEATURE_KEYS.filter((key) => BASE_FEATURES[key]));
  for (const key of PLAN_FEATURES[tenant.planId] ?? []) effective.add(key);

  const overrides = tenant.featureOverrides as FeatureOverrides | null;
  overrides?.enabled?.forEach((key) => effective.add(key as FeatureKey));
  overrides?.disabled?.forEach((key) => effective.delete(key as FeatureKey));

  return effective;
}

export const THEME_IDS = ["modern", "classic", "minimal"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

const THEME_FEATURE: Partial<Record<ThemeId, FeatureKey>> = {
  classic: "theme_classic",
  minimal: "theme_minimal",
};

// Only used server-side (to build onboarding-form options and to re-validate
// a submitted themeId) — this is the sole remaining enforcement point since
// retail-software's own settings page is now read-only display.
export function entitledThemeIds(features: Set<FeatureKey>): ThemeId[] {
  return THEME_IDS.filter((id) => {
    const feature = THEME_FEATURE[id];
    return !feature || features.has(feature);
  });
}
