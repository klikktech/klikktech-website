import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/core/logic/admin-auth";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  redirect(admin ? "/admin" : "/");
}
