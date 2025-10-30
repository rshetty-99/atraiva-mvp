"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      className="relative bg-background pt-[320px] pb-20 px-20 h-[508px]"
      style={{
        backgroundImage: `url(/images/website/resources/hero-background-96a838.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Theme-aware overlay for text contrast */}
      <div className="absolute inset-0 bg-background/60"></div>

      {/* Background Blur Element */}
      <div className="absolute top-16 left-[639px] w-[681.42px] h-[592.91px] rounded-full bg-[rgba(134,145,216,0.4)] blur-[300px]"></div>

      <div className="relative z-10 flex items-center h-full">
        <div className="flex items-center justify-between w-full gap-20">
          {/* Left Content */}
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex flex-col gap-4">
              <span className="font-lato text-lg font-normal leading-[1.33] text-left text-primary">
                Home / Resources
              </span>
              <h1 className="font-lato text-[48px] font-normal leading-[1.2] text-left text-foreground">
                Security Insights &<br />
                Expert Analysis
              </h1>
              <p className="font-lato text-lg font-normal leading-[1.33] text-left text-muted-foreground max-w-[502px]">
                Stay ahead of emerging threats with cutting-edge research,
                expert insights, and practical guidance from our team of
                cybersecurity professionals and AI specialists.
              </p>
            </div>

            {/* Author and Date */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="font-lato text-base font-medium leading-[1.5] text-foreground">
                  Dr. Sarah Chen
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-lato text-base font-medium leading-[1.5] text-foreground">
                  March 15, 2024
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Button className="bg-primary hover:bg-primary/90 px-[25.6px] py-[12.8px] rounded-[48px] h-12 text-base font-medium text-white flex items-center gap-2 shadow-lg transition-all">
                Read article
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-border border-2 hover:bg-muted px-[25.6px] py-[12.8px] rounded-[48px] h-12 text-base font-medium text-foreground"
              >
                Subscribe to newsletter
              </Button>
            </div>
          </div>

          {/* Right Content - Image */}
          {/* <div className="flex-1 flex justify-end">
            <div className="w-full max-w-[500px] h-[400px] relative">
              <img
                src="/images/website/resources/hero-image.jpg"
                alt="Cybersecurity professional"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
