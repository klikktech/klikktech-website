import { AdminTenantForm } from "@/components/organisms/admin-tenant-form";
import { createTenantAction } from "../actions";

export default function NewTenantPage() {
  return (
    <div>
      <h1 className="text-headline-md text-on-surface mb-lg">New tenant</h1>
      <AdminTenantForm action={createTenantAction} submitLabel="Create tenant" />
    </div>
  );
}
