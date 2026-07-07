import Link from "next/link";
import { listTenants } from "@/core/logic/tenants";
import { AdminTenantsTable } from "@/components/organisms/admin-tenants-table";
import { Button } from "@/components/atoms/button";

export default async function AdminDashboardPage() {
  const tenants = await listTenants();

  return (
    <div>
      <div className="mb-lg flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Tenants</h1>
        <Link href="/admin/tenants/new">
          <Button type="button">New tenant</Button>
        </Link>
      </div>
      <AdminTenantsTable tenants={tenants} />
    </div>
  );
}
