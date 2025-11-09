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
import { getBreachesByState } from "@/lib/breach/server-fetch";

// ISR Configuration: Revalidate every hour (3600 seconds)
export const revalidate = 3600;

export default async function FeaturesPage() {
  // Fetch breach counts by state
  const breachCountsByState = await getBreachesByState();

  return (
    <div className="min-h-screen bg-[#0F0C0B] text-gray-200 w-full max-w-full overflow-x-hidden">
      <Header />
      <Hero breachCountsByState={breachCountsByState} />
      <ProductFeatures />
      <Stats />
      <WhyChooseUs />
      <CTA />
      <Footer />
    </div>
  );
}
