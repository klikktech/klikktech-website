import { requireAdmin } from "@/core/logic/admin-auth";
import { AdminLayout } from "@/components/templates/admin-layout";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return <AdminLayout adminName={admin.fullName}>{children}</AdminLayout>;
}
