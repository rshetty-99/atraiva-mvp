"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormFields";
import { NewsletterService } from "@/lib/newsletter";
import { NewsletterFormData } from "@/types/newsletter";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

// Form schema
const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export function Newsletter() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  // Check subscription status on mount and when user changes
  // First check Clerk metadata (cached), then fallback to API if needed
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isUserLoaded) return;

      // If no user, allow form submission (guest mode)
      if (!user) {
        setIsSubscribed(false);
        setCheckingSubscription(false);
        return;
      }

      // Check Clerk metadata first (cached, no API call)
      const sessionData = user.publicMetadata?.atraiva as
        | { preferences?: { newsletterSubscribed?: boolean } }
        | undefined;
      if (sessionData?.preferences?.newsletterSubscribed !== undefined) {
        setIsSubscribed(sessionData.preferences.newsletterSubscribed);
        setCheckingSubscription(false);
        // Auto-fill email if user is logged in
        if (user.primaryEmailAddress?.emailAddress) {
          form.setValue("email", user.primaryEmailAddress.emailAddress);
        }
        return;
      }

      // If not in cache, check via API (will cache the result)
      setCheckingSubscription(true);
      try {
        let url = "/api/newsletter/subscribe?";
        if (user.id) {
          url += `userId=${encodeURIComponent(user.id)}`;
        } else if (user.primaryEmailAddress?.emailAddress) {
          url += `email=${encodeURIComponent(
            user.primaryEmailAddress.emailAddress
          )}`;
        } else {
          setIsSubscribed(false);
          setCheckingSubscription(false);
          return;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setIsSubscribed(data.isSubscribed || false);
          // Auto-fill email if user is logged in
          if (user.primaryEmailAddress?.emailAddress) {
            form.setValue("email", user.primaryEmailAddress.emailAddress);
          }
        } else {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        setIsSubscribed(false);
      } finally {
        setCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [user, isUserLoaded, form]);

  const onSubmit = async (data: NewsletterFormValues) => {
    try {
      setIsSubmitting(true);

      // Get additional metadata
      const metadata = {
        referrer: document.referrer || "direct",
        userAgent: navigator.userAgent,
        utmSource:
          new URLSearchParams(window.location.search).get("utm_source") ||
          undefined,
        utmMedium:
          new URLSearchParams(window.location.search).get("utm_medium") ||
          undefined,
        utmCampaign:
          new URLSearchParams(window.location.search).get("utm_campaign") ||
          undefined,
      };

      // Prepare subscription data
      const userName = user?.fullName || user?.firstName || undefined;
      const userId = user?.id || undefined;

      // Subscribe via API to ensure metadata is updated
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          name: userName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Successfully subscribed to newsletter!");
        setIsSubscribed(true);
        // Don't reset form if user is logged in (keep email visible)
        if (!user) {
          form.reset();
        }
      } else {
        toast.error(result.message || "Failed to subscribe. Please try again.");
        if (result.message?.includes("already subscribed")) {
          setIsSubscribed(true);
        }
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-background py-10 px-20">
      <div className="w-full">
        <div
          className="bg-gradient-to-b from-accent to-accent/60 rounded-3xl p-30 flex flex-col items-center gap-8 relative"
          style={{
            backgroundImage: `url(/images/website/resources/newsletter-background.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Theme-aware overlay for text contrast */}
          <div className="absolute inset-0 bg-background/50 rounded-3xl"></div>
          <div className="relative z-10 flex flex-col items-center gap-8 w-[800px]">
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <h2 className="font-['Encode_Sans_Semi_Expanded'] text-[42px] font-normal leading-[1.25] text-center text-foreground">
                  Never Miss a Security Update
                </h2>
                <p className="font-lato text-lg font-normal leading-[1.33] text-center text-foreground w-[641px]">
                  Join over 10,000 security professionals who rely on our
                  insights to stay ahead of emerging threats and industry
                  trends. Get weekly updates delivered straight to your inbox.
                </p>
              </div>

              {/* Email Signup Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex gap-4 w-[550px]"
                >
                  <div className="flex-1">
                    <CustomFormField<NewsletterFormValues>
                      control={form.control}
                      name="email"
                      fieldType={FormFieldType.INPUT}
                      inputType="email"
                      placeholder="Enter your email address"
                      required
                      disabled={checkingSubscription || isSubscribed === true}
                    />
                  </div>
                  {checkingSubscription ? (
                    <Button
                      type="button"
                      disabled
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-[48px] text-base font-medium flex items-center gap-2 opacity-50 cursor-not-allowed"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Checking...
                    </Button>
                  ) : isSubscribed === true ? (
                    <Button
                      type="button"
                      disabled
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-[48px] text-base font-medium flex items-center gap-2 opacity-50 cursor-not-allowed"
                    >
                      Already Subscribed
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-[48px] text-base font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 7.89a1 1 0 001.42 0L21 7M5 3l14 14"
                            />
                          </svg>
                          Subscribe
                        </>
                      )}
                    </Button>
                  )}
                </form>
              </Form>
            </div>
          </div>

          <p className="font-lato text-lg font-normal leading-[1.33] text-center text-foreground w-[641px] relative z-10">
            No spam, unsubscribe at any time. Read our privacy policy.
          </p>
        </div>
      </div>
    </section>
  );
}
