import Link from "next/link";
import { Building2 } from "lucide-react";
import type { Tenant } from "@/generated/prisma/client";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";
import { AdminSectionCard } from "@/components/molecules/admin-section-card";
import { TenantStatusBadge } from "@/components/molecules/tenant-status-badge";

interface AdminTenantsTableProps {
  tenants: Tenant[];
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function AdminTenantsTable({ tenants }: AdminTenantsTableProps) {
  if (tenants.length === 0) {
    return (
      <AdminSectionCard className="text-center">
        <div className="flex flex-col items-center gap-md py-lg">
          <span className="inline-flex size-12 items-center justify-center rounded-card bg-surface-container-low text-on-surface-variant">
            <Icon icon={Building2} size="lg" aria-hidden />
          </span>
          <div>
            <p className="text-body-md font-medium text-on-surface">No tenants yet</p>
            <p className="mt-xs text-body-sm text-on-surface-variant">
              Create your first tenant to get started.
            </p>
          </div>
          <Link href="/admin/tenants/new">
            <Button type="button">Create tenant</Button>
          </Link>
        </div>
      </AdminSectionCard>
    );
  }

  return (
    <AdminSectionCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-body-sm text-on-surface">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low text-label-md text-on-surface-variant">
              <th className="px-lg py-sm">Name</th>
              <th className="px-lg py-sm">Slug</th>
              <th className="px-lg py-sm">Status</th>
              <th className="px-lg py-sm">Plan</th>
              <th className="px-lg py-sm">Onboarding</th>
              <th className="px-lg py-sm">Created</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr
                key={tenant.id}
                className="border-b border-outline-variant last:border-b-0 transition-colors hover:bg-surface-container-low/60"
              >
                <td className="px-lg py-md">
                  <Link
                    href={`/admin/tenants/${tenant.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {tenant.name}
                  </Link>
                  {tenant.storeName && tenant.storeName !== tenant.name ? (
                    <p className="mt-xs text-body-sm text-on-surface-variant">{tenant.storeName}</p>
                  ) : null}
                </td>
                <td className="px-lg py-md font-mono text-on-surface-variant">{tenant.slug}</td>
                <td className="px-lg py-md">
                  <TenantStatusBadge status={tenant.status} />
                </td>
                <td className="px-lg py-md">
                  <Badge variant="accent">{tenant.planId}</Badge>
                </td>
                <td className="px-lg py-md">
                  <Badge variant={tenant.onboardingCompletedAt ? "success" : "default"}>
                    {tenant.onboardingCompletedAt ? "Complete" : "Pending"}
                  </Badge>
                </td>
                <td className="px-lg py-md text-on-surface-variant">{formatDate(tenant.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminSectionCard>
  );
}
