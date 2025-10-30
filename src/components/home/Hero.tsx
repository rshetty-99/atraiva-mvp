"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "../website/Header";

export function Hero() {
  return (
    <section className="relative min-h-[1020px] bg-background pt-[130px] pb-0">
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

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-2197px] left-[1807px] w-[1440px] h-[1693px] bg-gradient-to-b from-[rgba(244,245,251,0.6)] to-[rgba(233,235,243,1)]">
          <div className="absolute top-[-428px] left-0 w-[1440px] h-[1440px]">
            {/* Decorative circles */}
            <div className="absolute top-[190.59px] left-[190.59px] w-[1058.82px] h-[1058.82px] rounded-full border-[1.93px] border-gray-300/50 bg-[#D9D9D9]"></div>
            <div className="absolute top-0 left-0 w-[1440px] h-[1440px] rounded-full border-[1.93px] border-gray-300/50 bg-[#D9D9D9]"></div>
            <div className="absolute top-[369.63px] left-[369.63px] w-[700.75px] h-[700.75px] rounded-full border-[1.93px] border-gray-300/50 bg-[#D9D9D9]"></div>
            <div className="absolute top-[560.21px] left-[560.21px] w-[319.57px] h-[319.57px] rounded-full border-[1.93px] border-gray-300/50 bg-[#D9D9D9]"></div>
          </div>
        </div>
        <div className="absolute top-[561px] left-[323px] w-[795px] h-[296px] rounded-full bg-[#8791DE] blur-[100px]"></div>
      </div>

      {/* Hero Content */}
      <div className="absolute right-[300px] top-1/2 transform -translate-y-1/2 flex flex-col items-center justify-center gap-8 w-[800px] p-8">
        <div className="flex flex-col items-center gap-6 w-[800px]">
          <h1 className="font-['Encode_Sans_Semi_Expanded'] text-[48px] font-normal leading-[1.25] text-center w-[722px] bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent">
            Manage your Invisible Risk with AI-Enhanced cybersecurity
            compliance.
          </h1>
        </div>

        <div className="flex flex-col items-center gap-3 w-full">
          <p className="font-lato text-lg font-normal leading-[1.375] text-center text-foreground w-full">
            Your data stays private. Your compliance becomes defensible.
          </p>
          <p className="font-lato text-lg font-normal leading-[1.375] text-center text-foreground">
            Atraiva detects notification and reporting obligations automatically
            & accurately.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 h-12 mt-4 justify-center">
          <Link href="/contact-us?inquiryType=demo">
            <Button className="bg-primary hover:bg-primary/90 text-white font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12 shadow-lg transition-all">
              Schedule a Demo
            </Button>
          </Link>
          <Button
            variant="outline"
            className="bg-muted border-border border-[0.8px] text-foreground hover:bg-muted/80 font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12"
          >
            View Features
          </Button>
        </div>
      </div>

      {/* Hero Dashboard Image */}
      <div className="absolute left-[300px] top-[140px] w-[1000px] h-[787.65px]">
        <Image
          src="/images/website/home/hero-dashboard-4c4e5e.png"
          alt="Atraiva Dashboard"
          width={1000}
          height={788}
          className="rounded-2xl border-[15px] border-white/8 backdrop-blur-[80px]"
        />
      </div>
    </section>
  );
}
