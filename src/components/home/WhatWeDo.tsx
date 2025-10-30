"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  AlertTriangle,
  MapPin,
} from "lucide-react";

export function WhatWeDo() {
  return (
    <section className="bg-background py-8 px-4 sm:py-12 sm:px-6 md:py-16 md:px-8 lg:py-20 lg:px-12 xl:py-24 xl:px-16 2xl:px-20">
      <div className="max-w-xs mx-auto sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16 xl:gap-20">
          {/* Left Content */}
          <div className="flex flex-col gap-6 w-full lg:w-[329px] lg:flex-shrink-0">
            <div className="flex flex-col gap-4">
              <h2 className="font-['Encode_Sans_Semi_Expanded'] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal leading-[1.25] text-left text-primary">
                What We Do
              </h2>
              <p className="font-lato text-sm sm:text-base font-normal leading-[1.375] text-left text-muted-foreground">
                Atraiva empowers legal and compliance teams to proactively
                manage breach notification risk. By aligning data records with
                continuously updated state and federal regulatory obligations,
                our platform enables cost-effective rapid identification of
                reporting triggers—even under ransomware conditions—while
                providing defensible documentation to insurers, regulators, and
                courts. Built from the ground up to solve real-world regulatory
                pain points, Atraiva combines deep legal insight with
                precision-engineered technology to deliver AI-enhanced
                cybersecurity compliance — without ever accessing or storing
                sensitive client data.
                <br />
                <br />
                Our mission is simple: empower organizations to take control of
                breach response, regulatory obligations, and risk mitigation —
                faster, smarter, and more defensibly than ever before.
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-start items-center gap-2.5">
              <Button
                variant="outline"
                size="icon"
                className="w-11 h-11 bg-muted border border-border rounded-[40px] p-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-11 h-11 bg-muted border border-border rounded-[40px] p-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Exposure Assessment Card */}
            <div className="bg-card border-2 border-primary/20 p-4 sm:p-6 flex flex-col gap-6 sm:gap-8 w-full sm:w-1/3 h-auto sm:h-[550px] shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 rounded-lg">
              <div className="flex flex-col gap-6 sm:gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-inter text-lg sm:text-xl md:text-2xl lg:text-[28px] font-medium leading-[1.286] text-left text-primary">
                        Exposure Assessment
                      </h3>
                    </div>
                    <h4 className="font-inter text-sm sm:text-base font-normal leading-[1.375] text-left text-muted-foreground">
                      Proactively Identify Exposure Before It Becomes
                      Exploitable
                    </h4>
                  </div>
                </div>
                <p className="font-inter text-sm sm:text-base font-normal leading-[1.375] text-left text-muted-foreground">
                  Pinpoint reporting and notification exposure vulnerabilities
                  across your digital infrastructure with AI-enhanced scanning
                  and compliance-aware mapping. Atraiva surfaces real-time
                  exposure risks—including data-element-level privacy
                  triggers—so you can prioritize remediation before a breach
                  occurs.
                </p>
              </div>
            </div>

            {/* Incident Response Card */}
            <div className="bg-card border-2 border-accent/20 p-4 sm:p-6 flex flex-col gap-6 sm:gap-8 w-full sm:w-1/3 h-auto sm:h-[550px] shadow-lg hover:shadow-xl hover:border-accent/40 transition-all duration-300 rounded-lg">
              <div className="flex flex-col gap-6 sm:gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-lato text-lg sm:text-xl md:text-2xl lg:text-[28px] font-medium leading-[1.286] text-left text-primary">
                        Incident Response
                      </h3>
                    </div>
                    <h4 className="font-lato text-sm sm:text-base font-normal leading-[1.375] text-left text-muted-foreground">
                      Automated, Regulator-Aligned Breach Response Workflows
                    </h4>
                  </div>
                </div>
                <p className="font-lato text-sm sm:text-base font-normal leading-[1.375] text-left text-muted-foreground">
                  When a data breach strikes, Atraiva activates dynamic,
                  AI-guided workflows to assess impact, map regulatory
                  obligations, and generate jurisdiction-specific reporting
                  drafts in real time. Our system ensures no compliance detail
                  is missed—even when access to original records is blocked.
                </p>
              </div>
            </div>

            {/* Multi-Region Support Card */}
            <div className="bg-card border-2 border-primary/20 p-4 sm:p-6 flex flex-col gap-6 sm:gap-8 w-full sm:w-1/3 h-auto sm:h-[550px] shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 rounded-lg">
              <div className="flex flex-col gap-6 sm:gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-lato text-lg sm:text-xl md:text-2xl lg:text-[28px] font-medium leading-[1.286] text-left text-primary">
                        Multi-Region Support
                      </h3>
                    </div>
                    <h4 className="font-lato text-sm sm:text-base font-normal leading-[1.375] text-left text-muted-foreground">
                      Jurisdiction-Specific Compliance Across Global Operations
                    </h4>
                  </div>
                </div>
                <p className="font-lato text-sm sm:text-base font-normal leading-[1.375] text-left text-muted-foreground">
                  Designed for enterprises with a distributed footprint, Atraiva
                  continuously updates compliance logic for all U.S. states and
                  with major international regimes coming soon. Whether your
                  breach affects records in Anchorage, Alaska or Zephyrhills,
                  Florida, Atraiva ensures your notifications, timelines, and
                  thresholds are accurate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
