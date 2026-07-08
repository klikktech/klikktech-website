"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/core/logic/admin-auth";
import {
  createTenant,
  updateTenant,
  updateFeatureOverrides,
  getTenant,
  deleteTenant,
  generateOnboardingLink,
  type TenantInput,
} from "@/core/logic/tenants";
import {
  provisionTenantDatabase,
  deprovisionTenantDatabase,
  canDeprovisionTenantDatabase,
} from "@/core/logic/tenant-provisioning";
import { syncFeaturesToTenant } from "@/core/logic/tenant-sync";
import { PLAN_IDS, FEATURE_KEYS } from "@/core/logic/feature-keys";
import { deleteUploadedImageIfLocal } from "@/lib/uploads";
import { siteUrl } from "@/lib/seo/site-config";
import type { TenantStatus } from "@/generated/prisma/client";

type FormState = { error?: string };
type OnboardingLinkState = { error?: string; link?: string };
type ProvisionState = {
  error?: string;
  result?: { tenantId: string; adminEmail: string; tempPassword: string };
};

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

function parseProvisionInput(
  formData: FormData
): { name: string; slug: string; planId: string; contactEmail: string; notes: string | null } | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const planId = String(formData.get("planId") ?? "basic");
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name) return { error: "Name is required." };
  if (!slug) return { error: "Slug is required." };
  if (!contactEmail) return { error: "Contact email is required — it becomes the tenant's first admin login." };
  if (!(PLAN_IDS as readonly string[]).includes(planId)) return { error: "Invalid plan." };

  return { name, slug, planId, contactEmail, notes: notes || null };
}

// Manual fallback for environments where auto-provisioning isn't configured
// (e.g. deployed on Vercel, with no local Postgres server or sibling
// retail-software checkout to provision against) — same shape as the
// original pre-provisioning flow, just registers an already-provisioned
// databaseUrl.
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

// Provisions a real database, runs retail-software's migrations against it,
// seeds the tenant's first admin login, then creates the control-plane
// Tenant record pointing at it. Doesn't redirect afterward (unlike a plain
// create) because the temp password must be shown exactly once in the
// returned state.
export async function provisionTenantAction(
  _prevState: ProvisionState | undefined,
  formData: FormData
): Promise<ProvisionState> {
  await requireAdmin();
  const input = parseProvisionInput(formData);
  if ("error" in input) return input;

  let provisioned;
  try {
    provisioned = await provisionTenantDatabase({
      slug: input.slug,
      storeName: input.name,
      contactEmail: input.contactEmail,
    });
  } catch (err) {
    return { error: `Provisioning failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  const tenant = await createTenant({
    name: input.name,
    slug: input.slug,
    status: "TRIAL",
    planId: input.planId,
    databaseUrl: provisioned.databaseUrl,
    contactEmail: input.contactEmail,
    notes: input.notes,
  });
  await syncFeaturesToTenant(tenant);

  revalidatePath("/admin");
  return { result: { tenantId: tenant.id, adminEmail: provisioned.adminEmail, tempPassword: provisioned.tempPassword } };
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

export async function deleteTenantAction(
  id: string,
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const tenant = await getTenant(id);
  if (!tenant) return { error: "Tenant not found." };

  const confirmation = String(formData.get("confirmation") ?? "").trim();
  if (confirmation !== tenant.name) {
    return { error: "Confirmation name does not match." };
  }

  if (canDeprovisionTenantDatabase(tenant.slug, tenant.databaseUrl)) {
    try {
      await deprovisionTenantDatabase(tenant.slug, tenant.databaseUrl);
    } catch (err) {
      return {
        error: `Failed to delete database: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  if (tenant.logoUrl) {
    await deleteUploadedImageIfLocal(tenant.logoUrl);
  }

  await deleteTenant(id);
  revalidatePath("/admin");
  redirect("/admin");
}
