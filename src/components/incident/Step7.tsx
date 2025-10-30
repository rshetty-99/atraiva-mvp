"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  FileText,
  AlertTriangle,
  Shield,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StepProps {
  onNext?: () => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

export default function Step7({ onPrevious, isLastStep }: StepProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Load all saved data from localStorage
    const step1 = JSON.parse(localStorage.getItem("incident_step1") || "{}");
    const step2 = JSON.parse(localStorage.getItem("incident_step2") || "{}");
    const step3 = JSON.parse(localStorage.getItem("incident_step3") || "{}");
    const step4 = JSON.parse(localStorage.getItem("incident_step4") || "{}");
    const step5 = JSON.parse(localStorage.getItem("incident_step5") || "{}");
    const step6 = JSON.parse(localStorage.getItem("incident_step6") || "{}");

    setFormData({ step1, step2, step3, step4, step5, step6 });
  }, []);

  const handleComplete = async () => {
    try {
      // Here you would submit the data to your backend API
      console.log("Submitting incident report:", formData);

      // For now, just show success and redirect
      // TODO: Replace with actual API call
      // const response = await fetch("/api/incidents", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      // Clear localStorage after successful submission
      localStorage.removeItem("incident_step1");
      localStorage.removeItem("incident_step2");
      localStorage.removeItem("incident_step3");
      localStorage.removeItem("incident_step4");
      localStorage.removeItem("incident_step5");
      localStorage.removeItem("incident_step6");

      // Redirect to incidents list or dashboard
      router.push("/org/incidents");
    } catch (error) {
      console.error("Error submitting incident report:", error);
    }
  };

  const nextSteps = [
    {
      icon: Shield,
      title: "Execute immediate Purview queries on identified systems",
      description: "Automated investigation will begin",
    },
    {
      icon: Clock,
      title: "Initiate regulatory notification timeline tracking",
      description: "Compliance deadlines will be monitored",
    },
    {
      icon: AlertTriangle,
      title: "Alert key stakeholders based on severity",
      description: "Notifications will be sent to relevant teams",
    },
    {
      icon: FileText,
      title: "Generate initial incident report",
      description: "Documentation will be created automatically",
    },
    {
      icon: CheckCircle,
      title: "Begin containment and eradication procedures",
      description: "Response team will be notified",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="space-y-6">
        <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-900 dark:text-green-100">
            Ready to Submit
          </AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-200">
            Your incident report is complete. Review the automated actions below
            and submit when ready.
          </AlertDescription>
        </Alert>

        <div className="border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Immediate Next Steps
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Based on your responses, the system will automatically prioritize
            the following actions upon submission:
          </p>

          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Once submitted, this incident will be logged in the system and
            notifications will be sent to relevant stakeholders. You can still
            update the incident details after submission.
          </AlertDescription>
        </Alert>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button type="button" onClick={onPrevious} variant="outline">
            Previous
          </Button>
          {isLastStep && (
            <Button onClick={handleComplete} className="gap-2" size="lg">
              <CheckCircle className="h-5 w-5" />
              Submit Incident Report
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
