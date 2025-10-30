import React from "react";
import {
  Header,
  HeroSection,
  MissionVision,
  CoreValues,
  TeamSection,
  ExpertiseSection,
  // SecuritySection,
  CTASection,
  Footer,
} from "@/components/website/aboutus";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Header />
      <HeroSection />
      <MissionVision />
      <CoreValues />
      <TeamSection />
      <ExpertiseSection />
      {/* <SecuritySection /> */}
      <CTASection />
      <Footer />
    </div>
  );
}
