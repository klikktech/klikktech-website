import "server-only";
import { Client } from "pg";
import type { Tenant } from "@/generated/prisma/client";

// Pushes this control-plane Tenant row's enabledAddons/colorPaletteId/
// featureOverrides into the tenant's own siloed Postgres database
// (retail-software's StoreSettings table, id=1 singleton row) — the same
// columns its core/logic/features.ts reads to resolve the tenant's effective
// feature set. Used both by the post-onboarding "Sync" button and by the
// add-ons editor action, since neither touches the onboarding-only fields
// below. Opens a short-lived direct connection using the tenant's stored
// databaseUrl; never throws past this boundary so the caller can surface a
// plain success/error message.
export async function syncFeaturesToTenant(
  tenant: Pick<Tenant, "databaseUrl" | "enabledAddons" | "colorPaletteId" | "featureOverrides">
): Promise<{ ok: true } | { ok: false; error: string }> {
  const client = new Client({ connectionString: tenant.databaseUrl });
  try {
    await client.connect();
    await client.query(
      'UPDATE "StoreSettings" SET "enabledAddons" = $1, "colorPaletteId" = $2, "featureOverrides" = $3 WHERE id = 1',
      [
        JSON.stringify(tenant.enabledAddons ?? []),
        tenant.colorPaletteId,
        tenant.featureOverrides == null ? null : JSON.stringify(tenant.featureOverrides),
      ]
    );
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  } finally {
    await client.end().catch(() => {});
  }
}

// Deliberately a separate function/UPDATE from syncFeaturesToTenant above,
// not merged into one: this one is only ever called right after
// completeOnboarding with freshly-validated, non-null form data. Merging
// them would mean clicking the existing "Sync" button before onboarding is
// complete could blast the tenant's real storeName/etc. to NULL.
export async function syncOnboardingToTenant(
  tenant: Pick<
    Tenant,
    | "databaseUrl"
    | "storeName"
    | "themeId"
    | "logoUrl"
    | "colorPaletteId"
    | "enabledAddons"
    | "contactEmail"
    | "contactPhone"
    | "currency"
    | "isStoreOpen"
  >
): Promise<{ ok: true } | { ok: false; error: string }> {
  const client = new Client({ connectionString: tenant.databaseUrl });
  try {
    await client.connect();
    await client.query(
      `UPDATE "StoreSettings" SET
        "storeName" = $1,
        "themeId" = $2,
        "logoUrl" = $3,
        "colorPaletteId" = $4,
        "enabledAddons" = $5,
        "contactEmail" = $6,
        "contactPhone" = $7,
        "currency" = $8,
        "isStoreOpen" = $9
      WHERE id = 1`,
      [
        tenant.storeName,
        tenant.themeId,
        tenant.logoUrl,
        tenant.colorPaletteId,
        JSON.stringify(tenant.enabledAddons ?? []),
        tenant.contactEmail,
        tenant.contactPhone,
        tenant.currency,
        tenant.isStoreOpen,
      ]
    );
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  } finally {
    await client.end().catch(() => {});
  }
}
