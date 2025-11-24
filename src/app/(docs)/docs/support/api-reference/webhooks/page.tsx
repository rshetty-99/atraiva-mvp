import React from "react";

export default function WebhooksAPI() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Webhooks
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Receive real-time notifications for events in your organization.
        </p>
      </div>

      {/* On This Page Navigation */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">On This Page</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#overview" className="text-primary hover:underline">
              Overview
            </a>
          </li>
          <li>
            <a href="#create-webhook" className="text-primary hover:underline">
              Create Webhook
            </a>
          </li>
          <li>
            <a href="#available-events" className="text-primary hover:underline">
              Available Events
            </a>
          </li>
          <li>
            <a href="#webhook-payload" className="text-primary hover:underline">
              Webhook Payload
            </a>
          </li>
          <li>
            <a href="#verifying-webhooks" className="text-primary hover:underline">
              Verifying Webhooks
            </a>
          </li>
        </ul>
      </div>

      <div className="space-y-4" id="overview">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Overview
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Webhooks allow you to receive HTTP POST notifications when events occur in Atraiva.
          This is more efficient than polling the API for changes.
        </p>
      </div>

      <div className="space-y-4" id="create-webhook">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Create Webhook
        </h2>

        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm text-foreground">POST /v1/webhooks</code>
        </div>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Request Body
        </h3>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`{
  "url": "https://your-domain.com/webhooks/atraiva",
  "events": ["incident.created", "determination.completed"],
  "secret": "your_webhook_secret"
}`}
          </code>
        </pre>
      </div>

      <div className="space-y-4" id="available-events">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Available Events
        </h2>

        <table className="w-full border-collapse border border-border text-sm text-foreground">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border p-2 text-left font-semibold">Event</th>
              <th className="border border-border p-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border p-2"><code>incident.created</code></td>
              <td className="border border-border p-2">New incident created</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>incident.updated</code></td>
              <td className="border border-border p-2">Incident updated</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>determination.completed</code></td>
              <td className="border border-border p-2">Breach determination completed</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>report.generated</code></td>
              <td className="border border-border p-2">Report generated</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4" id="webhook-payload">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Webhook Payload
        </h2>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`{
  "id": "evt_1234567890",
  "type": "incident.created",
  "created_at": "2024-03-15T12:30:00Z",
  "data": {
    "id": "inc_1234567890",
    "title": "Unauthorized Access",
    "status": "open"
  }
}`}
          </code>
        </pre>
      </div>

      <div className="space-y-4" id="verifying-webhooks">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Verifying Webhooks
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Atraiva signs webhook payloads with a signature in the <code className="bg-muted px-2 py-1 rounded">X-Atraiva-Signature</code> header.
        </p>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-foreground">
          <code>
{`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}`}
          </code>
        </pre>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-r">
        <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">
          <strong className="text-base">⚠️ Security:</strong> Always verify webhook signatures
          to ensure requests are coming from Atraiva.
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Webhooks - Atraiva Support",
  description: "Real-time event notifications via webhooks",
};

