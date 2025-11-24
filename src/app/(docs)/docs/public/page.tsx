import React from "react";

export default function PublicDocsHome() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Atraiva Documentation
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Welcome to the Atraiva documentation. Learn how to use our breach
          determination platform effectively.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          What is Atraiva?
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Atraiva is an AI-powered breach determination and compliance
          automation platform that helps organizations:
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>✅ Automate breach determination across 50+ jurisdictions</li>
          <li>✅ Calculate notification deadlines</li>
          <li>✅ Analyze regulatory requirements</li>
          <li>✅ Generate compliance reports</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Quick Links
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <a
            href="/docs/public/getting-started/introduction"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Getting Started
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Learn the basics
            </p>
          </a>
          <a
            href="/docs/public/user-guide"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              User Guide
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Detailed guides
            </p>
          </a>
          <a
            href="/docs/public/faq"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              FAQ
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Common questions
            </p>
          </a>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Key Features
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
            Reflex Determination Engine
          </h3>
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Automatically analyzes cybersecurity incidents against statutory
            triggers to determine breach notification requirements.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
            Multi-Jurisdiction Analysis
          </h3>
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Covers 50+ state data breach notification laws plus federal
            requirements (HIPAA, GLBA, SEC, FTC).
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
            Contract Intelligence
          </h3>
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Extracts vendor notification obligations from contracts and maps
            supply-chain exposure.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
            Safe Harbor Evaluation
          </h3>
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Analyzes encryption strength and key exposure to determine if safe
            harbor exceptions apply.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Need Help?
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          If you&apos;re a customer with a support account, check out our{" "}
          <a
            href="/docs/support"
            className="text-primary hover:underline font-medium"
          >
            Customer Support Documentation
          </a>
          .
        </p>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          For general inquiries, contact us at{" "}
          <a
            href="mailto:support@atraiva.ai"
            className="text-primary hover:underline font-medium"
          >
            support@atraiva.ai
          </a>
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Documentation - Atraiva",
  description:
    "Complete documentation for Atraiva breach determination platform",
};
