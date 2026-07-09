import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { AdminSectionCard } from "@/components/molecules/admin-section-card";
import { AdminPageHeader } from "@/components/molecules/admin-page-header";
import { ProvisionTenantForm } from "@/components/organisms/provision-tenant-form";
import { AdminTenantForm } from "@/components/organisms/admin-tenant-form";
import { isAutoProvisioningConfigured } from "@/core/logic/tenant-provisioning";
import { provisionTenantAction, createTenantAction } from "../actions";

export default function NewTenantPage() {
  const autoProvisioning = isAutoProvisioningConfigured();

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Tenants", href: "/admin" }, { label: "New tenant" }]}
        className="mb-lg pt-0"
      />
      <AdminPageHeader
        title="New tenant"
        description={
          autoProvisioning
            ? "Provision a new tenant database with migrations and first admin login."
            : "Register an already-provisioned tenant database."
        }
      />
      {autoProvisioning ? (
        <AdminSectionCard
          title="Provision tenant"
          description="Creates a real local database for this tenant, runs retail-software's migrations against it, and seeds their first admin login — no manual database setup needed."
          className="max-w-2xl"
        >
          <ProvisionTenantForm action={provisionTenantAction} />
        </AdminSectionCard>
      ) : (
        <AdminSectionCard
          title="Register tenant"
          description="Automatic provisioning isn't configured in this environment — register an already-provisioned tenant database instead."
          className="max-w-2xl"
        >
          <AdminTenantForm action={createTenantAction} submitLabel="Create tenant" />
        </AdminSectionCard>
      )}
    </div>
  );
}
