import { Badge } from "@/components/atoms/badge";
import type { TenantStatus } from "@/generated/prisma/client";

type TenantStatusBadgeProps = {
  status: TenantStatus;
};

const STATUS_CONFIG: Record<
  TenantStatus,
  { label: string; variant: "success" | "info" | "default" }
> = {
  TRIAL: { label: "Trial", variant: "info" },
  ACTIVE: { label: "Active", variant: "success" },
  SUSPENDED: { label: "Suspended", variant: "default" },
};

export function TenantStatusBadge({ status }: TenantStatusBadgeProps) {
  const { label, variant } = STATUS_CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}
