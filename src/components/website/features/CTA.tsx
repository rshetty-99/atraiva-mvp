"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section
      className="relative py-30 h-[750px]"
      style={{
        backgroundImage: `linear-gradient(-90deg, rgba(12, 12, 12, 0) 39%, rgba(12, 12, 12, 1) 76%), url(/images/website/features/cta-background.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "linear-gradient(-90deg, rgba(12, 12, 12, 0) 39%, rgba(12, 12, 12, 1) 76%)",
        }}
      ></div>

      <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-8 w-full max-w-full overflow-x-hidden">
        <div className="relative z-10 flex flex-col justify-center items-center gap-6 w-full max-w-[1280px] mx-auto">
          <div className="flex flex-col gap-6 w-full">
            <h2 className="font-['Encode_Sans_Semi_Expanded'] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal leading-[1.25] text-left text-primary w-full max-w-[494px]">
              Ready to Transform Your Legal Compliance?
            </h2>
            <p className="font-lato text-lg font-normal leading-[1.333] text-left text-foreground">
              Join leading organizations who trust Atraiva.ai to keep them
              informed of critical data breach law changes across all
              jurisdictions.
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="/contact-us?inquiryType=demo">
              <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 text-white font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12 shadow-lg transition-all">
                Schedule a Demo
              </Button>
            </Link>
            <Button
              variant="outline"
              className="bg-transparent border-primary dark:border-primary border-2 text-primary dark:text-primary hover:bg-primary/20 dark:hover:bg-primary/20 font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12 transition-all"
            >
              Get demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
