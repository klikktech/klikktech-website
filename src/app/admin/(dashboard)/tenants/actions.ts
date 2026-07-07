"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/core/logic/admin-auth";
import {
  createTenant,
  updateTenant,
  updateFeatureOverrides,
  getTenant,
  generateOnboardingLink,
  type TenantInput,
} from "@/core/logic/tenants";
import { syncFeaturesToTenant } from "@/core/logic/tenant-sync";
import { PLAN_IDS, FEATURE_KEYS } from "@/core/logic/feature-keys";
import { siteUrl } from "@/lib/seo/site-config";
import type { TenantStatus } from "@/generated/prisma/client";

type FormState = { error?: string };
type OnboardingLinkState = { error?: string; link?: string };

function parseTenantInput(formData: FormData): TenantInput | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const status = String(formData.get("status") ?? "TRIAL") as TenantStatus;
  const planId = String(formData.get("planId") ?? "basic");
  const databaseUrl = String(formData.get("databaseUrl") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name) return { error: "Name is required." };
  if (!slug) return { error: "Slug is required." };
  if (!databaseUrl) return { error: "Database URL is required." };
  if (!(PLAN_IDS as readonly string[]).includes(planId)) return { error: "Invalid plan." };

  return {
    name,
    slug,
    status,
    planId,
    databaseUrl,
    contactEmail: contactEmail || null,
    notes: notes || null,
  };
}

export async function createTenantAction(
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const input = parseTenantInput(formData);
  if ("error" in input) return input;

  const tenant = await createTenant(input);
  revalidatePath("/admin");
  redirect(`/admin/tenants/${tenant.id}`);
}

export async function updateTenantAction(
  id: string,
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const input = parseTenantInput(formData);
  if ("error" in input) return input;

  await updateTenant(id, input);
  revalidatePath("/admin");
  revalidatePath(`/admin/tenants/${id}`);
  return {};
}

export async function updateFeatureOverridesAction(
  id: string,
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const enabled: string[] = [];
  const disabled: string[] = [];
  for (const key of FEATURE_KEYS) {
    const value = formData.get(key);
    if (value === "enabled") enabled.push(key);
    else if (value === "disabled") disabled.push(key);
  }

  await updateFeatureOverrides(id, { enabled, disabled });
  revalidatePath(`/admin/tenants/${id}`);
  return {};
}

export async function syncTenantAction(
  id: string,
  _prevState: FormState | undefined,
  _formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const tenant = await getTenant(id);
  if (!tenant) return { error: "Tenant not found." };

  const result = await syncFeaturesToTenant(tenant);
  if (!result.ok) return { error: `Sync failed: ${result.error}` };
  return {};
}

export async function generateOnboardingLinkAction(
  id: string,
  _prevState: OnboardingLinkState | undefined,
  _formData: FormData
): Promise<OnboardingLinkState> {
  await requireAdmin();
  const token = await generateOnboardingLink(id);
  revalidatePath(`/admin/tenants/${id}`);
  return { link: `${siteUrl.replace(/\/$/, "")}/onboarding/${token}` };
}
