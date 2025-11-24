import React from "react";

export default function APIAuthentication() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          API Authentication
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Complete guide to authenticating and securely integrating with the
          Atraiva API.
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
              href="#getting-started"
              className="text-primary hover:underline"
            >
              Getting Started
            </a>
          </li>
          <li>
            <a
              href="#authentication-methods"
              className="text-primary hover:underline"
            >
              Authentication Methods
            </a>
          </li>
          <li>
            <a href="#base-url" className="text-primary hover:underline">
              Base URL & Endpoints
            </a>
          </li>
          <li>
            <a href="#error-handling" className="text-primary hover:underline">
              Error Handling
            </a>
          </li>
          <li>
            <a href="#rate-limits" className="text-primary hover:underline">
              Rate Limits
            </a>
          </li>
          <li>
            <a href="#best-practices" className="text-primary hover:underline">
              Best Practices
            </a>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r">
        <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 font-semibold mb-2">
          ℹ️ Enterprise Feature
        </p>
        <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 leading-relaxed">
          API access requires an <strong>Enterprise plan</strong>. Contact your
          account manager to enable API access for your organization.
        </p>
      </div>

      {/* Getting Started */}
      <div className="space-y-6" id="getting-started">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Getting Started
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Generate API Key
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Before making API calls, you need to generate an API key from your
            Atraiva dashboard.
          </p>

          <div className="space-y-3">
            <p className="text-sm sm:text-base font-medium text-foreground">
              Steps to Generate API Key:
            </p>
            <ol className="space-y-2 list-decimal list-inside text-sm sm:text-base text-foreground ml-4">
              <li>
                Navigate to <strong>Settings</strong> → <strong>API Keys</strong>
              </li>
              <li>
                Click <strong>Generate New API Key</strong>
              </li>
              <li>
                Enter a descriptive name (e.g., &quot;Production
                Integration&quot;, &quot;CI/CD Pipeline&quot;)
              </li>
              <li>
                Select appropriate permissions for the key:
                <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                  <li>
                    <strong>Read</strong> - View incidents and reports
                  </li>
                  <li>
                    <strong>Write</strong> - Create and update incidents
                  </li>
                  <li>
                    <strong>Delete</strong> - Remove incidents (use with
                    caution)
                  </li>
                </ul>
              </li>
              <li>
                Click <strong>Create</strong> to generate the key
              </li>
              <li>
                <strong>Important:</strong> Copy and securely store the API key
                (shown only once)
              </li>
            </ol>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-r">
            <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300 font-semibold mb-2">
              ⚠️ Security Warning
            </p>
            <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300 leading-relaxed">
              <strong>Never commit API keys to version control</strong> or share
              them publicly. Store keys securely in environment variables or a
              secrets manager. If a key is compromised, revoke it immediately
              and generate a new one.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Managing API Keys
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                🔑 Create Keys
              </h4>
              <p className="text-xs text-muted-foreground">
                Generate multiple keys for different environments and services
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                🔄 Rotate Keys
              </h4>
              <p className="text-xs text-muted-foreground">
                Regularly rotate keys (recommended: quarterly) for security
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                🚫 Revoke Keys
              </h4>
              <p className="text-xs text-muted-foreground">
                Immediately revoke compromised or unused keys
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Methods */}
      <div className="space-y-6" id="authentication-methods">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Authentication Methods
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Bearer Token Authentication
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Atraiva uses Bearer token authentication. Include your API key in
            the <code className="bg-muted px-2 py-1 rounded">Authorization</code>{" "}
            header of every API request.
          </p>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Header Format:</p>
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs sm:text-sm font-mono text-foreground">
                {`Authorization: Bearer YOUR_API_KEY`}
              </pre>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Example Request
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Here&apos;s a complete example using cURL to fetch incidents:
          </p>

          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs sm:text-sm font-mono text-foreground">
              {`curl -X GET https://api.atraiva.ai/v1/incidents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Language-Specific Examples
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                JavaScript / Node.js
              </h4>
              <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm font-mono text-foreground">
                  {`const axios = require('axios');

const apiKey = process.env.ATRAIVA_API_KEY;

axios.get('https://api.atraiva.ai/v1/incidents', {
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Python
              </h4>
              <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm font-mono text-foreground">
                  {`import os
import requests

api_key = os.getenv('ATRAIVA_API_KEY')
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.atraiva.ai/v1/incidents',
    headers=headers
)

print(response.json())`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                PHP
              </h4>
              <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm font-mono text-foreground">
                  {`<?php
$apiKey = getenv('ATRAIVA_API_KEY');

$ch = curl_init('https://api.atraiva.ai/v1/incidents');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

echo $response;`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Base URL */}
      <div className="space-y-6" id="base-url">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Base URL & Endpoints
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            API Base URL
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            All API requests should be made to the following base URL:
          </p>

          <div className="bg-muted rounded-lg p-4">
            <code className="text-sm sm:text-base text-foreground font-semibold">
              https://api.atraiva.ai/v1
            </code>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-4 sm:p-6">
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
              <strong>Note:</strong> All requests must use{" "}
              <strong>HTTPS</strong>. HTTP requests are not supported and will
              be rejected.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Available Endpoints
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Quick reference of available API endpoints:
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Resource
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Endpoint
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Methods
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">Incidents</td>
                  <td className="p-3">
                    <code className="text-xs">/incidents</code>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    GET, POST, PUT, DELETE
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Manage breach incidents
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    Determinations
                  </td>
                  <td className="p-3">
                    <code className="text-xs">/determinations</code>
                  </td>
                  <td className="p-3 text-muted-foreground">GET</td>
                  <td className="p-3 text-muted-foreground">
                    Retrieve breach determinations
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">Reports</td>
                  <td className="p-3">
                    <code className="text-xs">/reports</code>
                  </td>
                  <td className="p-3 text-muted-foreground">GET, POST</td>
                  <td className="p-3 text-muted-foreground">
                    Generate and download reports
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    Organizations
                  </td>
                  <td className="p-3">
                    <code className="text-xs">/organizations</code>
                  </td>
                  <td className="p-3 text-muted-foreground">GET, PUT</td>
                  <td className="p-3 text-muted-foreground">
                    View and update organization settings
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">Webhooks</td>
                  <td className="p-3">
                    <code className="text-xs">/webhooks</code>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    GET, POST, PUT, DELETE
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Configure webhook subscriptions
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Click on each resource in the sidebar to view detailed documentation
            for specific endpoints, parameters, and examples.
          </p>
        </div>
      </div>

      {/* Error Handling */}
      <div className="space-y-6" id="error-handling">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Error Handling
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            HTTP Status Codes
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            The Atraiva API uses conventional HTTP response codes to indicate
            success or failure:
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Code
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Status
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      200
                    </span>
                  </td>
                  <td className="p-3 font-medium text-foreground">OK</td>
                  <td className="p-3 text-muted-foreground">
                    Request succeeded
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      201
                    </span>
                  </td>
                  <td className="p-3 font-medium text-foreground">Created</td>
                  <td className="p-3 text-muted-foreground">
                    Resource successfully created
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      400
                    </span>
                  </td>
                  <td className="p-3 font-medium text-foreground">
                    Bad Request
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Invalid input or malformed request
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      401
                    </span>
                  </td>
                  <td className="p-3 font-medium text-foreground">
                    Unauthorized
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Invalid or missing API key
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      403
                    </span>
                  </td>
                  <td className="p-3 font-medium text-foreground">Forbidden</td>
                  <td className="p-3 text-muted-foreground">
                    Insufficient permissions for this resource
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      404
                    </span>
                  </td>
                  <td className="p-3 font-medium text-foreground">Not Found</td>
                  <td className="p-3 text-muted-foreground">
                    Resource does not exist
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                      429
                    </span>
                  </td>
                  <td className="p-3 font-medium text-foreground">
                    Too Many Requests
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Rate limit exceeded
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      500
                    </span>
                  </td>
                  <td className="p-3 font-medium text-foreground">
                    Internal Server Error
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Something went wrong on our end
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Error Response Format
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            All error responses follow a consistent JSON format:
          </p>

          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs sm:text-sm font-mono text-foreground">
              {`{
  "error": {
    "code": "INVALID_INPUT",
    "message": "The 'incidentDate' field is required",
    "details": {
      "field": "incidentDate",
      "issue": "missing_required_field"
    }
  }
}`}
            </pre>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Error Object Fields:
            </p>
            <ul className="space-y-2 text-sm text-foreground ml-4 list-disc">
              <li>
                <code className="bg-muted px-2 py-0.5 rounded">code</code> - A
                machine-readable error code
              </li>
              <li>
                <code className="bg-muted px-2 py-0.5 rounded">message</code> - A
                human-readable error message
              </li>
              <li>
                <code className="bg-muted px-2 py-0.5 rounded">details</code> -
                Additional context about the error (optional)
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Common Error Codes
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <code className="text-xs bg-muted px-2 py-1 rounded font-semibold text-foreground">
                INVALID_API_KEY
              </code>
              <p className="text-xs text-muted-foreground">
                The provided API key is invalid or has been revoked
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <code className="text-xs bg-muted px-2 py-1 rounded font-semibold text-foreground">
                INVALID_INPUT
              </code>
              <p className="text-xs text-muted-foreground">
                Request body contains invalid or malformed data
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <code className="text-xs bg-muted px-2 py-1 rounded font-semibold text-foreground">
                RATE_LIMIT_EXCEEDED
              </code>
              <p className="text-xs text-muted-foreground">
                You have exceeded your plan&apos;s rate limit
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <code className="text-xs bg-muted px-2 py-1 rounded font-semibold text-foreground">
                RESOURCE_NOT_FOUND
              </code>
              <p className="text-xs text-muted-foreground">
                The requested resource does not exist
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <code className="text-xs bg-muted px-2 py-1 rounded font-semibold text-foreground">
                INSUFFICIENT_PERMISSIONS
              </code>
              <p className="text-xs text-muted-foreground">
                Your API key lacks permissions for this operation
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <code className="text-xs bg-muted px-2 py-1 rounded font-semibold text-foreground">
                SERVER_ERROR
              </code>
              <p className="text-xs text-muted-foreground">
                An unexpected server error occurred
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="space-y-6" id="rate-limits">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Rate Limits
        </h2>

        <div className="space-y-4">
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            To ensure fair usage and platform stability, API requests are rate
            limited based on your plan tier.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Plan Tier
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Requests/Hour
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Burst Limit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    Enterprise
                  </td>
                  <td className="p-3 text-foreground">1,000</td>
                  <td className="p-3 text-muted-foreground">100/minute</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    Enterprise Plus
                  </td>
                  <td className="p-3 text-foreground">5,000</td>
                  <td className="p-3 text-muted-foreground">250/minute</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">Custom</td>
                  <td className="p-3 text-foreground">Custom</td>
                  <td className="p-3 text-muted-foreground">
                    Contact sales for custom limits
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Rate Limit Headers
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Every API response includes headers to help you track your rate limit
            status:
          </p>

          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <code className="text-xs sm:text-sm text-foreground">
                X-RateLimit-Limit
              </code>
              <span className="text-xs text-muted-foreground">
                Total requests allowed per hour
              </span>
            </div>
            <div className="flex justify-between items-center">
              <code className="text-xs sm:text-sm text-foreground">
                X-RateLimit-Remaining
              </code>
              <span className="text-xs text-muted-foreground">
                Requests remaining in current window
              </span>
            </div>
            <div className="flex justify-between items-center">
              <code className="text-xs sm:text-sm text-foreground">
                X-RateLimit-Reset
              </code>
              <span className="text-xs text-muted-foreground">
                Unix timestamp when limit resets
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Handling Rate Limits
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            When you exceed your rate limit, the API returns a{" "}
            <code className="bg-muted px-2 py-0.5 rounded">429</code> status code.
            Implement exponential backoff to handle rate limit errors gracefully:
          </p>

          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs sm:text-sm font-mono text-foreground">
              {`// Example: Exponential backoff with retry
async function makeRequestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    
    if (response.status !== 429) {
      return response;
    }
    
    // Wait before retrying: 2^i * 1000ms
    const delay = Math.pow(2, i) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  throw new Error('Max retries exceeded');
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6" id="best-practices">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Best Practices
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Follow these best practices to build secure, reliable, and efficient
          integrations with the Atraiva API.
        </p>

        <div className="grid gap-4">
          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Always Use HTTPS
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All API requests must use HTTPS. Never send API keys or sensitive
              data over unencrypted connections.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Store API Keys Securely
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use environment variables or a secrets manager (AWS Secrets Manager,
              HashiCorp Vault, etc.) to store API keys. Never hardcode keys in
              your application.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Implement Exponential Backoff
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When encountering rate limits or temporary errors, implement
              exponential backoff with jitter to avoid overwhelming the API.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Monitor Rate Limit Headers
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track the <code className="bg-muted px-1 py-0.5 rounded text-xs">
                X-RateLimit-*
              </code>{" "}
              headers to proactively manage your request rate and avoid hitting
              limits.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Rotate API Keys Regularly
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Rotate your API keys quarterly as a security best practice. Generate
              a new key before revoking the old one to avoid downtime.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Use Separate Keys for Environments
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Generate separate API keys for development, staging, and production
              environments. This isolates testing from production data.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Validate Responses
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Always validate API responses and handle errors gracefully. Don&apos;t
              assume requests will always succeed.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Log API Interactions
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Log API requests and responses (excluding sensitive data) for
              debugging and audit purposes. Include request IDs for tracing.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Set Reasonable Timeouts
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Configure appropriate timeout values (recommended: 30 seconds) to
              prevent hanging requests from blocking your application.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Use Pagination Efficiently
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When fetching large datasets, use pagination parameters to retrieve
              data in manageable chunks rather than requesting everything at once.
            </p>
          </div>
        </div>
      </div>

      {/* Need Help */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Need API Integration Support?
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Our API support team is here to help you integrate Atraiva into your
          systems and workflows.
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <p className="text-sm font-medium text-foreground">
                API Support Team
              </p>
              <a
                href="mailto:api-support@atraiva.ai"
                className="text-sm text-primary hover:underline"
              >
                api-support@atraiva.ai
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <p className="text-sm font-medium text-foreground">
                Full API Documentation
              </p>
              <a
                href="https://api-docs.atraiva.ai"
                className="text-sm text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                api-docs.atraiva.ai
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-sm font-medium text-foreground">
                Live Support
              </p>
              <p className="text-sm text-muted-foreground">
                Available in-app during business hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "API Authentication - Atraiva Support",
  description:
    "Complete guide to authenticating and securely integrating with the Atraiva API",
};
