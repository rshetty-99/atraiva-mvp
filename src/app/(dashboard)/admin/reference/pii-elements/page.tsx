"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  collection,
  query,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  PIIElement,
  PIICategory,
  RiskLevel,
  Regulation,
  getRiskLevelColor,
  PII_CATEGORY_INFO,
} from "@/types/pii-element";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  Loader2,
  ArrowUpDown,
  Database,
  AlertCircle,
  FileText,
  TrendingUp,
  Tag,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";

// All PII Categories
const ALL_CATEGORIES: PIICategory[] = [
  "Core Identifiers",
  "Government-Issued Numbers",
  "Financial & Payment",
  "Health & Genetic",
  "Biometric Identifiers",
  "Digital & Device IDs",
  "Login & Security Credentials",
  "Location & Vehicle",
  "Personal Characteristics & Demographics",
  "Civic, Political & Legal",
  "Education & Employment",
  "Media & Communications",
  "Household & Utility",
  "Miscellaneous Unique Identifiers",
];

// All Risk Levels
const ALL_RISK_LEVELS: RiskLevel[] = ["low", "medium", "high", "critical"];

// All Regulations
const ALL_REGULATIONS: Regulation[] = [
  "GDPR",
  "CCPA",
  "HIPAA",
  "GLBA",
  "FERPA",
  "BIPA",
  "GINA",
  "PCI-DSS",
  "TCPA",
  "State Laws",
];

// Page size options
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200];
const DEFAULT_PAGE_SIZE = 25;

