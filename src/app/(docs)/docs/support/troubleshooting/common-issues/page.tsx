import React from "react";

export default function CommonIssues() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Common Issues &amp; Solutions
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Quick solutions to frequently encountered problems in Atraiva.
        </p>
      </div>

      {/* On This Page Navigation */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">
          On This Page
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#authentication" className="text-primary hover:underline">
              Authentication Issues
            </a>
          </li>
          <li>
            <a
              href="#incident-reporting"
              className="text-primary hover:underline"
            >
              Incident Reporting
            </a>
          </li>
          <li>
            <a href="#data-reports" className="text-primary hover:underline">
              Data &amp; Reports
            </a>
          </li>
          <li>
            <a href="#integrations" className="text-primary hover:underline">
              Integration Issues
            </a>
          </li>
          <li>
            <a href="#performance" className="text-primary hover:underline">
              Performance Issues
            </a>
          </li>
        </ul>
      </div>

      <div className="space-y-4" id="authentication">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Authentication Issues
        </h2>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Issue: Cannot Log In
        </h3>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Symptoms:</strong> Login button doesn&apos;t work, or
          redirects back to login page.
        </p>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Solutions:</strong>
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
          <li>Clear browser cache and cookies</li>
          <li>Try incognito/private browsing mode</li>
          <li>Disable browser extensions</li>
          <li>Check if third-party cookies are enabled</li>
          <li>Try a different browser</li>
        </ul>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Issue: Session Timeout
        </h3>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Symptoms:</strong> Logged out unexpectedly, frequent
          re-authentication requests.
        </p>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Solutions:</strong>
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
          <li>Check your network connection</li>
          <li>Ensure your system time is correct</li>
          <li>Contact admin if timeout is too short</li>
        </ul>
      </div>

      <div className="space-y-4" id="incident-reporting">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Incident Reporting
        </h2>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Issue: Cannot Create Incident
        </h3>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Symptoms:</strong> Form submission fails or shows validation
          errors.
        </p>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Solutions:</strong>
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
          <li>Ensure all required fields are filled</li>
          <li>Check date formats (YYYY-MM-DD)</li>
          <li>Verify affected records count is a number</li>
          <li>Ensure file uploads are under 10MB</li>
        </ul>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Issue: Breach Determination Incorrect
        </h3>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Symptoms:</strong> Determination result doesn&apos;t match
          expectations.
        </p>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Solutions:</strong>
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
          <li>Review incident metadata for accuracy</li>
          <li>Check encryption status is correctly set</li>
          <li>Verify data categories selected</li>
          <li>Ensure affected jurisdictions are correct</li>
          <li>Review determination reasoning in the report</li>
        </ul>
      </div>

      <div className="space-y-4" id="data-reports">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Data &amp; Reports
        </h2>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Issue: Reports Not Generating
        </h3>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Symptoms:</strong> Report generation hangs or fails.
        </p>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Solutions:</strong>
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
          <li>Check if data is complete for the report period</li>
          <li>Try a shorter date range</li>
          <li>Refresh the page and try again</li>
          <li>Contact support if issue persists</li>
        </ul>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Issue: Missing Data
        </h3>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Symptoms:</strong> Expected data not showing in dashboard or
          reports.
        </p>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Solutions:</strong>
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
          <li>Check date range filters</li>
          <li>Verify user permissions</li>
          <li>Check integration sync status</li>
          <li>Refresh the dashboard</li>
        </ul>
      </div>

      <div className="space-y-4" id="integrations">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Integration Issues
        </h2>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Issue: Purview Integration Not Syncing
        </h3>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Symptoms:</strong> Data classification labels not updating.
        </p>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Solutions:</strong>
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
          <li>Check integration connection status</li>
          <li>Verify API permissions in Microsoft 365</li>
          <li>Check sync schedule settings</li>
          <li>Manually trigger a sync</li>
          <li>Re-authenticate if needed</li>
        </ul>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Issue: SIEM Data Not Appearing
        </h3>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Symptoms:</strong> Security incidents not showing in Atraiva.
        </p>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Solutions:</strong>
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
          <li>Check SIEM API credentials</li>
          <li>Verify data export is configured in SIEM</li>
          <li>Check network connectivity</li>
          <li>Review integration logs</li>
        </ul>
      </div>

      <div className="space-y-4" id="performance">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Performance Issues
        </h2>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Issue: Slow Dashboard Loading
        </h3>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Solutions:</strong>
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
          <li>Check internet connection speed</li>
          <li>Clear browser cache</li>
          <li>Reduce dashboard date range</li>
          <li>Use a modern browser (Chrome, Firefox, Edge, Safari)</li>
        </ul>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Issue: File Upload Timeout
        </h3>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          <strong>Solutions:</strong>
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
          <li>Ensure file is under 10MB</li>
          <li>Check network stability</li>
          <li>Try compressing large files</li>
          <li>Upload during off-peak hours</li>
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r">
        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
          <strong className="text-base">💡 Tip:</strong> If none of these
          solutions work, contact support at{" "}
          <a href="mailto:support@atraiva.ai" className="underline font-medium">
            support@atraiva.ai
          </a>{" "}
          with a detailed description of the issue.
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Common Issues - Atraiva Support",
  description: "Solutions to frequently encountered problems",
};
