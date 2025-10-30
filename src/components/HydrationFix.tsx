"use client";

import { useEffect } from "react";

export default function HydrationFix() {
  useEffect(() => {
    // Remove attributes added by browser extensions that cause hydration mismatches
    const removeExtensionAttributes = () => {
      const elements = document.querySelectorAll("[fdprocessedid]");
      elements.forEach((element) => {
        element.removeAttribute("fdprocessedid");
      });
    };

    // Run immediately and after a short delay to catch dynamically added elements
    removeExtensionAttributes();
    const timeoutId = setTimeout(removeExtensionAttributes, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}
