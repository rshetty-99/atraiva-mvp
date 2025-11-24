import React from "react";

export default function DeterminationsAPI() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Determinations API
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Retrieve breach determination results and analysis.
        </p>
      </div>

      {/* On This Page Navigation */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">On This Page</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#get-determination" className="text-primary hover:underline">
              Get Determination
            </a>
          </li>
          <li>
            <a href="#list-determinations" className="text-primary hover:underline">
              List Determinations
            </a>
          </li>
          <li>
            <a href="#determination-types" className="text-primary hover:underline">
              Determination Types
            </a>
          </li>
        </ul>
      </div>

      <div className="space-y-4" id="get-determination">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Get Determination
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Retrieve the breach determination for a specific incident.
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">GET /v1/determinations/:id</code>
        </div>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Example Request
        </h3>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`curl -X GET "https://api.atraiva.ai/v1/determinations/det_9876543210" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
          </code>
        </pre>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Example Response
        </h3>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`{
  "id": "det_9876543210",
  "incident_id": "inc_1234567890",
  "determination": "notification_required",
  "confidence": "high",
  "reasoning": "Incident meets statutory triggers for CA, NY, TX",
  "jurisdictions": {
    "CA": {
      "notification_required": true,
      "triggers": ["unauthorized_access", "pii_exposure"],
      "deadline": "2024-03-19T23:59:59Z",
      "notification_types": ["consumer", "attorney_general"]
    },
    "NY": {
      "notification_required": true,
      "triggers": ["unauthorized_acquisition"],
      "deadline": "2024-03-16T23:59:59Z",
      "notification_types": ["consumer", "attorney_general", "credit_bureaus"]
    }
  },
  "safe_harbor_applicable": false,
  "recommended_actions": [
    "Notify affected consumers within 48 hours",
    "File notification with state attorneys general",
    "Consider credit monitoring services"
  ],
  "created_at": "2024-03-15T12:35:00Z"
}`}
          </code>
        </pre>
      </div>

      <div className="space-y-4" id="list-determinations">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          List Determinations
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Retrieve all determinations for your organization.
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">GET /v1/determinations</code>
        </div>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Query Parameters
        </h3>

        <table className="w-full border-collapse border border-border text-sm text-foreground">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border p-2 text-left font-semibold">Parameter</th>
              <th className="border border-border p-2 text-left font-semibold">Type</th>
              <th className="border border-border p-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border p-2"><code>page</code></td>
              <td className="border border-border p-2">integer</td>
              <td className="border border-border p-2">Page number</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>per_page</code></td>
              <td className="border border-border p-2">integer</td>
              <td className="border border-border p-2">Items per page</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>determination</code></td>
              <td className="border border-border p-2">string</td>
              <td className="border border-border p-2">Filter by determination type</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4" id="determination-types">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Determination Types
        </h2>

        <table className="w-full border-collapse border border-border text-sm text-foreground">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border p-2 text-left font-semibold">Type</th>
              <th className="border border-border p-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border p-2"><code>notification_required</code></td>
              <td className="border border-border p-2">Breach notification is required</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>notification_not_required</code></td>
              <td className="border border-border p-2">No notification required</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>safe_harbor_applies</code></td>
              <td className="border border-border p-2">Safe harbor exception applies</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>risk_assessment_needed</code></td>
              <td className="border border-border p-2">Further risk assessment required</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Determinations API - Atraiva Support",
  description: "API reference for breach determinations",
};

