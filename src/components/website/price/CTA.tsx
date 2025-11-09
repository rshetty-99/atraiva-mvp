"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section
      className="relative flex flex-col justify-center items-center gap-6 py-8 lg:py-30 px-4 sm:px-8 md:px-12 lg:px-20 min-h-[750px] bg-black/80 backdrop-blur-md w-full max-w-full overflow-x-hidden"
      style={{
        backgroundImage: `linear-gradient(-90deg, rgba(12, 12, 12, 0) 39%, rgba(12, 12, 12, 1) 76%), url(/images/website/price/cta-background-dad204.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 flex flex-col justify-center gap-8 w-full max-w-[1280px] mx-auto px-4">
        <div className="flex flex-col gap-6 w-full max-w-[494px]">
          <h2 className="font-['Amethysta'] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal leading-[1.26] text-left text-primary w-full">
            Ready to Transform Your Legal Compliance?
          </h2>
          <p className="font-lato text-lg font-normal leading-[1.33] text-left text-foreground w-full">
            Join leading organizations who trust Atraiva.ai to keep them
            informed of critical data breach law changes across all
            jurisdictions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 h-auto sm:h-12">
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
