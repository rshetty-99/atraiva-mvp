"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
  label?: string;
  variant?: "default" | "gradient" | "minimal";
}

const sizeClasses = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
  lg: "h-7 w-12",
};

const thumbSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const thumbPositionClasses = {
  sm: { checked: "translate-x-4", unchecked: "translate-x-0" },
  md: { checked: "translate-x-5", unchecked: "translate-x-0" },
  lg: { checked: "translate-x-5", unchecked: "translate-x-0" },
};

export function AnimatedToggle({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  className,
  children,
  label,
  variant = "default",
}: AnimatedToggleProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "gradient":
        return isChecked
          ? "bg-gradient-to-r from-[#C9B9FF] to-[#2B1B64]"
          : "bg-gray-300 dark:bg-gray-600";
      case "minimal":
        return isChecked ? "bg-primary" : "bg-gray-200 dark:bg-gray-700";
      default:
        return isChecked ? "bg-primary" : "bg-gray-300 dark:bg-gray-600";
    }
  };

  const getThumbClasses = () => {
    switch (variant) {
      case "gradient":
        return "bg-white shadow-lg";
      case "minimal":
        return "bg-white shadow-sm";
      default:
        return "bg-white shadow-md";
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground cursor-pointer">
          {label}
        </label>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size],
          getVariantClasses(),
          className
        )}
      >
        <motion.div
          className={cn(
            "pointer-events-none inline-block rounded-full transition-transform duration-200 ease-in-out",
            thumbSizeClasses[size],
            getThumbClasses(),
            thumbPositionClasses[size][isChecked ? "checked" : "unchecked"]
          )}
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          <AnimatePresence mode="wait">
            {isChecked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center h-full w-full"
              >
                <svg
                  className="h-3 w-3 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </button>

      {children && (
        <span className="text-sm text-muted-foreground">{children}</span>
      )}
    </div>
  );
}

// Preset variants for common use cases
export function ThemeToggleSwitch() {
  const [isDark, setIsDark] = useState(false);

  return (
    <AnimatedToggle
      checked={isDark}
      onChange={setIsDark}
      variant="gradient"
      size="md"
      label="Dark mode"
    />
  );
}

export function NotificationToggle() {
  const [notifications, setNotifications] = useState(true);

  return (
    <AnimatedToggle
      checked={notifications}
      onChange={setNotifications}
      variant="default"
      size="md"
      label="Notifications"
    />
  );
}

export function PrivacyToggle() {
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <AnimatedToggle
      checked={isPrivate}
      onChange={setIsPrivate}
      variant="minimal"
      size="sm"
      label="Private"
    />
  );
}
