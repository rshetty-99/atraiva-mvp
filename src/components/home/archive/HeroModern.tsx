"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Shield, Zap, Lock, Star, CheckCircle } from "lucide-react";
import Image from "next/image";
import { complianceEvents } from "@/lib/analytics";
import { SignUpButton } from "@clerk/nextjs";

export default function HeroModern() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const floatingVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "backOut",
      }
    },
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };

  // Update these stats based on your Figma design
  const stats = [
    { value: "70%", label: "Faster Response", sublabel: "Average processing time" },
    { value: "50+", label: "State Coverage", sublabel: "Federal & state laws" },
    { value: "99.9%", label: "Compliance Rate", sublabel: "Accuracy guarantee" },
    { value: "24/7", label: "Monitoring", sublabel: "Continuous protection" },
  ];

  const trustBadges = [
    { icon: Shield, label: "HIPAA Compliant", color: "text-emerald-600" },
    { icon: Lock, label: "SOC 2 Type II", color: "text-blue-600" },
    { icon: CheckCircle, label: "GDPR Ready", color: "text-purple-600" },
    { icon: Star, label: "PCI DSS", color: "text-orange-600" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background - Update based on your Figma design */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary/5">
        {/* Geometric shapes or background elements from Figma */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-conic from-primary/20 via-transparent to-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-accent/15 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Floating elements - Update positioning based on Figma */}
      <motion.div
        variants={floatingVariants}
        initial="hidden"
        animate={["visible", "float"]}
        className="absolute top-1/4 right-1/6 text-primary/30"
      >
        <Shield className="w-20 h-20" />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        initial="hidden"
        animate={["visible", "float"]}
        transition={{ delay: 0.5 }}
        className="absolute bottom-1/3 left-1/12 text-secondary/30"
      >
        <Zap className="w-16 h-16" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge/Announcement - Update styling based on Figma */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm">
              <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-semibold text-primary">
                AI-Powered Data Breach Compliance Platform
              </span>
              <ArrowRight className="w-4 h-4 ml-2 text-primary" />
            </div>
          </motion.div>

          {/* Main Headline - Update typography based on your Figma design */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95] tracking-tight"
          >
            <span className="block bg-gradient-to-r from-slate-900 via-primary to-slate-900 bg-clip-text text-transparent">
              Protect Your Data.
            </span>
            <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Ensure Compliance.
            </span>
            <span className="block text-slate-700">
              Automate Everything.
            </span>
          </motion.h1>

          {/* Subtitle - Update based on Figma design */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
          >
            Streamline data breach notification compliance with AI-powered automation.
            Discover PII across your infrastructure, navigate complex regulations, and
            manage breach response—all in one unified platform.
          </motion.p>

          {/* CTA Buttons - Update styling based on Figma */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <SignUpButton>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-12 py-6 rounded-2xl text-lg font-semibold group shadow-xl hover:shadow-2xl transition-all duration-300 h-auto"
                onClick={() => complianceEvents.ctaClicked('start_trial', 'hero_section')}
              >
                Start Free Trial
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpButton>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-slate-300 hover:bg-slate-50 px-10 py-6 rounded-2xl text-lg font-semibold group h-auto"
              onClick={() => complianceEvents.ctaClicked('watch_demo', 'hero_section')}
            >
              <Play className="mr-3 h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats Grid - Update layout and styling based on Figma */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-slate-700 mb-1">{stat.label}</div>
                <div className="text-sm text-slate-500">{stat.sublabel}</div>
              </div>
            ))}
          </motion.div>

          {/* Trust Indicators - Update design based on Figma */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-6"
          >
            <p className="text-sm text-slate-500 mb-4 w-full">
              Trusted by 500+ enterprises in healthcare, finance, and technology
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-white/80 border border-slate-200 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <badge.icon className={`w-4 h-4 ${badge.color}`} />
                  <span className="text-sm font-semibold text-slate-700">{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Update design based on Figma */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-primary/40 rounded-full flex justify-center cursor-pointer hover:border-primary transition-colors"
        >
          <div className="w-1 h-3 bg-primary rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}