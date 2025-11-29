"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface OnboardingState {
  showTooltips: boolean;
  showTour: boolean;
  showHelpPanel: boolean;
  tourCompleted: boolean;
  tooltipsDismissed: boolean;
  currentTourStep: number;
}

interface OnboardingContextType {
  state: OnboardingState;
  toggleTooltips: () => void;
  toggleTour: () => void;
  toggleHelpPanel: () => void;
  startTour: () => void;
  completeTour: () => void;
  dismissTooltips: () => void;
  setTourStep: (step: number) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<OnboardingState>(() => {
    // Load from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("incident-simulation-onboarding");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fallback to defaults
        }
      }
    }
    return {
      showTooltips: true,
      showTour: false,
      showHelpPanel: true, // Show help panel by default
      tourCompleted: false,
      tooltipsDismissed: false,
      currentTourStep: 0,
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "incident-simulation-onboarding",
        JSON.stringify(state)
      );
    }
  }, [state]);

  const toggleTooltips = () => {
    setState((prev) => ({ ...prev, showTooltips: !prev.showTooltips }));
  };

  const toggleTour = () => {
    setState((prev) => ({ ...prev, showTour: !prev.showTour }));
  };

  const toggleHelpPanel = () => {
    setState((prev) => ({ ...prev, showHelpPanel: !prev.showHelpPanel }));
  };

  const startTour = () => {
    setState((prev) => ({
      ...prev,
      showTour: true,
      currentTourStep: 0,
    }));
  };

  const completeTour = () => {
    setState((prev) => ({
      ...prev,
      showTour: false,
      tourCompleted: true,
      currentTourStep: 0,
    }));
  };

  const dismissTooltips = () => {
    setState((prev) => ({
      ...prev,
      showTooltips: false,
      tooltipsDismissed: true,
    }));
  };

  const setTourStep = (step: number) => {
    setState((prev) => ({ ...prev, currentTourStep: step }));
  };

  const resetOnboarding = () => {
    setState({
      showTooltips: true,
      showTour: false,
      showHelpPanel: false,
      tourCompleted: false,
      tooltipsDismissed: false,
      currentTourStep: 0,
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("incident-simulation-onboarding");
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        toggleTooltips,
        toggleTour,
        toggleHelpPanel,
        startTour,
        completeTour,
        dismissTooltips,
        setTourStep,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
