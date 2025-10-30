"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import Link from "next/link";

// Mock data for compliance posture chart
const compliancePostureData = [
  { name: "Aligned", value: 1250, color: "#16A34A" },
  { name: "Needs Review", value: 150, color: "#FBBF24" },
  { name: "Gaps Identified", value: 15, color: "#EF4444" },
];

// Mock data for client compliance matrix
const clientComplianceData = [
  {
    id: 101,
    name: "Global Tech Inc",
    accountOwner: "John Doe",
    regulations: [
      { name: "CCPA", color: "blue" },
      { name: "PCI-DSS", color: "green" },
    ],
    alignmentScore: 95,
    lastAssessment: "2025-06-15",
  },
  {
    id: 102,
    name: "Springfield General",
    accountOwner: "Jane Smith",
    regulations: [{ name: "HIPAA", color: "red" }],
    alignmentScore: 65,
    lastAssessment: "2025-07-01",
  },
];

// Mock data for compliance tasks
const complianceTasksData = [
  {
    id: 1,
    task: "Review and Update Privacy Policy",
    client: "Global Tech Inc",
    assignedTo: "John Doe",
    dueDate: "2025-08-01",
    status: "In Progress",
    statusColor: "yellow",
  },
  {
    id: 2,
    task: "Conduct Annual Security Awareness Training",
    client: "Springfield General",
    assignedTo: "Jane Smith",
    dueDate: "2025-07-15",
    status: "Overdue",
    statusColor: "red",
    isOverdue: true,
  },
];

export default function CompliancePage() {
  const [clientFilter, setClientFilter] = useState("");

  const getStatusBadgeClass = (color: string) => {
    const classes: Record<string, string> = {
      yellow:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100",
      red: "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100",
      green:
        "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
    };
    return classes[color] || classes.green;
  };

  const getRegulationBadgeClass = (color: string) => {
    const classes: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      green:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return classes[color] || classes.blue;
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return "bg-green-600";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div
      className="p-6 space-y-8 bg-gray-100 dark:bg-gray-900"
      style={{ marginTop: "140px" }}
    >
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Compliance Management
      </h1>

      {/* 1. Compliance Dashboard / Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Compliance Posture */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Overall Compliance Posture
            </h3>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={compliancePostureData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {compliancePostureData.map((entry, index) => (
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

        {/* Compliance Task Summary */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Compliance Task Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Open Tasks
                </span>
                <span className="font-bold text-2xl text-blue-600">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  In Progress
                </span>
                <span className="font-bold text-2xl text-yellow-500">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Overdue
                </span>
                <span className="font-bold text-2xl text-red-600">8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Compliance Deadlines */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Upcoming Compliance Deadlines
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="text-sm">
                <strong className="text-yellow-500">45 days:</strong>{" "}
                Springfield General - Annual HIPAA Risk Assessment
              </li>
              <li className="text-sm">
                <strong className="text-yellow-500">60 days:</strong> Global
                Tech Inc - PCI-DSS Attestation of Compliance
              </li>
              <li className="text-sm">
                <strong>90 days:</strong> DataFlow Analytics - Annual Privacy
                Policy Review
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 2. Client Compliance Matrix */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Client Compliance Matrix
            </h2>
            <Input
              type="text"
              placeholder="Filter clients..."
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="w-full sm:w-64 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Client Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Account Owner
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Applicable Regulations
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Overall Alignment Score
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Last Assessment
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientComplianceData.map((client) => (
                  <tr
                    key={client.id}
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {client.name}
                    </td>
                    <td className="px-6 py-4">{client.accountOwner}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {client.regulations.map((reg, idx) => (
                          <Badge
                            key={idx}
                            className={`px-2 py-0.5 text-xs font-medium ${getRegulationBadgeClass(
                              reg.color
                            )}`}
                          >
                            {reg.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className={`${getProgressBarColor(
                            client.alignmentScore
                          )} h-2.5 rounded-full`}
                          style={{ width: `${client.alignmentScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {client.alignmentScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4">{client.lastAssessment}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/clients/${client.id}/compliance-profile`}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 3. Proactive Compliance Task Management */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Proactive Compliance Tasks
            </h2>
            <Button
              className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium"
              onClick={() => {
                // TODO: Open create task modal
                console.log("Create task");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Assigned To
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Evidence
                  </th>
                </tr>
              </thead>
              <tbody>
                {complianceTasksData.map((task) => (
                  <tr
                    key={task.id}
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {task.task}
                    </td>
                    <td className="px-6 py-4">{task.client}</td>
                    <td className="px-6 py-4">{task.assignedTo}</td>
                    <td
                      className={`px-6 py-4 ${
                        task.isOverdue ? "text-red-500" : ""
                      }`}
                    >
                      {task.dueDate}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`px-2 py-1 font-semibold leading-tight ${getStatusBadgeClass(
                          task.statusColor
                        )}`}
                      >
                        {task.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        {task.status === "Overdue" ? "Upload" : "View"}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
