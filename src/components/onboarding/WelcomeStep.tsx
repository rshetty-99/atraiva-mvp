"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Users,
  Building,
  Zap,
  CheckCircle,
  ArrowRight,
  Lock,
  BarChart3,
  Clock,
  Globe,
} from "lucide-react";
import { OnboardingData } from "@/lib/firestore/types";

interface WelcomeStepProps {
  data: Partial<OnboardingData>;
  onDataUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  registrationToken?: string | null;
}

const features = [
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Enterprise-grade security with full HIPAA compliance",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Users,
    title: "Multi-Tenant",
    description: "Support for law firms, enterprises, and channel partners",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Live compliance monitoring and breach notification tracking",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Clock,
    title: "Automated Workflows",
    description: "Streamlined incident response and regulatory compliance",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Globe,
    title: "50-State Coverage",
    description: "Complete regulatory coverage across all US jurisdictions",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description: "Intelligent PII detection and compliance assessment",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
];

const stats = [
  { label: "Organizations", value: "500+", icon: Building },
  { label: "Compliance Rate", value: "99.9%", icon: CheckCircle },
  { label: "Response Time", value: "<2 min", icon: Clock },
  { label: "Uptime", value: "99.9%", icon: Shield },
];

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <Lock className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">
              Enterprise Security Platform
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to the Future of
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Compliance Management
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Atraiva empowers cybersecurity law firms and enterprises to manage
            breach notification compliance with automated regulatory mapping,
            real-time monitoring, and intelligent incident response.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center mb-2">
                {React.createElement(stat.icon, {
                  className: "h-6 w-6 text-blue-600",
                })}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
          >
            <Card className="h-full hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4`}
                >
                  {React.createElement(feature.icon, {
                    className: `h-6 w-6 ${feature.color}`,
                  })}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Value Proposition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
      >
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">
            Why Choose Atraiva?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5 min</div>
              <div className="text-sm text-gray-600">
                Average onboarding time
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50%</div>
              <div className="text-sm text-gray-600">
                Reduction in compliance costs
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">
                Regulatory compliance accuracy
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center"
      >
        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Setup takes less than 5 minutes • No credit card required
        </p>
      </motion.div>
    </div>
  );
}
