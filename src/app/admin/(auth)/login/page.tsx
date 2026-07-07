import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/core/logic/admin-auth";
import { AdminLoginForm } from "@/components/organisms/admin-login-form";
import { adminLoginAction } from "./actions";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect("/admin");
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-surface-container-low px-md py-xl">
      <div className="w-full max-w-sm rounded-card border border-outline-variant bg-surface-container-lowest p-lg shadow-overlay">
        <h1 className="text-headline-md text-on-surface">Super admin</h1>
        <p className="mt-sm text-body-md text-on-surface-variant">Sign in to manage tenants.</p>
        <div className="mt-lg">
          <AdminLoginForm action={adminLoginAction} />
        </div>
      </div>
    </div>
  );
}
