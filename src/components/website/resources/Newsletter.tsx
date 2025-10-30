"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormFields";
import { NewsletterService } from "@/lib/newsletter";
import { NewsletterFormData } from "@/types/newsletter";
import { toast } from "sonner";

// Form schema
const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

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

      // Subscribe to newsletter
      const result = await NewsletterService.subscribe(data.email, metadata);

      if (result.success) {
        toast.success(result.message);
        form.reset(); // Clear the form
      } else {
        toast.error(result.message);
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
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-[48px] text-base font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
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
