"use client";

import { AdminTabs, type AdminTab } from "@/components/molecules/admin-tabs";
import { AdminSectionCard } from "@/components/molecules/admin-section-card";
import { AdminTenantForm } from "@/components/organisms/admin-tenant-form";
import { AdminFeatureOverridesEditor } from "@/components/organisms/admin-feature-overrides-editor";
import { AdminEffectiveFeatures } from "@/components/organisms/admin-effective-features";
import { AdminAddonsEditor } from "@/components/organisms/admin-addons-editor";
import { AdminSyncTenantForm } from "@/components/organisms/admin-sync-tenant-form";
import { AdminOnboardingLinkForm } from "@/components/organisms/admin-onboarding-link-form";
import { AdminOnboardingSummary } from "@/components/organisms/admin-onboarding-summary";
import { AdminDeleteTenantForm } from "@/components/organisms/admin-delete-tenant-form";
import type { FeatureKey } from "@/core/logic/feature-keys";
import type { Tenant } from "@/generated/prisma/client";

type OverrideValue = "" | "enabled" | "disabled";
type FormState = { error?: string };
type OnboardingFormState = { error?: string; link?: string };

type TenantFormInitial = {
  name: string;
  slug: string;
  status: string;
  databaseUrl: string;
  contactEmail: string;
  notes: string;
};

type AdminTenantDetailProps = {
  tenant: Tenant;
  initialOverrides: Partial<Record<FeatureKey, OverrideValue>>;
  canDropDatabase: boolean;
  databaseName: string | null;
  updateTenantAction: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  updateFeatureOverridesAction: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  updateEnabledAddonsAction: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  syncTenantAction: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
  generateOnboardingLinkAction: (
    state: OnboardingFormState | undefined,
    formData: FormData,
  ) => Promise<OnboardingFormState>;
  deleteTenantAction: (state: FormState | undefined, formData: FormData) => Promise<FormState>;
};

export function AdminTenantDetail({
  tenant,
  initialOverrides,
  canDropDatabase,
  databaseName,
  updateTenantAction,
  updateFeatureOverridesAction,
  updateEnabledAddonsAction,
  syncTenantAction,
  generateOnboardingLinkAction,
  deleteTenantAction,
}: AdminTenantDetailProps) {
  const registryInitial: TenantFormInitial = {
    name: tenant.name,
    slug: tenant.slug,
    status: tenant.status,
    databaseUrl: tenant.databaseUrl,
    contactEmail: tenant.contactEmail ?? "",
    notes: tenant.notes ?? "",
  };

  const tabs: AdminTab[] = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <>
          <div className="grid gap-lg lg:grid-cols-2">
            <AdminSectionCard
              title="Onboarding"
              description="Send the tenant a one-time link to configure their store."
            >
              <AdminOnboardingLinkForm
                action={generateOnboardingLinkAction}
                completedAt={
                  tenant.onboardingCompletedAt ? tenant.onboardingCompletedAt.toLocaleString() : null
                }
              />
            </AdminSectionCard>

            <AdminSectionCard
              title="Sync to tenant"
              description="Push registry changes into the tenant's live database."
            >
              <AdminSyncTenantForm action={syncTenantAction} />
            </AdminSectionCard>
          </div>

          {tenant.onboardingCompletedAt ? (
            <AdminSectionCard title="Store configuration">
              <AdminOnboardingSummary tenant={tenant} />
            </AdminSectionCard>
          ) : null}
        </>
      ),
    },
    {
      id: "registry",
      label: "Registry",
      content: (
        <AdminSectionCard
          title="Tenant record"
          description="Internal ops label and connection details. The tenant sets their store name during onboarding."
        >
          <AdminTenantForm
            action={updateTenantAction}
            submitLabel="Save changes"
            initial={registryInitial}
          />
        </AdminSectionCard>
      ),
    },
    {
      id: "entitlements",
      label: "Entitlements",
      content: (
        <>
          <AdminSectionCard
            title="Effective features"
            description="What the tenant can access after base package, add-ons, and overrides are applied."
          >
            <AdminEffectiveFeatures
              enabledAddons={tenant.enabledAddons}
              featureOverrides={tenant.featureOverrides}
            />
          </AdminSectionCard>

          <AdminSectionCard
            title="Add-ons"
            description="Toggle paid add-ons. Newly enabled add-ons are logged as one-time purchases."
          >
            <AdminAddonsEditor
              action={updateEnabledAddonsAction}
              initial={(tenant.enabledAddons as string[]) ?? []}
            />
          </AdminSectionCard>

          <AdminSectionCard
            title="Feature overrides"
            description="Force individual features on or off on top of add-ons. Save here, then sync."
          >
            <AdminFeatureOverridesEditor action={updateFeatureOverridesAction} initial={initialOverrides} />
          </AdminSectionCard>

          <div className="rounded-button border border-outline-variant bg-surface-container-low px-md py-sm">
            <p className="text-body-sm text-on-surface-variant">
              After updating add-ons or overrides, sync from the Overview tab to push changes to the tenant
              database.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "danger",
      label: "Danger zone",
      content: (
        <AdminSectionCard
          title="Delete tenant"
          description="Permanently remove this tenant from the registry."
          variant="danger"
        >
          <AdminDeleteTenantForm
            tenantName={tenant.name}
            canDropDatabase={canDropDatabase}
            databaseName={databaseName}
            action={deleteTenantAction}
          />
        </AdminSectionCard>
      ),
    },
  ];

  return <AdminTabs tabs={tabs} defaultTab="overview" />;
}
