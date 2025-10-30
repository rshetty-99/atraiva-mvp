"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calculator, TrendingUp, DollarSign, Clock, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomFormField, { FormFieldType } from "@/components/CustomFormFields";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";

const calculatorSchema = z.object({
  companySize: z.enum(["small", "medium", "large", "enterprise"]),
  industry: z.enum(["healthcare", "finance", "retail", "tech", "other"]),
  recordsAtRisk: z.string().min(1, "Required"),
  currentProcessTime: z.string().min(1, "Required")
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

export default function ROICalculator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showResults, setShowResults] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState({
    potentialFines: 0,
    timeSavings: 0,
    monthlySavings: 0,
    riskReduction: 0,
    paybackPeriod: 0
  });

  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      companySize: "medium",
      industry: "healthcare",
      recordsAtRisk: "10000",
      currentProcessTime: "120"
    }
  });

  const calculateROI = (data: CalculatorFormData) => {
    // Base calculations - simplified for demo
    const recordCount = parseInt(data.recordsAtRisk);
    const currentHours = parseInt(data.currentProcessTime);

    // Industry-specific multipliers
    const industryMultipliers = {
      healthcare: 1.5,
      finance: 1.3,
      retail: 1.0,
      tech: 1.1,
      other: 1.0
    };

    // Company size multipliers
    const sizeMultipliers = {
      small: 0.7,
      medium: 1.0,
      large: 1.3,
      enterprise: 1.8
    };

    const industryMultiplier = industryMultipliers[data.industry];
    const sizeMultiplier = sizeMultipliers[data.companySize];

    // Calculate potential fines (average $150 per record for healthcare, less for others)
    const basePerRecordFine = data.industry === 'healthcare' ? 150 :
                             data.industry === 'finance' ? 100 : 75;
    const potentialFines = recordCount * basePerRecordFine * industryMultiplier;

    // Calculate time savings (70% reduction)
    const timeSavings = Math.round(currentHours * 0.7);
    const hourlyCost = 150; // Average compliance attorney hourly rate
    const monthlySavings = Math.round(timeSavings * hourlyCost * sizeMultiplier);

    // Risk reduction percentage
    const riskReduction = Math.min(95, Math.round(75 + (sizeMultiplier * 10)));

    // Payback period (months)
    const atraivaMonthlyPrice = data.companySize === 'enterprise' ? 2500 :
                               data.companySize === 'large' ? 1500 :
                               data.companySize === 'medium' ? 800 : 400;
    const paybackPeriod = Math.max(0.5, Math.round((atraivaMonthlyPrice / monthlySavings) * 10) / 10);

    setCalculatedResults({
      potentialFines,
      timeSavings,
      monthlySavings,
      riskReduction,
      paybackPeriod
    });

    setShowResults(true);
  };

  const onSubmit = (data: CalculatorFormData) => {
    calculateROI(data);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-muted/10 to-background" ref={ref}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Calculator className="w-4 h-4 text-accent mr-2" />
            <span className="text-sm font-medium text-accent">ROI Calculator</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Calculate Your Risk
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              & Potential Savings
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover how much Atraiva could save your organization in compliance costs,
            legal fees, and potential fines with our interactive calculator.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-lg">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  Your Organization Profile
                </h3>
                <p className="text-muted-foreground">
                  Tell us about your organization to get personalized risk assessment
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <CustomFormField
                    control={form.control}
                    name="companySize"
                    label="Company Size"
                    fieldType={FormFieldType.SELECT}
                    placeholder="Select company size"
                  >
                    <option value="small">Small (1-100 employees)</option>
                    <option value="medium">Medium (101-1,000 employees)</option>
                    <option value="large">Large (1,001-10,000 employees)</option>
                    <option value="enterprise">Enterprise (10,000+ employees)</option>
                  </CustomFormField>

                  <CustomFormField
                    control={form.control}
                    name="industry"
                    label="Industry"
                    fieldType={FormFieldType.SELECT}
                    placeholder="Select industry"
                  >
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Financial Services</option>
                    <option value="retail">Retail</option>
                    <option value="tech">Technology</option>
                    <option value="other">Other</option>
                  </CustomFormField>

                  <CustomFormField
                    control={form.control}
                    name="recordsAtRisk"
                    label="Estimated Records at Risk"
                    fieldType={FormFieldType.INPUT}
                    placeholder="e.g., 10000"
                  />

                  <CustomFormField
                    control={form.control}
                    name="currentProcessTime"
                    label="Current Breach Response Time (hours)"
                    fieldType={FormFieldType.INPUT}
                    placeholder="e.g., 120"
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Calculate My Risk & Savings
                    <TrendingUp className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </Form>

              {/* Risk Indicators */}
              <div className="mt-8 pt-6 border-t border-border/30">
                <div className="text-sm text-muted-foreground mb-4">Industry Risk Factors:</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">$5M avg breach cost</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="text-sm">72hr deadline</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">50+ jurisdictions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm">$150/record fine</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {showResults ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-8 shadow-lg"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    Your Personalized Results
                  </h3>
                  <p className="text-muted-foreground">
                    Based on your organization profile and industry benchmarks
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Potential Savings */}
                  <div className="p-6 bg-card rounded-xl border border-border/50">
                    <div className="flex items-center space-x-3 mb-4">
                      <DollarSign className="w-6 h-6 text-green-500" />
                      <h4 className="font-semibold text-foreground">Potential Fine Avoidance</h4>
                    </div>
                    <div className="text-3xl font-bold text-green-500 mb-2">
                      ${calculatedResults.potentialFines.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average regulatory fines you could avoid with proper compliance
                    </p>
                  </div>

                  {/* Time Savings */}
                  <div className="p-6 bg-card rounded-xl border border-border/50">
                    <div className="flex items-center space-x-3 mb-4">
                      <Clock className="w-6 h-6 text-blue-500" />
                      <h4 className="font-semibold text-foreground">Time Savings Per Incident</h4>
                    </div>
                    <div className="text-3xl font-bold text-blue-500 mb-2">
                      {calculatedResults.timeSavings} hours
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reduction in manual compliance work (70% automation)
                    </p>
                  </div>

                  {/* Monthly Savings */}
                  <div className="p-6 bg-card rounded-xl border border-border/50">
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      <h4 className="font-semibold text-foreground">Monthly Operational Savings</h4>
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      ${calculatedResults.monthlySavings.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Legal and compliance cost reduction through automation
                    </p>
                  </div>

                  {/* Risk Reduction */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-card rounded-xl border border-border/50 text-center">
                      <div className="text-2xl font-bold text-secondary mb-1">
                        {calculatedResults.riskReduction}%
                      </div>
                      <div className="text-xs text-muted-foreground">Risk Reduction</div>
                    </div>
                    <div className="p-4 bg-card rounded-xl border border-border/50 text-center">
                      <div className="text-2xl font-bold text-accent mb-1">
                        {calculatedResults.paybackPeriod} mo
                      </div>
                      <div className="text-xs text-muted-foreground">Payback Period</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/30 text-center">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                    Get Detailed ROI Report
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">
                    Receive a personalized PDF report with detailed calculations
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="bg-card border border-border/50 rounded-2xl p-12 shadow-lg text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
                  <Calculator className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Ready to Calculate Your ROI?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Fill out the form on the left to see your personalized risk assessment
                  and potential savings with Atraiva's automated compliance platform.
                </p>

                {/* Preview Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">70%</div>
                    <div className="text-xs text-muted-foreground">Time Reduction</div>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">$50K+</div>
                    <div className="text-xs text-muted-foreground">Avg Annual Savings</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}