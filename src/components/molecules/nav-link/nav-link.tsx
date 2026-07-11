"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToHash } from "@/lib/utils/scroll-to-hash";
import { cn } from "@/lib/utils/cn";

type NavLinkProps = {
  href: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
};

export function NavLink({
  href,
  label,
  className,
  onNavigate,
}: NavLinkProps) {
  const pathname = usePathname();
  const isHashLink = href.startsWith("/#");
  const isActive =
    !isHashLink &&
    (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)));

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();

    if (!isHashLink || pathname !== "/") {
      return;
    }

    event.preventDefault();
    scrollToHash(href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "border-b border-transparent pb-xs text-body-sm text-on-surface-variant",
        "transition-colors duration-150 hover:text-on-surface",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
        isActive && "border-primary text-on-surface",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
