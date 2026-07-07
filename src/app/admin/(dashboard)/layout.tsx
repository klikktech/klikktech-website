import Link from "next/link";
import { requireAdmin } from "@/core/logic/admin-auth";
import { Button } from "@/components/atoms/button";
import { adminLogoutAction } from "../actions";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      <header className="flex items-center justify-between border-b border-outline-variant bg-surface px-lg py-md">
        <Link href="/admin" className="text-label-md text-on-surface font-semibold">
          Super admin
        </Link>
        <div className="flex items-center gap-md">
          <span className="text-body-sm text-on-surface-variant">{admin.fullName}</span>
          <form action={adminLogoutAction}>
            <Button type="submit" variant="secondary">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-lg py-xl">{children}</main>
    </div>
  );
}
