"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative bg-[#0F0C0B] pt-80 pb-20 px-20">
      {/* Background Blur Element */}
      <div className="absolute top-16 left-[-51px] w-[979.42px] h-[852.21px] rounded-full bg-[rgba(134,145,216,0.4)] blur-[300px]"></div>

      <div className="relative z-10 flex flex-col items-center gap-15 max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-['Encode_Sans_Semi_Expanded'] text-[40px] font-normal leading-[1.25] text-center text-[#E7E7E7] w-[540px]">
              Pricing that that won&apos;t pinch your pocket
            </h1>
            <p className="font-lato text-lg font-normal leading-[1.33] text-center text-[#E7E7E7]">
              Start free. upgrade only when you&apos;re ready to scale.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
