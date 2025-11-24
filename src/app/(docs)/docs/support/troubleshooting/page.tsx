import React from "react";

export default function Troubleshooting() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Troubleshooting
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Find solutions to common issues and understand error codes.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Help Resources
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <a
            href="/docs/support/troubleshooting/common-issues"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Common Issues
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Quick solutions to frequently encountered problems
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
              Reference guide for error codes
            </p>
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Quick Diagnostic Steps
        </h2>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Before Contacting Support
        </h3>

        <ol className="space-y-2 list-decimal list-inside text-sm sm:text-base text-foreground">
          <li>Check the <a href="/docs/support/troubleshooting/common-issues" className="text-primary hover:underline">Common Issues</a> page</li>
          <li>Clear your browser cache and cookies</li>
          <li>Try using an incognito/private browsing window</li>
          <li>Verify your internet connection is stable</li>
          <li>Check if the issue occurs in a different browser</li>
          <li>Note any error codes or messages you see</li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Common Problem Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              🔐 Authentication
            </h3>
            <ul className="space-y-1 list-disc list-inside text-sm text-foreground ml-4">
              <li>Cannot log in</li>
              <li>Session timeout</li>
              <li>MFA issues</li>
              <li>Password reset</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              📊 Data &amp; Reports
            </h3>
            <ul className="space-y-1 list-disc list-inside text-sm text-foreground ml-4">
              <li>Missing data</li>
              <li>Report generation</li>
              <li>Export issues</li>
              <li>Dashboard not loading</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              🔌 Integrations
            </h3>
            <ul className="space-y-1 list-disc list-inside text-sm text-foreground ml-4">
              <li>Purview sync failed</li>
              <li>SIEM connection</li>
              <li>API errors</li>
              <li>Webhook delivery</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              ⚡ Performance
            </h3>
            <ul className="space-y-1 list-disc list-inside text-sm text-foreground ml-4">
              <li>Slow loading</li>
              <li>Timeout errors</li>
              <li>Upload failures</li>
              <li>Browser compatibility</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          System Requirements
        </h2>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Supported Browsers
        </h3>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>Google Chrome (latest version)</li>
          <li>Mozilla Firefox (latest version)</li>
          <li>Microsoft Edge (latest version)</li>
          <li>Safari (latest version)</li>
        </ul>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Required Browser Settings
        </h3>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>JavaScript must be enabled</li>
          <li>Cookies must be enabled (especially third-party cookies)</li>
          <li>Pop-up blocker should allow atraiva.ai</li>
          <li>Minimum screen resolution: 1024x768</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Getting Additional Help
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          If you can&apos;t find a solution in the documentation:
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>
            📧 Email support:{" "}
            <a
              href="mailto:support@atraiva.ai"
              className="text-primary hover:underline font-medium"
            >
              support@atraiva.ai
            </a>
          </li>
          <li>💬 Use the in-app chat support (bottom right corner)</li>
          <li>📞 Call your account manager (Enterprise plans)</li>
          <li>
            🎫 Submit a support ticket via{" "}
            <a href="/org/support" className="text-primary hover:underline font-medium">
              Support Portal
            </a>
          </li>
        </ul>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          What to Include in Your Support Request
        </h3>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>Clear description of the issue</li>
          <li>Steps to reproduce the problem</li>
          <li>Error codes or messages (screenshot if possible)</li>
          <li>Browser and version you&apos;re using</li>
          <li>When the issue started occurring</li>
          <li>Any recent changes to your setup</li>
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r">
        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
          <strong className="text-base">💡 Pro Tip:</strong> Screenshots and screen recordings are incredibly
          helpful for our support team to diagnose issues quickly!
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Troubleshooting - Atraiva Support",
  description: "Solutions to common issues and error codes",
};

