"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      className="hero-section relative pt-40 pb-20 px-4 sm:px-8 md:px-12 lg:px-20 z-10 flex items-center w-full max-w-full overflow-x-hidden"
      style={{
        backgroundImage: "url(/images/website/hero-background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/60 z-0"></div>

      <div className="relative z-20 max-w-[1280px] mx-auto w-full px-4">
        <div className="flex flex-col gap-10 w-full max-w-[680px]">
          <div className="inline-flex items-center justify-center gap-2 bg-muted/30 backdrop-blur-[10px] rounded-[60px] px-4 py-2 self-start max-w-full">
            <span className="text-primary text-sm font-['Lato'] font-medium uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
              AI - Powered Design Security
            </span>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-primary text-[40px] font-normal font-['Encode_Sans_Semi_Expanded'] leading-[1.4]">
                Securing design
                <br />
                Innovation
              </h1>
              <p className="text-muted-foreground text-[18px] font-['Lato'] leading-[1.333]">
                We&apos;re revolutionizing design security with cutting-edge AI
                technology, protecting your Figma workflows and creative assets
                from emerging threats.
              </p>
            </div>

            <div className="flex gap-4">
              <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 text-white font-['Lato'] text-base font-medium leading-[1] px-6 py-3 rounded-[48px] h-12 border-0 shadow-lg transition-all">
                Know more about us
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-primary border-2 text-primary px-6 py-3 rounded-[48px] text-base font-['Lato'] font-medium leading-[1] h-12 hover:bg-primary/10 transition-all"
                onClick={() => {
                  document.getElementById('team')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
              >
                Meet our Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
