import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/organisms/admin-login-form";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { getCurrentAdmin } from "@/core/logic/admin-auth";
import { siteConfig } from "@/lib/constants/navigation";
import { adminLoginAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="absolute right-4 top-4 md:right-6">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center p-lg">
        <div className="w-full max-w-md rounded-card border border-outline-variant bg-surface-container-lowest p-xl shadow-overlay">
          <div className="mb-lg flex flex-col items-center gap-md text-center">
            <Link href="/" className="inline-flex shrink-0 items-center">
              <Image
                src={siteConfig.logo.src}
                alt={siteConfig.logo.alt}
                width={siteConfig.logo.width}
                height={siteConfig.logo.height}
                className="h-8 w-auto"
              />
            </Link>
            <div className="flex flex-col gap-sm">
              <h1 className="font-display text-headline-md text-on-surface">
                Super admin
              </h1>
              <p className="text-body-sm text-on-surface-variant">
                Sign in to manage tenants and onboarding.
              </p>
            </div>
          </div>

          <AdminLoginForm action={adminLoginAction} />

          <Link
            href="/"
            className="mt-lg block text-center text-body-sm text-on-surface-variant transition-colors hover:text-on-surface"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
