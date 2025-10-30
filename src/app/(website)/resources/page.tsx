"use client";

import React from "react";
import {
  Header,
  Hero,
  BrowseSection,
  BlogGrid,
  Newsletter,
  CTA,
  Footer,
} from "@/components/website/resources";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#0F0C0B] text-gray-200">
      <Header />
      <Hero />
      <BrowseSection />
      <BlogGrid />
      <Newsletter />
      <CTA />
      <Footer />
    </div>
  );
}
