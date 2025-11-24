import React from "react";

export default function ReportsAPI() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Reports API
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Generate and download compliance reports.
        </p>
      </div>

      {/* On This Page Navigation */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">On This Page</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#generate-report" className="text-primary hover:underline">
              Generate Report
            </a>
          </li>
          <li>
            <a href="#download-report" className="text-primary hover:underline">
              Download Report
            </a>
          </li>
          <li>
            <a href="#report-types" className="text-primary hover:underline">
              Report Types
            </a>
          </li>
        </ul>
      </div>

      <div className="space-y-4" id="generate-report">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Generate Report
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Generate a new compliance report.
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">POST /v1/reports</code>
        </div>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Request Body
        </h3>

        <table className="w-full border-collapse border border-border text-sm text-foreground">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border p-2 text-left font-semibold">Field</th>
              <th className="border border-border p-2 text-left font-semibold">Type</th>
              <th className="border border-border p-2 text-left font-semibold">Required</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border p-2"><code>incident_id</code></td>
              <td className="border border-border p-2">string</td>
              <td className="border border-border p-2">Yes</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>report_type</code></td>
              <td className="border border-border p-2">string</td>
              <td className="border border-border p-2">Yes</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>format</code></td>
              <td className="border border-border p-2">string</td>
              <td className="border border-border p-2">No</td>
            </tr>
          </tbody>
        </table>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Example Request
        </h3>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`curl -X POST "https://api.atraiva.ai/v1/reports" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "incident_id": "inc_1234567890",
    "report_type": "determination",
    "format": "pdf"
  }'`}
          </code>
        </pre>
      </div>

      <div className="space-y-4" id="download-report">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Download Report
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Download a generated report.
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">GET /v1/reports/:id/download</code>
        </div>
      </div>

      <div className="space-y-4" id="report-types">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Report Types
        </h2>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li><code className="bg-muted px-2 py-1 rounded">determination</code> - Breach determination report</li>
          <li><code className="bg-muted px-2 py-1 rounded">compliance</code> - Compliance summary</li>
          <li><code className="bg-muted px-2 py-1 rounded">notification</code> - Notification template</li>
          <li><code className="bg-muted px-2 py-1 rounded">regulator</code> - Regulator submission package</li>
        </ul>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Reports API - Atraiva Support",
  description: "API reference for compliance reports",
};

