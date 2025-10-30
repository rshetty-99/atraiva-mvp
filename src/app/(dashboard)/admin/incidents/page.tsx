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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderLock, FolderPlus, ExternalLink } from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
const mockIncidents = [
  {
    id: "INC-957302",
    severity: "P0",
    deadline: "2025-07-29",
    clientName: "Global Tech Inc",
    operatingStates: "CA, NY, TX",
    reportedBy: {
      name: "Sarah Johnson (CISO)",
      email: "s.johnson@globaltech.com",
      clientId: "101",
    },
    dateOfDiscovery: "2025-07-14 09:15:22",
    dateOfReporting: "2025-07-14 10:05:00",
    breachType: "Ransomware",
    dataElements: "PII, Financial",
    assignee: "John Doe",
    actionPlanStatus: "Under Review",
    status: "Active",
    hasEvidence: true,
  },
  {
    id: "INC-957301",
    severity: "P2",
    deadline: "2025-08-09",
    clientName: "Springfield General",
    operatingStates: "MA, CT",
    reportedBy: {
      name: "Dr. Emily Carter (CIO)",
      email: "e.carter@springfield.med",
      clientId: "102",
    },
    dateOfDiscovery: "2025-07-10 14:30:00",
    dateOfReporting: "2025-07-10 14:45:10",
    breachType: "Phishing",
    dataElements: "PHI",
    assignee: "Jane Smith",
    actionPlanStatus: "Verified",
    status: "Completed",
    hasEvidence: true,
  },
  {
    id: "INC-957300",
    severity: "P1",
    deadline: "2025-07-20",
    clientName: "DataFlow Analytics",
    operatingStates: "FL",
    reportedBy: {
      name: "Mike Chen (IT Director)",
      email: "m.chen@dataflow.io",
      clientId: "103",
    },
    dateOfDiscovery: "2025-06-20 11:00:00",
    dateOfReporting: "2025-06-20 11:12:30",
    breachType: "Insider Threat",
    dataElements: "PII",
    assignee: "John Doe",
    actionPlanStatus: "Ross AI Draft",
    status: "Expired",
    hasEvidence: false,
  },
];

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { bg: string; text: string }> = {
      P0: { bg: "bg-red-600 dark:bg-red-600", text: "text-white" },
      P1: { bg: "bg-yellow-500 dark:bg-yellow-500", text: "text-white" },
      P2: { bg: "bg-blue-500 dark:bg-blue-500", text: "text-white" },
    };
    const variant = variants[severity] || variants.P2;
    return (
      <Badge
        className={`${variant.bg} ${variant.text} font-bold text-xs px-3 py-1`}
      >
        {severity}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Active: "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100",
      Completed:
        "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
      Expired: "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100",
    };
    return (
      <Badge
        className={`${
          variants[status] || variants.Active
        } font-semibold leading-tight px-2 py-1`}
      >
        {status}
      </Badge>
    );
  };

  const getActionPlanBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Under Review":
        "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100",
      Verified:
        "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
      "Ross AI Draft":
        "bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100",
    };
    return (
      <Badge
        className={`${
          variants[status] || variants["Under Review"]
        } font-semibold leading-tight px-2 py-1`}
      >
        {status}
      </Badge>
    );
  };

  const getDeadlineColor = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysUntilDeadline = Math.floor(
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilDeadline < 0) {
      return "text-gray-500 dark:text-gray-400";
    } else if (daysUntilDeadline <= 7) {
      return "text-red-600 dark:text-red-400 font-medium";
    } else {
      return "text-green-600 dark:text-green-400 font-medium";
    }
  };

  return (
    <div
      className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900"
      style={{ marginTop: "140px" }}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Incidents Queue
        </h1>
        <Button
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={() => {
            // TODO: Open create incident modal/page
            console.log("Log new incident");
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Log New Incident
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Input
              type="text"
              placeholder="Search by Client Name/ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full col-span-full sm:col-span-1 md:col-span-2 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="p0">P0 (Critical)</SelectItem>
                <SelectItem value="p1">P1 (High)</SelectItem>
                <SelectItem value="p2">P2 (Medium)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="expired">
                  Expired (Deadline Missed)
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="john_doe">John Doe</SelectItem>
                <SelectItem value="jane_smith">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              aria-label="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            <Input
              type="date"
              aria-label="To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableRow>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Incident ID
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Severity
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Deadline
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Client Name
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Operating States
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Reported by
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Date of Discovery
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Date of Reporting (TIPC)
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Breach Type
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Data Elements
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Assignee
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Action Plan Status
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Evidence
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase whitespace-nowrap">
                  Report
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockIncidents.map((incident) => (
                <TableRow
                  key={incident.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <TableCell className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">
                    <Link href={`/admin/incidents/${incident.id}`}>
                      {incident.id}
                    </Link>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {getSeverityBadge(incident.severity)}
                  </TableCell>
                  <TableCell
                    className={`px-6 py-4 whitespace-nowrap ${getDeadlineColor(
                      incident.deadline
                    )}`}
                  >
                    {incident.deadline}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {incident.clientName}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {incident.operatingStates}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <Link
                        href={`/admin/clients/${incident.reportedBy.clientId}`}
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {incident.reportedBy.name}
                      </Link>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {incident.reportedBy.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {incident.dateOfDiscovery}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {incident.dateOfReporting}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {incident.breachType}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {incident.dataElements}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {incident.assignee}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {getActionPlanBadge(incident.actionPlanStatus)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(incident.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group flex items-center justify-center">
                      <Link
                        href={`/admin/incidents/${incident.id}/evidence`}
                        className={`flex items-center justify-center ${
                          incident.hasEvidence
                            ? "text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            : "text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400"
                        }`}
                      >
                        {incident.hasEvidence ? (
                          <FolderLock className="h-5 w-5" />
                        ) : (
                          <FolderPlus className="h-5 w-5" />
                        )}
                      </Link>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {incident.hasEvidence
                          ? "View Evidence Log"
                          : "Start Evidence Log"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/incidents/${incident.id}/report`}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
