import { Building2, CheckCircle2, PauseCircle, Clock } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils/cn";

export type AdminDashboardStatsData = {
  total: number;
  active: number;
  pendingOnboarding: number;
  suspended: number;
};

type AdminDashboardStatsProps = {
  stats: AdminDashboardStatsData;
  className?: string;
};

type StatCardProps = {
  label: string;
  value: number;
  icon: typeof Building2;
  accent?: "default" | "success" | "warning" | "muted";
};

function StatCard({ label, value, icon, accent = "default" }: StatCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-sm rounded-card border border-outline-variant bg-surface-container-lowest p-md",
        accent === "success" && "border-success/30 bg-success-container/30",
        accent === "warning" && "border-secondary-container bg-secondary-container/20",
        accent === "muted" && "bg-surface-container-low",
      )}
    >
      <div className="flex items-center justify-between gap-sm">
        <p className="text-label-md text-on-surface-variant normal-case">{label}</p>
        <span
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-button",
            accent === "success" && "bg-success-container text-on-success-container",
            accent === "warning" && "bg-secondary-container text-on-secondary-container",
            accent === "muted" && "bg-surface-container text-on-surface-variant",
            accent === "default" && "bg-surface-container text-on-surface-variant",
          )}
        >
          <Icon icon={icon} size="sm" aria-hidden />
        </span>
      </div>
      <p className="text-headline-md text-on-surface">{value}</p>
    </article>
  );
}

export function AdminDashboardStats({ stats, className }: AdminDashboardStatsProps) {
  return (
    <div className={cn("mb-lg grid gap-md sm:grid-cols-2 xl:grid-cols-4", className)}>
      <StatCard label="Total tenants" value={stats.total} icon={Building2} />
      <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
      <StatCard
        label="Pending onboarding"
        value={stats.pendingOnboarding}
        icon={Clock}
        accent="warning"
      />
      <StatCard label="Suspended" value={stats.suspended} icon={PauseCircle} accent="muted" />
    </div>
  );
}
