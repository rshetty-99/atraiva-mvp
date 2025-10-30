"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef, useState } from "react";

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "#262626",
  className,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const { left, top } = ref.current.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    }
  };

  const handleMouseEnter = () => {
    setIsHoveringCard(true);
  };

  const handleMouseLeave = () => {
    setIsHoveringCard(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const animatedRadius = useSpring(radius, { stiffness: 500, damping: 30 });
  const opacity = useTransform(
    [mouseX, mouseY, animatedRadius],
    ([latestMouseX, latestMouseY, latestRadius]) => {
      if (!isHoveringCard && !isFocused) return 0;
      const distance = Math.sqrt(
        (latestMouseX - latestRadius) ** 2 + (latestMouseY - latestRadius) ** 2
      );
      return Math.max(0, (latestRadius - distance) / latestRadius);
    }
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/50 backdrop-blur-sm p-8 shadow-2xl",
        className
      )}
      style={{
        background: `radial-gradient(${radius}px circle at var(--mouse-x) var(--mouse-y), ${color}40 0%, transparent 50%)`,
      }}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300"
        style={{
          background: `radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 80%)`,
          opacity,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
