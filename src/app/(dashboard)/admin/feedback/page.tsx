"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  MessageSquare,
  Filter,
  Download,
  Eye,
  Loader2,
  AlertCircle,
  ArrowUpDown,
  Send,
} from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Feedback, FeedbackType, FeedbackStatus } from "@/types/feedback";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Safe date formatting helper
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return "N/A";
    
    try {
      // Handle Firestore Timestamp
      if (dateValue?.toDate && typeof dateValue.toDate === "function") {
        return format(dateValue.toDate(), "MMM dd, yyyy");
      }
      
      // Handle ISO string or Date object
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    filterFeedbackList();
  }, [feedbacks, searchTerm, filterType, filterStatus]);

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);

      if (!db) {
        throw new Error("Firebase is not configured");
      }

      const feedbacksRef = collection(db, "feedback");
      const q = query(feedbacksRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedFeedbacks: Feedback[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as Feedback;
      });

      setFeedbacks(fetchedFeedbacks);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to fetch feedback", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterFeedbackList = () => {
    let filtered = [...feedbacks];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (fb) =>
          fb.title.toLowerCase().includes(search) ||
          fb.description.toLowerCase().includes(search) ||
          fb.userEmail.toLowerCase().includes(search) ||
          fb.userName.toLowerCase().includes(search) ||
          fb.category?.toLowerCase().includes(search)
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((fb) => fb.type === filterType);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((fb) => fb.status === filterStatus);
    }

    setFilteredFeedbacks(filtered);
  };

  const getTypeBadge = (type: FeedbackType) => {
    const config = {
      bug: { label: "🐛 Bug", className: "bg-red-500/10 text-red-500 border-red-500/20" },
      feature: { label: "✨ Feature", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
      improvement: { label: "💡 Improvement", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
      general: { label: "💬 General", className: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
    };

    const { label, className } = config[type];
    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    );
  };

  const getStatusBadge = (status: FeedbackStatus) => {
    const config = {
      new: { className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
      in_progress: { className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
      resolved: { className: "bg-green-500/10 text-green-500 border-green-500/20" },
      closed: { className: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
    };

    return (
      <Badge variant="outline" className={config[status].className}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Type",
      "Status",
      "Title",
      "Description",
      "User",
      "Email",
      "Organization",
      "Category",
      "Page",
      "Source",
      "Created At",
    ];

    const csvData = filteredFeedbacks.map((fb) => [
      fb.id,
      fb.type,
      fb.status,
      fb.title,
      fb.description,
      fb.userName,
      fb.userEmail,
      fb.organizationName || "",
      fb.category || "",
      fb.page || "",
      fb.supportInitiated ? "Support" : "User",
      formatDate(fb.createdAt),
    ]);

    const csv = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast.success("Exported to CSV successfully");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 px-4 pb-6 pt-20 sm:px-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-6 pt-20 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            Feedback Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage user feedback, bug reports, and feature requests
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => window.location.href = "/feedback"}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={filteredFeedbacks.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbacks.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbacks.filter((fb) => fb.status === "new").length}
            </div>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Loader2 className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbacks.filter((fb) => fb.status === "in_progress").length}
            </div>
            <p className="text-xs text-muted-foreground">Being addressed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <AlertCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbacks.filter((fb) => fb.status === "resolved").length}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>Filter feedback by type, status, or search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(searchTerm || filterType !== "all" || filterStatus !== "all") && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                    setFilterStatus("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Feedback Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Feedback ({filteredFeedbacks.length})</CardTitle>
            <CardDescription>
              {filteredFeedbacks.length === feedbacks.length
                ? "Showing all feedback"
                : `Filtered from ${feedbacks.length} total feedback items`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Created
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedbacks.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No feedback found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFeedbacks.map((feedback) => (
                      <TableRow key={feedback.id}>
                        <TableCell>{getTypeBadge(feedback.type)}</TableCell>
                        <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate">{feedback.title}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {feedback.userName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {feedback.userEmail}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {feedback.supportInitiated ? (
                            <Badge
                              variant="outline"
                              className="bg-purple-500/10 text-purple-500 border-purple-500/20"
                            >
                              👤 Support
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-500 border-green-500/20"
                            >
                              User
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {feedback.category && (
                            <Badge variant="secondary">{feedback.category}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(feedback.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: Open detail dialog
                              toast.info("Detail view coming soon");
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

