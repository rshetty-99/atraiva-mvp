"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  BrainCircuit,
  ShieldCheck,
  ClipboardCheck,
  Database,
  CreditCard,
  Settings2,
  Brain,
  Calendar,
  Play,
  Edit,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

// Status indicator component
const StatusIndicator = ({
  status,
}: {
  status: "active" | "warning" | "error" | "inactive";
}) => {
  const colors = {
    active: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    inactive: "bg-gray-500",
  };

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full mr-2 ${colors[status]}`}
    />
  );
};

export default function IntegrationsLicensesPage() {
  return (
    <div
      className="p-6 space-y-8 bg-gray-100 dark:bg-gray-900"
      style={{ marginTop: "140px" }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          System Integrations & Licenses
        </h1>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <StatusIndicator status="active" />
            <span>23 Active Integrations</span>
          </div>
          <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Section 1: AI & Core Platform */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <BrainCircuit className="h-6 w-6 mr-3 text-purple-500" />
          AI & Core Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ross AI */}
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600 rounded-md flex items-center justify-center text-white font-bold mr-4">
                    R
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Ross AI (Custom LLM Agent)
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Legal Assistant & Regulatory Guidance
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                  Active
                </Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block font-medium text-gray-600 dark:text-gray-400">
                    Primary Model
                  </label>
                  <p className="text-gray-800 dark:text-gray-200 font-mono">
                    gpt-4-turbo-2024-04-09
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-600 dark:text-gray-400">
                    Feedback Integration
                  </label>
                  <p className="text-gray-800 dark:text-gray-200 flex items-center">
                    <StatusIndicator status="active" />
                    Human-in-the-loop validation active
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-600 dark:text-gray-400">
                    Knowledge Base Status
                  </label>
                  <p className="text-gray-800 dark:text-gray-200">
                    Last updated: 2 hours ago
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Settings2 className="h-4 w-4 mr-2" />
                  Configure Models
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Feedback Metrics
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Regulatory Scraper Agent */}
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-md flex items-center justify-center text-white font-bold mr-4">
                    S
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Regulatory Scraper Agent
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automated Regulatory Discovery
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                  Active
                </Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block font-medium text-gray-600 dark:text-gray-400">
                    Schedule
                  </label>
                  <p className="text-gray-800 dark:text-gray-200">
                    Weekly scan (Sundays 2:00 AM UTC)
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-600 dark:text-gray-400">
                    Coverage
                  </label>
                  <p className="text-gray-800 dark:text-gray-200">
                    50 states + Federal regulations
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-600 dark:text-gray-400">
                    Last Scan
                  </label>
                  <p className="text-gray-800 dark:text-gray-200 flex items-center">
                    <StatusIndicator status="active" />
                    Completed successfully 3 days ago
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Configure Schedule
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 2: Security & Incident Response */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <ShieldCheck className="h-6 w-6 mr-3 text-red-500" />
          Security & Incident Response
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Splunk SIEM */}
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center text-white font-bold mr-4">
                    SP
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Splunk SIEM
                  </h3>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                  Active
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Instance:</strong> prod.splunk.company.com
                </p>
                <p>
                  <strong>API Status:</strong>{" "}
                  <span className="text-green-600">Connected</span>
                </p>
                <p>
                  <strong>Auto Evidence Collection:</strong> Enabled
                </p>
              </div>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  className="w-full text-sm"
                  size="sm"
                >
                  Configure Playbooks
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Microsoft Sentinel */}
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold mr-4">
                    MS
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Microsoft Sentinel
                  </h3>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100">
                  Pending
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Workspace:</strong> TIPCyber-Workspace
                </p>
                <p>
                  <strong>Auth Status:</strong>{" "}
                  <span className="text-yellow-600">Pending Setup</span>
                </p>
                <p>
                  <strong>Incident Sync:</strong> Not configured
                </p>
              </div>
              <div className="mt-4">
                <Button
                  className="w-full text-sm bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  Complete Setup
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Phantom SOAR */}
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold mr-4">
                    PH
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Phantom SOAR
                  </h3>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                  Active
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Server:</strong> phantom.company.local
                </p>
                <p>
                  <strong>Playbooks:</strong> 12 active
                </p>
                <p>
                  <strong>Auto Containment:</strong> Enabled
                </p>
              </div>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  className="w-full text-sm"
                  size="sm"
                >
                  Manage Playbooks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 3: Compliance & GRC Tools */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <ClipboardCheck className="h-6 w-6 mr-3 text-blue-500" />
          Compliance & GRC Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ServiceNow GRC */}
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-lime-500 rounded-md flex items-center justify-center text-white font-bold mr-4">
                    SN
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    ServiceNow GRC
                  </h3>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                  Active
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Instance:</strong> company.service-now.com
                </p>
                <p>
                  <strong>Risk Sync:</strong>{" "}
                  <span className="text-green-600">Bidirectional</span>
                </p>
                <p>
                  <strong>Control Mapping:</strong> Automated
                </p>
              </div>
            </CardContent>
          </Card>

          {/* OneTrust */}
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-900 rounded-md flex items-center justify-center text-white font-bold mr-4">
                    OT
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    OneTrust
                  </h3>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                  Active
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Privacy Management:</strong> Connected
                </p>
                <p>
                  <strong>Data Discovery:</strong>{" "}
                  <span className="text-green-600">Enabled</span>
                </p>
                <p>
                  <strong>Breach Assessment:</strong> Automated
                </p>
              </div>
            </CardContent>
          </Card>

          {/* RSA Archer */}
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-600 rounded-md flex items-center justify-center text-white font-bold mr-4">
                    RSA
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    RSA Archer
                  </h3>
                </div>
                <Badge className="bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100">
                  Inactive
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Risk Registry:</strong>{" "}
                  <span className="text-gray-500">Not connected</span>
                </p>
                <p>
                  <strong>Control Framework:</strong> Pending
                </p>
                <p>
                  <strong>Incident Workflow:</strong> Disabled
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 4: Regulatory Data Sources */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <Database className="h-6 w-6 mr-3 text-indigo-500" />
          Regulatory Data Sources
        </h2>
        <Card className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Data Source
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Coverage
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Last Update
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    Federal Register API
                  </td>
                  <td className="px-6 py-4">Government API</td>
                  <td className="px-6 py-4">Federal Regulations</td>
                  <td className="px-6 py-4">2 hours ago</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                      Active
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 dark:text-blue-500 hover:underline">
                      Configure
                    </button>
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    California AG Office
                  </td>
                  <td className="px-6 py-4">Web Scraper</td>
                  <td className="px-6 py-4">CA Data Breach Laws</td>
                  <td className="px-6 py-4">1 day ago</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                      Active
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 dark:text-blue-500 hover:underline">
                      View Data
                    </button>
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    NIST Cybersecurity Framework
                  </td>
                  <td className="px-6 py-4">Standards Body</td>
                  <td className="px-6 py-4">Cybersecurity Controls</td>
                  <td className="px-6 py-4">3 days ago</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                      Active
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 dark:text-blue-500 hover:underline">
                      Sync Now
                    </button>
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    Thomson Reuters Regulatory Intelligence
                  </td>
                  <td className="px-6 py-4">Premium Service</td>
                  <td className="px-6 py-4">Global Regulatory Changes</td>
                  <td className="px-6 py-4">12 hours ago</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100">
                      Limited
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-yellow-600 dark:text-yellow-500 hover:underline">
                      Upgrade License
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Section 5: Business & Payment Systems */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <CreditCard className="h-6 w-6 mr-3 text-green-500" />
          Business & Payment Systems
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stripe */}
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold mr-4">
                    S
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Stripe
                  </h3>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                  Active
                </Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block font-medium text-gray-600 dark:text-gray-400">
                    Mode
                  </label>
                  <p className="text-gray-800 dark:text-gray-200 font-mono">
                    Production
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-600 dark:text-gray-400">
                    Webhook Status
                  </label>
                  <p className="text-gray-800 dark:text-gray-200 flex items-center">
                    <StatusIndicator status="active" />
                    Receiving events
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Manage Keys
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tableau Embedded */}
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-600 rounded-md flex items-center justify-center text-white font-bold mr-4">
                    T
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Tableau Embedded
                  </h3>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100">
                  Expires Soon
                </Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block font-medium text-gray-600 dark:text-gray-400">
                    License Tier
                  </label>
                  <p className="text-gray-800 dark:text-gray-200">Enterprise</p>
                </div>
                <div>
                  <label className="block font-medium text-gray-600 dark:text-gray-400">
                    Expiration
                  </label>
                  <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                    2025-09-15
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renew License
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
