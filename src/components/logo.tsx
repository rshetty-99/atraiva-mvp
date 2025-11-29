"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function Logo({
  width = 42,
  height = 40,
  className = "",
  showText = false,
  textClassName = "",
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the current theme
  const isDark = resolvedTheme === "dark";

  // console.log("Logo: resolvedTheme =", resolvedTheme, "isDark =", isDark);

  // Use a fallback during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div
          style={{ width, height }}
          className={`bg-gray-200 dark:bg-gray-800 rounded ${className}`}
        />
        {showText && (
          <span className={textClassName || "text-2xl font-normal"}>
            Atraiva.ai
          </span>
        )}
      </div>
    );
  }

  const logoSrc = isDark ? "/logo-dark.png" : "/logo-light.png";

  return (
    <div className="flex items-center gap-2">
      <Image
        key={logoSrc}
        src={logoSrc}
        alt="Atraiva.ai"
        width={width}
        height={height}
        className={className}
        priority
        unoptimized
      />
      {showText && (
        <span className={textClassName || "text-2xl font-normal"}>
          Atraiva.ai
        </span>
      )}
    </div>
  );
}
