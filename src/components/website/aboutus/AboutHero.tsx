"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Users, Zap } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { SparklesCore } from "@/components/ui/sparkles";

export default function AboutHero() {
  const words =
    "Pioneering the future of data privacy and compliance through innovative AI-powered solutions.";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Sparkles Background */}
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#3b82f6"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm font-medium bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
          >
            <Shield className="w-4 h-4 mr-2" />
            About Atraiva
          </Badge>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
        >
          Transforming{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
            Compliance
          </span>
          <br />
          Through Innovation
        </motion.h1>

        {/* Subtitle with Text Generate Effect */}
        <div className="max-w-3xl mx-auto mb-8">
          <TextGenerateEffect
            words={words}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300"
          />
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12"
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">500+ Enterprises</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-semibold">99.9% Compliance Rate</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="font-semibold">AI-Powered</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="px-8 py-3 text-lg">
            Learn Our Story
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
            Meet Our Team
          </Button>
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent dark:from-slate-950/20 pointer-events-none" />
    </section>
  );
}
