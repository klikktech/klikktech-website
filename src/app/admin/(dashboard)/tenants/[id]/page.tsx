import { notFound } from "next/navigation";
import { getTenant } from "@/core/logic/tenants";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { AdminTenantHeader } from "@/components/organisms/admin-tenant-header";
import { AdminTenantDetail } from "@/components/organisms/admin-tenant-detail";
import {
  updateTenantAction,
  updateFeatureOverridesAction,
  updateEnabledAddonsAction,
  syncTenantAction,
  generateOnboardingLinkAction,
  deleteTenantAction,
} from "../actions";
import { canDeprovisionTenantDatabase } from "@/core/logic/tenant-provisioning";
import type { FeatureKey } from "@/core/logic/feature-keys";

interface FeatureOverrides {
  enabled?: string[];
  disabled?: string[];
}

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tenant = await getTenant(id);
  if (!tenant) notFound();

  const overrides = tenant.featureOverrides as unknown as FeatureOverrides | null;
  const initialOverrides: Partial<Record<FeatureKey, "" | "enabled" | "disabled">> = {};
  overrides?.enabled?.forEach((key) => {
    initialOverrides[key as FeatureKey] = "enabled";
  });
  overrides?.disabled?.forEach((key) => {
    initialOverrides[key as FeatureKey] = "disabled";
  });

  const canDropDatabase = canDeprovisionTenantDatabase(tenant.slug, tenant.databaseUrl);
  let databaseName: string | null = null;
  try {
    databaseName = decodeURIComponent(new URL(tenant.databaseUrl).pathname.replace(/^\//, ""));
  } catch {
    databaseName = null;
  }

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Tenants", href: "/admin" }, { label: tenant.name }]}
        className="mb-lg pt-0"
      />

      <AdminTenantHeader tenant={tenant} />

      <AdminTenantDetail
        tenant={tenant}
        initialOverrides={initialOverrides}
        canDropDatabase={canDropDatabase}
        databaseName={databaseName}
        updateTenantAction={updateTenantAction.bind(null, tenant.id)}
        updateFeatureOverridesAction={updateFeatureOverridesAction.bind(null, tenant.id)}
        updateEnabledAddonsAction={updateEnabledAddonsAction.bind(null, tenant.id)}
        syncTenantAction={syncTenantAction.bind(null, tenant.id)}
        generateOnboardingLinkAction={generateOnboardingLinkAction.bind(null, tenant.id)}
        deleteTenantAction={deleteTenantAction.bind(null, tenant.id)}
      />
    </div>
  );
}
