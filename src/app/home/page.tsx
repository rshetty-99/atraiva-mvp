"use client";

import React from "react";
import {
  Header,
  Hero,
  WhatWeDo,
  Features,
  Enterprise,
  ProductFeatures,
  CTA,
  Footer,
} from "@/components/home";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <WhatWeDo />
      <Features />
      <Enterprise />
      <ProductFeatures />
      <CTA />
      <Footer />
    </div>
  );
}
