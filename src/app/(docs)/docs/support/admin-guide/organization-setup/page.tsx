import React from "react";

export default function OrganizationSetup() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Organization Setup
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Complete guide to configuring your organization settings, compliance
          frameworks, and integrations in Atraiva.
        </p>
      </div>

      {/* On This Page Navigation */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">
          On This Page
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#initial-setup" className="text-primary hover:underline">
              Initial Setup
            </a>
          </li>
          <li>
            <a
              href="#organization-information"
              className="text-primary hover:underline"
            >
              Organization Information
            </a>
          </li>
          <li>
            <a
              href="#breach-notification"
              className="text-primary hover:underline"
            >
              Breach Notification Settings
            </a>
          </li>
          <li>
            <a href="#compliance" className="text-primary hover:underline">
              Compliance Settings
            </a>
          </li>
          <li>
            <a
              href="#data-classification"
              className="text-primary hover:underline"
            >
              Data Classification
            </a>
          </li>
          <li>
            <a href="#integrations" className="text-primary hover:underline">
              Integrations
            </a>
          </li>
          <li>
            <a
              href="#notification-templates"
              className="text-primary hover:underline"
            >
              Notification Templates
            </a>
          </li>
          <li>
            <a href="#best-practices" className="text-primary hover:underline">
              Best Practices
            </a>
          </li>
        </ul>
      </div>

      {/* Initial Setup */}
      <div className="space-y-6" id="initial-setup">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Initial Setup
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Organization Profile
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Start by creating your organization profile. This information will
            be used across the platform and in generated reports.
          </p>

          <div className="space-y-3">
            <p className="text-sm sm:text-base font-medium text-foreground">
              Setup Steps:
            </p>
            <ol className="space-y-2 list-decimal list-inside text-sm sm:text-base text-foreground ml-4">
              <li>
                Navigate to <strong>Settings</strong> →{" "}
                <strong>Organization</strong>
              </li>
              <li>
                Fill in the required fields:
                <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                  <li>
                    <strong>Organization name</strong> - Legal entity name
                  </li>
                  <li>
                    <strong>Organization type</strong> - Enterprise, Law Firm,
                    or Channel Partner
                  </li>
                  <li>
                    <strong>Industry</strong> - Healthcare, Financial,
                    Technology, etc.
                  </li>
                  <li>
                    <strong>Company size</strong> - Number of employees
                  </li>
                  <li>
                    <strong>Primary contact</strong> - Main point of contact
                    information
                  </li>
                </ul>
              </li>
              <li>
                Upload your organization logo
                <span className="text-muted-foreground text-sm ml-2">
                  (Recommended: 500x500px PNG with transparent background)
                </span>
              </li>
              <li>
                Click <strong>Save Changes</strong> to complete setup
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r">
            <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 font-semibold mb-2">
              💡 Pro Tip
            </p>
            <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 leading-relaxed">
              Your organization profile is visible to all team members and
              appears in breach notification documents. Ensure all information
              is accurate and up-to-date.
            </p>
          </div>
        </div>
      </div>

      {/* Organization Information */}
      <div className="space-y-6" id="organization-information">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Organization Information
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Business Address
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Configure your primary business address. This information is used
            for regulatory compliance and appears on official breach
            notifications.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">
                📍 Physical Address
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Street address (line 1 and 2)</li>
                <li>City, State/Province</li>
                <li>ZIP/Postal code</li>
                <li>Country</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">
                📧 Contact Information
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Primary phone number</li>
                <li>Support email address</li>
                <li>Website URL</li>
                <li>Emergency contact</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-4 sm:p-6">
            <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 leading-relaxed">
              <strong>Important:</strong> This address will appear on generated
              reports, compliance documents, and consumer breach notifications.
              Ensure it matches your official business registration.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Breach Response Team
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Designate key contacts for your breach response team.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                👨‍⚖️ Legal Counsel
              </h4>
              <p className="text-xs text-muted-foreground">
                Primary legal contact for breach determinations
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                🔒 CISO/Security Lead
              </h4>
              <p className="text-xs text-muted-foreground">
                Security incident response coordinator
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                🎯 Compliance Officer
              </h4>
              <p className="text-xs text-muted-foreground">
                Regulatory compliance and notification oversight
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                📣 Communications Lead
              </h4>
              <p className="text-xs text-muted-foreground">
                Public relations and media coordination
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breach Notification Settings */}
      <div className="space-y-6" id="breach-notification">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Breach Notification Settings
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Default Notification Thresholds
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Configure organization-wide defaults for breach notification
            triggers. These settings help automate determination decisions.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Setting
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Description
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Default Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    Risk Threshold
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Minimum risk level to trigger notification workflow
                  </td>
                  <td className="p-3 text-foreground">Medium</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    Affected Records
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Minimum number of records to trigger notification
                  </td>
                  <td className="p-3 text-foreground">1</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    Data Categories
                  </td>
                  <td className="p-3 text-muted-foreground">
                    PII categories that trigger notifications
                  </td>
                  <td className="p-3 text-foreground">
                    All sensitive categories
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    Encryption Override
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Apply safe harbor for encrypted data
                  </td>
                  <td className="p-3 text-foreground">Yes</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    Auto-Notification
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Automatically send notifications when triggered
                  </td>
                  <td className="p-3 text-foreground">No (Manual review)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-r">
            <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300 font-semibold mb-2">
              ⚠️ Important Consideration
            </p>
            <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300 leading-relaxed">
              While Atraiva can automate notification workflows, we recommend
              manual review by legal counsel before sending any consumer or
              regulator notifications. Enable auto-notification only after
              establishing mature processes.
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Settings */}
      <div className="space-y-6" id="compliance">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Compliance Settings
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Regulatory Frameworks
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Select all applicable regulatory frameworks for your organization.
            Atraiva uses these to determine notification requirements and
            timelines.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h4 className="font-semibold text-foreground">HIPAA</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Healthcare and medical records
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h4 className="font-semibold text-foreground">GLBA</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Financial services and banking
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h4 className="font-semibold text-foreground">GDPR</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                European Union data protection
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <h4 className="font-semibold text-foreground">CCPA/CPRA</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                California privacy laws
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <h4 className="font-semibold text-foreground">State Laws</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                50+ state breach notification laws
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <h4 className="font-semibold text-foreground">SEC/FTC</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Public companies & consumer protection
              </p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 sm:p-6 rounded-r">
            <p className="text-sm sm:text-base text-red-700 dark:text-red-300 font-semibold mb-2">
              🚨 Critical Requirement
            </p>
            <p className="text-sm sm:text-base text-red-700 dark:text-red-300 leading-relaxed">
              You must select <strong>all applicable frameworks</strong> for
              your organization. Missing frameworks may result in incomplete
              breach determinations, missed notification requirements, and
              potential regulatory penalties.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Jurisdictional Coverage
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Specify which U.S. states and international jurisdictions your
            organization operates in or maintains residents from.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">
                🇺🇸 United States
              </h4>
              <p className="text-xs text-muted-foreground">
                Select all states where you have customers, employees, or
                operations
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">
                🌍 International
              </h4>
              <p className="text-xs text-muted-foreground">
                EU member states, UK, Canada, and other jurisdictions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Classification */}
      <div className="space-y-6" id="data-classification">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Data Classification
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            PII Categories
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Define which categories of personally identifiable information (PII)
            your organization collects, processes, or stores.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                name: "Social Security Numbers",
                icon: "🆔",
                risk: "Critical",
              },
              { name: "Driver's License Numbers", icon: "🚗", risk: "High" },
              {
                name: "Financial Account Information",
                icon: "💳",
                risk: "Critical",
              },
              { name: "Medical Records (PHI)", icon: "🏥", risk: "Critical" },
              { name: "Biometric Data", icon: "👤", risk: "High" },
              { name: "Login Credentials", icon: "🔐", risk: "High" },
              { name: "Email Addresses", icon: "📧", risk: "Medium" },
              { name: "Phone Numbers", icon: "📱", risk: "Medium" },
              { name: "Physical Addresses", icon: "📍", risk: "Medium" },
              { name: "Date of Birth", icon: "🎂", risk: "Medium" },
              {
                name: "Passport/ID Numbers",
                icon: "✈️",
                risk: "Critical",
              },
              { name: "Tax Identification", icon: "💰", risk: "Critical" },
            ].map((category) => (
              <div
                key={category.name}
                className="border border-border rounded-lg p-3 space-y-1 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{category.icon}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      category.risk === "Critical"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        : category.risk === "High"
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {category.risk}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground">
                  {category.name}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-4 sm:p-6">
            <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 leading-relaxed">
              <strong>Note:</strong> Selecting accurate data categories ensures
              proper breach determination. Categories marked as{" "}
              <strong>&quot;Critical&quot;</strong> typically trigger more
              stringent notification requirements across multiple jurisdictions.
            </p>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="space-y-6" id="integrations">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Integrations
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Data Classification Tools
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Connect Atraiva to your data classification and protection tools for
            automated metadata ingestion.
          </p>

          <div className="border border-border rounded-lg p-4 sm:p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">☁️</span>
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-foreground">
                  Microsoft Purview
                </h4>
                <p className="text-sm text-muted-foreground">
                  Connect Microsoft Purview for automated data classification
                  and label ingestion.
                </p>
                <ol className="text-sm text-foreground space-y-1 ml-4 list-decimal">
                  <li>
                    Navigate to <strong>Settings</strong> →{" "}
                    <strong>Integrations</strong>
                  </li>
                  <li>
                    Click <strong>Connect Microsoft Purview</strong>
                  </li>
                  <li>Authenticate with your Microsoft 365 admin account</li>
                  <li>Grant required permissions (read-only)</li>
                  <li>
                    Configure sync schedule (recommended:{" "}
                    <strong>hourly</strong>)
                  </li>
                  <li>Verify initial data sync completes successfully</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Security Monitoring (SIEM/XDR)
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Connect your security information and event management (SIEM) or
            extended detection and response (XDR) tools for incident metadata
            ingestion.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: "Splunk", icon: "📊", status: "Supported" },
              { name: "CrowdStrike Falcon", icon: "🦅", status: "Supported" },
              { name: "Microsoft Sentinel", icon: "🛡️", status: "Supported" },
              {
                name: "Palo Alto Cortex XDR",
                icon: "🔥",
                status: "Supported",
              },
              { name: "Rapid7 InsightIDR", icon: "🎯", status: "Supported" },
              { name: "SentinelOne", icon: "🤖", status: "Beta" },
            ].map((tool) => (
              <div
                key={tool.name}
                className="border border-border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{tool.icon}</span>
                    <h4 className="font-semibold text-foreground text-sm">
                      {tool.name}
                    </h4>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    {tool.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
            <p className="text-sm sm:text-base text-foreground mb-2">
              <strong>Integration Note:</strong>
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Atraiva only ingests incident metadata (alert type, timestamp,
              affected assets) from SIEM/XDR tools. No PII, log data, or
              sensitive information is transferred to Atraiva.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Templates */}
      <div className="space-y-6" id="notification-templates">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Notification Templates
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Customize Notification Templates
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Customize breach notification templates for different audiences.
            Templates support dynamic variables that auto-populate from incident
            data.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                👥 Consumer Notification
              </h4>
              <p className="text-xs text-muted-foreground">
                Template for affected individuals and consumers
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                🏛️ Regulator Notification
              </h4>
              <p className="text-xs text-muted-foreground">
                Template for state AGs, OCR, FTC, and other regulators
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                🤝 Business Partner Notification
              </h4>
              <p className="text-xs text-muted-foreground">
                Template for vendors, partners, and third parties
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                📰 Media Statement
              </h4>
              <p className="text-xs text-muted-foreground">
                Public statement template for press releases
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
            Available Template Variables
          </h3>

          <p className="text-sm text-foreground">
            Templates support the following dynamic variables:
          </p>

          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs sm:text-sm font-mono text-foreground">
              {`{{organization_name}}        - Your organization's legal name
{{incident_date}}            - Date of incident occurrence
{{discovery_date}}           - Date incident was discovered
{{data_categories}}          - Types of data involved
{{affected_count}}           - Number of affected individuals
{{jurisdictions}}            - Affected states/countries
{{notification_deadline}}    - Legal deadline for notification
{{contact_info}}             - Organization contact information
{{credit_monitoring_offer}}  - Credit monitoring service details
{{incident_description}}     - Summary of what happened
{{remediation_steps}}        - Steps taken to address incident`}
            </pre>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-4 sm:p-6">
            <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 leading-relaxed">
              <strong>Best Practice:</strong> Have your legal counsel review and
              approve all templates before using them in production. Templates
              should comply with applicable state and federal notification
              content requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6" id="best-practices">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Best Practices
        </h2>

        <div className="grid gap-4">
          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Complete Initial Setup Thoroughly
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Take time to accurately fill in all organization profile fields.
              Incomplete information can delay breach response and notification
              processes.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Review Compliance Settings Quarterly
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Regulatory frameworks evolve. Review and update your selected
              frameworks and jurisdictions every quarter to ensure continued
              compliance.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Test Notification Templates
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Test notification templates with sample data before an actual
              breach occurs. Verify all variables populate correctly and content
              meets legal requirements.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Configure Integrations Early
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Set up Microsoft Purview and SIEM/XDR integrations during initial
              deployment. Historical data classification improves breach
              determination accuracy.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Designate Breach Response Team
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Clearly identify and assign breach response team members (legal,
              CISO, compliance, communications). Ensure contact information is
              always current.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Document Configuration Decisions
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Maintain internal documentation explaining why specific
              thresholds, frameworks, and settings were chosen. This aids audits
              and knowledge transfer.
            </p>
          </div>
        </div>
      </div>

      {/* Need Help */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Need Help with Organization Setup?
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Our support team and account managers are here to help you configure
          your organization for optimal breach determination and notification
          workflows.
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <p className="text-sm font-medium text-foreground">
                Email Support
              </p>
              <a
                href="mailto:support@atraiva.ai"
                className="text-sm text-primary hover:underline"
              >
                support@atraiva.ai
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-sm font-medium text-foreground">Live Chat</p>
              <p className="text-sm text-muted-foreground">
                Available in-app during business hours
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">📞</span>
            <div>
              <p className="text-sm font-medium text-foreground">
                Enterprise Support Line
              </p>
              <p className="text-sm text-muted-foreground">
                See your account details for dedicated support number
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Organization Setup - Atraiva Support",
  description:
    "Complete guide to configuring your organization settings, compliance frameworks, and integrations in Atraiva",
};
