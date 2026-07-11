"use client";

import { useEffect } from "react";
import { scrollToHash } from "@/lib/utils/scroll-to-hash";

/** Scrolls to the URL hash on load / hash change (e.g. /#services). */
export function HashScrollHandler() {
  useEffect(() => {
    const scrollIfNeeded = () => {
      const hash = window.location.hash;
      if (!hash) return;

      window.requestAnimationFrame(() => {
        scrollToHash(hash, "auto");
      });
    };

    scrollIfNeeded();
    window.addEventListener("hashchange", scrollIfNeeded);

    return () => {
      window.removeEventListener("hashchange", scrollIfNeeded);
    };
  }, []);

  return null;
}
