import React from "react";

export default function Introduction() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Introduction to Atraiva
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Atraiva transforms how organizations handle data breach notifications
          and compliance requirements.
        </p>
      </div>

      <div className="space-y-4 pt-8">
        <h2 className="text-2xl font-semibold text-foreground border-b pb-2">
          Overview
        </h2>

        <p className="text-base text-foreground leading-relaxed">
          Atraiva is purpose-built for{" "}
          <strong>legal teams, compliance officers, and CISOs</strong> who need
          to:
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>Make accurate breach determination decisions</li>
          <li>Calculate precise notification deadlines</li>
          <li>Understand complex multi-jurisdictional requirements</li>
          <li>Document determinations for regulatory defense</li>
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r">
        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
          <strong className="text-base">💡 Info:</strong> Atraiva uses{" "}
          <strong>metadata-only analysis</strong> - no PII, PHI, or sensitive
          customer data is ingested into the platform.
        </p>
      </div>

      <div className="space-y-6 pt-8">
        <h2 className="text-2xl font-semibold text-foreground border-b pb-2">
          Key Features
        </h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Breach Determination Engine
          </h3>
          <p className="text-base text-foreground leading-relaxed">
            Automatically analyzes incidents against 50+ state and federal
            regulations to determine if a breach notification is required.
          </p>

          <div>
            <p className="text-base font-semibold text-foreground mb-2">
              Key Capabilities:
            </p>
            <ul className="space-y-2 list-disc list-inside text-foreground ml-4">
              <li>Statutory trigger analysis</li>
              <li>Safe harbor encryption evaluation</li>
              <li>Access vs. acquisition assessment</li>
              <li>Harm threshold analysis</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Notification Deadlines
          </h3>
          <p className="text-base text-foreground leading-relaxed">
            Calculates precise deadlines for consumer and regulator
            notifications based on applicable laws.
          </p>

          <div>
            <p className="text-base font-semibold text-foreground mb-2">
              Covers:
            </p>
            <ul className="space-y-2 list-disc list-inside text-foreground ml-4">
              <li>State notification laws (50+ jurisdictions)</li>
              <li>Federal frameworks (HIPAA, GLBA, SEC, FTC)</li>
              <li>Contractual obligations</li>
              <li>Regulatory time windows</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Contract Intelligence
          </h3>
          <p className="text-base text-foreground leading-relaxed">
            Extracts and analyzes vendor notification requirements from
            contracts.
          </p>

          <div>
            <p className="text-base font-semibold text-foreground mb-2">
              Features:
            </p>
            <ul className="space-y-2 list-disc list-inside text-foreground ml-4">
              <li>Automated clause extraction</li>
              <li>Notification timeline mapping</li>
              <li>Upstream/downstream vendor tracking</li>
              <li>Supply-web exposure analysis</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Intel Agent (RAG)
          </h3>
          <p className="text-base text-foreground leading-relaxed">
            Upload documents to enhance breach analysis with custom knowledge.
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-8">
        <h2 className="text-2xl font-semibold text-foreground border-b pb-2">
          System Requirements
        </h2>
        <ul className="space-y-2 list-disc list-inside text-foreground">
          <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
          <li>JavaScript enabled</li>
          <li>Internet connection</li>
          <li>Valid Atraiva account</li>
        </ul>
      </div>

      <div className="space-y-4 pt-8">
        <h2 className="text-2xl font-semibold text-foreground border-b pb-2">
          Getting Help
        </h2>
        <ul className="space-y-2 list-disc list-inside text-foreground">
          <li>
            📧 Email:{" "}
            <a
              href="mailto:support@atraiva.ai"
              className="text-primary hover:underline font-medium"
            >
              support@atraiva.ai
            </a>
          </li>
          <li>💬 In-app chat support</li>
          <li>
            📚{" "}
            <a
              href="/docs/support"
              className="text-primary hover:underline font-medium"
            >
              Customer Support Docs
            </a>{" "}
            (requires login)
          </li>
          <li>📞 Account manager (Enterprise plans)</li>
        </ul>
      </div>

      <div className="space-y-4 pt-8">
        <h2 className="text-2xl font-semibold text-foreground border-b pb-2">
          Next Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <a
            href="/docs/public/getting-started/quick-start"
            className="block p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all"
          >
            <h4 className="font-semibold text-lg mb-2 text-foreground">
              Quick Start Guide
            </h4>
            <p className="text-sm text-muted-foreground">
              Get up and running with Atraiva
            </p>
          </a>
          <a
            href="/docs/public/user-guide"
            className="block p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all"
          >
            <h4 className="font-semibold text-lg mb-2 text-foreground">
              User Guide
            </h4>
            <p className="text-sm text-muted-foreground">
              Detailed documentation and tutorials
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Introduction - Atraiva Documentation",
  description: "Introduction to Atraiva breach determination platform",
};
