"use client";

// import Header from "@/components/home/Header";
// import Hero from "@/components/home/Hero";
// import Features from "@/components/home/Features";
// import Solutions from "@/components/home/Solutions";
// import Pricing from "@/components/home/Pricing";
// import Resources from "@/components/home/Resources";
// import CTA from "@/components/home/CTA";
// import Footer from "@/components/home/Footer";
// import { useHydrationFix } from "@/hooks/useHydrationFix";

// export default function Home() {
//   useHydrationFix();

//   return (
//     <div className="min-h-screen bg-background" style={{ paddingTop: "80px" }}>
//       <Header />
//       <div style={{ marginTop: "40px" }}>
//         <Hero />
//       </div>
//       <Features />
//       <Solutions />
//       <Pricing />
//       <Resources />
//       <CTA />
//       <Footer />
//     </div>
//   );
// }

"use client";

// import Header from "@/components/home/Header";
// import Hero from "@/components/home/Hero";
// import Features from "@/components/home/Features";
// import CTA from "@/components/home/CTA";
// import Footer from "@/components/home/Footer";

// export default function HomePage() {
//   return (
//     <div className="min-h-screen">
//       <Header />
//       <Hero />
//       <Features />
//       <CTA />
//       <Footer />
//     </div>
//   );
// }
import React from "react";
import {
  Header,
  HeroSection,
  MissionVision,
  CoreValues,
  TeamSection,
  ExpertiseSection,
  SecuritySection,
  CTASection,
  Footer,
} from "@/components/website/aboutus";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Header />
      <HeroSection />
      <MissionVision />
      <CoreValues />
      <TeamSection />
      <ExpertiseSection />
      <SecuritySection />
      <CTASection />
      <Footer />
    </div>
  );
}
