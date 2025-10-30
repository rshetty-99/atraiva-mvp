"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Globe,
  TrendingUp,
  Shield,
  Clock,
  Award,
  Zap,
} from "lucide-react";

export default function CompanyStats() {
  const [counters, setCounters] = useState({
    clients: 0,
    countries: 0,
    compliance: 0,
    uptime: 0,
  });

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    {
      icon: Building2,
      value: 500,
      suffix: "+",
      label: "Enterprise Clients",
      description: "Trusted by leading organizations worldwide",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Globe,
      value: 50,
      suffix: "+",
      label: "Countries Served",
      description: "Global reach across all continents",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Shield,
      value: 99.9,
      suffix: "%",
      label: "Compliance Rate",
      description: "Industry-leading accuracy and reliability",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Clock,
      value: 99.99,
      suffix: "%",
      label: "System Uptime",
      description: "Always available when you need us",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: "Industry Recognition",
      items: [
        "Best Compliance Solution 2024",
        "AI Innovation Award",
        "Data Privacy Excellence",
      ],
    },
    {
      icon: TrendingUp,
      title: "Growth Metrics",
      items: [
        "300% YoY Growth",
        "95% Customer Retention",
        "$50M+ Compliance Savings",
      ],
    },
    {
      icon: Zap,
      title: "Technology Leadership",
      items: [
        "50+ Patents Filed",
        "AI-First Architecture",
        "Real-time Processing",
      ],
    },
  ];

  // Counter animation effect
  useEffect(() => {
    if (!isInView) return;

    const animateCounter = (
      target: keyof typeof counters,
      finalValue: number,
      duration: number = 2000
    ) => {
      let startValue = 0;
      const increment = finalValue / (duration / 50);

      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= finalValue) {
          setCounters((prev) => ({ ...prev, [target]: finalValue }));
          clearInterval(timer);
        } else {
          setCounters((prev) => ({
            ...prev,
            [target]: Math.floor(startValue),
          }));
        }
      }, 50);
    };

    // Start animations with delays
    setTimeout(() => animateCounter("clients", 500), 200);
    setTimeout(() => animateCounter("countries", 50), 400);
    setTimeout(() => animateCounter("compliance", 99.9), 600);
    setTimeout(() => animateCounter("uptime", 99.99), 800);
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="text-center mb-16"
      >
        <motion.div variants={itemVariants} className="mb-4">
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm font-medium bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            By The Numbers
          </Badge>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
        >
          Proven Results
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
        >
          Our commitment to excellence is reflected in the measurable impact we
          deliver to organizations worldwide.
        </motion.p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex p-3 rounded-full ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>

                <div className="mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {stat.label.includes("Compliance") ||
                    stat.label.includes("Uptime")
                      ? counters[
                          stat.label.includes("Compliance")
                            ? "compliance"
                            : "uptime"
                        ]
                      : counters[
                          stat.label.includes("Countries")
                            ? "countries"
                            : "clients"
                        ]}
                  </span>
                  <span
                    className={`text-2xl md:text-3xl font-bold ${stat.color}`}
                  >
                    {stat.suffix}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {stat.label}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievements Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Card className="h-full border-0 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
                    <achievement.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {achievement.title}
                  </h3>
                </div>

                <ul className="space-y-2">
                  {achievement.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center text-gray-600 dark:text-gray-300"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
