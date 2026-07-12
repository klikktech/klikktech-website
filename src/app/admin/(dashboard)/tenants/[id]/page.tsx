import { notFound } from "next/navigation";
import { getTenant } from "@/core/logic/tenants";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { AdminSectionCard } from "@/components/molecules/admin-section-card";
import { AdminSectionNav } from "@/components/molecules/admin-section-nav";
import { AdminTenantHeader } from "@/components/organisms/admin-tenant-header";
import { AdminTenantForm } from "@/components/organisms/admin-tenant-form";
import { AdminFeatureOverridesEditor } from "@/components/organisms/admin-feature-overrides-editor";
import { AdminEffectiveFeatures } from "@/components/organisms/admin-effective-features";
import { AdminAddonsEditor } from "@/components/organisms/admin-addons-editor";
import { AdminSyncTenantForm } from "@/components/organisms/admin-sync-tenant-form";
import { AdminOnboardingLinkForm } from "@/components/organisms/admin-onboarding-link-form";
import { AdminOnboardingSummary } from "@/components/organisms/admin-onboarding-summary";
import { AdminDeleteTenantForm } from "@/components/organisms/admin-delete-tenant-form";
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

  const sectionNav = [
    { id: "registry", label: "Registry" },
    { id: "features", label: "Features" },
    { id: "addons", label: "Add-ons" },
    { id: "sync", label: "Sync" },
    { id: "onboarding", label: "Onboarding" },
    ...(tenant.onboardingCompletedAt ? [{ id: "store-config", label: "Store config" }] : []),
    { id: "danger", label: "Danger zone" },
  ];

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Tenants", href: "/admin" }, { label: tenant.name }]}
        className="mb-lg pt-0"
      />

      <AdminTenantHeader tenant={tenant} />
      <AdminSectionNav items={sectionNav} />

      <div className="grid gap-lg lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="flex flex-col gap-lg">
          <AdminSectionCard
            id="registry"
            title="Registry"
            description="Internal tenant record — name is your ops label; the tenant sets their store name during onboarding."
          >
            <AdminTenantForm
              action={updateTenantAction.bind(null, tenant.id)}
              submitLabel="Save changes"
              initial={{
                name: tenant.name,
                slug: tenant.slug,
                status: tenant.status,
                databaseUrl: tenant.databaseUrl,
                contactEmail: tenant.contactEmail ?? "",
                notes: tenant.notes ?? "",
              }}
            />
          </AdminSectionCard>

          <AdminSectionCard
            id="features"
            title="Feature overrides"
            description="Override individual features on top of the tenant's base + add-ons. Save here, then sync to push changes."
          >
            <div className="mb-lg rounded-button border border-outline-variant bg-surface-container-low px-md py-sm">
              <p className="text-label-md text-on-surface-variant mb-sm">Effective features</p>
              <AdminEffectiveFeatures
                enabledAddons={tenant.enabledAddons}
                featureOverrides={tenant.featureOverrides}
              />
            </div>
            <AdminFeatureOverridesEditor
              action={updateFeatureOverridesAction.bind(null, tenant.id)}
              initial={initialOverrides}
            />
          </AdminSectionCard>

          <AdminSectionCard
            id="addons"
            title="Add-ons"
            description="Enable or remove paid add-ons for this tenant. Newly added add-ons are logged as a one-time purchase."
          >
            <AdminAddonsEditor
              action={updateEnabledAddonsAction.bind(null, tenant.id)}
              initial={(tenant.enabledAddons as string[]) ?? []}
            />
          </AdminSectionCard>
        </div>

        <aside className="flex flex-col gap-lg lg:sticky lg:top-24">
          <AdminSectionCard
            id="sync"
            title="Sync to tenant"
            description="Pushes add-ons and feature overrides into this tenant's database."
          >
            <AdminSyncTenantForm action={syncTenantAction.bind(null, tenant.id)} />
          </AdminSectionCard>

          <AdminSectionCard
            id="onboarding"
            title="Onboarding"
            description="Generate a one-time link for the tenant to configure their store."
          >
            <AdminOnboardingLinkForm
              action={generateOnboardingLinkAction.bind(null, tenant.id)}
              completedAt={
                tenant.onboardingCompletedAt ? tenant.onboardingCompletedAt.toLocaleString() : null
              }
            />
          </AdminSectionCard>

          {tenant.onboardingCompletedAt ? (
            <AdminSectionCard id="store-config" title="Store configuration">
              <AdminOnboardingSummary tenant={tenant} />
            </AdminSectionCard>
          ) : null}
        </aside>
      </div>

      <AdminSectionCard
        id="danger"
        title="Danger zone"
        description="Permanently remove this tenant from the registry."
        variant="danger"
        className="mt-lg"
      >
        <AdminDeleteTenantForm
          tenantName={tenant.name}
          canDropDatabase={canDropDatabase}
          databaseName={databaseName}
          action={deleteTenantAction.bind(null, tenant.id)}
        />
      </AdminSectionCard>
    </div>
  );
}
