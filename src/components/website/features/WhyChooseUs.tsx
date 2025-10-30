"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const benefits = [
  {
    title: "Centralized Monitoring",
    icon: "monitoring",
  },
  {
    title: "Instant Notifications",
    icon: "notifications",
  },
  {
    title: "Customizable Scope",
    icon: "scope",
  },
];

const metrics = [
  {
    percentage: "90%",
    title: "Time Reduction",
    subtitle: "Save Hours of Research",
    description:
      "No more manually checking multiple government websites for regulatory updates.",
  },
  {
    percentage: "100%",
    title: "Compliance Coverage",
    subtitle: "Ensure Full Compliance",
    description:
      "Stay ahead of changing requirements and avoid costly compliance violations.",
  },
  {
    percentage: "$50K+",
    title: "Average Annual Savings",
    subtitle: "Reduce Legal Costs",
    description:
      "Minimize the need for external legal counsel to track regulatory changes.",
  },
  {
    percentage: "24/7",
    title: "Monitoring",
    subtitle: "Peace of Mind",
    description:
      "Know that you're always informed of the latest legal requirements.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-background py-20">
      <div className="px-20 py-8">
        <div className="flex gap-20 w-full mx-[50px]">
          {/* Left Content */}
          <div className="flex flex-col gap-8 flex-1">
            <div className="flex flex-col justify-center items-start gap-4">
              <h2 className="font-['Encode_Sans_Semi_Expanded'] text-[42px] font-normal leading-[1.25] text-left text-primary">
                Why Legal Teams Choose Atraiva.ai
              </h2>
              <p className="font-lato text-lg font-normal leading-[1.333] text-left text-muted-foreground w-[534px]">
                Data breach laws are constantly evolving across different
                jurisdictions. Missing a single update could expose your
                organization to significant penalties and compliance risks.
              </p>
            </div>

            {/* Benefits */}
            <div className="flex flex-col gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-card border border-dashed border-border p-4 flex items-center h-[56px] rounded-lg w-[320px]"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-lato text-lg font-medium leading-[1.5] text-left text-foreground">
                      {benefit.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 text-white font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12 w-fit shadow-lg transition-all">
              Start free trial
            </Button>
          </div>

          {/* Right Content - Metrics */}
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex gap-6">
              <div className="flex flex-col gap-6">
                {metrics.slice(0, 2).map((metric, index) => (
                  <div
                    key={index}
                    className="bg-card border-l-[3px] border-l-primary p-6 flex gap-2.5 h-[290px]"
                  >
                    <div className="flex flex-col gap-12">
                      <div className="flex flex-col gap-2.5">
                        <span className="font-lato text-[32px] font-medium leading-[1.2] text-left text-foreground">
                          {metric.percentage}
                        </span>
                        <span className="font-lato text-base font-normal leading-[1.2] text-left text-muted-foreground">
                          {metric.title}
                        </span>
                      </div>
                      <div className="flex flex-col gap-4">
                        <span className="font-lato text-[28px] font-medium leading-[1.286] text-left text-foreground">
                          {metric.subtitle}
                        </span>
                        <p className="font-lato text-base font-normal leading-[1.3125] text-left text-muted-foreground">
                          {metric.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-6">
                {metrics.slice(2, 4).map((metric, index) => (
                  <div
                    key={index}
                    className="bg-card border-l-[3px] border-l-primary p-6 flex gap-2.5 h-[290px]"
                  >
                    <div className="flex flex-col gap-12">
                      <div className="flex flex-col gap-2.5">
                        <span className="font-lato text-[32px] font-medium leading-[1.2] text-left text-foreground">
                          {metric.percentage}
                        </span>
                        <span className="font-lato text-base font-normal leading-[1.2] text-left text-muted-foreground">
                          {metric.title}
                        </span>
                      </div>
                      <div className="flex flex-col gap-4">
                        <span className="font-lato text-[28px] font-medium leading-[1.286] text-left text-foreground w-[238px]">
                          {metric.subtitle}
                        </span>
                        <p className="font-lato text-base font-normal leading-[1.3125] text-left text-muted-foreground">
                          {metric.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
