import { Badge } from "@/components/atoms/badge";
import { TenantStatusBadge } from "@/components/molecules/tenant-status-badge";
import type { Tenant } from "@/generated/prisma/client";

type AdminTenantHeaderProps = {
  tenant: Pick<
    Tenant,
    "name" | "slug" | "status" | "planId" | "storeName" | "onboardingCompletedAt"
  >;
};

export function AdminTenantHeader({ tenant }: AdminTenantHeaderProps) {
  const isOnboarded = Boolean(tenant.onboardingCompletedAt);

  return (
    <header className="mb-lg">
      <div className="flex flex-wrap items-start justify-between gap-md">
        <div className="min-w-0">
          <h1 className="text-headline-md text-on-surface">{tenant.name}</h1>
          {tenant.storeName && tenant.storeName !== tenant.name ? (
            <p className="mt-xs text-body-md text-on-surface-variant">
              Store: {tenant.storeName}
            </p>
          ) : null}
          <p className="mt-xs font-mono text-body-sm text-on-surface-variant">{tenant.slug}</p>
        </div>
        <div className="flex flex-wrap items-center gap-sm">
          <TenantStatusBadge status={tenant.status} />
          <Badge variant="accent">{tenant.planId}</Badge>
          <Badge variant={isOnboarded ? "success" : "default"}>
            {isOnboarded ? "Onboarded" : "Onboarding pending"}
          </Badge>
        </div>
      </div>
    </header>
  );
}
