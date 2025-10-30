"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section
      className="relative py-[120px] px-20 flex items-center"
      style={{
        backgroundImage: `
          linear-gradient(180deg, rgba(16, 14, 16, 0) 0%, rgba(16, 14, 16, 1) 100%),
          linear-gradient(-90deg, rgba(12, 12, 12, 0) 39%, rgba(12, 12, 12, 1) 76%),
           url(/images/website/cta-background.jpg)
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-10 w-[670px]">
          <div className="flex flex-col gap-6">
            <h2 className="text-primary text-[42px] font-normal font-['Encode_Sans_Semi_Expanded'] leading-[1.25]">
              Ready to Transform Your Legal Compliance?
            </h2>
            <p className="text-foreground text-[18px] font-['Lato'] leading-[1.333]">
              Join leading organizations who trust Atraiva.ai to keep them
              informed of critical data breach law changes across all
              jurisdictions.
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="/contact-us?inquiryType=demo">
              <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] text-white hover:opacity-90 font-['Lato'] text-base font-medium leading-[1] px-6 py-3 rounded-[48px] h-12 border-0 shadow-lg transition-all">
                Schedule a Demo
              </Button>
            </Link>
            <Button
              variant="outline"
              className="bg-transparent border-primary dark:border-primary border-2 text-primary dark:text-primary px-6 py-3 rounded-[48px] text-base font-['Lato'] font-medium leading-[1] h-12 hover:bg-primary/20 dark:hover:bg-primary/20 transition-all"
            >
              Get Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
