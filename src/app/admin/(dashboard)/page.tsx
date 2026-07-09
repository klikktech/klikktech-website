import Link from "next/link";
import { listTenants } from "@/core/logic/tenants";
import { AdminTenantsTable } from "@/components/organisms/admin-tenants-table";
import { AdminDashboardStats } from "@/components/organisms/admin-dashboard-stats";
import { AdminPageHeader } from "@/components/molecules/admin-page-header";
import { Button } from "@/components/atoms/button";

export default async function AdminDashboardPage() {
  const tenants = await listTenants();

  const stats = {
    total: tenants.length,
    active: tenants.filter((t) => t.status === "ACTIVE").length,
    pendingOnboarding: tenants.filter((t) => !t.onboardingCompletedAt).length,
    suspended: tenants.filter((t) => t.status === "SUSPENDED").length,
  };

  return (
    <div>
      <AdminPageHeader
        title="Tenants"
        description="Manage retail-software tenant registry and remote configuration."
        actions={
          <Link href="/admin/tenants/new">
            <Button type="button">New tenant</Button>
          </Link>
        }
      />
      {tenants.length > 0 ? <AdminDashboardStats stats={stats} /> : null}
      <AdminTenantsTable tenants={tenants} />
    </div>
  );
}
