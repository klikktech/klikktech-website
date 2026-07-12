"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type AdminTab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type AdminTabsProps = {
  tabs: AdminTab[];
  defaultTab?: string;
  className?: string;
};

function tabFromHash(tabs: AdminTab[]): string | undefined {
  if (typeof window === "undefined") return undefined;
  const hash = window.location.hash.replace(/^#/, "");
  return tabs.some((tab) => tab.id === hash) ? hash : undefined;
}

export function AdminTabs({ tabs, defaultTab, className }: AdminTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");

  useEffect(() => {
    const fromHash = tabFromHash(tabs);
    if (fromHash) setActive(fromHash);
  }, [tabs]);

  function selectTab(id: string) {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  const activeTab = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Tenant sections"
        className="mb-lg flex gap-xs border-b border-outline-variant"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab?.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => selectTab(tab.id)}
              className={cn(
                "-mb-px shrink-0 border-b-2 px-md py-sm text-body-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container focus-visible:ring-offset-2",
                isActive
                  ? "border-primary text-on-surface"
                  : "border-transparent text-on-surface-variant hover:border-outline-variant hover:text-on-surface",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab ? (
        <div
          role="tabpanel"
          id={`panel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          className="flex flex-col gap-lg"
        >
          {activeTab.content}
        </div>
      ) : null}
    </div>
  );
}
