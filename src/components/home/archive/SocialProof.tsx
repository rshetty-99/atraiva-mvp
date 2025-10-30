"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Users, Shield, TrendingUp } from "lucide-react";

export default function SocialProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const metrics = [
    {
      icon: Users,
      number: "500+",
      label: "Enterprise Clients",
      description: "Healthcare & Finance Organizations"
    },
    {
      icon: Shield,
      number: "99.9%",
      label: "Compliance Accuracy",
      description: "Across All 50 States + Federal"
    },
    {
      icon: Star,
      number: "4.9/5",
      label: "Customer Rating",
      description: "Based on 200+ Reviews"
    },
    {
      icon: TrendingUp,
      number: "70%",
      label: "Faster Response",
      description: "Average Incident Processing Time"
    }
  ];

  const testimonials = [
    {
      quote: "Atraiva transformed our breach response process. What used to take weeks now takes hours.",
      author: "Sarah Chen",
      title: "CISO, Regional Health System",
      company: "1,200+ bed hospital network"
    },
    {
      quote: "The AI-powered PII discovery saved us thousands of hours and ensured 100% regulatory compliance.",
      author: "Michael Rodriguez",
      title: "Chief Privacy Officer",
      company: "Fortune 500 Financial Services"
    },
    {
      quote: "Finally, a platform that understands the complexity of multi-state data breach notifications.",
      author: "Jennifer Park",
      title: "Partner, Cybersecurity Law Firm",
      company: "Serving 50+ enterprise clients"
    }
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-primary/5 to-background" ref={ref}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 w-full">
        {/* Metrics Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <metric.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">{metric.number}</div>
              <div className="text-lg font-semibold text-foreground mb-1">{metric.label}</div>
              <div className="text-sm text-muted-foreground">{metric.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <Star className="w-4 h-4 text-secondary mr-2" />
            <span className="text-sm font-medium text-secondary">Customer Success</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Trusted by Industry Leaders
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-50"></div>
              <div className="relative p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 h-full">
                {/* Quote */}
                <div className="mb-6">
                  <div className="text-4xl text-primary mb-4 font-serif">"</div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    {testimonial.quote}
                  </p>
                </div>

                {/* Author */}
                <div className="border-t border-border/30 pt-4">
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-primary font-medium">{testimonial.title}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                </div>

                {/* Star Rating */}
                <div className="flex space-x-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/10 border border-accent/20">
            <div className="w-2 h-2 bg-accent rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium text-accent">
              Join the growing community of compliant organizations
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}