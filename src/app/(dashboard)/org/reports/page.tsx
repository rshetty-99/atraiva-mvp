"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Sparkles,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Sample data for User Activity Log
const activityLogs = [
  {
    timestamp: "Jul 10, 2025, 11:15:02 AM",
    userId: "admin@clientcorp.com",
    action: "Ran a Purview Scan",
    sourceIp: "72.229.28.185",
    status: "success",
  },
  {
    timestamp: "Jul 10, 2025, 10:58:14 AM",
    userId: "sandra.p@clientcorp.com",
    action: "Viewed Data Exposure Matrix",
    sourceIp: "192.168.1.102",
    status: "success",
  },
  {
    timestamp: "Jul 9, 2025, 03:22:51 PM",
    userId: "admin@clientcorp.com",
    action: "Deleted user: old.user@clientcorp.com",
    sourceIp: "72.229.28.185",
    status: "success",
  },
  {
    timestamp: "Jul 9, 2025, 03:21:05 PM",
    userId: "admin@clientcorp.com",
    action: "Attempted to add user with invalid email",
    sourceIp: "72.229.28.185",
    status: "failure",
  },
  {
    timestamp: "Jul 9, 2025, 09:01:30 AM",
    userId: "sandra.p@clientcorp.com",
    action: "User logged in",
    sourceIp: "192.168.1.102",
    status: "success",
  },
];

