"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormFields";
import { ContactFormState } from "@/types/contact-form";

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

export function ContactForm() {
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

      const result = await response.json();

      if (result.success) {
        setFormState({
          isSubmitting: false,
          isSuccess: true,
          error: null,
        });
        form.reset();
      } else {
        setFormState({
          isSubmitting: false,
          isSuccess: false,
          error: result.error || "An error occurred",
        });
      }
    } catch (err) {
      console.error("Contact form submission error:", err);
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        error: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <section className="bg-background py-20 px-4 sm:px-8 md:px-12 lg:px-20 w-full max-w-full overflow-x-hidden" style={{ overflow: "hidden", maxWidth: "100vw", width: "100%", boxSizing: "border-box", position: "relative" }}>
      <div className="max-w-[1280px] mx-auto w-full min-w-0" style={{ maxWidth: "min(100vw, 1280px)", boxSizing: "border-box", width: "100%" }}>
        <div className="flex flex-col lg:flex-row border-border rounded-lg w-full min-w-0 overflow-hidden" style={{ overflow: "hidden", maxWidth: "100%", width: "100%", boxSizing: "border-box" }}>
          {/* Left Side - Hero Image */}
          <div
            className="flex flex-col justify-stretch items-stretch w-full lg:w-1/2 gap-2.5 p-2.5 rounded-lg min-h-[300px] lg:min-h-0 min-w-0 flex-shrink-0"
            style={{
              backgroundImage: `url(/images/website/contact-us/contact-hero-background.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              maxWidth: "100%",
              boxSizing: "border-box",
              width: "100%",
            }}
          ></div>

          {/* Right Side - Contact Form */}
          <div className="flex flex-col justify-center items-start lg:items-end p-6 lg:p-10 bg-card border border-dashed border-border rounded-lg w-full lg:w-1/2 min-w-0 shrink overflow-hidden" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%", overflow: "hidden" }}>
            <div className="flex flex-col justify-center gap-8 w-full max-w-full lg:max-w-[480px] min-w-0" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%", overflow: "hidden" }}>
              <div className="flex flex-col gap-4" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
                <h2 className="font-lato text-[32px] font-bold leading-[1.2] text-left text-primary" style={{ maxWidth: "100%", overflow: "hidden", wordBreak: "break-word", boxSizing: "border-box" }}>
                  Write to us!
                </h2>
                <p className="font-lato text-lg font-normal leading-[1.78] text-left text-foreground w-full" style={{ maxWidth: "100%", overflow: "hidden", wordBreak: "break-word", boxSizing: "border-box" }}>
                  Need any help, just write us here and we will get back to you
                  within 24 hours
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-8"
                  style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}
                >
                  {/* Success/Error Messages */}
                  {formState.isSuccess && (
                    <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-400" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%", overflow: "hidden" }}>
                      <p className="font-medium">Thank you for your message!</p>
                      <p className="text-sm">
                        We will get back to you within 24 hours.
                      </p>
                    </div>
                  )}

                  {formState.error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%", overflow: "hidden" }}>
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{formState.error}</p>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="flex flex-col gap-6 w-full min-w-0" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
                    {/* First Row - Name Fields */}
                    <div className="flex flex-col sm:flex-row gap-6 w-full min-w-0" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
                      <div className="flex-1 min-w-0" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
                        <CustomFormField
                          control={form.control}
                          name="firstName"
                          label="First name"
                          placeholder="First name"
                          fieldType={FormFieldType.INPUT}
                          required
                        />
                      </div>
                      <div className="flex-1 min-w-0" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
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
                    <div className="flex flex-col sm:flex-row gap-6 w-full min-w-0" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
                      <div className="flex-1 min-w-0" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
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
                      <div className="flex-1 min-w-0" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
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
                    <div className="flex flex-col sm:flex-row gap-6 w-full min-w-0" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
                      <div className="flex-1 min-w-0" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
                        <CustomFormField
                          control={form.control}
                          name="company"
                          label="Company (Optional)"
                          placeholder="Your company name"
                          fieldType={FormFieldType.INPUT}
                        />
                      </div>
                      <div className="flex-1 min-w-0" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
                        <CustomFormField
                          control={form.control}
                          name="inquiryType"
                          label="Inquiry Type"
                          placeholder="Select inquiry type"
                          fieldType={FormFieldType.SELECT}
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
                    <div className="w-full min-w-0" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
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
                    className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 w-full h-12 px-6 py-3 rounded-[48px] text-base font-medium text-white shadow-lg transition-all disabled:opacity-50"
                  >
                    {formState.isSubmitting ? "Submitting..." : "Submit"}
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
