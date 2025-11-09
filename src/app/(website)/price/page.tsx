"use client";

import React from "react";
import {
  Header,
  Hero,
  PricingTiers,
  CTA,
  Footer,
} from "@/components/website/price";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0F0C0B] text-gray-200 w-full max-w-full overflow-x-hidden">
      <Header />
      <Hero />
      <PricingTiers />
      <CTA />
      <Footer />
    </div>
  );
}