// Sample data for Breach Impact Analysis
const breachMetrics = [
  {
    metric: "Sensitive File Exposure",
    preBreach: "45 files publicly accessible",
    postRemediation: "2 files publicly accessible",
    change: "95% Reduction",
    changeType: "good",
  },
  {
    metric: "Over-Privileged Accounts",
    preBreach: "12 Admin-level accounts",
    postRemediation: "5 Admin-level accounts",
    change: "7 Accounts Remediated",
    changeType: "good",
  },
  {
    metric: "Unclassified Sensitive Data",
    preBreach: "1,250 items",
    postRemediation: "85 items",
    change: "Data Classified",
    changeType: "good",
  },
  {
    metric: "Systems with PHI Data",
    preBreach: "3 Systems (FS-01, DB-02, EXCH)",
    postRemediation: "5 Systems (+ FS-02, ARC-01)",
    change: "2 New Systems Implicated",
    changeType: "bad",
  },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("activity");
  const [userFilter, setUserFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedIncident, setSelectedIncident] =
    useState("phishing-july-2025");

  const handleExportLog = () => {
    console.log("Exporting activity log...");
    // Implement export logic here
  };

  const handleExportBreachReport = () => {
    console.log("Exporting breach impact report...");
    // Implement export logic here
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] pb-8 px-8 pt-[160px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Reports</h1>
          <p className="text-gray-400">
            View activity logs and breach impact analysis
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-[600px] grid-cols-2 mb-8 bg-gray-800/50 border border-purple-500/20">
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/50 transition-all duration-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              User Activity Log
            </TabsTrigger>
            <TabsTrigger
              value="breach"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/50 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Breach Impact Analysis
            </TabsTrigger>
          </TabsList>

          {/* User Activity Log Tab */}
          <TabsContent value="activity" className="space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === "activity" && (
                <motion.div
                  key="activity-content"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                    opacity: { duration: 0.3 },
                  }}
                >
                  <Card className="bg-gradient-to-br from-purple-900/20 via-gray-900/50 to-gray-900/50 border-purple-500/30 backdrop-blur-sm shadow-lg shadow-purple-500/10">
                    <CardHeader>
                      <CardTitle className="text-2xl text-gray-100">
                        User Activity Log
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Track and monitor user actions and events
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Filter Bar */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-800/30 rounded-lg border border-purple-500/10">
                        <div className="space-y-2">
                          <Label
                            htmlFor="user-filter"
                            className="text-gray-300"
                          >
                            User
                          </Label>
                          <Select
                            value={userFilter}
                            onValueChange={setUserFilter}
                          >
                            <SelectTrigger
                              id="user-filter"
                              className="bg-gray-800 border-gray-700 text-gray-100"
                            >
                              <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="all">All Users</SelectItem>
                              <SelectItem value="admin">
                                admin@clientcorp.com
                              </SelectItem>
                              <SelectItem value="sandra">
                                sandra.p@clientcorp.com
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date-from" className="text-gray-300">
                            Date From
                          </Label>
                          <Input
                            id="date-from"
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-gray-100"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date-to" className="text-gray-300">
                            Date To
                          </Label>
                          <Input
                            id="date-to"
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-gray-100"
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            onClick={handleExportLog}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export Log
                          </Button>
                        </div>
                      </div>

                      {/* Activity Table */}
                      <div className="rounded-lg border border-purple-500/20 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-800/50 border-purple-500/20 hover:bg-gray-800/50">
                              <TableHead className="text-gray-300 font-semibold">
                                Timestamp
                              </TableHead>
                              <TableHead className="text-gray-300 font-semibold">
                                User ID
                              </TableHead>
                              <TableHead className="text-gray-300 font-semibold">
                                Action/Event
                              </TableHead>
                              <TableHead className="text-gray-300 font-semibold">
                                Source IP Address
                              </TableHead>
                              <TableHead className="text-gray-300 font-semibold">
                                Status
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activityLogs.map((log, index) => (
                              <TableRow
                                key={index}
                                className="border-purple-500/10 hover:bg-gray-800/30 transition-colors"
                              >
                                <TableCell className="text-gray-300">
                                  {log.timestamp}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {log.userId}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {log.action}
                                </TableCell>
                                <TableCell className="text-gray-300 font-mono text-sm">
                                  {log.sourceIp}
                                </TableCell>
                                <TableCell>
                                  {log.status === "success" ? (
                                    <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                                      Success
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-red-600/20 text-red-400 border-red-500/30">
                                      Failure
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Breach Impact Analysis Tab */}
          <TabsContent value="breach" className="space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === "breach" && (
                <motion.div
                  key="breach-content"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                    opacity: { duration: 0.3 },
                  }}
                >
                  {/* Purview Disclaimer */}
                  <Alert className="bg-blue-500/10 border-blue-500/30 mb-6">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                    <AlertDescription className="text-gray-200 ml-2">
                      <strong className="text-blue-400">
                        Powered by Microsoft Purview
                      </strong>
                      <br />
                      This report provides a comparative analysis based on data
                      from your organization&apos;s Purview scans. Insights are
                      generated by contrasting the data posture before and after
                      a reported incident.
                    </AlertDescription>
                  </Alert>

                  <Card className="bg-gradient-to-br from-purple-900/20 via-gray-900/50 to-gray-900/50 border-purple-500/30 backdrop-blur-sm shadow-lg shadow-purple-500/10">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <Label
                            htmlFor="incident-select"
                            className="text-gray-300 mb-2 block"
                          >
                            Select Incident to Analyze
                          </Label>
                          <Select
                            value={selectedIncident}
                            onValueChange={setSelectedIncident}
                          >
                            <SelectTrigger
                              id="incident-select"
                              className="bg-gray-800 border-gray-700 text-gray-100"
                            >
                              <SelectValue placeholder="Select an incident" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="phishing-july-2025">
                                July 2025 - Phishing Incident (INC-957302)
                              </SelectItem>
                              <SelectItem value="ransomware-may-2025">
                                May 2025 - Ransomware Attack (INC-882341)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={handleExportBreachReport}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export to PDF
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-xl font-semibold text-gray-100 mb-4">
                        Breach Impact & Remediation Analysis
                      </h3>

                      {/* Comparison Table */}
                      <div className="rounded-lg border border-purple-500/20 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-800/50 border-purple-500/20 hover:bg-gray-800/50">
                              <TableHead className="text-gray-300 font-semibold">
                                Metric
                              </TableHead>
                              <TableHead className="text-gray-300 font-semibold">
                                Pre-Breach State
                                <br />
                                <span className="text-xs font-normal text-gray-400">
                                  (Scan: Jun 15, 2025)
                                </span>
                              </TableHead>
                              <TableHead className="text-gray-300 font-semibold">
                                Post-Remediation State
                                <br />
                                <span className="text-xs font-normal text-gray-400">
                                  (Scan: Jul 10, 2025)
                                </span>
                              </TableHead>
                              <TableHead className="text-gray-300 font-semibold">
                                Change / Impact
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {breachMetrics.map((metric, index) => (
                              <TableRow
                                key={index}
                                className="border-purple-500/10 hover:bg-gray-800/30 transition-colors"
                              >
                                <TableCell className="text-gray-100 font-semibold">
                                  {metric.metric}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {metric.preBreach}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {metric.postRemediation}
                                </TableCell>
                                <TableCell>
                                  {metric.changeType === "good" ? (
                                    <div className="flex items-center gap-2 text-green-400 font-semibold">
                                      {metric.change.includes("Reduction") ? (
                                        <ArrowDown className="w-4 h-4" />
                                      ) : (
                                        <CheckCircle className="w-4 h-4" />
                                      )}
                                      {metric.change}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 text-red-400 font-semibold">
                                      <ArrowUp className="w-4 h-4" />
                                      {metric.change}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
