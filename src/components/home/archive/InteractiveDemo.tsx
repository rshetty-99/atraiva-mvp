"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Pause,
  Database,
  Search,
  FileText,
  Send,
  Clock,
} from "lucide-react";
import { Logo } from "@/components/logo";

const demoSteps = [
  {
    id: 0,
    icon: Database,
    title: "Detect & Classify",
    description: "AI scans data sources and identifies 19+ PII categories",
    time: "2-5 min",
    bg: "bg-primary/10",
    color: "text-primary",
  },
  {
    id: 1,
    icon: Search,
    title: "Assess Impact",
    description: "Analyze scope, affected individuals, and risk level",
    time: "3-10 min",
    bg: "bg-secondary/10",
    color: "text-secondary",
  },
  {
    id: 2,
    icon: FileText,
    title: "Map Compliance",
    description: "Determine regulatory requirements for all jurisdictions",
    time: "1-2 min",
    bg: "bg-accent/10",
    color: "text-accent",
  },
  {
    id: 3,
    icon: Send,
    title: "Generate Notices",
    description:
      "Create compliant notifications for authorities and individuals",
    time: "5-15 min",
    bg: "bg-orange-100 dark:bg-orange-900/20",
    color: "text-orange-600 dark:text-orange-400",
  },
];

const mockData = {
  piiBreach: {
    affectedRecords: "2,847",
    piiTypes: ["Medical Records", "SSN", "Email", "Phone", "Address"],
    states: ["CA", "NY", "TX", "FL", "IL", "WA"],
    complianceDeadlines: "24-72 hours",
  },
};

export default function InteractiveDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % demoSteps.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section
      ref={ref}
      className="py-24 bg-gradient-to-br from-background via-background to-primary/5"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            See Atraiva in Action
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Watch how our AI transforms hours of manual compliance work into
            minutes of automated precision
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <Button
              onClick={togglePlayback}
              variant={isPlaying ? "secondary" : "default"}
              size="lg"
              className="rounded-full px-8 py-4"
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause Demo
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Play Demo
                </>
              )}
            </Button>
            <div className="text-sm text-muted-foreground">
              Auto-advancing every 3 seconds
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Demo Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {demoSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                onClick={() => handleStepClick(step.id)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  activeStep === step.id
                    ? "border-primary/50 bg-primary/5 shadow-lg"
                    : "border-border/50 bg-card hover:border-primary/30"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${
                      step.bg
                    } flex items-center justify-center flex-shrink-0 ${
                      activeStep === step.id ? "scale-110" : ""
                    } transition-transform duration-300`}
                  >
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{step.time}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {step.description}
                    </p>

                    {activeStep === step.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="font-medium text-foreground mb-1">
                              Processing Status
                            </div>
                            <div className="text-primary">Active</div>
                          </div>
                          <div>
                            <div className="font-medium text-foreground mb-1">
                              Progress
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full w-3/4"></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mock Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-card border border-border/50 rounded-2xl p-6 shadow-2xl">
              {/* Mock Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Logo
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain rounded-lg"
                  />
                  <h4 className="font-semibold text-foreground">
                    Incident Dashboard
                  </h4>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>

              {/* Mock Content Based on Active Step */}
              <div className="space-y-4">
                {activeStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <div className="text-sm font-medium text-foreground mb-3">
                      PII Discovery Scan Results
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {mockData.piiBreach.affectedRecords}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Records Found
                        </div>
                      </div>
                      <div className="p-3 bg-secondary/5 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">
                          {mockData.piiBreach.piiTypes.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PII Types
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mockData.piiBreach.piiTypes.map((type, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <div className="text-sm font-medium text-foreground mb-3">
                      Impact Assessment
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="text-sm text-orange-800 dark:text-orange-200">
                        High Risk Breach Detected
                      </div>
                      <div className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                        Medical records and SSNs compromised
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {mockData.piiBreach.states.map((state, i) => (
                        <div
                          key={i}
                          className="p-2 bg-muted rounded text-xs font-medium"
                        >
                          {state}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <div className="text-sm font-medium text-foreground mb-3">
                      Regulatory Requirements
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                        <span className="text-sm">HIPAA Notification</span>
                        <span className="text-xs text-primary font-medium">
                          Required
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
                        <span className="text-sm">State Attorneys General</span>
                        <span className="text-xs text-secondary font-medium">
                          {mockData.piiBreach.states.length} states
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                        <span className="text-sm">Individual Notification</span>
                        <span className="text-xs text-accent font-medium">
                          {mockData.piiBreach.complianceDeadlines}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <div className="text-sm font-medium text-foreground mb-3">
                      Generated Notifications
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm">Authority Letters</span>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Ready
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm">Individual Notices</span>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Generated
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="text-sm">Media Release</span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Pending Review
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-6 pt-4 border-t border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    Overall Progress
                  </span>
                  <span className="text-xs text-primary font-medium">
                    {Math.round(((activeStep + 1) / demoSteps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${((activeStep + 1) / demoSteps.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/20 rounded-full animate-pulse"></div>
            <div
              className="absolute -bottom-4 -left-4 w-8 h-8 bg-secondary/20 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full text-lg font-medium group"
          >
            Try Interactive Demo
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            See your own data in a private demo environment
          </p>
        </motion.div>
      </div>
    </section>
  );
}
