"use client";

import React from "react";
import { Target, Eye } from "lucide-react";

export function MissionVision() {
  return (
    <section className="bg-white dark:bg-background flex items-center justify-center py-20 px-4 sm:px-8 md:px-12 lg:px-20 w-full max-w-full overflow-x-hidden">
      <div className="max-w-[1280px] w-full min-w-0">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-[60px] w-full min-w-0">
          {/* Left Content */}
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            <div className="flex flex-col gap-4">
              <h2 className="text-primary text-[42px] font-normal font-['Encode_Sans_Semi_Expanded'] leading-[1.25] break-words">
                Our Mission & Vision
              </h2>
              <p className="text-muted-foreground text-[18px] font-['Lato'] leading-[1.333] break-words">
                Empowering designers and organizations with intelligent security
                solutions that protect creative workflows without compromising
                innovation.
              </p>
            </div>
          </div>

          {/* Right Content - Mission & Vision Cards */}
          <div className="flex flex-col lg:flex-row gap-4 w-full lg:flex-1 min-w-0">
            {/* Mission Card */}
            <div className="flex-1 bg-card border border-dashed border-primary/50 rounded-lg p-6 min-w-0">
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0">
                    <Target className="w-10 h-10 text-primary" />
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <h3 className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent text-[28px] font-['Lato'] font-medium leading-[1.286]">
                      Mission
                    </h3>
                    <p className="text-muted-foreground text-base font-['Lato'] leading-[1.3125]">
                      To democratize design security by providing AI-powered
                      tools that seamlessly integrate into creative workflows,
                      ensuring every design team can work safely and
                      confidently.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="flex-1 bg-card border border-dashed border-accent/50 rounded-lg p-6 min-w-0">
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0">
                    <Eye className="w-10 h-10 text-accent" />
                  </div>
                  <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <h3 className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent text-[28px] font-['Lato'] font-medium leading-[1.286] break-words">
                      Vision
                    </h3>
                    <p className="text-muted-foreground text-base font-['Lato'] leading-[1.3125] break-words">
                      A world where creativity flows freely without security
                      concerns, where every designer has access to
                      enterprise-grade protection regardless of their
                      organization&apos;s size.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
