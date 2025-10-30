"use client";

import React from "react";

const stats = [
  {
    value: "99.9%",
    label: "Threat Detection Rate",
  },
  {
    value: "500+",
    label: "Enterprise Clients",
  },
  {
    value: "24/7",
    label: "Security Monitoring",
  },
  {
    value: "< 1ms",
    label: "Response Time",
  },
];

export function Stats() {
  return (
    <section className="bg-background border-b border-border py-15">
      <div className="px-20 py-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="bg-gradient-to-b from-accent to-accent/60 rounded-3xl p-30 flex justify-center items-center gap-[70px]">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-4 w-[147px]"
              >
                <span className="font-lato text-[56px] font-semibold leading-[1.2] text-center text-foreground">
                  {stat.value}
                </span>
                <span className="font-lato text-base font-medium leading-[1.5] text-center text-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
