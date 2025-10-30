"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FileText,
  BookOpen,
  Video,
  Download,
  ArrowRight,
  Calendar,
  Users,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Resources() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const resources = [
    {
      type: "Documentation",
      icon: BookOpen,
      title: "Compliance Guide",
      description:
        "Complete guide to data breach compliance across all 50 states",
      href: "/docs/compliance-guide",
      category: "Guide",
    },
    {
      type: "Whitepaper",
      icon: FileText,
      title: "AI in Data Protection",
      description:
        "How artificial intelligence is revolutionizing data breach response",
      href: "/resources/ai-data-protection",
      category: "Research",
    },
    {
      type: "Webinar",
      icon: Video,
      title: "GDPR Compliance Best Practices",
      description:
        "Learn from industry experts about GDPR compliance strategies",
      href: "/resources/gdpr-webinar",
      category: "Training",
    },
    {
      type: "Template",
      icon: Download,
      title: "Breach Notification Templates",
      description:
        "Ready-to-use templates for all 50 states and federal requirements",
      href: "/resources/notification-templates",
      category: "Template",
    },
    {
      type: "Case Study",
      icon: Shield,
      title: "Healthcare Data Breach Response",
      description: "How a major hospital system reduced response time by 70%",
      href: "/resources/healthcare-case-study",
      category: "Case Study",
    },
    {
      type: "Webinar",
      icon: Calendar,
      title: "Monthly Compliance Updates",
      description:
        "Stay updated with the latest regulatory changes and requirements",
      href: "/resources/monthly-updates",
      category: "Training",
    },
  ];

  const upcomingEvents = [
    {
      title: "Data Privacy Summit 2024",
      date: "March 15, 2024",
      type: "Conference",
      description: "Join us at the premier data privacy conference",
    },
    {
      title: "HIPAA Compliance Workshop",
      date: "March 22, 2024",
      type: "Workshop",
      description: "Hands-on workshop for healthcare compliance professionals",
    },
    {
      title: "CCPA Update Webinar",
      date: "March 29, 2024",
      type: "Webinar",
      description: "Latest updates on California Consumer Privacy Act",
    },
  ];

  return (
    <section id="resources" ref={ref} className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Resources & Learning
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Access our comprehensive library of guides, templates, and training
            materials to stay ahead of compliance requirements.
          </motion.p>
        </div>

        {/* Resources Grid */}
        <div className="mt-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-foreground mb-8"
          >
            Resource Library
          </motion.h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Badge variant="secondary" className="text-xs">
                            {resource.category}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg">
                        {resource.title}
                      </CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        variant="ghost"
                        className="p-0 h-auto font-medium"
                        asChild
                      >
                        <a
                          href={resource.href}
                          className="flex items-center gap-2"
                        >
                          Access Resource
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Upcoming Events
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{event.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {event.date}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      Register
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center bg-muted/30 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Need Personalized Help?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our compliance experts are here to help you navigate complex
            regulatory requirements and implement best practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/contact">Schedule Consultation</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/docs">Browse Documentation</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
