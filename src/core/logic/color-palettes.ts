// Local copy of retail-software's lib/color-palettes.ts. No shared package
// between the two repos — keep this in sync manually. Carries an extra
// `bestFor` field the onboarding picker UI needs that retail-software doesn't.
export const COLOR_PALETTE_IDS = ["slate", "ocean", "forest", "burgundy", "espresso"] as const;
export type ColorPaletteId = (typeof COLOR_PALETTE_IDS)[number];

export interface ColorPalette {
  id: ColorPaletteId;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  bestFor: string;
}

export const COLOR_PALETTES: Record<ColorPaletteId, ColorPalette> = {
  slate: {
    id: "slate",
    label: "Slate",
    primary: "#1e293b",
    secondary: "#64748b",
    accent: "#475569",
    bestFor: "Neutral default; any store type",
  },
  ocean: {
    id: "ocean",
    label: "Ocean Blue",
    primary: "#1e40af",
    secondary: "#3b82f6",
    accent: "#0ea5e9",
    bestFor: "General retail; trustworthy e-commerce",
  },
  forest: {
    id: "forest",
    label: "Forest Emerald",
    primary: "#065f46",
    secondary: "#059669",
    accent: "#34d399",
    bestFor: "Grocery, wellness, eco/outdoor",
  },
  burgundy: {
    id: "burgundy",
    label: "Burgundy",
    primary: "#881337",
    secondary: "#be123c",
    accent: "#fb7185",
    bestFor: "Fashion, jewelry, beauty",
  },
  espresso: {
    id: "espresso",
    label: "Espresso Amber",
    primary: "#78350f",
    secondary: "#b45309",
    accent: "#f59e0b",
    bestFor: "Home goods, coffee, artisanal",
  },
};

export function getColorPalette(id: string): ColorPalette {
  return COLOR_PALETTES[id as ColorPaletteId] ?? COLOR_PALETTES.slate;
}
