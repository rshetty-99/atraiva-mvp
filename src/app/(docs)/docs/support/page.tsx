import React from "react";

export default function SupportDocsHome() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Customer Support Documentation
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Welcome to the Atraiva customer support documentation. This section
          contains detailed guides for administrators and advanced users.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r">
        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
          <strong className="text-base">ℹ️ Note:</strong> This documentation is
          only accessible to authenticated users with valid Atraiva accounts.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Admin Resources
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <a
            href="/docs/support/admin-guide/user-management"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              User Management
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage team members
            </p>
          </a>
          <a
            href="/docs/support/admin-guide/organization-setup"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Organization Setup
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Configure your org
            </p>
          </a>
          <a
            href="/docs/support/admin-guide/permissions"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Permissions
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Role-based access
            </p>
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Technical Resources
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <a
            href="/docs/support/troubleshooting/common-issues"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Common Issues
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Troubleshooting guide
            </p>
          </a>
          <a
            href="/docs/support/troubleshooting/error-codes"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Error Codes
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Error reference
            </p>
          </a>
          <a
            href="/docs/support/api-reference/authentication"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              API Authentication
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              API integration
            </p>
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          What&apos;s New
        </h2>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Latest Updates
        </h3>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>
            <strong>Role-Based Access Control</strong>: Enhanced permission
            management
          </li>
          <li>
            <strong>Intel Agent (RAG)</strong>: Upload custom documents for
            breach analysis
          </li>
          <li>
            <strong>Breach Data</strong>: View and analyze breach statistics
          </li>
          <li>
            <strong>Supply-Web Mapping</strong>: Track vendor exposure
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Quick Access
        </h2>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Common Tasks
        </h3>
        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>
            <a
              href="/docs/support/admin-guide/user-management#adding-users"
              className="text-primary hover:underline"
            >
              Add team members
            </a>
          </li>
          <li>
            <a
              href="/docs/support/admin-guide/organization-setup"
              className="text-primary hover:underline"
            >
              Configure organization settings
            </a>
          </li>
          <li>
            <a
              href="/docs/support/troubleshooting/common-issues#authentication"
              className="text-primary hover:underline"
            >
              Troubleshoot login issues
            </a>
          </li>
          <li>
            <a
              href="/docs/support/api-reference/authentication"
              className="text-primary hover:underline"
            >
              API integration
            </a>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Need Additional Help?
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Contact your account manager or reach out to our support team:
        </p>
        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>
            📧{" "}
            <a
              href="mailto:support@atraiva.ai"
              className="text-primary hover:underline"
            >
              support@atraiva.ai
            </a>
          </li>
          <li>💬 In-app chat support</li>
          <li>📞 Enterprise support line (see your account details)</li>
        </ul>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Support Documentation - Atraiva",
  description: "Customer support documentation for Atraiva users",
};
