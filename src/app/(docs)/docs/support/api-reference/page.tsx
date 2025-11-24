import React from "react";

export default function APIReference() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          API Reference
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Complete reference for integrating with the Atraiva API.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r">
        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
          <strong className="text-base">ℹ️ Note:</strong> API access requires an Enterprise plan.
          Contact your account manager at{" "}
          <a
            href="mailto:sales@atraiva.ai"
            className="underline font-medium"
          >
            sales@atraiva.ai
          </a>{" "}
          to enable API access.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Getting Started
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          The Atraiva API allows you to programmatically interact with the platform to:
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>Create and manage breach incidents</li>
          <li>Retrieve breach determinations</li>
          <li>Download compliance reports</li>
          <li>Manage organization data</li>
          <li>Query regulatory requirements</li>
          <li>Access breach statistics</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          API Documentation Sections
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <a
            href="/docs/support/api-reference/authentication"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Authentication
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Learn how to authenticate API requests
            </p>
          </a>

          <a
            href="/docs/support/api-reference/incidents"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Incidents API
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Create and manage incidents
            </p>
          </a>

          <a
            href="/docs/support/api-reference/determinations"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Determinations API
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Retrieve breach determinations
            </p>
          </a>

          <a
            href="/docs/support/api-reference/reports"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Reports API
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Download compliance reports
            </p>
          </a>

          <a
            href="/docs/support/api-reference/organizations"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Organizations API
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage organization data
            </p>
          </a>

          <a
            href="/docs/support/api-reference/webhooks"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Webhooks
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Real-time event notifications
            </p>
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Quick Start
        </h2>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          1. Generate API Key
        </h3>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Navigate to <strong>Settings</strong> → <strong>API Keys</strong> and generate a new API key.
        </p>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          2. Make Your First Request
        </h3>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`curl -X GET https://api.atraiva.ai/v1/incidents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
          </code>
        </pre>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          3. Handle the Response
        </h3>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`{
  "incidents": [
    {
      "id": "inc_1234567890",
      "title": "Unauthorized Access Incident",
      "status": "open",
      "created_at": "2024-03-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 42
  }
}`}
          </code>
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Base URL
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          All API requests should be made to:
        </p>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>https://api.atraiva.ai/v1</code>
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          SDK Libraries
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Official SDK libraries are available for:
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>
            <strong>Python</strong>:{" "}
            <code className="bg-muted px-2 py-1 rounded">pip install atraiva-sdk</code>
          </li>
          <li>
            <strong>Node.js</strong>:{" "}
            <code className="bg-muted px-2 py-1 rounded">npm install @atraiva/sdk</code>
          </li>
          <li>
            <strong>Java</strong>: Available via Maven Central
          </li>
          <li>
            <strong>.NET</strong>: Available via NuGet
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Rate Limits
        </h2>

        <table className="w-full border-collapse border border-border text-sm text-foreground">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border p-2 text-left font-semibold">Plan</th>
              <th className="border border-border p-2 text-left font-semibold">Requests/Hour</th>
              <th className="border border-border p-2 text-left font-semibold">Burst Limit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border p-2">Enterprise</td>
              <td className="border border-border p-2">1,000</td>
              <td className="border border-border p-2">100/min</td>
            </tr>
            <tr>
              <td className="border border-border p-2">Enterprise Plus</td>
              <td className="border border-border p-2">5,000</td>
              <td className="border border-border p-2">500/min</td>
            </tr>
            <tr>
              <td className="border border-border p-2">Custom</td>
              <td className="border border-border p-2">Custom</td>
              <td className="border border-border p-2">Custom</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Support
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          For API integration support:
        </p>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>
            📧 Email:{" "}
            <a
              href="mailto:api-support@atraiva.ai"
              className="text-primary hover:underline"
            >
              api-support@atraiva.ai
            </a>
          </li>
          <li>
            📚 Interactive API Explorer:{" "}
            <a
              href="https://api-explorer.atraiva.ai"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              api-explorer.atraiva.ai
            </a>
          </li>
          <li>
            📖 OpenAPI Spec:{" "}
            <a
              href="https://api.atraiva.ai/openapi.json"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download OpenAPI 3.0 Spec
            </a>
          </li>
          <li>💬 In-app chat support</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Best Practices
        </h2>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>✅ Use HTTPS for all API requests</li>
          <li>✅ Store API keys securely in environment variables</li>
          <li>✅ Implement exponential backoff for retries</li>
          <li>✅ Monitor rate limit headers in responses</li>
          <li>✅ Use webhooks for real-time updates instead of polling</li>
          <li>✅ Cache responses when appropriate</li>
          <li>✅ Handle errors gracefully</li>
          <li>✅ Rotate API keys quarterly</li>
        </ul>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-r">
        <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">
          <strong className="text-base">⚠️ Security:</strong> Never expose API keys in client-side
          code, version control, or public repositories. Always use server-side implementations.
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "API Reference - Atraiva Support",
  description: "Complete reference for the Atraiva API",
};

