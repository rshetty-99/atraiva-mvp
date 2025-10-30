"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Star, Zap, Shield, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const plans = [
    {
      name: "Starter",
      description:
        "Perfect for small businesses getting started with compliance",
      price: "$299",
      period: "/month",
      icon: Zap,
      popular: false,
      features: [
        "Up to 1,000 records scanned",
        "Basic PII discovery",
        "5-state compliance coverage",
        "Email support",
        "Basic reporting",
        "1 user account",
      ],
      cta: "Start Free Trial",
      href: "/onboarding",
    },
    {
      name: "Professional",
      description: "Ideal for growing organizations with compliance needs",
      price: "$799",
      period: "/month",
      icon: Shield,
      popular: true,
      features: [
        "Up to 10,000 records scanned",
        "Advanced AI PII discovery",
        "50-state compliance coverage",
        "Priority support",
        "Advanced analytics",
        "Up to 5 user accounts",
        "Custom compliance frameworks",
        "API access",
      ],
      cta: "Start Free Trial",
      href: "/onboarding",
    },
    {
      name: "Enterprise",
      description: "Comprehensive solution for large organizations",
      price: "Custom",
      period: "",
      icon: Building,
      popular: false,
      features: [
        "Unlimited records scanned",
        "Enterprise AI PII discovery",
        "Global compliance coverage",
        "24/7 dedicated support",
        "Custom analytics dashboard",
        "Unlimited user accounts",
        "Custom compliance frameworks",
        "Full API access",
        "On-premise deployment",
        "Custom integrations",
        "Dedicated success manager",
      ],
      cta: "Contact Sales",
      href: "/contact",
    },
  ];

  return (
    <section id="pricing" ref={ref} className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Choose the plan that fits your organization's compliance needs. All
            plans include our core AI-powered features.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ delay: 0.1 + index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card
                  className={`h-full ${
                    plan.popular ? "border-primary shadow-lg" : ""
                  }`}
                >
                  <CardHeader className="text-center pb-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Button
                        className={`w-full ${
                          plan.popular ? "bg-primary hover:bg-primary/90" : ""
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        asChild
                      >
                        <a href={plan.href}>{plan.cta}</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Need a custom solution?{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contact our sales team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
