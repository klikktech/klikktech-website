import Link from "next/link";
import type { Tenant } from "@/generated/prisma/client";

interface AdminTenantsTableProps {
  tenants: Tenant[];
}

export function AdminTenantsTable({ tenants }: AdminTenantsTableProps) {
  if (tenants.length === 0) {
    return <p className="text-body-md text-on-surface-variant">No tenants yet.</p>;
  }

  return (
    <table className="w-full text-left text-body-sm text-on-surface">
      <thead>
        <tr className="border-b border-outline-variant text-label-md text-on-surface-variant">
          <th className="py-sm">Name</th>
          <th className="py-sm">Slug</th>
          <th className="py-sm">Status</th>
          <th className="py-sm">Plan</th>
        </tr>
      </thead>
      <tbody>
        {tenants.map((tenant) => (
          <tr key={tenant.id} className="border-b border-outline-variant">
            <td className="py-sm">
              <Link href={`/admin/tenants/${tenant.id}`} className="text-primary hover:underline">
                {tenant.name}
              </Link>
            </td>
            <td className="py-sm">{tenant.slug}</td>
            <td className="py-sm">{tenant.status}</td>
            <td className="py-sm">{tenant.planId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
