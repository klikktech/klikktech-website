"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Search } from "lucide-react";
import type { Tenant, TenantStatus } from "@/generated/prisma/client";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import { Icon } from "@/components/atoms/icon";
import { AdminSectionCard } from "@/components/molecules/admin-section-card";
import { TenantStatusBadge } from "@/components/molecules/tenant-status-badge";

interface AdminTenantsTableProps {
  tenants: Tenant[];
}

type StatusFilter = "all" | TenantStatus;
type OnboardingFilter = "all" | "complete" | "pending";

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function countAddons(enabledAddons: unknown) {
  return Array.isArray(enabledAddons) ? enabledAddons.length : 0;
}

export function AdminTenantsTable({ tenants }: AdminTenantsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [onboardingFilter, setOnboardingFilter] = useState<OnboardingFilter>("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tenants.filter((tenant) => {
      if (statusFilter !== "all" && tenant.status !== statusFilter) return false;
      if (onboardingFilter === "complete" && !tenant.onboardingCompletedAt) return false;
      if (onboardingFilter === "pending" && tenant.onboardingCompletedAt) return false;
      if (!query) return true;
      return (
        tenant.name.toLowerCase().includes(query) ||
        tenant.slug.toLowerCase().includes(query) ||
        (tenant.storeName?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [tenants, search, statusFilter, onboardingFilter]);

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
      <div className="flex flex-col gap-md border-b border-outline-variant bg-surface-container-low p-md sm:flex-row sm:items-end">
        <div className="relative min-w-0 flex-1">
          <Icon
            icon={Search}
            size="sm"
            className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search by name or slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            aria-label="Search tenants"
          />
        </div>
        <div className="flex flex-wrap gap-sm">
          <Select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            options={[
              { label: "All statuses", value: "all" },
              { label: "Trial", value: "TRIAL" },
              { label: "Active", value: "ACTIVE" },
              { label: "Suspended", value: "SUSPENDED" },
            ]}
            className="min-w-36"
          />
          <Select
            aria-label="Filter by onboarding"
            value={onboardingFilter}
            onChange={(e) => setOnboardingFilter(e.target.value as OnboardingFilter)}
            options={[
              { label: "All onboarding", value: "all" },
              { label: "Complete", value: "complete" },
              { label: "Pending", value: "pending" },
            ]}
            className="min-w-40"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-lg py-xl text-center">
          <p className="text-body-md text-on-surface-variant">No tenants match your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm text-on-surface">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-label-md text-on-surface-variant">
                <th className="px-lg py-sm">Name</th>
                <th className="px-lg py-sm">Slug</th>
                <th className="px-lg py-sm">Status</th>
                <th className="px-lg py-sm">Add-ons</th>
                <th className="px-lg py-sm">Onboarding</th>
                <th className="px-lg py-sm">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tenant) => (
                <tr
                  key={tenant.id}
                  className="cursor-pointer border-b border-outline-variant transition-colors last:border-b-0 hover:bg-surface-container-low/60"
                  onClick={() => router.push(`/admin/tenants/${tenant.id}`)}
                >
                  <td className="px-lg py-md">
                    <Link
                      href={`/admin/tenants/${tenant.id}`}
                      className="font-medium text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
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
                    <Badge variant="accent">{countAddons(tenant.enabledAddons)}</Badge>
                  </td>
                  <td className="px-lg py-md">
                    <Badge variant={tenant.onboardingCompletedAt ? "success" : "default"}>
                      {tenant.onboardingCompletedAt ? "Complete" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-lg py-md text-on-surface-variant">
                    {formatDate(tenant.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t border-outline-variant bg-surface-container-low px-lg py-sm">
        <p className="text-body-sm text-on-surface-variant">
          Showing {filtered.length} of {tenants.length} tenant{tenants.length === 1 ? "" : "s"}
        </p>
      </div>
    </AdminSectionCard>
  );
}
