"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import Link from "next/link";

// Mock data for different tabs
const adminActivityLogs = [
  {
    timestamp: "2025-07-17 10:30:15 AM",
    actor: "Alicia Stone",
    action: "Action Plan Verified",
    target: "Incident: INC-957302",
    details: "Plan for Global Tech Inc was verified.",
  },
];

const clientActivityReports = [
  {
    timestamp: "2025-07-16 10:01 AM",
    client: "Global Tech Inc",
    user: "s.johnson@globaltech.com",
    action: "Logged in",
    ipAddress: "72.229.28.185",
  },
];

const incidentReports = [
  {
    incidentId: "INC-957302",
    clientName: "Global Tech Inc",
    status: "Active",
    completionDate: "-",
  },
];

const actionPlanLogs = [
  {
    incidentId: "INC-957302",
    clientName: "Global Tech Inc",
    lastModifiedBy: "Alicia Stone",
    lastModifiedDate: "2025-07-17 10:30 AM",
  },
];

const lifecycleReports = [
  {
    clientName: "Vertex Solutions",
    event: "Onboarded",
    dateOfEvent: "2025-07-15",
  },
  {
    clientName: "Legacy Systems Co.",
    event: "Entered Grace Period",
    dateOfEvent: "2025-07-01",
  },
];

const configChangeLogs = [
  {
    timestamp: "2025-07-17 09:15:05 AM",
    actor: "John Smith",
    target: "System Settings",
    details: "Enabled 'Require 2FA for all Admins'.",
  },
  {
    timestamp: "2025-07-12 03:45:20 PM",
    actor: "Alicia Stone",
    target: "Ross AI Config",
    details: "Changed primary LLM from Model A to Model B.",
  },
];

