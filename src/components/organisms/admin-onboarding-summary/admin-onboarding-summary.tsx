import { Badge } from "@/components/atoms/badge";
import { getColorPalette } from "@/core/logic/color-palettes";
import type { Tenant } from "@/generated/prisma/client";

type AdminOnboardingSummaryProps = {
  tenant: Pick<
    Tenant,
    | "storeName"
    | "themeId"
    | "logoUrl"
    | "colorPaletteId"
    | "contactEmail"
    | "contactPhone"
    | "currency"
    | "isStoreOpen"
    | "onboardingCompletedAt"
  >;
};

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-xs sm:flex-row sm:items-baseline sm:justify-between">
      <dt className="text-label-md text-on-surface-variant">{label}</dt>
      <dd className="text-body-sm text-on-surface sm:text-right">{value}</dd>
    </div>
  );
}

export function AdminOnboardingSummary({ tenant }: AdminOnboardingSummaryProps) {
  if (!tenant.onboardingCompletedAt) {
    return (
      <p className="text-body-sm text-on-surface-variant">
        The tenant has not completed onboarding yet.
      </p>
    );
  }

  const palette = getColorPalette(tenant.colorPaletteId);

  return (
    <dl className="flex flex-col gap-md">
      {tenant.logoUrl ? (
        <div>
          <dt className="text-label-md text-on-surface-variant mb-xs">Logo</dt>
          <dd>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tenant.logoUrl}
              alt={`${tenant.storeName ?? "Tenant"} logo`}
              className="h-12 w-auto rounded-button border border-outline-variant bg-surface-container-low object-contain p-xs"
            />
          </dd>
        </div>
      ) : null}

      <SummaryRow label="Store name" value={tenant.storeName ?? "—"} />
      <SummaryRow label="Theme" value={tenant.themeId ?? "—"} />
      <SummaryRow label="Currency" value={tenant.currency ?? "—"} />
      <SummaryRow
        label="Store status"
        value={
          <Badge variant={tenant.isStoreOpen ? "success" : "default"}>
            {tenant.isStoreOpen ? "Open" : "Closed"}
          </Badge>
        }
      />
      {tenant.contactEmail ? <SummaryRow label="Contact email" value={tenant.contactEmail} /> : null}
      {tenant.contactPhone ? <SummaryRow label="Contact phone" value={tenant.contactPhone} /> : null}

      <SummaryRow
        label="Color palette"
        value={
          <span className="flex items-center justify-end gap-xs">
            <span className="flex -space-x-1">
              {[palette.primary, palette.secondary, palette.accent].map((color) => (
                <span
                  key={color}
                  className="size-4 rounded-full border border-surface"
                  style={{ backgroundColor: color }}
                />
              ))}
            </span>
            {palette.label}
          </span>
        }
      />

      <SummaryRow
        label="Completed"
        value={tenant.onboardingCompletedAt.toLocaleString()}
      />
    </dl>
  );
}
