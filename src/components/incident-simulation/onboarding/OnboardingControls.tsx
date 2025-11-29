"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, Map, X } from "lucide-react";
import { useOnboarding } from "./OnboardingProvider";

export function OnboardingControls() {
  const { state, toggleHelpPanel, startTour, toggleTooltips, resetOnboarding } =
    useOnboarding();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={state.showHelpPanel ? "default" : "outline"}
        size="sm"
        onClick={toggleHelpPanel}
        className={state.showHelpPanel ? "bg-primary" : ""}
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        {state.showHelpPanel ? "Hide Help" : "Show Help"}
      </Button>
      {!state.tourCompleted && (
        <Button variant="outline" size="sm" onClick={startTour}>
          <Map className="h-4 w-4 mr-2" />
          Take Tour
        </Button>
      )}
      {!state.showTooltips && (
        <Button variant="ghost" size="sm" onClick={toggleTooltips}>
          Show Tooltips
        </Button>
      )}
    </div>
  );
}
