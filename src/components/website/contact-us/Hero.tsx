"use client";

import React from "react";

export function Hero() {
  return (
    <section className="bg-background pt-[220px] pb-20 px-4 sm:px-8 md:px-12 lg:px-20 w-full max-w-full overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col items-center gap-15">
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-['Encode_Sans_Semi_Expanded'] text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-normal leading-[1.25] text-center text-primary w-full max-w-[510px] px-4">
              Get in Touch
            </h1>
            <p className="font-lato text-base sm:text-lg font-normal leading-[1.33] text-center text-foreground w-full max-w-[620px] px-4">
              Ready to secure your design workflow? Let&apos;s discuss how our
              AI-powered security solutions can protect your creative assets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
