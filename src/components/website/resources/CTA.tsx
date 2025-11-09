"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section
      className="relative flex flex-col justify-center items-center gap-6 py-30 px-4 sm:px-8 md:px-12 lg:px-20 min-h-[750px] w-full max-w-full overflow-x-hidden"
      style={{
        backgroundImage: `url(/images/website/resources/cta-background.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Theme-aware gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-l from-background/90 via-background/70 to-transparent"></div>

      <div className="relative z-10 flex flex-col justify-center gap-8 w-full max-w-[1280px] mx-auto px-4">
        <div className="flex flex-col gap-6">
          <h2 className="font-['Encode_Sans_Semi_Expanded'] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal leading-[1.25] text-left text-primary w-full max-w-[494px]">
            Ready to Transform Your Legal Compliance?
          </h2>
          <p className="font-lato text-lg font-normal leading-[1.33] text-left text-foreground w-full">
            Join leading organizations who trust Atraiva.ai to keep them
            informed of critical data breach law changes across all
            jurisdictions.
          </p>
        </div>

        <div className="flex gap-4 h-12">
          <Link href="/contact-us?inquiryType=demo">
            <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 px-[25.6px] py-[12.8px] rounded-[48px] h-12 text-base font-medium text-white shadow-lg transition-all">
              Schedule a Demo
            </Button>
          </Link>
          <Button
            variant="outline"
            className="bg-transparent border-primary dark:border-primary border-2 text-primary dark:text-primary hover:bg-primary/20 dark:hover:bg-primary/20 px-[25.6px] py-[12.8px] rounded-[48px] h-12 text-base font-medium transition-all"
          >
            Get demo
          </Button>
        </div>
      </div>
    </section>
  );
}
