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
import { FAQ } from "@/components/website/FAQ";
import { homepageFAQs } from "@/lib/data/faq-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground w-full max-w-full overflow-x-hidden">
      <Header />
      <Hero />
      <WhatWeDo />
      <Features />
      <Enterprise />
      <ProductFeatures />
      <FAQ
        items={homepageFAQs}
        title="Frequently Asked Questions"
        description="Get quick answers to common questions about Atraiva's breach determination platform"
        columns={1}
        showAll={false}
      />
      <div className="text-center pb-12">
        <Link href="/faq">
          <Button variant="outline" size="lg">
            View All FAQs
          </Button>
        </Link>
      </div>
      <CTA />
      <Footer />
    </div>
  );
}
