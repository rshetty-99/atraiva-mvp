"use client";

import React from "react";
import { Brain, Activity, Zap } from "lucide-react";

const expertiseAreas = [
  {
    icon: Brain,
    title: "Threat Intelligence",
    description:
      "Advanced machine learning algorithms analyze global threat patterns to predict and prevent attacks before they occur.",
  },
  {
    icon: Activity,
    title: "Behavioral Analysis",
    description:
      "AI-driven behavioral monitoring detects anomalies and suspicious activities with unprecedented accuracy and minimal false positives.",
  },
  {
    icon: Zap,
    title: "Automated Response",
    description:
      "Intelligent automation systems respond to threats in milliseconds, containing and neutralizing attacks without human intervention.",
  },
];

export function ExpertiseSection() {
  return (
    <section className="bg-white dark:bg-background flex items-center py-20 px-4 sm:px-8 md:px-12 lg:px-20 w-full max-w-full overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto w-full min-w-0">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-[60px] w-full min-w-0">
          {/* Left Content */}
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            <div className="flex flex-col gap-4">
              <h2 className="text-primary text-[42px] font-normal font-['Encode_Sans_Semi_Expanded'] leading-[1.25] break-words">
                Our Expertise
              </h2>
              <p className="text-muted-foreground text-[18px] font-['Lato'] leading-[1.333] break-words">
                Comprehensive AI-powered security solutions across multiple
                domains
              </p>
            </div>
          </div>

          {/* Right Content - Expertise Cards */}
          <div className="flex flex-col lg:flex-row gap-4 w-full lg:flex-1 min-w-0 lg:h-[382px]">
            {/* First Card - Threat Intelligence */}
            <div className="flex-1 bg-card border border-dashed border-border rounded-lg p-6 flex flex-col gap-[100px] min-w-0">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0">
                  <Brain className="w-10 h-10 text-accent stroke-[2.5px]" />
                </div>
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  <h3 className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent text-[28px] font-['Lato'] font-medium leading-[1.286] break-words">
                    {expertiseAreas[0].title}
                  </h3>
                  <p className="text-muted-foreground text-base font-['Lato'] leading-[1.3125] break-words">
                    {expertiseAreas[0].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Second Card - Behavioral Analysis */}
            <div className="flex-1 bg-card border border-dashed border-border rounded-lg p-6 min-w-0">
              <div className="flex flex-col gap-[100px]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0">
                    <Activity className="w-10 h-10 text-accent stroke-[2.5px]" />
                  </div>
                  <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <h3 className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent text-[28px] font-['Lato'] font-medium leading-[1.286] break-words">
                      {expertiseAreas[1].title}
                    </h3>
                    <p className="text-muted-foreground text-base font-['Lato'] leading-[1.3125] break-words">
                      {expertiseAreas[1].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Card - Automated Response */}
            <div className="flex-1 bg-card border border-dashed border-border rounded-lg p-6 flex flex-col gap-[100px] min-w-0">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0">
                  <Zap className="w-10 h-10 text-accent stroke-[2.5px]" />
                </div>
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  <h3 className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent text-[28px] font-['Lato'] font-medium leading-[1.286] break-words">
                    {expertiseAreas[2].title}
                  </h3>
                  <p className="text-muted-foreground text-base font-['Lato'] leading-[1.3125] break-words">
                    {expertiseAreas[2].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
