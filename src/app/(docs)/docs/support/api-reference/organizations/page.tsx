import React from "react";

export default function OrganizationsAPI() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Organizations API
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Manage organization data and settings.
        </p>
      </div>

      {/* On This Page Navigation */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">On This Page</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#get-organization" className="text-primary hover:underline">
              Get Organization
            </a>
          </li>
          <li>
            <a href="#update-organization" className="text-primary hover:underline">
              Update Organization
            </a>
          </li>
          <li>
            <a href="#list-members" className="text-primary hover:underline">
              List Team Members
            </a>
          </li>
        </ul>
      </div>

      <div className="space-y-4" id="get-organization">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Get Organization
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Retrieve organization details.
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">GET /v1/organizations/:id</code>
        </div>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Example Response
        </h3>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`{
  "id": "org_1234567890",
  "name": "Acme Corporation",
  "type": "enterprise",
  "industry": "technology",
  "size": "large",
  "plan": "enterprise",
  "status": "active",
  "settings": {
    "default_jurisdiction": "CA",
    "auto_determination": true
  },
  "created_at": "2024-01-01T00:00:00Z"
}`}
          </code>
        </pre>
      </div>

      <div className="space-y-4" id="update-organization">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Update Organization
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Update organization settings.
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">PATCH /v1/organizations/:id</code>
        </div>
      </div>

      <div className="space-y-4" id="list-members">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          List Team Members
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Retrieve all team members.
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">GET /v1/organizations/:id/members</code>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Organizations API - Atraiva Support",
  description: "API reference for organization management",
};

