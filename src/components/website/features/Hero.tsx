"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Shield, Clock } from "lucide-react";
import { BreachMap } from "./BreachMap";
import type { StateBreachData } from "@/lib/breach/server-fetch";

type HeroProps = {
  breachCountsByState?: Record<string, StateBreachData>;
};

export function Hero({ breachCountsByState }: HeroProps) {
  return (
    <section className="relative bg-background min-h-[calc(100vh-439px)] pt-[164px] pb-[150px] lg:min-h-[calc(100vh-439px)] flex items-start">
      {/* Background Blur Element */}
      <div className="absolute top-16 left-[702px] w-[770px] h-[765px] rounded-full bg-primary/20 blur-[250px] hidden lg:block"></div>

      <div className="px-4 sm:px-8 md:px-12 lg:px-20 pt-8 pb-0 w-full">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-[150px] max-w-[1600px] mx-auto">
          {/* Left Content */}
          <div className="flex flex-col justify-center gap-6 lg:gap-10 w-full lg:w-auto lg:flex-1">
            <div className="flex flex-col gap-6 lg:gap-10">
              <div className="flex flex-col justify-center gap-6">
                <div className="flex flex-col gap-6">
                  <h1 className="font-['Encode_Sans_Semi_Expanded'] text-3xl sm:text-4xl lg:text-[64px] xl:text-[72px] 2xl:text-[80px] font-normal leading-[1.25] text-left text-foreground w-full lg:w-[600px] xl:w-[700px] 2xl:w-[800px]">
                    Real time legal updates
                  </h1>
                  <p className="font-lato text-base sm:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl font-normal leading-[1.333] text-left text-muted-foreground w-full lg:max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px]">
                    Stay ahead of ever-changing data breach laws across Federal,
                    State, and Local jurisdictions. Get instant notifications
                    when regulations change, reporting templates update, or
                    compliance deadlines shift.
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-8">
                <Button className="bg-primary hover:bg-primary/90 text-white font-lato text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-medium leading-[1] px-[40px] py-[20px] lg:px-[48px] lg:py-[24px] xl:px-[56px] xl:py-[28px] 2xl:px-[64px] 2xl:py-[32px] rounded-[48px] h-16 lg:h-20 xl:h-24 2xl:h-28 w-full sm:w-auto shadow-lg transition-all">
                  Start free trial
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-border border-2 text-foreground font-lato text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-medium leading-[1] px-[40px] py-[20px] lg:px-[48px] lg:py-[24px] xl:px-[56px] xl:py-[28px] 2xl:px-[64px] 2xl:py-[32px] rounded-[48px] h-16 lg:h-20 xl:h-24 2xl:h-28 flex items-center justify-center gap-3 w-full sm:w-auto hover:bg-muted"
                >
                  <div className="bg-primary rounded-full p-1 flex items-center justify-center w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9">
                    <Play className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-white fill-white" />
                  </div>
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Feature Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-12 lg:gap-16">
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 bg-primary rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-primary-foreground" />
                </div>
                <span className="font-lato text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-medium leading-[1.5] text-left text-foreground">
                  50+ Jurisdictions Tracked
                </span>
              </div>
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 bg-primary rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-primary-foreground" />
                </div>
                <span className="font-lato text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-medium leading-[1.5] text-left text-foreground">
                  Real-Time Updates
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Map */}
          <div className="flex flex-col justify-center items-center gap-8 lg:gap-12 w-full lg:w-auto lg:flex-1">
            {breachCountsByState ? (
              <div className="w-full max-w-[650px] lg:max-w-[1000px] xl:max-w-[1200px] 2xl:max-w-[1400px]">
                <BreachMap breachCountsByState={breachCountsByState} />
              </div>
            ) : (
              <div className="w-full max-w-[650px] lg:max-w-[1000px] xl:max-w-[1200px] 2xl:max-w-[1400px]">
                <Image
                  src="/images/website/features/legal-updates-chart-47bf32.jpg"
                  alt="Legal Updates Chart"
                  width={1400}
                  height={886}
                  className="rounded-lg w-full h-auto"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
