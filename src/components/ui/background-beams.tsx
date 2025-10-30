"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500/[0.1] via-purple-500/[0.1] to-cyan-500/[0.1]",
        className
      )}
    >
      <div className="absolute inset-0 h-full w-full">
        {/* Animated beams */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent animate-pulse" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent animate-pulse delay-500" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent animate-pulse delay-1000" />
      </div>
    </div>
  );
};
