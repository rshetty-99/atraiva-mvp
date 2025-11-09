"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "../website/Header";

export function Hero() {
  return (
    <section
      className="relative min-h-[1020px] bg-background pt-[130px] pb-0 w-full max-w-full overflow-x-hidden"
      style={{
        overflow: "hidden",
        clipPath: "inset(0)",
        maxWidth: "100vw",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <Header />

      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/website/home/hero-background.png"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/30"></div>
      </div>

      {/* Background Decorative Elements - Completely hidden until 2xl (1536px+) to prevent overflow */}
      {/* Using CSS to force hide until 2xl breakpoint - COMPLETELY REMOVED FROM FLOW */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 1535px) { 
              .hero-decorative-container { 
                display: none !important; 
                visibility: hidden !important;
                position: absolute !important;
                left: -9999px !important;
                width: 0 !important;
                height: 0 !important;
                overflow: hidden !important;
                pointer-events: none !important;
              } 
            }
            @media (max-width: 1279px) {
              .hero-decorative-container {
                display: none !important;
              }
            }
          `,
        }}
      />
      <div
        className="absolute inset-0 overflow-hidden hero-decorative-container hidden 2xl:block"
        style={{
          overflow: "hidden",
          clipPath: "inset(0)",
          display: "none",
          maxWidth: "100vw",
          width: "100%",
        }}
      >
        <div
          className="absolute top-[-2197px] right-0 2xl:left-[1807px] w-[1440px] h-[1693px] bg-gradient-to-b from-[rgba(244,245,251,0.6)] to-[rgba(233,235,243,1)] overflow-hidden"
          style={{
            clipPath: "inset(0)",
            right: "0",
            left: "auto",
            maxWidth: "min(100vw, 1440px)",
          }}
        >
          <div
            className="absolute top-[-428px] left-0 w-[1440px] h-[1440px] max-w-full overflow-hidden"
            style={{ clipPath: "inset(0)" }}
          >
            {/* Decorative circles */}
            <div className="absolute top-[190.59px] left-[190.59px] w-[1058.82px] h-[1058.82px] rounded-full border-[1.93px] border-gray-300/50 bg-[#D9D9D9] max-w-[calc(100%-190.59px)]"></div>
            <div className="absolute top-0 left-0 w-[1440px] h-[1440px] rounded-full border-[1.93px] border-gray-300/50 bg-[#D9D9D9] max-w-full"></div>
            <div className="absolute top-[369.63px] left-[369.63px] w-[700.75px] h-[700.75px] rounded-full border-[1.93px] border-gray-300/50 bg-[#D9D9D9] max-w-[calc(100%-369.63px)]"></div>
            <div className="absolute top-[560.21px] left-[560.21px] w-[319.57px] h-[319.57px] rounded-full border-[1.93px] border-gray-300/50 bg-[#D9D9D9] max-w-[calc(100%-560.21px)]"></div>
          </div>
        </div>
        <div
          className="absolute top-[561px] left-0 2xl:left-[323px] w-[795px] h-[296px] rounded-full bg-[#8791DE] blur-[100px] overflow-hidden hidden 2xl:block"
          style={{
            clipPath: "inset(0)",
            maxWidth: "min(100vw, 795px)",
          }}
        ></div>
      </div>

      {/* Hero Content - Responsive positioning */}
      <div
        className="relative lg:absolute lg:right-[5%] xl:right-[300px] top-1/2 lg:transform lg:-translate-y-1/2 flex flex-col items-center justify-center gap-8 w-full max-w-[800px] mx-auto px-4 lg:p-8 lg:mx-0"
        style={{
          maxWidth: "min(100vw, 800px)",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div className="flex flex-col items-center gap-6 w-full">
          <h1 className="font-['Encode_Sans_Semi_Expanded'] text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-normal leading-[1.25] text-center w-full max-w-[722px] bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent">
            Manage your Invisible Risk with AI-Enhanced cybersecurity
            compliance.
          </h1>
        </div>

        <div className="flex flex-col items-center gap-3 w-full">
          <p className="font-lato text-base sm:text-lg font-normal leading-[1.375] text-center text-foreground w-full">
            Your data stays private. Your compliance becomes defensible.
          </p>
          <p className="font-lato text-base sm:text-lg font-normal leading-[1.375] text-center text-foreground">
            Atraiva detects notification and reporting obligations automatically
            & accurately.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 h-auto sm:h-12 mt-4 justify-center w-full">
          <Link
            href="/contact-us?inquiryType=demo"
            className="w-full sm:w-auto"
          >
            <Button className="bg-primary hover:bg-primary/90 text-white font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12 shadow-lg transition-all w-full sm:w-auto">
              Schedule a Demo
            </Button>
          </Link>
          <Button
            variant="outline"
            className="bg-muted border-border border-[0.8px] text-foreground hover:bg-muted/80 font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12 w-full sm:w-auto"
          >
            View Features
          </Button>
        </div>
      </div>

      {/* Hero Dashboard Image - Responsive positioning */}
      <div
        className="relative lg:absolute lg:left-[5%] xl:left-[300px] top-[20px] lg:top-[140px] w-full max-w-[1000px] min-w-0 h-auto lg:h-[787.65px] mx-auto px-4 lg:px-0 lg:mx-0 mt-8 lg:mt-0 overflow-hidden"
        style={{
          maxWidth: "min(100vw, 1000px)",
          boxSizing: "border-box",
          width: "100%",
          left: "auto",
          right: "auto",
        }}
      >
        <Image
          src="/images/website/home/hero-dashboard-4c4e5e.png"
          alt="Atraiva Dashboard"
          width={1000}
          height={788}
          className="rounded-2xl border-[15px] border-white/8 backdrop-blur-[80px] w-full h-auto"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    </section>
  );
}
