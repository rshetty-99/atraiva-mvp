"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section
      className="relative flex flex-col justify-center gap-6 py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-8 md:px-12 lg:px-20 min-h-[500px] sm:min-h-[600px] md:min-h-[700px] w-full max-w-full overflow-x-hidden"
      style={{
        backgroundImage: `url(/images/website/contact-us/cta-overlay-3a14d9.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Theme-aware Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-l from-background/90 via-background/70 to-transparent"></div>

      <div className="relative z-10 flex flex-col justify-center gap-6 md:gap-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-4 md:gap-6">
          <h2 className="font-['Encode_Sans_Semi_Expanded'] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal leading-[1.25] text-left text-primary w-full max-w-[494px] break-words">
            Ready to Transform Your Legal Compliance?
          </h2>
          <p className="font-lato text-sm sm:text-base md:text-lg font-bold leading-[1.33] text-left text-foreground w-full max-w-3xl break-words">
            Join leading organizations who trust Atraiva.ai to keep them
            informed of critical data breach law changes across all
            jurisdictions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link href="/contact-us?inquiryType=demo">
            <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 px-6 py-3 rounded-[48px] h-auto sm:h-12 text-sm sm:text-base font-medium text-white shadow-lg transition-all w-full sm:w-auto">
              Schedule a Demo
            </Button>
          </Link>
          <Button
            variant="outline"
            className="bg-transparent border-primary dark:border-primary border-2 text-primary dark:text-primary hover:bg-primary/20 dark:hover:bg-primary/20 px-6 py-3 rounded-[48px] h-auto sm:h-12 text-sm sm:text-base font-medium transition-all w-full sm:w-auto"
          >
            Get demo
          </Button>
        </div>
      </div>
    </section>
  );
}
