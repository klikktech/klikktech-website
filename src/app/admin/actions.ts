"use server";

import { redirect } from "next/navigation";
import { destroyCurrentSession } from "@/core/logic/admin-auth";

export async function adminLogoutAction() {
  await destroyCurrentSession();
  redirect("/");
}
