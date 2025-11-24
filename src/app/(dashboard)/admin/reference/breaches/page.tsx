"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
  AlertOctagon,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import type { BreachRecord } from "@/types/breach";

const DEFAULT_PAGE_SIZE = 25;

// Severity badge colors
const getSeverityBadge = (severity: string) => {
  const colors = {
    critical: "bg-red-100 text-red-800 border-red-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return colors[severity as keyof typeof colors] || colors.medium;
};

// Status badge colors
const getStatusBadge = (status: string) => {
  const colors = {
    reported: "bg-red-100 text-red-800 border-red-200",
    investigating: "bg-yellow-100 text-yellow-800 border-yellow-200",
    contained: "bg-blue-100 text-blue-800 border-blue-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    closed: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return colors[status as keyof typeof colors] || colors.reported;
};

export default function BreachesPage() {
  const { user } = useUser();
  const [breaches, setBreaches] = useState<BreachRecord[]>([]);
  const [filteredBreaches, setFilteredBreaches] = useState<BreachRecord[]>([]);
  const [paginatedBreaches, setPaginatedBreaches] = useState<BreachRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFirebaseError, setHasFirebaseError] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  // Sort states
  const [sortBy, setSortBy] = useState<"createdAt" | "severity" | "title" | "status">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    if (typeof window !== "undefined" && user?.id) {
      const saved = localStorage.getItem(`breaches_page_size_${user.id}`);
      return saved ? parseInt(saved, 10) : DEFAULT_PAGE_SIZE;
    }
    return DEFAULT_PAGE_SIZE;
  });

  const totalPages = Math.ceil(filteredBreaches.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Fetch breaches from Firestore
  const fetchBreaches = async () => {
    try {
      setIsLoading(true);
      setHasFirebaseError(false);

      const breachesCollection = collection(db, "breaches");
      const q = query(breachesCollection, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const fetchedBreaches: BreachRecord[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          organizationId: data.organizationId || "",
          title: data.title || "Untitled Breach",
          summary: data.summary,
          status: data.status || "reported",
          severity: data.severity || "medium",
          triageScore: data.triageScore,
          taxonomySelections: data.taxonomySelections || [],
          triggerIds: data.triggerIds || [],
          notifications: data.notifications || [],
          evidence: data.evidence || [],
          stakeholders: data.stakeholders || [],
          impact: data.impact || { severity: "medium" },
          controls: data.controls || [],
          timeline: data.timeline || [],
          ticketLinks: data.ticketLinks || [],
          automationState: data.automationState,
          simulation: data.simulation,
          postIncident: data.postIncident,
          createdAt: data.createdAt || new Date().toISOString(),
          createdBy: data.createdBy,
          updatedAt: data.updatedAt || new Date().toISOString(),
          updatedBy: data.updatedBy,
          archivedAt: data.archivedAt,
        } as BreachRecord;
      });

      setBreaches(fetchedBreaches);
      toast.success(`Loaded ${fetchedBreaches.length} breach records`);
    } catch (error) {
      console.error("Error fetching breaches:", error);
      setHasFirebaseError(true);
      toast.error("Failed to load breach data from Firebase");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBreaches();
  }, []);

  // Filter and sort breaches
  const filterAndSortBreaches = useCallback(() => {
    let filtered = [...breaches];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (breach) =>
          breach.title.toLowerCase().includes(search) ||
          breach.summary?.toLowerCase().includes(search) ||
          breach.organizationId.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((breach) => breach.status === filterStatus);
    }

    // Apply severity filter
    if (filterSeverity !== "all") {
      filtered = filtered.filter((breach) => breach.severity === filterSeverity);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "severity":
          const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          comparison =
            (severityOrder[a.severity as keyof typeof severityOrder] || 0) -
            (severityOrder[b.severity as keyof typeof severityOrder] || 0);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredBreaches(filtered);
  }, [breaches, searchTerm, filterStatus, filterSeverity, sortBy, sortOrder]);

  useEffect(() => {
    filterAndSortBreaches();
  }, [filterAndSortBreaches]);

  // Update pagination when filtered breaches change
  useEffect(() => {
    const paginated = filteredBreaches.slice(startIndex, endIndex);
    setPaginatedBreaches(paginated);
  }, [filteredBreaches, startIndex, endIndex]);

  // Save page size to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && user?.id) {
      localStorage.setItem(`breaches_page_size_${user.id}`, pageSize.toString());
    }
  }, [pageSize, user?.id]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterSeverity]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterSeverity("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
    toast.success(`Page size changed to ${value}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const SortIcon = ({ column }: { column: typeof sortBy }) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 inline" />
    );
  };

  return (
    <div className="container mx-auto space-y-6 px-4 pb-6 pt-20 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <AlertOctagon className="h-8 w-8 text-primary" />
            Breach Records
          </h1>
          <p className="text-muted-foreground">
            View and manage all breach incidents from the database
          </p>
        </div>
        <Button onClick={fetchBreaches} variant="outline" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Breaches</CardDescription>
            <CardTitle className="text-3xl">{breaches.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Critical</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {breaches.filter((b) => b.severity === "critical").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Investigating</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {breaches.filter((b) => b.status === "investigating").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Resolved</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {breaches.filter((b) => b.status === "resolved").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search breaches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="contained">Contained</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Breach Records
            {filteredBreaches.length !== breaches.length && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredBreaches.length} of {breaches.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : hasFirebaseError ? (
            <div className="text-center py-12 text-destructive">
              Failed to load data from Firebase. Please check your connection.
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("title")}
                      >
                        Title <SortIcon column="title" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("severity")}
                      >
                        Severity <SortIcon column="severity" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("status")}
                      >
                        Status <SortIcon column="status" />
                      </TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("createdAt")}
                      >
                        Created <SortIcon column="createdAt" />
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBreaches.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          No breaches found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedBreaches.map((breach) => (
                        <TableRow key={breach.id}>
                          <TableCell className="font-medium">{breach.title}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getSeverityBadge(breach.severity)}
                            >
                              {breach.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusBadge(breach.status)}
                            >
                              {breach.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {breach.organizationId}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(breach.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {filteredBreaches.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
                  {/* Page Info and Size Selector */}
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, filteredBreaches.length)} of{" "}
                      {filteredBreaches.length} results
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Items per page:
                      </span>
                      <Select
                        value={pageSize.toString()}
                        onValueChange={handlePageSizeChange}
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="200">200</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pagination Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

