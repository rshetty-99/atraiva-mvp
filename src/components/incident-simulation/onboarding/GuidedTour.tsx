"use client";

import React from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { incidentSimulationTour } from "./config";
import { useOnboarding } from "./OnboardingProvider";

export function GuidedTour() {
  const { state, completeTour, setTourStep } = useOnboarding();

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      completeTour();
    } else if (status === STATUS.RUNNING) {
      setTourStep(index);
    }
  };

  if (!state.showTour) {
    return null;
  }

  const steps: Step[] = incidentSimulationTour.map((step) => ({
    target: step.target,
    content: (
      <div>
        <h3 className="font-semibold mb-2">{step.title}</h3>
        <p className="text-sm">{step.content}</p>
      </div>
    ),
    placement: step.placement || "bottom",
    disableBeacon: true,
  }));

  return (
    <Joyride
      steps={steps}
      run={state.showTour}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#2563eb",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
        },
        buttonNext: {
          backgroundColor: "#2563eb",
          borderRadius: 6,
        },
        buttonBack: {
          color: "#2563eb",
        },
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip tour",
      }}
    />
  );
}