export default function PIIElementsPage() {
  const { user } = useUser();
  const [piiElements, setPiiElements] = useState<PIIElement[]>([]);
  const [filteredElements, setFilteredElements] = useState<PIIElement[]>([]);
  const [paginatedElements, setPaginatedElements] = useState<PIIElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFirebaseError, setHasFirebaseError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>("all");
  const [filterRegulated, setFilterRegulated] = useState<string>("all");
  const [filterRegulation, setFilterRegulation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"element" | "category" | "riskLevel">(
    "element"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    // Load page size from localStorage or use default
    if (typeof window !== "undefined") {
      const savedPageSize = localStorage.getItem(
        `pii_elements_page_size_${user?.id || "default"}`
      );
      return savedPageSize ? parseInt(savedPageSize, 10) : DEFAULT_PAGE_SIZE;
    }
    return DEFAULT_PAGE_SIZE;
  });

  // Dynamic filter options
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueRegulations, setUniqueRegulations] = useState<string[]>([]);

  // Dialog state for viewing PII element details
  const [selectedElement, setSelectedElement] = useState<PIIElement | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calculate pagination info
  const totalPages = Math.ceil(filteredElements.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    uniqueCategories: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    regulated: 0,
    nonRegulated: 0,
    byCategory: {} as Record<string, number>,
    byRiskLevel: {} as Record<string, number>,
  });

  useEffect(() => {
    fetchPIIElements();
  }, []);

  useEffect(() => {
    filterAndSortElements();
  }, [
    piiElements,
    searchTerm,
    filterCategory,
    filterRiskLevel,
    filterRegulated,
    filterRegulation,
    sortBy,
    sortOrder,
  ]);

  // Update pagination when filtered elements or page settings change
  useEffect(() => {
    const paginated = filteredElements.slice(startIndex, endIndex);
    setPaginatedElements(paginated);
  }, [filteredElements, startIndex, endIndex]);

  // Save page size to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined" && user?.id) {
      localStorage.setItem(
        `pii_elements_page_size_${user.id}`,
        pageSize.toString()
      );
    }
  }, [pageSize, user?.id]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    filterCategory,
    filterRiskLevel,
    filterRegulated,
    filterRegulation,
  ]);

  const fetchPIIElements = async () => {
    try {
      setIsLoading(true);
      setHasFirebaseError(false);
      if (!db) {
        throw new Error("Firebase is not initialized. Check your API key.");
      }
      const elementsRef = collection(db, "ref_pii_elements");
      const q = query(elementsRef, orderBy("element", "asc"));
      const querySnapshot = await getDocs(q);

      const fetchedElements: PIIElement[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedElements.push({
          id: doc.id,
          element: data.element,
          category: data.category as PIICategory,
          categorySlug: data.categorySlug,
          description: data.description,
          riskLevel: data.riskLevel as RiskLevel,
          isRegulated: data.isRegulated,
          applicableRegulations: data.applicableRegulations as Regulation[],
          detectionPatterns: data.detectionPatterns || [],
          examples: data.examples || [],
          metadata: {
            createdAt: data.metadata?.createdAt?.toDate
              ? data.metadata.createdAt.toDate()
              : new Date(),
            updatedAt: data.metadata?.updatedAt?.toDate
              ? data.metadata.updatedAt.toDate()
              : new Date(),
            createdBy: data.metadata?.createdBy,
            source: data.metadata?.source || "PII_elements.xlsx",
            importDate: data.metadata?.importDate,
          },
        } as PIIElement);
      });

      setPiiElements(fetchedElements);

      // Calculate dynamic filter options
      const categories = Array.from(
        new Set(fetchedElements.map((e) => e.category))
      );
      const regulations = Array.from(
        new Set(fetchedElements.flatMap((e) => e.applicableRegulations))
      );

      setUniqueCategories(categories);
      setUniqueRegulations(regulations);

      // Calculate stats
      const byCategory: Record<string, number> = {};
      const byRiskLevel: Record<string, number> = {};
      let regulated = 0;

      fetchedElements.forEach((element) => {
        byCategory[element.category] = (byCategory[element.category] || 0) + 1;
        byRiskLevel[element.riskLevel] =
          (byRiskLevel[element.riskLevel] || 0) + 1;
        if (element.isRegulated) regulated++;
      });

      setStats({
        total: fetchedElements.length,
        uniqueCategories: categories.length,
        highRisk: byRiskLevel["high"] || 0,
        mediumRisk: byRiskLevel["medium"] || 0,
        lowRisk: byRiskLevel["low"] || 0,
        regulated,
        nonRegulated: fetchedElements.length - regulated,
        byCategory,
        byRiskLevel,
      });
    } catch (error: any) {
      console.error("Error fetching PII elements:", error);

      if (
        error.code === "installations/request-failed" ||
        error.message?.includes("API key not valid") ||
        error.message?.includes("Firebase is not initialized")
      ) {
        setHasFirebaseError(true);
        toast.error("Firebase Configuration Error", {
          description:
            "Please check your Firebase API key in the configuration.",
        });
      } else {
        toast.error("Failed to fetch PII elements", {
          description: error.message || "An unknown error occurred.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortElements = () => {
    let filtered = [...piiElements];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (element) =>
          element.element.toLowerCase().includes(search) ||
          element.category.toLowerCase().includes(search) ||
          element.categorySlug.toLowerCase().includes(search) ||
          element.applicableRegulations.some((reg) =>
            reg.toLowerCase().includes(search)
          )
      );
    }

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (element) => element.category === filterCategory
      );
    }

    // Apply risk level filter
    if (filterRiskLevel !== "all") {
      filtered = filtered.filter(
        (element) => element.riskLevel === filterRiskLevel
      );
    }

    // Apply regulated filter
    if (filterRegulated !== "all") {
      const isRegulated = filterRegulated === "true";
      filtered = filtered.filter(
        (element) => element.isRegulated === isRegulated
      );
    }

    // Apply regulation filter
    if (filterRegulation !== "all") {
      filtered = filtered.filter((element) =>
        element.applicableRegulations.includes(filterRegulation as Regulation)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "element":
          comparison = a.element.localeCompare(b.element);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "riskLevel":
          const riskOrder = { low: 0, medium: 1, high: 2, critical: 3 };
          comparison = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredElements(filtered);
  };

  const toggleSort = (column: "element" | "category" | "riskLevel") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getRiskLevelBadge = (riskLevel: RiskLevel) => {
    return (
      <Badge variant="outline" className={getRiskLevelColor(riskLevel)}>
        {riskLevel.toUpperCase()}
      </Badge>
    );
  };

  const getCategoryBadge = (category: PIICategory) => {
    const info = PII_CATEGORY_INFO[category];
    const colorClass =
      info.color === "red"
        ? "bg-red-500/10 text-red-500 border-red-500/20"
        : info.color === "yellow"
        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        : "bg-gray-500/10 text-gray-500 border-gray-500/20";

    return (
      <Badge variant="outline" className={colorClass}>
        {category}
      </Badge>
    );
  };

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handlePageSizeChange = (newSize: string) => {
    const size = parseInt(newSize, 10);
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    toast.success(`Page size updated to ${size} items`);
  };

  const handleViewElement = (element: PIIElement) => {
    setSelectedElement(element);
    setIsDialogOpen(true);
  };

  const exportToCSV = () => {
    const headers = [
      "Element",
      "Category",
      "Risk Level",
      "Regulated",
      "Applicable Regulations",
      "Detection Patterns",
      "Examples",
      "Source",
      "Import Date",
    ];

    const csvData = filteredElements.map((element) => [
      element.element,
      element.category,
      element.riskLevel,
      element.isRegulated ? "Yes" : "No",
      element.applicableRegulations.join("; "),
      element.detectionPatterns.join("; "),
      element.examples.join("; "),
      element.metadata.source,
      element.metadata.importDate || "N/A",
    ]);

    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pii-elements-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast.success("Exported to CSV successfully");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Spinner Overlay */}
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Loading PII reference data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show Firebase error state
  if (hasFirebaseError) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Firebase Configuration Error
            </CardTitle>
            <CardDescription className="text-destructive/90">
              There was an issue connecting to Firebase. This is likely due to
              missing or invalid API keys.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-destructive/80">
              Please ensure your `.env.local` file in the project root contains
              the correct Firebase environment variables.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
            >
              <Loader2 className="h-4 w-4 mr-2" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            PII Reference Data
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor Personally Identifiable Information elements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
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
            <CardTitle className="text-sm font-medium">
              Total Elements
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.uniqueCategories} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highRisk}</div>
            <p className="text-xs text-muted-foreground">
              {stats.mediumRisk} medium risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regulated</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.regulated}</div>
            <p className="text-xs text-muted-foreground">
              {stats.nonRegulated} non-regulated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueCategories}</div>
            <p className="text-xs text-muted-foreground">Distinct groups</p>
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
            <CardDescription>
              Filter and search through PII reference elements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search elements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Category Filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Risk Level Filter */}
              <Select
                value={filterRiskLevel}
                onValueChange={setFilterRiskLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Risk Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  {ALL_RISK_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Regulated Filter */}
              <Select
                value={filterRegulated}
                onValueChange={setFilterRegulated}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Regulated Only</SelectItem>
                  <SelectItem value="false">Non-Regulated Only</SelectItem>
                </SelectContent>
              </Select>

              {/* Regulation Filter */}
              <Select
                value={filterRegulation}
                onValueChange={setFilterRegulation}
              >
                <SelectTrigger className="md:col-span-2">
                  <SelectValue placeholder="All Regulations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regulations</SelectItem>
                  {uniqueRegulations.map((regulation) => (
                    <SelectItem key={regulation} value={regulation}>
                      {regulation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {(searchTerm ||
              filterCategory !== "all" ||
              filterRiskLevel !== "all" ||
              filterRegulated !== "all" ||
              filterRegulation !== "all") && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("all");
                    setFilterRiskLevel("all");
                    setFilterRegulated("all");
                    setFilterRegulation("all");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>PII Elements ({filteredElements.length})</CardTitle>
            <CardDescription>
              {filteredElements.length === piiElements.length
                ? "Showing all elements"
                : `Filtered from ${piiElements.length} total elements`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort("element")}
                        className="font-semibold"
                      >
                        Element
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort("category")}
                        className="font-semibold"
                      >
                        Category
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort("riskLevel")}
                        className="font-semibold"
                      >
                        Risk Level
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Regulated</TableHead>
                    <TableHead>Applicable Regulations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedElements.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No PII elements found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedElements.map((element) => (
                      <TableRow key={element.id}>
                        <TableCell className="font-medium">
                          {element.element}
                        </TableCell>
                        <TableCell>
                          {getCategoryBadge(element.category)}
                        </TableCell>
                        <TableCell>
                          {getRiskLevelBadge(element.riskLevel)}
                        </TableCell>
                        <TableCell>
                          {element.isRegulated ? (
                            <Badge variant="default" className="bg-blue-500">
                              Yes
                            </Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {element.applicableRegulations
                              .slice(0, 3)
                              .map((reg) => (
                                <Badge key={reg} variant="outline">
                                  {reg}
                                </Badge>
                              ))}
                            {element.applicableRegulations.length > 3 && (
                              <Badge variant="outline">
                                +{element.applicableRegulations.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewElement(element)}
                            title="View Details"
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

            {/* Pagination Controls */}
            {filteredElements.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                {/* Page Info and Size Selector */}
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredElements.length)} of{" "}
                    {filteredElements.length} results
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
                        {PAGE_SIZE_OPTIONS.map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    title="First Page"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    title="Previous Page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    title="Last Page"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* PII Element Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              {selectedElement?.element}
            </DialogTitle>
            <DialogDescription>
              Detailed information about this PII element
            </DialogDescription>
          </DialogHeader>

          {selectedElement && (
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Element Name
                    </label>
                    <p className="text-base font-medium">
                      {selectedElement.element}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Category
                    </label>
                    <div className="mt-1">
                      {getCategoryBadge(selectedElement.category)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Risk Level
                    </label>
                    <div className="mt-1">
                      {getRiskLevelBadge(selectedElement.riskLevel)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Regulated
                    </label>
                    <div className="mt-1">
                      {selectedElement.isRegulated ? (
                        <Badge variant="default" className="bg-blue-500">
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedElement.description && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Description
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedElement.description}
                  </p>
                </div>
              )}

              {/* Applicable Regulations */}
              {selectedElement.applicableRegulations.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Applicable Regulations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedElement.applicableRegulations.map((reg) => (
                      <Badge key={reg} variant="outline" className="text-sm">
                        {reg}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Examples */}
              {selectedElement.examples &&
                selectedElement.examples.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Examples
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedElement.examples.map((example, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground"
                        >
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Detection Patterns */}
              {selectedElement.detectionPatterns &&
                selectedElement.detectionPatterns.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Detection Patterns
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedElement.detectionPatterns.map(
                        (pattern, index) => (
                          <li
                            key={index}
                            className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded"
                          >
                            {pattern}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {/* Metadata */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Metadata
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Source
                    </label>
                    <p className="text-sm">
                      {selectedElement.metadata?.source || "PII_elements.xlsx"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created At
                    </label>
                    <p className="text-sm">
                      {selectedElement.metadata?.createdAt
                        ? format(
                            new Date(selectedElement.metadata.createdAt),
                            "PPpp"
                          )
                        : "N/A"}
                    </p>
                  </div>
                  {selectedElement.metadata?.updatedAt && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Last Updated
                      </label>
                      <p className="text-sm">
                        {format(
                          new Date(selectedElement.metadata.updatedAt),
                          "PPpp"
                        )}
                      </p>
                    </div>
                  )}
                  {selectedElement.metadata?.createdBy && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Created By
                      </label>
                      <p className="text-sm">
                        {selectedElement.metadata.createdBy}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
