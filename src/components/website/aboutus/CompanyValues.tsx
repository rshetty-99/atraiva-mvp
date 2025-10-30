"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lightbulb,
  Users,
  Zap,
  Heart,
  Award,
  Lock,
  Rocket,
} from "lucide-react";

export default function CompanyValues() {
  const values = [
    {
      title: "Security First",
      description:
        "We prioritize the highest levels of data security and privacy protection in everything we do.",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Innovation",
      description:
        "Continuously pushing boundaries with cutting-edge AI and machine learning technologies.",
      icon: Lightbulb,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      title: "Collaboration",
      description:
        "Building strong partnerships and fostering teamwork to achieve shared success.",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Excellence",
      description:
        "Delivering exceptional quality and performance in every solution we create.",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Agility",
      description:
        "Adapting quickly to changing regulations and market demands with flexible solutions.",
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "Integrity",
      description:
        "Maintaining the highest ethical standards and transparency in all our operations.",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Trust",
      description:
        "Building lasting relationships through reliability, consistency, and proven results.",
      icon: Lock,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      title: "Growth",
      description:
        "Empowering continuous learning and development for our team and clients.",
      icon: Rocket,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="px-4 py-2 text-sm font-medium bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
          >
            <Heart className="w-4 h-4 mr-2" />
            Our Values
          </Badge>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
        >
          What Drives Us
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
        >
          Our core values shape every decision we make and guide us in
          delivering exceptional compliance solutions.
        </motion.p>
      </motion.div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex p-4 rounded-full ${value.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <value.icon className={`w-8 h-8 ${value.color}`} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom Quote Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-20 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <blockquote className="text-2xl md:text-3xl font-light text-gray-700 dark:text-gray-300 italic mb-6">
            &ldquo;Our values aren&apos;t just words on a wall—they&apos;re the
            foundation of every product we build and every relationship we
            forge.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="font-semibold text-gray-900 dark:text-white">
                Sarah Chen
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                CEO & Founder, Atraiva
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
