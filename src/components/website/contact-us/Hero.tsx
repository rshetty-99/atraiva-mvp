"use client";

import React from "react";

export function Hero() {
  return (
    <section className="bg-background pt-[220px] pb-20 px-20">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col items-center gap-15">
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-['Encode_Sans_Semi_Expanded'] text-[56px] font-normal leading-[1.25] text-center text-primary w-[510px]">
              Get in Touch
            </h1>
            <p className="font-lato text-lg font-normal leading-[1.33] text-center text-foreground w-[620px]">
              Ready to secure your design workflow? Let&apos;s discuss how our
              AI-powered security solutions can protect your creative assets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
