"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const features = [
  {
    id: 1,
    title: "A Dynamic Form Filler",
    subtitle: "Intelligent Auto-Populated Forms",
    description:
      "Pre-filled, context-aware form generation that adapts to jurisdictional rules, saving time while improving accuracy and audit readiness.",
    gradient: "from-[#0C101B] to-[#B8CBFF]",
    layout: "left",
    icon: "form",
    image: "/images/features/form-filler-screenshot.png",
  },
  {
    id: 2,
    title: "Notification Letter Generator",
    subtitle: "Jurisdiction-Tailored Communications",
    description:
      "Automated generation of breach notification letters pre-formatted to meet federal and state regulatory requirements.",
    gradient: "from-[#0C101B] to-[#DCB8FF]",
    layout: "right",
    icon: "notification",
    image: "/images/features/notification-generator-screenshot.png",
  },
  {
    id: 3,
    title: "Automation Features",
    subtitle: "Streamlined, Hands-Off Operations",
    description:
      "Eliminate repetitive manual tasks with built-in automation for incident tracking, documentation, deadline monitoring, and more.",
    gradient: "from-[#0C101B] to-[#FFB8C4]",
    layout: "left",
    icon: "automation",
    image: "/images/features/automation-features-screenshot.png",
  },
  {
    id: 4,
    title: "Admin Dashboard for Updates",
    subtitle: "Centralized Control Panel",
    description:
      "Grant administrators the power to oversee users, update jurisdictional rule sets, and manage configurations across enterprise instances.",
    gradient: "from-[#0C101B] to-[#FFE8B8]",
    layout: "right",
    icon: "dashboard",
    image: "/images/features/admin-dashboard-screenshot.png",
  },
  {
    id: 5,
    title: "Tracking System",
    subtitle: "Full Breach Lifecycle Visibility",
    description:
      "Track breach response activities from detection to resolution with real-time dashboards and historical audit logs.",
    gradient: "from-[#0C101B] to-[#BFF7B8]",
    layout: "left",
    icon: "tracking",
    image: "/images/features/tracking-system-screenshot.png",
  },
  {
    id: 6,
    title: "Email & Dashboard Alerts",
    subtitle: "Real-Time Notifications",
    description:
      "Receive automated alerts and notifications directly via email or in-dashboard prompts for time-sensitive actions and updates.",
    gradient: "from-[#0C101B] to-[#B8F7FF]",
    layout: "right",
    icon: "alert",
    image: "/images/features/email-alerts-screenshot.png",
  },
  {
    id: 7,
    title: "Role-Based Access Control (RBAC)",
    subtitle: "Granular User Permissioning",
    description:
      "Limit access based on role, location, or department to ensure proper data governance and prevent unauthorized access.",
    gradient: "from-[#0C101B] to-[#FFD1B8]",
    layout: "left",
    icon: "security",
    image: "/images/features/admin-dashboard-screenshot.png",
  },
  {
    id: 8,
    title: "Multi-Language Support for Notification Letters",
    subtitle: "Localized Compliance Messaging",
    description:
      "Generate notification letters in multiple languages to meet the linguistic and legal requirements of global jurisdictions.",
    gradient: "from-[#0C101B] to-[#B4C7FA]",
    layout: "right",
    icon: "language",
    image: "/images/features/notification-generator-screenshot.png",
  },
  {
    id: 9,
    title: "Data Classification & Risk Assessment",
    subtitle: "Context-Aware Data Prioritization",
    description:
      "Categorize sensitive data and assess exposure severity to determine notification thresholds and remediation priorities.",
    gradient: "from-[#0C101B] to-[#D7B4F9]",
    layout: "left",
    icon: "data",
    image: "/images/features/tracking-system-screenshot.png",
  },
  {
    id: 10,
    title: "Compliance Reports & Export Functionality",
    subtitle: "Audit-Ready Deliverables",
    description:
      "Easily export structured compliance reports in multiple formats (PDF, CSV, DOCX) for regulators, legal teams, or internal stakeholders.",
    gradient: "from-[#0C101B] to-[#F8E2B4]",
    layout: "right",
    icon: "report",
    image: "/images/features/automation-features-screenshot.png",
  },
];

