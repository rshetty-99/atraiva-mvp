"use client";

import React, { Suspense } from "react";
import {
  Header,
  Hero,
  ContactForm,
  CTA,
  Footer,
} from "@/components/website/contact-us";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Suspense
        fallback={<div className="py-20 px-20 text-center">Loading...</div>}
      >
        <ContactForm />
      </Suspense>
      <CTA />
      <Footer />
    </div>
  );
}