export default function AuditsReportsPage() {
  return (
    <div
      className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900"
      style={{ marginTop: "140px" }}
    >
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Audit & Reporting Center
      </h1>

      <Tabs defaultValue="admin-log" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 dark:border-gray-700 rounded-none h-auto p-0 overflow-x-auto flex-nowrap">
          <TabsTrigger
            value="admin-log"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:bg-transparent px-4 py-3 whitespace-nowrap"
          >
            Admin Activity Logs
          </TabsTrigger>
          <TabsTrigger
            value="client-log"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:bg-transparent px-4 py-3 whitespace-nowrap"
          >
            Client Activity Reports
          </TabsTrigger>
          <TabsTrigger
            value="incident-reports"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:bg-transparent px-4 py-3 whitespace-nowrap"
          >
            Incident Reports
          </TabsTrigger>
          <TabsTrigger
            value="plan-history"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:bg-transparent px-4 py-3 whitespace-nowrap"
          >
            Action Plan Logs
          </TabsTrigger>
          <TabsTrigger
            value="lifecycle-report"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:bg-transparent px-4 py-3 whitespace-nowrap"
          >
            Client Lifecycle Report
          </TabsTrigger>
          <TabsTrigger
            value="config-log"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:bg-transparent px-4 py-3 whitespace-nowrap"
          >
            Config Change Log
          </TabsTrigger>
        </TabsList>

        {/* Admin Activity Logs */}
        <TabsContent value="admin-log">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Admin Activity Logs
                </h2>
                <Button className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Admin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alicia">Alicia Stone</SelectItem>
                    <SelectItem value="john">John Smith</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Action Type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="login">User Login</SelectItem>
                    <SelectItem value="incident_created">
                      Incident Created
                    </SelectItem>
                    <SelectItem value="plan_verified">
                      Action Plan Verified
                    </SelectItem>
                    <SelectItem value="report_exported">
                      Report Exported
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input type="text" placeholder="Filter by Target..." />
                <Input type="date" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3 text-left">Timestamp</th>
                      <th className="px-6 py-3 text-left">Actor</th>
                      <th className="px-6 py-3 text-left">Action</th>
                      <th className="px-6 py-3 text-left">Target</th>
                      <th className="px-6 py-3 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-300">
                    {adminActivityLogs.map((log, index) => (
                      <tr key={index} className="border-b dark:border-gray-700">
                        <td className="px-6 py-4">{log.timestamp}</td>
                        <td className="px-6 py-4 font-medium">{log.actor}</td>
                        <td className="px-6 py-4">{log.action}</td>
                        <td className="px-6 py-4">{log.target}</td>
                        <td className="px-6 py-4">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Client Activity Reports */}
        <TabsContent value="client-log">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Client Activity Reports
                </h2>
                <Button className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Client..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="globaltech">Global Tech Inc</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by User..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sjohnson">
                      s.johnson@globaltech.com
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Action Type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="login">Login</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3 text-left">Timestamp</th>
                      <th className="px-6 py-3 text-left">Client</th>
                      <th className="px-6 py-3 text-left">User</th>
                      <th className="px-6 py-3 text-left">Action</th>
                      <th className="px-6 py-3 text-left">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-300">
                    {clientActivityReports.map((report, index) => (
                      <tr key={index} className="border-b dark:border-gray-700">
                        <td className="px-6 py-4">{report.timestamp}</td>
                        <td className="px-6 py-4">{report.client}</td>
                        <td className="px-6 py-4">{report.user}</td>
                        <td className="px-6 py-4">{report.action}</td>
                        <td className="px-6 py-4">{report.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Incident Reports */}
        <TabsContent value="incident-reports">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Master Incident Reports
                </h2>
                <Button className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Input type="text" placeholder="Filter by Incident ID..." />
                <Input type="text" placeholder="Filter by Client Name..." />
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Account Owner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3 text-left">Incident ID</th>
                      <th className="px-6 py-3 text-left">Client Name</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Completion Date</th>
                      <th className="px-6 py-3 text-left"></th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-300">
                    {incidentReports.map((report, index) => (
                      <tr key={index} className="border-b dark:border-gray-700">
                        <td className="px-6 py-4">{report.incidentId}</td>
                        <td className="px-6 py-4">{report.clientName}</td>
                        <td className="px-6 py-4">{report.status}</td>
                        <td className="px-6 py-4">{report.completionDate}</td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/incidents/${report.incidentId}/report`}
                            className="text-blue-500 hover:underline"
                          >
                            View Report
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action Plan Logs */}
        <TabsContent value="plan-history">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Action Plan Logs
                </h2>
                <Button className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Input type="text" placeholder="Filter by Incident ID..." />
                <Input type="text" placeholder="Filter by Client Name..." />
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Account Owner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3 text-left">Incident ID</th>
                      <th className="px-6 py-3 text-left">Client Name</th>
                      <th className="px-6 py-3 text-left">Last Modified By</th>
                      <th className="px-6 py-3 text-left">
                        Last Modified Date
                      </th>
                      <th className="px-6 py-3 text-left"></th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-300">
                    {actionPlanLogs.map((log, index) => (
                      <tr key={index} className="border-b dark:border-gray-700">
                        <td className="px-6 py-4">{log.incidentId}</td>
                        <td className="px-6 py-4">{log.clientName}</td>
                        <td className="px-6 py-4">{log.lastModifiedBy}</td>
                        <td className="px-6 py-4">{log.lastModifiedDate}</td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/incidents/${log.incidentId}/action-plan-history`}
                            className="text-blue-500 hover:underline"
                          >
                            View History
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Client Lifecycle Report */}
        <TabsContent value="lifecycle-report">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Client Lifecycle Report
                </h2>
                <Button className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Event Type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="signedup">Signed Up</SelectItem>
                    <SelectItem value="integration">
                      Purview Integration Set Up
                    </SelectItem>
                    <SelectItem value="onboarded">Onboarded</SelectItem>
                    <SelectItem value="subended">Subscription Ended</SelectItem>
                    <SelectItem value="grace">Entered Grace Period</SelectItem>
                    <SelectItem value="offboarded">Offboarded</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" />
                <Input type="date" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3 text-left">Client Name</th>
                      <th className="px-6 py-3 text-left">Event</th>
                      <th className="px-6 py-3 text-left">Date of Event</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-300">
                    {lifecycleReports.map((report, index) => (
                      <tr key={index} className="border-b dark:border-gray-700">
                        <td className="px-6 py-4">{report.clientName}</td>
                        <td className="px-6 py-4">{report.event}</td>
                        <td className="px-6 py-4">{report.dateOfEvent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Change Log */}
        <TabsContent value="config-log">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Configuration Change Log
                </h2>
                <Button className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3 text-left">Timestamp</th>
                      <th className="px-6 py-3 text-left">Actor</th>
                      <th className="px-6 py-3 text-left">Target</th>
                      <th className="px-6 py-3 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-300">
                    {configChangeLogs.map((log, index) => (
                      <tr key={index} className="border-b dark:border-gray-700">
                        <td className="px-6 py-4">{log.timestamp}</td>
                        <td className="px-6 py-4 font-medium">{log.actor}</td>
                        <td className="px-6 py-4">{log.target}</td>
                        <td className="px-6 py-4">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
