import React from "react";

export default function ErrorCodes() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Error Code Reference
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Comprehensive reference for Atraiva error codes and their solutions.
        </p>
      </div>

      {/* On This Page Navigation */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">
          On This Page
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="#authentication-errors"
              className="text-primary hover:underline"
            >
              Authentication Errors (1000-1999)
            </a>
          </li>
          <li>
            <a
              href="#permission-errors"
              className="text-primary hover:underline"
            >
              Permission Errors (2000-2999)
            </a>
          </li>
          <li>
            <a
              href="#validation-errors"
              className="text-primary hover:underline"
            >
              Data Validation Errors (3000-3999)
            </a>
          </li>
          <li>
            <a
              href="#integration-errors"
              className="text-primary hover:underline"
            >
              Integration Errors (4000-4999)
            </a>
          </li>
          <li>
            <a href="#system-errors" className="text-primary hover:underline">
              System Errors (5000-5999)
            </a>
          </li>
        </ul>
      </div>

      <div className="space-y-4" id="authentication-errors">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Authentication Errors (1000-1999)
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 1001: Unauthorized Access
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> User session expired or invalid
              authentication token
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Log out and log back in. Clear browser
              cache if issue persists.
            </p>
          </div>

          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 1002: Invalid Credentials
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Incorrect email or password
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Verify credentials. Use password reset
              if needed.
            </p>
          </div>

          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 1003: Account Locked
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Multiple failed login attempts
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Wait 15 minutes or contact
              administrator to unlock.
            </p>
          </div>

          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 1004: MFA Required
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Multi-factor authentication is required
              but not provided
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Complete MFA verification using your
              authenticator app.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4" id="permission-errors">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Permission Errors (2000-2999)
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 2001: Insufficient Permissions
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> User role doesn&apos;t have access to
              requested resource
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Contact your organization administrator
              to request elevated permissions.
            </p>
          </div>

          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 2002: Organization Access Denied
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> User is not a member of the requested
              organization
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Verify you&apos;re accessing the
              correct organization or request access.
            </p>
          </div>

          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 2003: Feature Not Available
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Feature requires higher plan tier
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Upgrade your plan or contact sales.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4" id="validation-errors">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Data Validation Errors (3000-3999)
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 3001: Invalid Input
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Form data doesn&apos;t meet validation
              requirements
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Review error messages on form fields
              and correct invalid data.
            </p>
          </div>

          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 3002: Required Field Missing
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Required form field is empty
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Fill in all required fields (marked
              with *).
            </p>
          </div>

          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 3003: Invalid Date Format
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Date is not in the expected format
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Use format YYYY-MM-DD (e.g.,
              2024-03-15).
            </p>
          </div>

          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 3004: File Too Large
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Uploaded file exceeds size limit
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Compress file or split into multiple
              smaller files (max 10MB per file).
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4" id="integration-errors">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Integration Errors (4000-4999)
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 4001: Integration Connection Failed
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Cannot connect to integrated service
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Check integration credentials and
              re-authenticate if needed.
            </p>
          </div>

          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 4002: Sync Failed
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Data synchronization failed
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Check integration logs and retry sync.
              Contact support if issue persists.
            </p>
          </div>

          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 4003: API Rate Limit Exceeded
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Too many API requests in short period
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Wait a few minutes and try again.
              Consider reducing sync frequency.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4" id="system-errors">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          System Errors (5000-5999)
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 5001: Internal Server Error
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Unexpected server error
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Refresh the page and try again. Contact
              support if issue persists.
            </p>
          </div>

          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 5002: Service Unavailable
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Service is temporarily down for
              maintenance
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Check status page at status.atraiva.ai
              or wait for maintenance to complete.
            </p>
          </div>

          <div>
            <h3 className="scroll-m-20 text-lg font-semibold text-foreground">
              Error 5003: Timeout
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              <strong>Cause:</strong> Request took too long to complete
            </p>
            <p className="text-sm sm:text-base text-foreground mt-2">
              <strong>Solution:</strong> Check network connection and try again.
              Reduce data range if querying large datasets.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 sm:p-6 rounded-r">
        <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
          <strong className="text-base">🚨 Critical Error?</strong> If you
          encounter error codes not listed here or persistent errors, contact
          support immediately at{" "}
          <a href="mailto:support@atraiva.ai" className="underline font-medium">
            support@atraiva.ai
          </a>{" "}
          with the error code and a screenshot.
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Error Codes - Atraiva Support",
  description: "Reference guide for Atraiva error codes",
};
