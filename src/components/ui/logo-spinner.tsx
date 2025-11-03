"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoSpinnerProps {
  size?: number;
  className?: string;
  showText?: boolean;
  text?: string;
}

export function LogoSpinner({
  size = 64,
  className = "",
  showText = true,
  text = "Loading blog posts...",
}: LogoSpinnerProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    // Determine current theme (matching Logo component logic)
    const resolvedTheme =
      theme === "system" ? systemTheme : theme || "light";
    setCurrentTheme(resolvedTheme === "dark" ? "dark" : "light");
  }, [theme, systemTheme]);

  // Use appropriate logo based on theme (matching existing Logo component)
  // Dark theme uses logo-dark.png, light theme uses logo-light.png
  const logoSrc =
    currentTheme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  if (!mounted) {
    // Return a placeholder while theme is loading
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 ${className}`}
        style={{ minHeight: size + 80 }}
      >
        <div
          className="bg-primary/20 rounded-lg animate-pulse"
          style={{ width: size, height: size }}
        />
        {showText && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <Image
          src={logoSrc}
          alt="Loading"
          width={size}
          height={size}
          className="object-contain animate-spin"
          priority
          unoptimized
        />
      </div>
      {showText && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}