// Icon component function
const renderIcon = (iconType: string) => {
  const iconProps = {
    className: "w-6 h-6 text-white",
    fill: "currentColor",
    viewBox: "0 0 24 24",
  };

  switch (iconType) {
    case "form":
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      );
    case "notification":
      return (
        <svg {...iconProps}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "automation":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
          <path d="M17.5 6.5L19 5l-1.5-1.5M4.5 17.5L3 19l1.5 1.5M17.5 17.5L19 19l-1.5 1.5M4.5 6.5L3 5l1.5-1.5" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    case "tracking":
      return (
        <svg {...iconProps}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    case "alert":
      return (
        <svg {...iconProps}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "security":
      return (
        <svg {...iconProps}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <circle cx="12" cy="16" r="1" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "language":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "data":
      return (
        <svg {...iconProps}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      );
    case "report":
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotate: -5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.05,
    rotate: 2,
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
  hover: {
    scale: 1.05,
  },
  tap: {
    scale: 0.95,
  },
};

export function ProductFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section className="bg-background py-8 px-4 sm:py-12 sm:px-6 md:py-16 md:px-8 lg:py-20 lg:px-12 xl:py-24 xl:px-16 2xl:px-20">
      <div className="max-w-xs mx-auto sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center gap-6 mb-8 sm:gap-8 sm:mb-10 md:gap-10 md:mb-12 lg:gap-12 lg:mb-15 xl:gap-15 xl:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col justify-center items-center gap-3 sm:gap-4">
            <motion.h2
              className="font-['Encode_Sans_Semi_Expanded'] text-[42px] font-normal leading-[1.25] text-center text-primary px-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Product & Features
            </motion.h2>
            <motion.p
              className="font-lato text-sm sm:text-base md:text-lg font-normal leading-[1.2] text-center bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              Cutting-edge technology meets enterprise-grade security to deliver
              comprehensive data breach management and risk mitigation
              solutions.
            </motion.p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          ref={ref}
          className="flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              className="flex flex-col sm:flex-col md:flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 2xl:gap-[180px] w-full"
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
            >
              {feature.layout === "left" ? (
                <>
                  {/* Content Left */}
                  <motion.div
                    className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full lg:w-auto order-2 lg:order-1"
                    variants={contentVariants}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                          <motion.div
                            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg"
                            whileHover={{
                              scale: 1.1,
                              rotate: 5,
                              transition: { duration: 0.2 },
                            }}
                          >
                            {renderIcon(feature.icon)}
                          </motion.div>
                          <div className="flex flex-col gap-4">
                            <motion.h3
                              className="font-['Encode_Sans_Semi_Expanded'] text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-normal leading-[1.25] text-left text-primary"
                              whileHover={{
                                color: "#C9B9FF",
                                transition: { duration: 0.3 },
                              }}
                            >
                              {feature.title}
                            </motion.h3>
                            <motion.h4
                              className="font-lato text-lg sm:text-xl md:text-2xl font-medium leading-[1.2] text-left text-muted-foreground"
                              whileHover={{
                                color: "#B8CBFF",
                                transition: { duration: 0.3 },
                              }}
                            >
                              {feature.subtitle}
                            </motion.h4>
                          </div>
                        </div>
                        <motion.p
                          className="font-lato text-sm sm:text-base font-normal leading-[1.3125] text-left text-muted-foreground w-full lg:w-[424px]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                        >
                          {feature.description}
                        </motion.p>
                      </div>
                      <motion.div
                        variants={buttonVariants}
                        transition={{
                          duration: 0.4,
                          delay: 0.3,
                          ease: "easeOut",
                        }}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 text-white font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12 w-fit shadow-lg transition-all">
                          Learn More
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                  {/* Image Right */}
                  <motion.div
                    className={`bg-gradient-to-b ${feature.gradient} border border-dashed border-border rounded-xl w-full h-[250px] sm:h-[300px] md:h-[350px] lg:w-[500px] lg:h-[400px] xl:h-[450px] 2xl:h-[500px] relative overflow-hidden order-1 lg:order-2`}
                    variants={imageVariants}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    whileHover="hover"
                  >
                    <motion.div
                      className="absolute top-[60px] left-[60px] w-[calc(100%-60px)] h-[calc(100%-60px)] rounded-lg overflow-hidden"
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover rounded-lg"
                        style={{ objectPosition: "left top" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </motion.div>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Image Left */}
                  <motion.div
                    className={`bg-gradient-to-b ${feature.gradient} border border-dashed border-border rounded-xl w-full h-[250px] sm:h-[300px] md:h-[350px] lg:w-[500px] lg:h-[400px] xl:h-[450px] 2xl:h-[500px] relative overflow-hidden order-1 lg:order-1`}
                    variants={imageVariants}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    whileHover="hover"
                  >
                    <motion.div
                      className="absolute top-[60px] left-[60px] w-[calc(100%-60px)] h-[calc(100%-60px)] rounded-lg overflow-hidden"
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover rounded-lg"
                        style={{ objectPosition: "left top" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </motion.div>
                  </motion.div>
                  {/* Content Right */}
                  <motion.div
                    className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full lg:w-auto order-2 lg:order-2"
                    variants={contentVariants}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-6 w-full lg:w-[490px]">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-4">
                              <motion.div
                                className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg"
                                whileHover={{
                                  scale: 1.1,
                                  rotate: 5,
                                  transition: { duration: 0.2 },
                                }}
                              >
                                {renderIcon(feature.icon)}
                              </motion.div>
                              <motion.h3
                                className="font-lato text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-normal leading-[1.25] text-left text-primary w-full lg:w-[448px]"
                                whileHover={{
                                  color: "#C9B9FF",
                                  transition: { duration: 0.3 },
                                }}
                              >
                                {feature.title}
                              </motion.h3>
                            </div>
                            <div className="flex flex-col gap-2">
                              <motion.h4
                                className="font-lato text-lg sm:text-xl md:text-2xl font-medium leading-[1.2] text-left text-muted-foreground w-full lg:w-[490px]"
                                whileHover={{
                                  color: "#B8CBFF",
                                  transition: { duration: 0.3 },
                                }}
                              >
                                {feature.subtitle}
                              </motion.h4>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <motion.p
                              className="font-lato text-sm sm:text-base font-normal leading-[1.3125] text-left text-muted-foreground"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5, duration: 0.6 }}
                            >
                              {feature.description}
                            </motion.p>
                          </div>
                        </div>
                      </div>
                      <motion.div
                        variants={buttonVariants}
                        transition={{
                          duration: 0.4,
                          delay: 0.3,
                          ease: "easeOut",
                        }}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 text-white font-lato text-base font-medium leading-[1] px-[25.6px] py-[12.8px] rounded-[48px] h-12 w-fit shadow-lg transition-all">
                          Learn More
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 h-auto sm:h-12 mt-8 sm:mt-10 md:mt-12 lg:mt-15 xl:mt-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <Link href="/contact-us?inquiryType=demo">
            <motion.div
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.95,
                transition: { duration: 0.1 },
              }}
            >
              <Button className="bg-primary hover:bg-primary/90 text-white font-lato text-sm sm:text-base font-medium leading-[1] px-4 sm:px-[25.6px] py-3 sm:py-[12.8px] rounded-[48px] h-10 sm:h-12 w-full sm:w-auto shadow-lg transition-all duration-300">
                Schedule a Demo
              </Button>
            </motion.div>
          </Link>
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
          >
            <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 text-white font-lato text-sm sm:text-base font-medium leading-[1] px-4 sm:px-[25.6px] py-3 sm:py-[12.8px] rounded-[48px] h-10 sm:h-12 w-full sm:w-auto shadow-lg transition-all duration-300">
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
