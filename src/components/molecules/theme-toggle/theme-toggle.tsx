"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import {
  getPreferredTheme,
  toggleTheme,
  type ThemeMode,
} from "@/lib/theme/theme";
import { cn } from "@/lib/utils/cn";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTheme(getPreferredTheme());
    setIsReady(true);
  }, []);

  const handleToggle = () => {
    setTheme((current) => toggleTheme(current));
  };

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-button border border-outline-variant",
        "text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
        !isReady && "opacity-0",
        className,
      )}
    >
      <Icon
        icon={isDark ? Sun : Moon}
        size="md"
        aria-hidden={false}
        aria-label={label}
      />
    </button>
  );
}
