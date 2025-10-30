"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function Features() {
  return (
    <section className="bg-background py-15 px-20">
      <div className="flex items-center justify-center gap-15">
        {/* Left Content */}
        <div className="flex flex-col items-center gap-15">
          <div className="flex flex-col gap-4 justify-center items-center">
            <h2 className="font-['Encode_Sans_Semi_Expanded'] text-[42px] font-normal leading-[1.25] text-center w-[800px]">
              <span className="text-primary">
                Tailored for Complex, High-Stakes Environments{" "}
              </span>
              <span className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent">
                Atraiva&apos;s Enterprise Platform is Built for Organizations
                That:
              </span>
            </h2>
          </div>

          {/* Features Grid */}
          <div className="flex gap-15">
            {/* Left Side - Image */}
            <div className="w-[620px] h-[500px]">
              <Image
                src="/images/website/home/enterprise-features.jpg"
                alt="Enterprise Features"
                width={620}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Side - Feature List */}
            <div className="flex flex-col gap-4">
              {/* Feature 1 */}
              <div className="bg-background border border-dashed border-border p-5 flex flex-col justify-center gap-15 w-[600px]">
                <div className="flex items-stretch gap-2.5">
                  <div className="flex flex-col justify-center gap-2.5 w-full">
                    <div className="flex items-center gap-2.5 w-full">
                      <Check className="w-6 h-6 text-primary" />
                      <span className="font-lato text-lg font-semibold leading-[1.333] text-left text-foreground">
                        Operate across multiple locations or regions
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-background border border-dashed border-border p-5 flex flex-col justify-center gap-15 w-[600px]">
                <div className="flex items-stretch gap-25">
                  <div className="flex items-center gap-2.5 w-full">
                    <Check className="w-6 h-6 text-primary" />
                    <span className="font-lato text-lg font-semibold leading-[1.333] text-left text-foreground">
                      Span diverse industry verticals
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-background border border-dashed border-border p-5 flex flex-col justify-center gap-15 w-[600px]">
                <div className="flex items-stretch gap-25">
                  <div className="flex items-center gap-2.5 w-full">
                    <Check className="w-6 h-6 text-primary" />
                    <span className="font-lato text-lg font-semibold leading-[1.333] text-left text-foreground">
                      Must comply with HIPAA and other healthcare mandates
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-background border border-dashed border-border p-5 flex flex-col justify-center gap-15 w-[600px]">
                <div className="flex items-stretch gap-25">
                  <div className="flex items-center gap-2.5 w-full">
                    <Check className="w-6 h-6 text-primary" />
                    <span className="font-lato text-lg font-semibold leading-[1.333] text-left text-foreground">
                      Are subject to GDPR and global privacy regulations (coming
                      soon)
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="bg-background border border-dashed border-border p-5 flex flex-col justify-center gap-15 w-[600px]">
                <div className="flex items-stretch gap-25">
                  <div className="flex items-center gap-2.5 w-full">
                    <Check className="w-6 h-6 text-primary" />
                    <span className="font-lato text-lg font-semibold leading-[1.333] text-left text-foreground">
                      Manage data across large-scale, distributed
                      infrastructures
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 h-12">
            <Link href="/contact-us?inquiryType=demo">
              <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 text-white font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12 shadow-lg transition-all">
                Schedule a Demo
              </Button>
            </Link>
            <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 text-white font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12 shadow-lg transition-all">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
