"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MapPin,
  FileText,
  Calendar,
  Filter,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    id: "notifications",
    title: "Real-Time Notifications",
    description:
      "Instant alerts when data breach laws change in any jurisdiction affecting your operations.",
    image: "/images/website/features/notifications-feature.jpg",
    gradient: "from-[#0C101B] to-[#B8CBFF]",
    icon: "bell",
    active: true,
  },
  {
    id: "tracking",
    title: "Jurisdiction Tracking",
    description:
      "Monitor Federal, State, and Local regulations across all regions where you have business exposure.",
    image: "/images/website/features/jurisdiction-tracking.jpg",
    gradient: "from-[#0C101B] to-[#DCB8FF]",
    icon: "map",
    active: false,
  },
  {
    id: "templates",
    title: "Template Updates",
    description:
      "Stay current with the latest reporting document templates required by authorities.",
    image: "/images/website/features/template-updates.jpg",
    gradient: "from-[#0C101B] to-[#FFB8C4]",
    icon: "document",
    active: false,
  },
  {
    id: "deadlines",
    title: "Deadline Management",
    description:
      "Track changing reporting deadlines and ensure compliance with updated timeframes.",
    image: "/images/website/features/deadline-management.jpg",
    gradient: "from-[#0C101B] to-[#FFE8B8]",
    icon: "calendar",
    active: false,
  },
  {
    id: "filtering",
    title: "Custom Filtering",
    description:
      "Customize your dashboard to show only the jurisdictions and regulations relevant to your business.",
    image: "/images/website/features/custom-filtering.jpg",
    gradient: "from-[#0C101B] to-[#BFF7B8]",
    icon: "filter",
    active: false,
  },
  {
    id: "analysis",
    title: "Trend Analysis",
    description:
      "Identify patterns in regulatory changes to better anticipate future compliance requirements.",
    image: "/images/website/features/trend-analysis.jpg",
    gradient: "from-[#0C101B] to-[#B8F7FF]",
    icon: "chart",
    active: false,
  },
];

// FeatureIcon component to render the correct icon based on icon type
const FeatureIcon = ({ iconType }: { iconType: string }) => {
  const iconProps = {
    className: "w-10 h-10 text-accent",
    strokeWidth: 2.5,
  };

  switch (iconType) {
    case "bell":
      return <Bell {...iconProps} />;
    case "map":
      return <MapPin {...iconProps} />;
    case "document":
      return <FileText {...iconProps} />;
    case "calendar":
      return <Calendar {...iconProps} />;
    case "filter":
      return <Filter {...iconProps} />;
    case "chart":
      return <TrendingUp {...iconProps} />;
    default:
      return <Bell {...iconProps} />;
  }
};

export function ProductFeatures() {
  const [activeFeature, setActiveFeature] = useState("notifications");
  const currentFeature =
    features.find((f) => f.id === activeFeature) || features[0];

  return (
    <section className="bg-background py-20">
      <div className="px-20 py-8">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center gap-15 mb-15">
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="font-['Encode_Sans_Semi_Expanded'] text-[42px] font-normal leading-[1.25] text-left text-primary">
                Product & Features
              </h2>
              <p className="font-lato text-lg font-normal leading-[1.2] text-center text-muted-foreground w-[680px]">
                Cutting-edge technology meets enterprise-grade security to
                deliver comprehensive data breach management and risk mitigation
                solutions.
              </p>
            </div>
          </div>

          <div className="flex gap-15 md:gap-18 lg:gap-20 xl:gap-24 2xl:gap-28 h-[600px]">
            {/* Left Side - Feature Tabs */}
            <motion.div
              className="flex flex-col w-[400px] md:w-[440px] lg:w-[500px] xl:w-[560px] 2xl:w-[620px] h-full"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  className={`flex flex-col gap-4 p-4 pt-4 cursor-pointer transition-all duration-300 flex-1 ${
                    activeFeature === feature.id ? "border-b-0" : ""
                  }`}
                  onClick={() => setActiveFeature(feature.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    className={`font-lato text-2xl font-medium leading-[1.2] text-left transition-all duration-300 ${
                      activeFeature === feature.id
                        ? "bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent"
                        : "text-foreground opacity-60 hover:opacity-100"
                    }`}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.title}
                  </motion.span>
                  <div className="flex flex-col">
                    <div className="w-full h-px bg-border"></div>
                    <AnimatePresence>
                      {activeFeature === feature.id && (
                        <motion.div
                          className="w-[226px] h-0.5 bg-primary"
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 226, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right Side - Feature Display */}
            <motion.div
              className="flex flex-col gap-6 w-[880px] md:w-[920px] lg:w-[1020px] xl:w-[1100px] 2xl:w-[1200px] h-full"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <motion.div
                className="bg-card border border-dashed border-border p-10 flex items-center gap-15 h-full "
                layout
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Content */}
                <motion.div
                  className="flex flex-col gap-6 flex-1"
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div className="flex flex-col gap-6">
                    <motion.div
                      className="flex flex-col gap-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <motion.div
                        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center"
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <FeatureIcon iconType={currentFeature.icon} />
                      </motion.div>
                      <motion.h3
                        className="font-['Encode_Sans_Semi_Expanded'] text-[32px] font-normal leading-[1.25] text-left text-primary"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        {currentFeature.title}
                      </motion.h3>
                    </motion.div>
                    <motion.div
                      className="flex flex-col gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <p className="font-lato text-base font-normal leading-[1.3125] text-left text-muted-foreground">
                        {currentFeature.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Image */}
                <motion.div
                  className={`bg-gradient-to-b ${currentFeature.gradient} border border-dashed border-border rounded-xl p-9 w-[350px] h-[300px] flex items-center justify-center relative overflow-hidden`}
                  key={`${activeFeature}-image`}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Image
                      src={currentFeature.image}
                      alt={currentFeature.title}
                      width={240}
                      height={180}
                      className="object-cover"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
