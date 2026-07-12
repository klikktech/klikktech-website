import { cn } from "@/lib/utils/cn";
import type { ColorPalette } from "@/core/logic/color-palettes";

interface PalettePreviewCardProps {
  palette: ColorPalette;
  selected: boolean;
  onSelect?: () => void;
}

// Static mock preview (mini header + product card + CTA), not a live iframe
// into a tenant storefront — keeps onboarding self-contained in this repo.
export function PalettePreviewCard({ palette, selected, onSelect }: PalettePreviewCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex flex-col overflow-hidden rounded-card border text-left transition-colors",
        selected ? "border-primary ring-2 ring-primary" : "border-outline-variant hover:border-primary/50"
      )}
    >
      <div
        className="flex items-center justify-between px-md py-sm"
        style={{ backgroundColor: palette.primary }}
      >
        <span className="text-label-md font-medium text-white">{palette.label}</span>
      </div>
      <div className="flex flex-col gap-xs p-md">
        <div className="h-10 rounded bg-surface-container-low" />
        <div className="h-2 w-3/4 rounded" style={{ backgroundColor: palette.secondary }} />
        <div
          className="mt-xs rounded px-sm py-xs text-center text-label-sm text-white"
          style={{ backgroundColor: palette.accent }}
        >
          Add to cart
        </div>
        <p className="mt-xs text-body-sm text-on-surface-variant">{palette.bestFor}</p>
      </div>
    </button>
  );
}
