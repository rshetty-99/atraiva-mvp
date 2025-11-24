"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Activity, Zap } from "lucide-react";

const expertiseAreas = [
  {
    icon: Brain,
    title: "Threat Intelligence",
    description:
      "Advanced machine learning algorithms analyze global threat patterns to predict and prevent attacks before they occur.",
  },
  {
    icon: Activity,
    title: "Behavioral Analysis",
    description:
      "AI-driven behavioral monitoring detects anomalies and suspicious activities with unprecedented accuracy and minimal false positives.",
  },
  {
    icon: Zap,
    title: "Automated Response",
    description:
      "Intelligent automation systems respond to threats in milliseconds, containing and neutralizing attacks without human intervention.",
  },
];

export function ExpertiseSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="bg-white dark:bg-background flex items-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 w-full max-w-full overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto w-full min-w-0">
        <div className="flex flex-col lg:flex-row items-start lg:items-start gap-8 md:gap-12 lg:gap-16 w-full min-w-0">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 md:gap-6 lg:flex-1 min-w-0"
          >
            <div className="flex flex-col gap-3 md:gap-4">
              <h2 className="text-primary text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-[52px] font-bold font-['Encode_Sans_Semi_Expanded'] leading-[1.2] break-words">
                Our Expertise
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg md:text-xl lg:text-[20px] font-['Lato'] leading-[1.5] break-words">
                Comprehensive AI-powered security solutions across multiple
                domains
              </p>
            </div>
          </motion.div>

          {/* Right Content - Expertise Cards */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-4 lg:gap-5 w-full lg:flex-1 min-w-0">
            {expertiseAreas.map((area, index) => (
              <div
                key={area.title}
                className="relative group block p-2 h-full w-full flex-1"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.span
                      className="absolute inset-0 h-full w-full bg-gradient-to-r from-[#AB96F9]/10 via-[#FF91C2]/10 to-[#AB96F9]/10 dark:from-slate-800/80 dark:via-slate-700/80 dark:to-slate-800/80 block rounded-2xl"
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.3 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.3, delay: 0.1 },
                      }}
                    />
                  )}
                </AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="rounded-2xl h-full w-full p-5 sm:p-6 overflow-hidden bg-card/50 backdrop-blur-sm border-2 border-border dark:border-white/[0.1] group-hover:border-[#AB96F9]/50 dark:group-hover:border-[#AB96F9]/50 relative z-20 transition-all duration-300 shadow-sm group-hover:shadow-xl"
                >
                  <div className="relative z-50">
                    <div className="flex flex-col gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#AB96F9]/20 to-[#FF91C2]/20 group-hover:from-[#AB96F9]/30 group-hover:to-[#FF91C2]/30 transition-all duration-300">
                        <area.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#AB96F9] dark:text-[#AB96F9] stroke-[2.5px]" />
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-foreground dark:text-white font-bold tracking-tight text-lg sm:text-xl md:text-[22px] font-['Lato'] leading-[1.3] group-hover:text-[#AB96F9] transition-colors duration-300">
                        {area.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-muted-foreground dark:text-gray-400 tracking-wide leading-relaxed text-sm sm:text-[15px] font-['Lato'] group-hover:text-foreground dark:group-hover:text-gray-300 transition-colors duration-300">
                        {area.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
