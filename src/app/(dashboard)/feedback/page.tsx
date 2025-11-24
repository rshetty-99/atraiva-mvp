"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { FeedbackType } from "@/types/feedback";

export default function FeedbackPage() {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: "" as FeedbackType | "",
    title: "",
    description: "",
    category: "",
  });

  // Check if user is platform admin
  const userMetadata = user?.publicMetadata?.atraiva as
    | { primaryOrganization?: { role?: string } }
    | undefined;
  const userRole = userMetadata?.primaryOrganization?.role;
  const isPlatformRole =
    userRole === "platform_admin" || userRole === "super_admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: formData.type,
          title: formData.title,
          description: formData.description,
          category: formData.category || undefined,
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      toast.success("Feedback submitted successfully!", {
        description: "Thank you for helping us improve Atraiva.",
      });

      // Reset form
      setFormData({
        type: "",
        title: "",
        description: "",
        category: "",
      });

      // Redirect platform admins back to admin feedback page
      if (isPlatformRole) {
        setTimeout(() => {
          window.location.href = "/admin/feedback";
        }, 1500); // Wait 1.5s to show toast before redirecting
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto space-y-6 px-4 pb-6 pt-20 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          Send Feedback
        </h1>
        <p className="text-muted-foreground">
          Help us improve Atraiva by sharing your thoughts, reporting bugs, or
          suggesting new features.
        </p>
        {isPlatformRole && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded-r">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              👤 Submitting as Customer Support - This feedback will be tagged
              as support-initiated
            </p>
          </div>
        )}
      </motion.div>

      {/* Feedback Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Your Feedback</CardTitle>
            <CardDescription>
              All feedback is reviewed by our team. We appreciate your input!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Info (Read-only) */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Your Name</Label>
                  <Input
                    value={user?.fullName || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Your Email</Label>
                  <Input
                    value={user?.primaryEmailAddress?.emailAddress || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              {/* Feedback Type */}
              <div className="space-y-2">
                <Label htmlFor="type">
                  Feedback Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as FeedbackType })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">🐛 Bug Report</SelectItem>
                    <SelectItem value="feature">✨ Feature Request</SelectItem>
                    <SelectItem value="improvement">
                      💡 Improvement Suggestion
                    </SelectItem>
                    <SelectItem value="general">💬 General Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Input
                  id="category"
                  placeholder="e.g., Dashboard, Incidents, Reports"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Brief summary of your feedback"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Please provide as much detail as possible..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  For bugs, please include steps to reproduce the issue.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      type: "",
                      title: "",
                      description: "",
                      category: "",
                    })
                  }
                  disabled={isSubmitting}
                >
                  Clear
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto"
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">🐛 Report Bugs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Found a bug? Let us know so we can fix it quickly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">✨ Request Features</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Have an idea? We&apos;d love to hear about features you&apos;d
              like to see.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">💡 Share Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Suggestions for improvements help us build a better product.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

