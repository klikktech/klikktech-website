import { getTenantByOnboardingToken } from "@/core/logic/tenants";
import { OnboardingForm } from "@/components/organisms/onboarding-form";
import { completeOnboardingAction } from "./actions";

export default async function OnboardingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const tenant = await getTenantByOnboardingToken(token);

  if (!tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-container-lowest px-md">
        <p className="text-body-md text-on-surface">This onboarding link is invalid or has expired.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-surface-container-lowest px-md py-xl">
      <div className="w-full max-w-lg rounded-xl border border-outline-variant bg-surface p-xl">
        <h1 className="text-headline-md text-on-surface mb-xs">Set up your store</h1>
        <p className="text-body-sm text-on-surface-variant mb-lg">
          This one-time link lets you configure {tenant.name}&apos;s storefront.
        </p>
        <OnboardingForm
          action={completeOnboardingAction.bind(null, token)}
          initial={{
            storeName: tenant.storeName ?? "",
            logoUrl: tenant.logoUrl ?? "",
            colorPaletteId: tenant.colorPaletteId,
            enabledAddons: (tenant.enabledAddons as string[]) ?? [],
            contactEmail: tenant.contactEmail ?? "",
            contactPhone: tenant.contactPhone ?? "",
            currency: tenant.currency ?? "USD",
            isStoreOpen: tenant.isStoreOpen,
          }}
        />
      </div>
    </div>
  );
}
