"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminLoginModal } from "@/components/organisms/admin-login-modal";
import { cn } from "@/lib/utils/cn";

type AdminNavButtonProps = {
  isAuthenticated: boolean;
  className?: string;
  onNavigate?: () => void;
};

const navItemStyles = cn(
  "cursor-pointer border-b border-transparent bg-transparent p-0 pb-xs text-body-sm font-inherit text-on-surface-variant",
  "transition-colors duration-150 hover:text-on-surface",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
);

export function AdminNavButton({ isAuthenticated, className, onNavigate }: AdminNavButtonProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  if (isAuthenticated) {
    return (
      <Link
        href="/admin"
        onClick={onNavigate}
        className={cn(navItemStyles, className)}
      >
        Admin
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          setIsLoginOpen(true);
        }}
        className={cn(navItemStyles, className)}
      >
        Admin
      </button>
      <AdminLoginModal open={isLoginOpen} onClose={closeLogin} />
    </>
  );
}
