"use client";

import React from "react";
import {
  Header,
  Hero,
  ProductFeatures,
  Stats,
  WhyChooseUs,
  CTA,
  Footer,
} from "@/components/website/features";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0F0C0B] text-gray-200">
      <Header />
      <Hero />
      <ProductFeatures />
      <Stats />
      <WhyChooseUs />
      <CTA />
      <Footer />
    </div>
  );
}
