import React from "react";

export default function IncidentsAPI() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Incidents API
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Create and manage breach incidents programmatically.
        </p>
      </div>

      {/* On This Page Navigation */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">On This Page</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#list-incidents" className="text-primary hover:underline">
              List Incidents
            </a>
          </li>
          <li>
            <a href="#create-incident" className="text-primary hover:underline">
              Create Incident
            </a>
          </li>
          <li>
            <a href="#get-incident" className="text-primary hover:underline">
              Get Incident
            </a>
          </li>
          <li>
            <a href="#update-incident" className="text-primary hover:underline">
              Update Incident
            </a>
          </li>
          <li>
            <a href="#delete-incident" className="text-primary hover:underline">
              Delete Incident
            </a>
          </li>
          <li>
            <a href="#data-categories" className="text-primary hover:underline">
              Data Category Codes
            </a>
          </li>
        </ul>
      </div>

      <div className="space-y-4" id="list-incidents">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          List Incidents
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Retrieve a list of incidents for your organization.
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">GET /v1/incidents</code>
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
              <td className="border border-border p-2">Page number (default: 1)</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>per_page</code></td>
              <td className="border border-border p-2">integer</td>
              <td className="border border-border p-2">Items per page (default: 20, max: 100)</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>status</code></td>
              <td className="border border-border p-2">string</td>
              <td className="border border-border p-2">Filter by status (open, closed, investigating)</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>from_date</code></td>
              <td className="border border-border p-2">date</td>
              <td className="border border-border p-2">Filter incidents from date (YYYY-MM-DD)</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>to_date</code></td>
              <td className="border border-border p-2">date</td>
              <td className="border border-border p-2">Filter incidents to date (YYYY-MM-DD)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Example Request
        </h3>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`curl -X GET "https://api.atraiva.ai/v1/incidents?page=1&per_page=20&status=open" \\
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
  "incidents": [
    {
      "id": "inc_1234567890",
      "title": "Unauthorized Access Incident",
      "description": "Suspicious access detected",
      "status": "open",
      "severity": "high",
      "incident_date": "2024-03-15T10:30:00Z",
      "discovery_date": "2024-03-15T12:00:00Z",
      "affected_records": 1500,
      "data_categories": ["ssn", "email", "name"],
      "jurisdictions": ["CA", "NY", "TX"],
      "encryption_status": "partially_encrypted",
      "created_at": "2024-03-15T12:30:00Z",
      "updated_at": "2024-03-15T14:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 3,
    "total_count": 42
  }
}`}
          </code>
        </pre>
      </div>

      <div className="space-y-4" id="create-incident">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Create Incident
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Create a new incident for breach determination.
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">POST /v1/incidents</code>
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
              <th className="border border-border p-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border p-2"><code>title</code></td>
              <td className="border border-border p-2">string</td>
              <td className="border border-border p-2">Yes</td>
              <td className="border border-border p-2">Incident title</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>description</code></td>
              <td className="border border-border p-2">string</td>
              <td className="border border-border p-2">No</td>
              <td className="border border-border p-2">Detailed description</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>incident_date</code></td>
              <td className="border border-border p-2">datetime</td>
              <td className="border border-border p-2">Yes</td>
              <td className="border border-border p-2">When incident occurred (ISO 8601)</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>discovery_date</code></td>
              <td className="border border-border p-2">datetime</td>
              <td className="border border-border p-2">Yes</td>
              <td className="border border-border p-2">When incident was discovered</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>affected_records</code></td>
              <td className="border border-border p-2">integer</td>
              <td className="border border-border p-2">Yes</td>
              <td className="border border-border p-2">Number of records affected</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>data_categories</code></td>
              <td className="border border-border p-2">array</td>
              <td className="border border-border p-2">Yes</td>
              <td className="border border-border p-2">PII categories involved</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>jurisdictions</code></td>
              <td className="border border-border p-2">array</td>
              <td className="border border-border p-2">Yes</td>
              <td className="border border-border p-2">State/country codes</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>encryption_status</code></td>
              <td className="border border-border p-2">string</td>
              <td className="border border-border p-2">Yes</td>
              <td className="border border-border p-2">encrypted, not_encrypted, partially_encrypted</td>
            </tr>
          </tbody>
        </table>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Example Request
        </h3>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`curl -X POST "https://api.atraiva.ai/v1/incidents" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Unauthorized Database Access",
    "description": "SQL injection attack detected",
    "incident_date": "2024-03-15T10:30:00Z",
    "discovery_date": "2024-03-15T12:00:00Z",
    "affected_records": 1500,
    "data_categories": ["ssn", "email", "name", "address"],
    "jurisdictions": ["CA", "NY", "TX"],
    "encryption_status": "partially_encrypted",
    "severity": "high"
  }'`}
          </code>
        </pre>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Example Response
        </h3>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`{
  "id": "inc_1234567890",
  "title": "Unauthorized Database Access",
  "status": "open",
  "created_at": "2024-03-15T12:30:00Z",
  "determination_id": "det_9876543210"
}`}
          </code>
        </pre>
      </div>

      <div className="space-y-4" id="get-incident">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Get Incident
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Retrieve details of a specific incident.
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">GET /v1/incidents/:id</code>
        </div>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Example Request
        </h3>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`curl -X GET "https://api.atraiva.ai/v1/incidents/inc_1234567890" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
          </code>
        </pre>
      </div>

      <div className="space-y-4" id="update-incident">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Update Incident
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Update an existing incident.
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">PATCH /v1/incidents/:id</code>
        </div>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Example Request
        </h3>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`curl -X PATCH "https://api.atraiva.ai/v1/incidents/inc_1234567890" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "status": "closed",
    "notes": "Incident resolved and remediation complete"
  }'`}
          </code>
        </pre>
      </div>

      <div className="space-y-4" id="delete-incident">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Delete Incident
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Delete an incident (admin only).
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">DELETE /v1/incidents/:id</code>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-r">
          <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">
            <strong className="text-base">⚠️ Warning:</strong> Deleting an incident is permanent and
            cannot be undone. This action requires admin privileges.
          </p>
        </div>
      </div>

      <div className="space-y-4" id="data-categories">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Data Category Codes
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Valid data category codes for the <code className="bg-muted px-2 py-1 rounded">data_categories</code> field:
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-foreground">
          <li><code className="bg-muted px-2 py-1 rounded">ssn</code> - Social Security Number</li>
          <li><code className="bg-muted px-2 py-1 rounded">drivers_license</code> - Driver&apos;s License</li>
          <li><code className="bg-muted px-2 py-1 rounded">financial</code> - Financial Account Info</li>
          <li><code className="bg-muted px-2 py-1 rounded">medical</code> - Medical/Health Records</li>
          <li><code className="bg-muted px-2 py-1 rounded">biometric</code> - Biometric Data</li>
          <li><code className="bg-muted px-2 py-1 rounded">credentials</code> - Login Credentials</li>
          <li><code className="bg-muted px-2 py-1 rounded">email</code> - Email Address</li>
          <li><code className="bg-muted px-2 py-1 rounded">name</code> - Full Name</li>
          <li><code className="bg-muted px-2 py-1 rounded">address</code> - Physical Address</li>
          <li><code className="bg-muted px-2 py-1 rounded">phone</code> - Phone Number</li>
        </ul>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Incidents API - Atraiva Support",
  description: "API reference for managing incidents",
};

