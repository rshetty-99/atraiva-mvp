"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, DollarSign, Building2, GraduationCap } from "lucide-react";

export default function Solutions() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const industries = [
    {
      icon: Heart,
      title: "Healthcare",
      description:
        "HIPAA compliance automation for hospitals, clinics, and health systems with specialized PHI discovery.",
    },
    {
      icon: DollarSign,
      title: "Financial Services",
      description:
        "GLBA and banking regulation compliance for financial institutions with advanced fraud detection.",
    },
    {
      icon: Building2,
      title: "Enterprise",
      description:
        "Multi-state compliance for large corporations with custom regulatory frameworks.",
    },
    {
      icon: GraduationCap,
      title: "Education",
      description:
        "FERPA compliance for educational institutions with student data protection management.",
    },
  ];

  return (
    <section id="solutions" ref={ref} className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-base text-primary font-semibold tracking-wide uppercase"
          >
            Industry Solutions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-2 text-3xl leading-8 font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Tailored for your industry
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto"
          >
            Specialized compliance solutions designed for the unique
            requirements of different industries.
          </motion.p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="pt-6"
              >
                <div className="flow-root bg-muted/30 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <industry.icon
                          className="h-6 w-6 text-primary-foreground"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-foreground tracking-tight">
                      {industry.title}
                    </h3>
                    <p className="mt-5 text-base text-muted-foreground">
                      {industry.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
