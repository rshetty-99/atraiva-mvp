"use client";

import { useEffect } from "react";

export function useHydrationFix() {
  useEffect(() => {
    // Remove browser extension attributes that cause hydration mismatches
    const removeExtensionAttributes = () => {
      const elements = document.querySelectorAll("[fdprocessedid]");
      elements.forEach((element) => {
        element.removeAttribute("fdprocessedid");
      });
    };

    // Run immediately and after a short delay to catch late-added attributes
    removeExtensionAttributes();
    const timeoutId = setTimeout(removeExtensionAttributes, 100);

    return () => clearTimeout(timeoutId);
  }, []);
}
