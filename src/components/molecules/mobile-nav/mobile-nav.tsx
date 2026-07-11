"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { HeaderScheduleLink } from "@/components/molecules/header-schedule-link";
import { NavLink } from "@/components/molecules/nav-link";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { mainNavLinks } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-sm lg:hidden">
      <ThemeToggle className="sm:hidden" />
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-panel"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-button border border-outline-variant",
          "text-on-surface transition-colors hover:bg-surface-container-low",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
        )}
        onClick={() => {
          setIsOpen((open) => !open);
        }}
      >
        <Icon icon={isOpen ? X : Menu} size="md" />
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 top-16 z-40 bg-inverse-surface/20"
            onClick={closeMenu}
          />
          <nav
            id="mobile-navigation-panel"
            aria-label="Mobile navigation"
            className="fixed left-0 right-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-outline-variant bg-surface-container-lowest p-lg shadow-overlay"
          >
            <ul className="flex flex-col gap-md">
              {mainNavLinks.map((link) => (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    label={link.label}
                    onNavigate={closeMenu}
                    className="block w-full border-b-0 py-sm text-body-md"
                  />
                </li>
              ))}
              <li className="pt-sm">
                <HeaderScheduleLink
                  onNavigate={closeMenu}
                  className="inline-flex w-full sm:hidden"
                />
              </li>
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  );
}
