import "server-only";
import { prisma } from "@/lib/prisma";
import type { Tenant, TenantStatus, Prisma } from "@/generated/prisma/client";
import { generateSessionToken, hashToken } from "./session-token";

const ONBOARDING_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function listTenants() {
  return prisma.tenant.findMany({ orderBy: { createdAt: "desc" } });
}

export function getTenant(id: string) {
  return prisma.tenant.findUnique({ where: { id } });
}

export interface TenantInput {
  name: string;
  slug: string;
  status: TenantStatus;
  databaseUrl: string;
  contactEmail?: string | null;
  notes?: string | null;
}

export function createTenant(input: TenantInput) {
  return prisma.tenant.create({ data: input });
}

export function updateTenant(id: string, input: TenantInput) {
  return prisma.tenant.update({ where: { id }, data: input });
}

export function deleteTenant(id: string) {
  return prisma.tenant.delete({ where: { id } });
}

export interface FeatureOverridesInput {
  enabled: string[];
  disabled: string[];
}

export function updateFeatureOverrides(id: string, overrides: FeatureOverridesInput) {
  return prisma.tenant.update({
    where: { id },
    data: { featureOverrides: overrides as unknown as Prisma.InputJsonValue },
  });
}

// Mints a one-time onboarding link's token: only its hash is stored, the raw
// token is returned so the caller can display it exactly once (never
// persisted in plaintext) — same shape as the session-token pattern used for
// staff/admin login, but with a longer TTL and no associated session record.
export async function generateOnboardingLink(tenantId: string): Promise<string> {
  const token = generateSessionToken();
  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      onboardingTokenHash: hashToken(token),
      onboardingTokenExpiresAt: new Date(Date.now() + ONBOARDING_TOKEN_TTL_MS),
    },
  });
  return token;
}

// Does not gate on onboardingCompletedAt — regenerating a link lets the
// super admin reopen onboarding later (e.g. to fix a typo), which just
// overwrites the fields and re-syncs rather than tracking a separate state.
export async function getTenantByOnboardingToken(token: string): Promise<Tenant | null> {
  const tenant = await prisma.tenant.findUnique({ where: { onboardingTokenHash: hashToken(token) } });
  if (!tenant || !tenant.onboardingTokenExpiresAt || tenant.onboardingTokenExpiresAt < new Date()) {
    return null;
  }
  return tenant;
}

export interface OnboardingInput {
  storeName: string;
  themeId: string;
  logoUrl?: string | null;
  colorPaletteId: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  currency: string;
  isStoreOpen: boolean;
  storeAddress: string;
  storeLatitude: number | null;
  storeLongitude: number | null;
}

// Single-use: clears the token hash/expiry so the link can't be replayed.
export function completeOnboarding(tenantId: string, input: OnboardingInput) {
  return prisma.tenant.update({
    where: { id: tenantId },
    data: {
      ...input,
      onboardingTokenHash: null,
      onboardingTokenExpiresAt: null,
      onboardingCompletedAt: new Date(),
    },
  });
}

export function updateStoreSettings(tenantId: string, input: OnboardingInput) {
  return prisma.tenant.update({
    where: { id: tenantId },
    data: input,
  });
}
