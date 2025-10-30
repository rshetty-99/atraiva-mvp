"use client";

import React from "react";
import { Shield, Zap, Users, Target } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Security First",
    description:
      "Every solution we build prioritizes security at its foundation, ensuring robust protection against evolving threats.",
  },
  {
    icon: Zap,
    title: "AI Innovation",
    description:
      "We deploy cutting artificial intelligence tools to provide real-time exposure to legal reporting and notification obligations.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    description:
      "Our success is measured by our clients' security posture improvement and their trust in our solutions.",
  },
  {
    icon: Target,
    title: "Precision & Accuracy",
    description:
      "We deliver continuously updated client exposure to statute and regulator reporting and notification obligations.",
  },
];

export function CoreValues() {
  return (
    <section className="bg-white dark:bg-background flex items-center py-20 px-20">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col items-center gap-[60px]">
          {/* Header */}
          <div className="flex flex-col justify-center items-center gap-4">
            <h2 className="text-primary text-[42px] font-normal font-['Encode_Sans_Semi_Expanded'] leading-[1.25] text-center">
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-[18px] font-['Lato'] leading-[1.2] text-center w-[680px]">
              These principles guide every decision we make and every solution
              we develop
            </p>
          </div>

          {/* Values Grid */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              {values.slice(0, 2).map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={index}
                    className="flex-1 bg-card border border-dashed border-primary/50 rounded-lg p-6 flex flex-col gap-[100px]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex-shrink-0">
                        <IconComponent className="w-10 h-10 text-primary stroke-[2.5px]" />
                      </div>
                      <div className="flex flex-col gap-3 flex-1">
                        <h3 className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent text-[28px] font-['Lato'] font-medium leading-[1.286]">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground text-base font-['Lato'] leading-[1.3125]">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4">
              {values.slice(2, 4).map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={index}
                    className="flex-1 bg-card border border-dashed border-accent/50 rounded-lg p-6 flex flex-col gap-[100px]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex-shrink-0">
                        <IconComponent className="w-10 h-10 text-accent stroke-[2.5px]" />
                      </div>
                      <div className="flex flex-col gap-3 flex-1">
                        <h3 className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent text-[28px] font-['Lato'] font-medium leading-[1.286]">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground text-base font-['Lato'] leading-[1.3125]">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
