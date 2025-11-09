"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { AnimatedToggle } from "@/components/ui/animated-toggle";

const pricingTiers = [
  {
    id: "annual",
    title: "Annual Plan",
    description: "Complete enterprise solution with unlimited access",
    price: "$35,000/per year",
    icon: "enterprise",
    features: [
      "Unlimited users",
      "Full platform access",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated account manager",
    ],
    buttonText: "Start Free Trial",
    buttonStyle: "gradient",
  },
  {
    id: "api",
    title: "API Usage",
    description: "Pay-per-use model for flexible API consumption",
    price: "$0.05 - $0.10/per API call",
    icon: "api",
    features: [
      "First 100 API calls free",
      "Scalable pricing",
      "Real-time monitoring",
      "API documentation",
      "Rate limiting controls",
      "Usage analytics",
    ],
    buttonText: "Get API Key",
    buttonStyle: "gradient",
  },
  {
    id: "regulatory",
    title: "Regulatory Filing",
    description: "Comprehensive regulatory compliance solutions",
    price: "$50 - $500/per API call",
    icon: "regulatory",
    features: [
      "First year filing free",
      "Expert review process",
      "Compliance tracking",
      "Document management",
      "Regulatory updates",
      "24/7 compliance support",
    ],
    buttonText: "Schedule Demo",
    buttonStyle: "gradient",
  },
];

export function PricingTiers() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section className="bg-[#0F0C0B] pt-2 pb-20 px-4 sm:px-8 md:px-12 lg:px-20 w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-[1280px] mx-auto">
        {/* Animated Toggle Switch */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 bg-white/8 rounded-lg p-1.5">
            <span
              className={`px-3 py-2.5 rounded-md text-xl font-medium transition-colors duration-200 ${
                !isYearly ? "text-[#AE99F9]" : "text-[#E7E7E7]"
              }`}
            >
              Monthly
            </span>
            <AnimatedToggle
              checked={isYearly}
              onChange={setIsYearly}
              variant="gradient"
              size="lg"
              className="mx-2"
            />
            <span
              className={`px-3 py-2.5 rounded-md text-xl font-medium transition-colors duration-200 ${
                isYearly ? "text-[#AE99F9]" : "text-[#E7E7E7]"
              }`}
            >
              Yearly
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 w-full">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className="flex flex-col bg-[rgba(21,21,21,0.4)] border border-dashed border-[rgba(231,231,231,0.5)] rounded-lg shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03)] h-full"
            >
              {/* Header */}
              <div className="flex flex-col gap-6 p-8">
                {/* Icon */}
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  {tier.icon === "enterprise" && (
                    <svg
                      className="w-7 h-7 text-[#AE99F9]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  )}
                  {tier.icon === "api" && (
                    <svg
                      className="w-7 h-7 text-[#AE99F9]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  )}
                  {tier.icon === "regulatory" && (
                    <svg
                      className="w-7 h-7 text-[#AE99F9]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  )}
                </div>

                {/* Title and Description */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-lato text-2xl font-bold leading-[1.21] text-left text-[#E7E7E7]">
                    {tier.title}
                  </h3>
                  <p className="font-lato text-base font-normal leading-[1.375] text-left text-[#E7E7E7]">
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2">
                  <p className="font-lato text-[42px] font-bold leading-[1.21] text-left text-[#E7E7E7]">
                    {tier.price.split("/")[0]}
                  </p>
                  <p className="font-lato text-base font-normal leading-[1.375] text-left text-[#8C94A6]">
                    /{tier.price.split("/")[1]}
                  </p>
                </div>

                {/* CTA Button */}
                <Button className="bg-gradient-to-b from-[#C9B9FF] to-[#2B1B64] hover:opacity-90 w-full h-12 px-6 py-3 rounded-[48px] text-base font-medium text-white">
                  {tier.buttonText}
                </Button>
              </div>

              {/* Features List */}
              <div className="flex flex-col gap-6 p-8 border-t border-dashed border-[rgba(231,231,231,0.5)] mt-auto">
                <div className="flex flex-col gap-4">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#35BC79] rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-lato text-base font-normal leading-[1.5] text-left text-[#E7E7E7]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
