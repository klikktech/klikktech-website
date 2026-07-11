"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToHash } from "@/lib/utils/scroll-to-hash";
import { cn } from "@/lib/utils/cn";

type HeaderScheduleLinkProps = {
  className?: string;
  onNavigate?: () => void;
};

export function HeaderScheduleLink({
  className,
  onNavigate,
}: HeaderScheduleLinkProps) {
  const pathname = usePathname();
  const href = "/#contact";

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();

    if (pathname !== "/") {
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
        "hidden rounded-button bg-primary px-md py-sm text-button text-on-primary sm:inline-flex sm:px-lg lg:ml-0",
        "transition-colors duration-150 ease-in-out hover:bg-on-surface",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
        className,
      )}
    >
      Schedule a Call
    </Link>
  );
}
