"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormFields";
import { ContactFormState } from "@/types/contact-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// List of personal email domains to block
const personalEmailDomains = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.in",
  "yahoo.fr",
  "yahoo.de",
  "hotmail.com",
  "hotmail.co.uk",
  "hotmail.fr",
  "outlook.com",
  "live.com",
  "msn.com",
  "protonmail.com",
  "proton.me",
  "pm.me",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "yandex.ru",
  "gmx.com",
  "gmx.net",
  "mail.ru",
  "qq.com",
  "163.com",
  "126.com",
];

// Form validation schema
const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((email) => {
      const domain = email.split("@")[1]?.toLowerCase();
      return domain && !personalEmailDomains.includes(domain);
    }, "Please use a company email address (personal email domains like Gmail, Yahoo, Hotmail are not allowed)"),
  phone: z.string().min(1, "Phone number is required"),
  countryCode: z.string(),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters"),
  company: z.string().optional(),
  subject: z.string().optional(),
  inquiryType: z.enum(["general", "sales", "support", "partnership", "demo"]),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

function ContactFormContent() {
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<ContactFormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
  });

  // Get inquiry type from URL or default to "general"
  const initialInquiryType = useMemo(() => {
    const inquiryTypeParam = searchParams.get("inquiryType");
    if (
      inquiryTypeParam &&
      ["general", "sales", "support", "partnership", "demo"].includes(
        inquiryTypeParam
      )
    ) {
      return inquiryTypeParam as
        | "general"
        | "sales"
        | "support"
        | "partnership"
        | "demo";
    }
    return "general";
  }, [searchParams]);

  // Check if inquiry type came from URL to disable the field
  const isInquiryTypeFromURL = useMemo(() => {
    return searchParams.get("inquiryType") !== null;
  }, [searchParams]);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryCode: "US",
      message: "",
      company: "",
      subject: "",
      inquiryType: initialInquiryType,
    },
  });

  // Ensure the inquiry type is set when the component mounts or searchParams change
  useEffect(() => {
    if (initialInquiryType) {
      form.setValue("inquiryType", initialInquiryType);
    }
  }, [initialInquiryType, form]);

  const onSubmit = async (data: ContactFormValues) => {
    setFormState({
      isSubmitting: true,
      isSuccess: false,
      error: null,
    });

    try {
      // Submit form via API endpoint to get proper IP address and metadata
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: data,
          utmSource: new URLSearchParams(window.location.search).get(
            "utm_source"
          ),
          utmMedium: new URLSearchParams(window.location.search).get(
            "utm_medium"
          ),
          utmCampaign: new URLSearchParams(window.location.search).get(
            "utm_campaign"
          ),
        }),
      });

      // Log the response for debugging
      console.log("API Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        
        setFormState({
          isSubmitting: false,
          isSuccess: false,
          error: errorData.message || errorData.error || "Server error",
        });
        
        // Show detailed error toast
        toast.error("Submission failed", {
          description: errorData.message || errorData.error || `Server error (${response.status})`,
          duration: 5000,
        });
        return;
      }

      const result = await response.json();
      console.log("API Success Response:", result);

      if (result.success) {
        setFormState({
          isSubmitting: false,
          isSuccess: true,
          error: null,
        });
        
        // Show success toast
        toast.success("Message sent successfully!", {
          description: "We'll get back to you within 24 hours.",
          duration: 3000,
        });
        
        form.reset();
        
        // If inquiry type was from URL, refresh the page to re-enable the field
        if (isInquiryTypeFromURL) {
          setTimeout(() => {
            window.location.href = '/contact-us';
          }, 2000); // Wait 2 seconds to show success message
        }
      } else {
        setFormState({
          isSubmitting: false,
          isSuccess: false,
          error: result.message || result.error || "An error occurred",
        });
        
        // Show error toast with detailed message
        toast.error("Submission failed", {
          description: result.message || result.error || "An error occurred. Please try again.",
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("Contact form submission error:", err);
      const errorMessage = err instanceof Error ? err.message : "Network error";
      
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        error: errorMessage,
      });
      
      // Show error toast with detailed message
      toast.error("Submission failed", {
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 border border-border rounded-lg w-full overflow-hidden">
          {/* Left Side - Hero Image */}
          <div
            className="w-full lg:w-1/2 min-h-[250px] sm:min-h-[300px] lg:min-h-[600px] rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(/images/website/contact-us/contact-hero-background.jpg)`,
            }}
          ></div>

          {/* Right Side - Contact Form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 bg-card">
            <div className="flex flex-col gap-6 md:gap-8 w-full max-w-2xl mx-auto">
              <div className="flex flex-col gap-3 md:gap-4">
                <h2 className="font-lato text-2xl sm:text-3xl md:text-[32px] font-bold leading-[1.2] text-primary break-words">
                  Write to us!
                </h2>
                <p className="font-lato text-base md:text-lg font-normal leading-[1.78] text-foreground break-words">
                  Need any help, just write us here and we will get back to you
                  within 24 hours
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-6 md:gap-8 w-full"
                >
                  {/* Success/Error Messages */}
                  {formState.isSuccess && (
                    <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-400 w-full">
                      <p className="font-medium">Thank you for your message!</p>
                      <p className="text-sm">
                        We will get back to you within 24 hours.
                      </p>
                    </div>
                  )}

                  {formState.error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 w-full">
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{formState.error}</p>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="flex flex-col gap-4 md:gap-6 w-full">
                    {/* First Row - Name Fields */}
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full">
                      <div className="flex-1 w-full">
                        <CustomFormField
                          control={form.control}
                          name="firstName"
                          label="First name"
                          placeholder="First name"
                          fieldType={FormFieldType.INPUT}
                          required
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <CustomFormField
                          control={form.control}
                          name="lastName"
                          label="Last name"
                          placeholder="Last name"
                          fieldType={FormFieldType.INPUT}
                          required
                        />
                      </div>
                    </div>

                    {/* Second Row - Email and Phone */}
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full">
                      <div className="flex-1 w-full">
                        <CustomFormField
                          control={form.control}
                          name="email"
                          label="Email"
                          placeholder="you@company.com"
                          fieldType={FormFieldType.INPUT}
                          inputType="email"
                          required
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <CustomFormField
                          control={form.control}
                          name="phone"
                          label="Phone number"
                          placeholder="+1 (555) 000-0000"
                          fieldType={FormFieldType.PHONE_INPUT}
                          required
                        />
                      </div>
                    </div>

                    {/* Third Row - Company and Subject */}
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full">
                      <div className="flex-1 w-full">
                        <CustomFormField
                          control={form.control}
                          name="company"
                          label="Company (Optional)"
                          placeholder="Your company name"
                          fieldType={FormFieldType.INPUT}
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <CustomFormField
                          control={form.control}
                          name="inquiryType"
                          label="Inquiry Type"
                          placeholder="Select inquiry type"
                          fieldType={FormFieldType.SELECT}
                          disabled={isInquiryTypeFromURL}
                        >
                          <option value="general">General Inquiry</option>
                          <option value="sales">Sales</option>
                          <option value="support">Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="demo">Schedule a Demo</option>
                        </CustomFormField>
                      </div>
                    </div>

                    {/* Message Field */}
                    <div className="w-full">
                      <CustomFormField
                        control={form.control}
                        name="message"
                        label="Message"
                        placeholder="Leave us a message..."
                        fieldType={FormFieldType.TEXTAREA}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 w-full h-11 sm:h-12 px-6 py-3 rounded-[48px] text-sm sm:text-base font-medium text-white shadow-lg transition-all disabled:opacity-50"
                  >
                    {formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactForm() {
  return (
    <Suspense
      fallback={
        <section className="bg-background py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 w-full max-w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Loading form...</p>
            </div>
          </div>
        </section>
      }
    >
      <ContactFormContent />
    </Suspense>
  );
}
