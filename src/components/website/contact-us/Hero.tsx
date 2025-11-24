"use client";

import React from "react";

export function Hero() {
  return (
    <section className="bg-background pt-32 sm:pt-40 md:pt-48 lg:pt-56 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <h1 className="font-['Encode_Sans_Semi_Expanded'] text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-normal leading-[1.25] text-center text-primary w-full max-w-[510px] break-words">
              Get in Touch
            </h1>
            <p className="font-lato text-base sm:text-lg font-normal leading-[1.33] text-center text-foreground w-full max-w-[620px] break-words">
              Ready to secure your design workflow? Let&apos;s discuss how our
              AI-powered security solutions can protect your creative assets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
