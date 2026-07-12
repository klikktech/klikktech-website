import { Badge } from "@/components/atoms/badge";
import { TenantStatusBadge } from "@/components/molecules/tenant-status-badge";
import type { Tenant } from "@/generated/prisma/client";

type AdminTenantHeaderProps = {
  tenant: Pick<
    Tenant,
    "name" | "slug" | "status" | "enabledAddons" | "storeName" | "onboardingCompletedAt"
  >;
};

export function AdminTenantHeader({ tenant }: AdminTenantHeaderProps) {
  const isOnboarded = Boolean(tenant.onboardingCompletedAt);
  const addonCount = Array.isArray(tenant.enabledAddons) ? tenant.enabledAddons.length : 0;

  return (
    <header className="mb-lg rounded-card border border-outline-variant bg-surface-container-low p-lg">
      <div className="flex flex-wrap items-start justify-between gap-md">
        <div className="min-w-0">
          <h1 className="text-headline-md text-on-surface">{tenant.name}</h1>
          {tenant.storeName && tenant.storeName !== tenant.name ? (
            <p className="mt-xs text-body-md text-on-surface-variant">Store: {tenant.storeName}</p>
          ) : null}
          <p className="mt-xs font-mono text-body-sm text-on-surface-variant">{tenant.slug}</p>
        </div>
        <div className="flex flex-wrap items-center gap-sm">
          <TenantStatusBadge status={tenant.status} />
          <Badge variant="accent">{addonCount} add-on{addonCount === 1 ? "" : "s"}</Badge>
          <Badge variant={isOnboarded ? "success" : "default"}>
            {isOnboarded ? "Onboarded" : "Onboarding pending"}
          </Badge>
        </div>
      </div>
    </header>
  );
}
