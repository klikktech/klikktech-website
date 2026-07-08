import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { AdminSectionCard } from "@/components/molecules/admin-section-card";
import { ProvisionTenantForm } from "@/components/organisms/provision-tenant-form";
import { provisionTenantAction } from "../actions";

export default function NewTenantPage() {
  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Tenants", href: "/admin" }, { label: "New tenant" }]}
        className="mb-lg pt-0"
      />
      <h1 className="text-headline-md text-on-surface mb-lg">New tenant</h1>
      <AdminSectionCard
        title="Provision tenant"
        description="Creates a real local database for this tenant, runs retail-software's migrations against it, and seeds their first admin login — no manual database setup needed."
        className="max-w-2xl"
      >
        <ProvisionTenantForm action={provisionTenantAction} />
      </AdminSectionCard>
    </div>
  );
}
