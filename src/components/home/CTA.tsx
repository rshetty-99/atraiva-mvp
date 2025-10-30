"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative flex items-center justify-between py-30 px-20 w-full h-[750px] bg-background">
      {/* Content - Positioned to the left */}
      <div className="relative z-10 flex flex-col justify-center gap-8 w-[500px] ml-[180px]">
        <h2 className="font-['Encode_Sans_Semi_Expanded'] text-[48px] font-normal leading-[1.2] text-left text-primary">
          Get started with the #1 AI Agent today
        </h2>

        <p className="font-lato text-lg font-normal leading-[1.5] text-left text-muted-foreground max-w-[450px]">
          Transform your cybersecurity compliance with AI-powered breach
          detection, automated reporting, and real-time risk assessment. Join
          thousands of organizations already using Atraiva to stay ahead of
          regulatory requirements.
        </p>

        <div className="flex gap-4 h-12">
          <Link href="/contact-us?inquiryType=demo">
            <Button className="bg-primary hover:bg-primary/90 text-white font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12 border-0 shadow-lg transition-all">
              Schedule a Demo
            </Button>
          </Link>
          {/* <Button
            variant="outline"
            className="bg-transparent border-border hover:border-primary border-2 text-foreground hover:text-primary hover:bg-primary/10 font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12 transition-all"
          >
            Get Demo
          </Button> */}
        </div>
      </div>

      {/* Image - Positioned to the right */}
      <div className="relative z-10 flex items-center justify-center w-[600px] h-full mr-[140px]">
        <Image
          src="/images/website/home/cta-background-dad204.jpg"
          alt="CTA Background"
          width={600}
          height={750}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </section>
  );
}
