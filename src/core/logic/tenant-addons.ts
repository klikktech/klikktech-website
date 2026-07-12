import "server-only";
import { prisma } from "@/lib/prisma";
import { ADDON_CATALOG, type AddonKey } from "./addon-catalog";
import type { Prisma } from "@/generated/prisma/client";

// Persists the tenant's new enabledAddons set and logs a TenantAddonPurchase
// row for each key that transitions off -> on (one-time pricing, charged at
// the point it's added). Removals aren't logged as purchases — no refund/
// charge event — and re-adding a previously-removed addon is a fresh
// purchase. Shared by onboarding submission and the post-onboarding editor.
export async function applyEnabledAddons(
  tenantId: string,
  selected: AddonKey[],
  previouslyEnabled: string[]
): Promise<{ addedCount: number }> {
  const previous = new Set(previouslyEnabled);
  const added = selected.filter((key) => !previous.has(key));

  await prisma.$transaction([
    prisma.tenant.update({
      where: { id: tenantId },
      data: { enabledAddons: selected as unknown as Prisma.InputJsonValue },
    }),
    ...added.map((key) =>
      prisma.tenantAddonPurchase.create({
        data: {
          tenantId,
          addonKey: key,
          label: ADDON_CATALOG[key].label,
          priceCents: ADDON_CATALOG[key].priceCents,
          currency: ADDON_CATALOG[key].currency,
        },
      })
    ),
  ]);

  return { addedCount: added.length };
}
