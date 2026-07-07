-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "accentColor" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "isStoreOpen" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "onboardingTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "onboardingTokenHash" TEXT,
ADD COLUMN     "primaryColor" TEXT,
ADD COLUMN     "secondaryColor" TEXT,
ADD COLUMN     "storeName" TEXT,
ADD COLUMN     "themeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_onboardingTokenHash_key" ON "Tenant"("onboardingTokenHash");

