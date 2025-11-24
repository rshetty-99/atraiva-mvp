import { Metadata } from "next";
import { FAQ } from "@/components/website/FAQ";
import { allFAQs } from "@/lib/data/faq-data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Atraiva",
  description:
    "Find answers to common questions about Atraiva's breach determination platform, data security, integrations, and compliance features.",
  keywords: [
    "Atraiva FAQ",
    "breach determination",
    "data security questions",
    "compliance platform",
    "privacy questions",
  ],
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 px-4 sm:px-6 lg:px-8 border-b">
        <div className="max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about Atraiva's breach determination
              platform, data security, integrations, and compliance features.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ
        items={allFAQs}
        title=""
        columns={1}
        showAll={false}
      />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Our team is here to help. Get in touch with us for personalized
            answers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-us">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Contact Us
              </Button>
            </Link>
            <Link href="/price">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

