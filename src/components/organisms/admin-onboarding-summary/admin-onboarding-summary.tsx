import { Badge } from "@/components/atoms/badge";
import type { Tenant } from "@/generated/prisma/client";

type AdminOnboardingSummaryProps = {
  tenant: Pick<
    Tenant,
    | "storeName"
    | "themeId"
    | "logoUrl"
    | "primaryColor"
    | "secondaryColor"
    | "accentColor"
    | "contactEmail"
    | "contactPhone"
    | "currency"
    | "isStoreOpen"
    | "onboardingCompletedAt"
  >;
};

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-xs">
      <span
        className="size-5 shrink-0 rounded-tag border border-outline-variant"
        style={{ backgroundColor: color }}
        title={color}
      />
      <span className="text-label-md text-on-surface-variant">{label}</span>
    </div>
  );
}

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

      {(tenant.primaryColor || tenant.secondaryColor || tenant.accentColor) ? (
        <div>
          <dt className="text-label-md text-on-surface-variant mb-sm">Brand colors</dt>
          <dd className="flex flex-wrap gap-md">
            {tenant.primaryColor ? (
              <ColorSwatch color={tenant.primaryColor} label="Primary" />
            ) : null}
            {tenant.secondaryColor ? (
              <ColorSwatch color={tenant.secondaryColor} label="Secondary" />
            ) : null}
            {tenant.accentColor ? (
              <ColorSwatch color={tenant.accentColor} label="Accent" />
            ) : null}
          </dd>
        </div>
      ) : null}

      <SummaryRow
        label="Completed"
        value={tenant.onboardingCompletedAt.toLocaleString()}
      />
    </dl>
  );
}
