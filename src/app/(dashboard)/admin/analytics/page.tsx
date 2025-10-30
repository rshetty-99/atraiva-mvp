"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Timer, Skull } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data for charts
const totalClientsData = Array.from({ length: 24 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - (23 - i));
  const clientCounts = [
    210, 250, 300, 360, 420, 480, 550, 610, 680, 740, 800, 850, 910, 960, 1010,
    1060, 1110, 1160, 1210, 1260, 1310, 1350, 1380, 1415,
  ];
  return {
    month: d.toLocaleString("default", { month: "short", year: "2-digit" }),
    clients: clientCounts[i],
  };
});

const incidentsByTypeData = [
  { name: "Ransomware", value: 45, color: "#EF4444" },
  { name: "Phishing", value: 30, color: "#F97316" },
  { name: "Insider Threat", value: 10, color: "#A855F7" },
  { name: "Data Exposure", value: 10, color: "#EAB308" },
  { name: "Other", value: 5, color: "#6B7280" },
];

const exposureTrendData = [
  { quarter: "Q1 '24", score: 75 },
  { quarter: "Q2 '24", score: 68 },
  { quarter: "Q3 '24", score: 62 },
  { quarter: "Q4 '24", score: 55 },
  { quarter: "Q1 '25", score: 48 },
  { quarter: "Q2 '25", score: 41 },
];

const clientsBySizeData = [
  { name: "Enterprise (>500)", value: 25, color: "#3B82F6" },
  { name: "Medium (50-499)", value: 45, color: "#14B8A6" },
  { name: "Small (<50)", value: 30, color: "#8B5CF6" },
];

const clientsByTenureData = [
  { tenure: "< 1 Year", clients: 620, color: "#60A5FA" },
  { tenure: "1-3 Years", clients: 550, color: "#34D399" },
  { tenure: "3+ Years", clients: 245, color: "#C084FC" },
];

export default function AnalyticsPage() {
  return (
    <div
      className="p-6 space-y-8 bg-gray-100 dark:bg-gray-900"
      style={{ marginTop: "140px" }}
    >
      {/* Section 1: Platform Growth & Health */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Platform Growth & Health
        </h2>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Incidents Managed
                </p>
                <p className="text-4xl font-bold text-gray-800 dark:text-white">
                  4,821
                </p>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded-full">
                <ShieldCheck className="h-7 w-7 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Avg. Time to Resolution
                </p>
                <p className="text-4xl font-bold text-gray-800 dark:text-white">
                  4.2 Days
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                <Timer className="h-7 w-7 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Most Common Breach Type
                </p>
                <p className="text-4xl font-bold text-gray-800 dark:text-white">
                  Ransomware
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                <Skull className="h-7 w-7 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Total Clients Over Time Chart */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Total Clients Over Time (24 Months)
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={totalClientsData}>
                  <defs>
                    <linearGradient
                      id="colorClients"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
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
                    dataKey="clients"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#colorClients)"
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Threat & Exposure Intelligence */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Threat & Exposure Intelligence
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incidents by Type */}
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Incidents by Type
              </h3>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incidentsByTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {incidentsByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "12px",
                        color: "#9CA3AF",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Exposure Trend */}
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Portfolio Exposure Trend
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={exposureTrendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#374151"
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="quarter"
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[30, 80]}
                    />
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
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: "#10B981", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 3: Operational Efficiency (Ross AI) */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Operational Efficiency (Ross AI)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Action Plans Generated by AI
              </p>
              <p className="text-6xl font-bold text-blue-600 dark:text-blue-400 my-4">
                12,500+
              </p>
              <p className="text-xs text-gray-500">Since platform launch</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Avg Time to Verified Plan
              </p>
              <p className="text-6xl font-bold text-blue-600 dark:text-blue-400 my-4">
                35 <span className="text-3xl">min</span>
              </p>
              <p className="text-xs text-gray-500">
                From AI draft to client-ready
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">
                AI Suggestion Accuracy
              </h3>
              <div className="space-y-4 mt-8">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-green-700 dark:text-green-400">
                      Kept by Human Team
                    </span>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      92%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-yellow-700 dark:text-yellow-400">
                      Edited by Human Team
                    </span>
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      6%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                    <div
                      className="bg-yellow-400 h-4 rounded-full"
                      style={{ width: "6%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-red-700 dark:text-red-400">
                      Deleted by Human Team
                    </span>
                    <span className="text-sm font-medium text-red-700 dark:text-red-400">
                      2%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                    <div
                      className="bg-red-500 h-4 rounded-full"
                      style={{ width: "2%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 4: Client Demographics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Client Demographics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clients by Size */}
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Clients by Size
              </h3>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clientsBySizeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {clientsBySizeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "12px",
                        color: "#9CA3AF",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Clients by Tenure */}
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Clients by Tenure
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientsByTenureData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#374151"
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="tenure"
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#E5E7EB",
                      }}
                    />
                    <Bar dataKey="clients" radius={[4, 4, 0, 0]} barSize={60}>
                      {clientsByTenureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
