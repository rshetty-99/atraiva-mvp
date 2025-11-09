"use client";

import React from "react";
import Image from "next/image";

const securityCertifications = [
  {
    name: "Soc 2 Type II",
    icon: "/images/website/soc2-certification-4606c6.png",
    width: 175,
  },
  {
    name: "ISO 27001",
    icon: "/images/website/iso27001-certification.png",
    width: 173,
  },
  {
    name: "GDPR Compliant",
    icon: "/images/website/gdpr-certification-141675.png",
    width: 175,
  },
  {
    name: "256 - bit encryption",
    icon: "/images/website/encryption-certification-18d519.png",
    width: 167,
  },
];

export function SecuritySection() {
  return (
    <section className="bg-white dark:bg-background flex items-center py-10 px-4 sm:px-8 md:px-12 lg:px-20 w-full max-w-full overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto w-full">
        <div className="flex flex-col items-center gap-[60px]">
          {/* Header */}
          <div className="flex flex-col justify-center items-center gap-4 w-full px-4">
            <h2 className="text-primary text-[42px] font-normal font-['Encode_Sans_Semi_Expanded'] leading-[1.25] text-center">
              Enterprise-Grade Security
            </h2>
            <p className="text-muted-foreground text-[18px] font-['Lato'] leading-[1.2] text-center w-full max-w-[632px]">
              Our platform meets the highest industry standards including SOC 2
              Type II, ISO 27001, and GDPR compliance, ensuring your design
              assets are protected with bank-level security.
            </p>
          </div>

          {/* Certifications */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full px-4">
            {securityCertifications.map((cert, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-4 min-w-0"
                style={{ width: `min(100%, ${cert.width}px)` }}
              >
                {/* Certification Badge */}
                <div className="w-40 h-40 bg-muted rounded-full flex items-center justify-center p-[18px]">
                  <div className="w-[130px] h-[130px] bg-card rounded-[11.787px] flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <Image
                        src={cert.icon}
                        alt={cert.name}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Certification Name */}
                <p className="text-foreground text-base font-['Lato'] leading-[1.5] text-center">
                  {cert.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
