-- AlterTable
ALTER TABLE "Tenant"
  DROP COLUMN "planId",
  DROP COLUMN "primaryColor",
  DROP COLUMN "secondaryColor",
  DROP COLUMN "accentColor",
  ADD COLUMN     "colorPaletteId" TEXT NOT NULL DEFAULT 'slate',
  ADD COLUMN     "enabledAddons" JSONB NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "TenantAddonPurchase" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "addonKey" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantAddonPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TenantAddonPurchase_tenantId_idx" ON "TenantAddonPurchase"("tenantId");

-- AddForeignKey
ALTER TABLE "TenantAddonPurchase" ADD CONSTRAINT "TenantAddonPurchase_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
