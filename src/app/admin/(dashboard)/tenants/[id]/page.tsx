import { notFound } from "next/navigation";
import { getTenant } from "@/core/logic/tenants";
import { AdminTenantForm } from "@/components/organisms/admin-tenant-form";
import { AdminFeatureOverridesEditor } from "@/components/organisms/admin-feature-overrides-editor";
import { AdminSyncTenantForm } from "@/components/organisms/admin-sync-tenant-form";
import { AdminOnboardingLinkForm } from "@/components/organisms/admin-onboarding-link-form";
import {
  updateTenantAction,
  updateFeatureOverridesAction,
  syncTenantAction,
  generateOnboardingLinkAction,
} from "../actions";
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

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <h1 className="text-headline-md text-on-surface mb-lg">{tenant.name}</h1>
        <AdminTenantForm
          action={updateTenantAction.bind(null, tenant.id)}
          submitLabel="Save changes"
          initial={{
            name: tenant.name,
            slug: tenant.slug,
            status: tenant.status,
            planId: tenant.planId,
            databaseUrl: tenant.databaseUrl,
            contactEmail: tenant.contactEmail ?? "",
            notes: tenant.notes ?? "",
          }}
        />
      </div>

      <div>
        <h2 className="text-body-lg font-semibold text-on-surface mb-md">Feature overrides</h2>
        <AdminFeatureOverridesEditor
          action={updateFeatureOverridesAction.bind(null, tenant.id)}
          initial={initialOverrides}
        />
      </div>

      <div>
        <h2 className="text-body-lg font-semibold text-on-surface mb-md">Sync to tenant database</h2>
        <p className="text-body-sm text-on-surface-variant mb-sm">
          Pushes the plan and feature overrides above into this tenant&apos;s own database.
        </p>
        <AdminSyncTenantForm action={syncTenantAction.bind(null, tenant.id)} />
      </div>

      <div>
        <h2 className="text-body-lg font-semibold text-on-surface mb-md">Onboarding</h2>
        <p className="text-body-sm text-on-surface-variant mb-sm">
          Generates a one-time link for the tenant to set up their store name, logo, theme, contact info,
          currency, and brand colors themselves.
        </p>
        <AdminOnboardingLinkForm
          action={generateOnboardingLinkAction.bind(null, tenant.id)}
          completedAt={tenant.onboardingCompletedAt ? tenant.onboardingCompletedAt.toLocaleString() : null}
        />
      </div>
    </div>
  );
}
