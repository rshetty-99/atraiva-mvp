"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Zap,
  Server,
  FileStack,
  DollarSign,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

// Mock data for charts
const topRiskData = [
  { name: "Data Exposure", value: 125 },
  { name: "Phishing", value: 98 },
  { name: "Compliance Gaps", value: 85 },
  { name: "Ransomware", value: 60 },
  { name: "Insider Threat", value: 45 },
];

const riskTrendData = [
  { month: "Jan", score: 65 },
  { month: "Mar", score: 62 },
  { month: "May", score: 60 },
  { month: "Jul", score: 55 },
  { month: "Sep", score: 53 },
  { month: "Nov", score: 50 },
];

// Mock client exposure data
const clientExposureData = [
  {
    id: 101,
    name: "Global Tech Inc",
    dataExposure: "high",
    phishing: "medium",
    ransomware: "high",
    insiderThreat: "low",
    complianceGaps: "low",
  },
  {
    id: 102,
    name: "Springfield General",
    dataExposure: "medium",
    phishing: "high",
    ransomware: "low",
    insiderThreat: "medium",
    complianceGaps: "high",
  },
  {
    id: 103,
    name: "DataFlow Analytics",
    dataExposure: "low",
    phishing: "low",
    ransomware: "low",
    insiderThreat: "medium",
    complianceGaps: "medium",
  },
];

export default function ExposureAnalysisPage() {
  const [threatScenario, setThreatScenario] = useState("");
  const [clientGroup, setClientGroup] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);

  const getRiskClass = (risk: string) => {
    const classes: Record<string, string> = {
      low: "bg-green-600 dark:bg-green-600",
      medium: "bg-yellow-500 dark:bg-yellow-500",
      high: "bg-red-500 dark:bg-red-500",
    };
    return classes[risk] || classes.low;
  };

  const handleAnalyzeImpact = () => {
    setShowAnalysis(true);
  };

  return (
    <div
      className="p-6 space-y-8 bg-gray-100 dark:bg-gray-900"
      style={{ marginTop: "140px" }}
    >
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Strategic Exposure Analysis
      </h1>

      {/* 1. Portfolio Risk Dashboard */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Portfolio Exposure Dashboard
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Exposure Heatmap */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Client Exposure Heatmap
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase">
                    <tr>
                      <th className="py-2">Client</th>
                      <th className="py-2 text-center">Data Exposure</th>
                      <th className="py-2 text-center">Phishing</th>
                      <th className="py-2 text-center">Ransomware</th>
                      <th className="py-2 text-center">Insider Threat</th>
                      <th className="py-2 text-center">Compliance Gaps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientExposureData.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b dark:border-gray-700"
                      >
                        <td className="py-2 font-medium">
                          <Link
                            href={`/admin/clients/${client.id}/risk-profile`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {client.name}
                          </Link>
                        </td>
                        <td className="py-2">
                          <div
                            className={`w-8 h-8 rounded mx-auto ${getRiskClass(
                              client.dataExposure
                            )}`}
                            title={`${client.dataExposure} risk`}
                          ></div>
                        </td>
                        <td className="py-2">
                          <div
                            className={`w-8 h-8 rounded mx-auto ${getRiskClass(
                              client.phishing
                            )}`}
                            title={`${client.phishing} risk`}
                          ></div>
                        </td>
                        <td className="py-2">
                          <div
                            className={`w-8 h-8 rounded mx-auto ${getRiskClass(
                              client.ransomware
                            )}`}
                            title={`${client.ransomware} risk`}
                          ></div>
                        </td>
                        <td className="py-2">
                          <div
                            className={`w-8 h-8 rounded mx-auto ${getRiskClass(
                              client.insiderThreat
                            )}`}
                            title={`${client.insiderThreat} risk`}
                          ></div>
                        </td>
                        <td className="py-2">
                          <div
                            className={`w-8 h-8 rounded mx-auto ${getRiskClass(
                              client.complianceGaps
                            )}`}
                            title={`${client.complianceGaps} risk`}
                          ></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-6">
              {/* Top Exposure Vectors */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Top Exposure Vectors
                </h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topRiskData}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#374151"
                        opacity={0.3}
                      />
                      <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#9CA3AF"
                        fontSize={11}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#E5E7EB",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#3B82F6"
                        radius={[4, 4, 4, 4]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Portfolio Exposure Trend */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Portfolio Exposure Trend
                </h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={riskTrendData}
                      margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#374151"
                        opacity={0.3}
                      />
                      <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#E5E7EB",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: "#3B82F6", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Threat Modeling & Scenario Analysis */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Threat Modeling by Ross AI
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div className="w-full">
              <Label
                htmlFor="threat-scenario"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Select Threat Scenario
              </Label>
              <Select value={threatScenario} onValueChange={setThreatScenario}>
                <SelectTrigger
                  id="threat-scenario"
                  className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                >
                  <SelectValue placeholder="Choose a scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zero-day">
                    New Zero-Day Exploit (Log4j)
                  </SelectItem>
                  <SelectItem value="phishing">
                    Industry-Wide Phishing Campaign
                  </SelectItem>
                  <SelectItem value="cloud-misc">
                    Cloud Misconfiguration
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Label
                htmlFor="client-group"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Select Client or Group
              </Label>
              <Select value={clientGroup} onValueChange={setClientGroup}>
                <SelectTrigger
                  id="client-group"
                  className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                >
                  <SelectValue placeholder="Choose client group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="healthcare">
                    All Healthcare Clients
                  </SelectItem>
                  <SelectItem value="global-tech">Global Tech Inc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleAnalyzeImpact}
              className="w-full lg:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Zap className="h-5 w-5 mr-2" />
              Analyze Impact
            </Button>
          </div>

          {/* Ross AI Output */}
          {showAnalysis && (
            <div className="mt-6 border-t dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                <BrainCircuit className="h-5 w-5 mr-3 text-blue-500" />
                Ross AI: Potential Impact Report
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Most Vulnerable Assets */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-semibold flex items-center text-gray-900 dark:text-white mb-2">
                    <Server className="h-4 w-4 mr-2" />
                    Most Vulnerable Assets
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                    <li>FS-PROD-01 (Unpatched Apache)</li>
                    <li>WebApp-03 (Legacy Java App)</li>
                  </ul>
                </div>

                {/* Potential Data Exposure */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-semibold flex items-center text-gray-900 dark:text-white mb-2">
                    <FileStack className="h-4 w-4 mr-2" />
                    Potential Data Exposure
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    ~1.2 TB of PII and Customer Data
                  </p>
                </div>

                {/* Estimated Financial Impact */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-semibold flex items-center text-gray-900 dark:text-white mb-2">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Estimated Financial Impact
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    $500k - $1.5M (Fines & Recovery)
                  </p>
                </div>

                {/* Recommended Mitigating Controls */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-semibold flex items-center text-gray-900 dark:text-white mb-2">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Recommended Mitigating Controls
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                    <li>Immediately patch all public-facing servers.</li>
                    <li>Implement stricter network segmentation.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
