"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  User,
  Shield,
  FileText,
  Settings,
  CreditCard,
  Bell,
  GitBranch,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { AuditLog } from "@/lib/firestore/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityLogTimelineProps {
  logs: AuditLog[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const getCategoryIcon = (category: AuditLog["category"]) => {
  const iconClass = "h-5 w-5";
  switch (category) {
    case "organization":
      return <Building2 className={iconClass} />;
    case "user":
      return <User className={iconClass} />;
    case "security":
      return <Shield className={iconClass} />;
    case "compliance":
    case "breach":
      return <AlertCircle className={iconClass} />;
    case "document":
      return <FileText className={iconClass} />;
    case "settings":
      return <Settings className={iconClass} />;
    case "billing":
      return <CreditCard className={iconClass} />;
    case "notification":
      return <Bell className={iconClass} />;
    case "integration":
      return <GitBranch className={iconClass} />;
    default:
      return <Activity className={iconClass} />;
  }
};

const getSeverityColor = (severity?: AuditLog["severity"]) => {
  switch (severity) {
    case "critical":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    case "error":
      return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    case "warning":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    case "info":
    default:
      return "text-blue-500 bg-blue-500/10 border-blue-500/20";
  }
};

const getSeverityIcon = (severity?: AuditLog["severity"]) => {
  const iconClass = "h-4 w-4";
  switch (severity) {
    case "critical":
    case "error":
      return <XCircle className={iconClass} />;
    case "warning":
      return <AlertTriangle className={iconClass} />;
    case "info":
    default:
      return <CheckCircle className={iconClass} />;
  }
};

const groupLogsByDate = (logs: AuditLog[]) => {
  const grouped: Record<string, AuditLog[]> = {};

  logs.forEach((log) => {
    const dateKey = format(new Date(log.timestamp), "yyyy-MM-dd");
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(log);
  });

  return Object.entries(grouped).sort(
    ([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime()
  );
};

export function ActivityLogTimeline({
  logs,
  loading = false,
  error = null,
  onRefresh,
}: ActivityLogTimelineProps) {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const toggleExpanded = (logId: string) => {
    setExpandedLogs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const filteredLogs =
    categoryFilter === "all"
      ? logs
      : logs.filter((log) => log.category === categoryFilter);

  const groupedLogs = groupLogsByDate(filteredLogs);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center border-red-500/20 bg-red-500/5">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-semibold mb-2 text-red-500">
          Error Loading Activity
        </h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            Try Again
          </Button>
        )}
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card className="p-12 text-center border-border/50">
        <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
        <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
        <p className="text-muted-foreground">
          Activity logs will appear here as actions are performed
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="breach">Breach</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="notification">Notification</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge variant="outline" className="text-muted-foreground">
          {filteredLogs.length} {filteredLogs.length === 1 ? "event" : "events"}
        </Badge>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        <AnimatePresence>
          {groupedLogs.map(([dateKey, dayLogs]) => (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Date Header */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2 mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {format(new Date(dateKey), "EEEE, MMMM d, yyyy")}
                </h3>
              </div>

              {/* Activity Items */}
              <div className="relative pl-8 space-y-4">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />

                {dayLogs.map((log, index) => {
                  const isExpanded = expandedLogs.has(log.id);
                  const hasChanges = log.changes && log.changes.length > 0;

                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="relative"
                    >
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-8 top-3 h-7 w-7 rounded-full border-2 flex items-center justify-center ${getSeverityColor(
                          log.severity
                        )}`}
                      >
                        {getCategoryIcon(log.category)}
                      </div>

                      {/* Activity Card */}
                      <Card className="p-4 border-border/50 hover:border-border transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Description */}
                            <p className="font-medium text-foreground mb-1">
                              {log.description}
                            </p>

                            {/* Metadata */}
                            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                              <span>
                                {format(new Date(log.timestamp), "h:mm a")}
                              </span>
                              {log.userName && (
                                <>
                                  <span>•</span>
                                  <span>by {log.userName}</span>
                                </>
                              )}
                              {log.resourceName && (
                                <>
                                  <span>•</span>
                                  <span>{log.resourceName}</span>
                                </>
                              )}
                            </div>

                            {/* Changes Details */}
                            {hasChanges && isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 space-y-2"
                              >
                                {log.changes!.map((change, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-muted/50 rounded-lg p-3 text-sm"
                                  >
                                    <p className="font-medium text-foreground mb-1 capitalize">
                                      {change.field.replace(/_/g, " ")}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                          Previous
                                        </p>
                                        <p className="text-foreground">
                                          {change.oldValue !== undefined &&
                                          change.oldValue !== null
                                            ? String(change.oldValue)
                                            : "—"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                          Updated
                                        </p>
                                        <p className="text-primary font-medium">
                                          {change.newValue !== undefined &&
                                          change.newValue !== null
                                            ? String(change.newValue)
                                            : "—"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </div>

                          {/* Right Side - Badges and Expand */}
                          <div className="flex items-start gap-2">
                            <Badge
                              variant="outline"
                              className={`capitalize ${getSeverityColor(
                                log.severity
                              )}`}
                            >
                              <span className="flex items-center gap-1">
                                {getSeverityIcon(log.severity)}
                                {log.severity || "info"}
                              </span>
                            </Badge>

                            {hasChanges && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpanded(log.id)}
                                className="h-7 w-7 p-0"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
