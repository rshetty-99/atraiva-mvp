"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StateRegulation, US_STATES_MAP } from "@/types/state-regulation";
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
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Gavel,
  Search,
  Filter,
  Download,
  Eye,
  Loader2,
  ArrowUpDown,
  Calendar,
  AlertCircle,
  Database,
  MapPin,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// US States list for filter
const US_STATES = Object.entries(US_STATES_MAP)
  .filter(([code]) => code !== "UNKNOWN")
  .sort(([codeA], [codeB]) => {
    if (codeA === "FEDERAL") return -1;
    if (codeB === "FEDERAL") return 1;
    return codeA.localeCompare(codeB);
  })
  .map(([code, name]) => ({
    code,
    name,
  }));

export default function StateRegulationsPage() {
  const router = useRouter();
  const [regulations, setRegulations] = useState<StateRegulation[]>([]);
  const [filteredRegulations, setFilteredRegulations] = useState<
    StateRegulation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState<string>("all");
  const [filterLawType, setFilterLawType] = useState<string>("all");
  const [filterIndustry, setFilterIndustry] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    | "state"
    | "updated_at"
    | "fetched_at"
    | "industry"
    | "scan_type"
    | "law_type"
  >("state");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [hasFirebaseError, setHasFirebaseError] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    uniqueStates: 0,
    federalCount: 0,
    stateCount: 0,
    byLawType: {} as Record<string, number>,
    byIndustry: {} as Record<string, number>,
  });

  useEffect(() => {
    fetchRegulations();
  }, []);

  const filterAndSortRegulations = useCallback(() => {
    let filtered = [...regulations];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((reg) => {
        const stateName = US_STATES_MAP[reg.state]?.toLowerCase() ?? "";
        const lawType = reg.parsed?.law_type?.toLowerCase() ?? "";
        const keywords = Array.isArray(reg.keywords)
          ? reg.keywords.join(" ").toLowerCase()
          : "";
        const regulationName = reg.regulationName?.toLowerCase() ?? "";
        const citation = reg.citation?.toLowerCase() ?? "";
        const jurisdictionType = reg.jurisdictionType?.toLowerCase() ?? "";

        return (
          reg.state.toLowerCase().includes(search) ||
          stateName.includes(search) ||
          lawType.includes(search) ||
          keywords.includes(search) ||
          regulationName.includes(search) ||
          citation.includes(search) ||
          jurisdictionType.includes(search)
        );
      });
    }

    // Apply state filter
    if (filterState !== "all") {
      filtered = filtered.filter((reg) => reg.state === filterState);
    }

    // Apply law type filter
    if (filterLawType !== "all") {
      filtered = filtered.filter(
        (reg) => reg.parsed.law_type === filterLawType
      );
    }

    // Apply industry filter
    if (filterIndustry !== "all") {
      filtered = filtered.filter((reg) => reg.industry === filterIndustry);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "state":
          comparison = a.state.localeCompare(b.state);
          break;
        case "updated_at":
          comparison =
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        case "fetched_at":
          comparison =
            new Date(a.fetched_at).getTime() - new Date(b.fetched_at).getTime();
          break;
        case "industry":
          comparison = (a.industry || "").localeCompare(b.industry || "");
          break;
        case "scan_type":
          comparison = (a.scan_type || "").localeCompare(b.scan_type || "");
          break;
        case "law_type":
          comparison = (a.parsed.law_type || "").localeCompare(
            b.parsed.law_type || ""
          );
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredRegulations(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    regulations,
    searchTerm,
    filterState,
    filterLawType,
    filterIndustry,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    filterAndSortRegulations();
  }, [filterAndSortRegulations]);

  const fetchRegulations = async () => {
    try {
      setIsLoading(true);
      setHasFirebaseError(false);

      // Check if Firebase is configured
      if (!db) {
        throw new Error("Firebase is not configured");
      }

      const regulationsRef = collection(db, "regulations");
      const querySnapshot = await getDocs(regulationsRef);

      const toRecord = (value: unknown): Record<string, unknown> =>
        value && typeof value === "object" && !Array.isArray(value)
          ? (value as Record<string, unknown>)
          : {};

      const toStringArray = (value: unknown): string[] =>
        Array.isArray(value)
          ? value.filter((item): item is string => typeof item === "string")
          : [];

      const getString = (value: unknown, fallback = ""): string =>
        typeof value === "string" ? value : fallback;

      const toDateString = (value: unknown): string => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        if (
          value &&
          typeof value === "object" &&
          "toDate" in value &&
          typeof (value as { toDate: () => Date }).toDate === "function"
        ) {
          try {
            return (value as { toDate: () => Date }).toDate().toISOString();
          } catch {
            return new Date().toISOString();
          }
        }
        if (typeof value === "string" && value.trim()) {
          return value;
        }
        return new Date().toISOString();
      };

      const fetchedRegulations: StateRegulation[] = querySnapshot.docs.map(
        (docSnapshot) => {
          const data = toRecord(docSnapshot.data());
          const jurisdiction = toRecord(data.jurisdiction);
          const parsedRaw = toRecord(data.parsed);

          const levelRaw =
            data.jurisdictionType ??
            jurisdiction.type ??
            data.level ??
            (jurisdiction.state || data.state ? "state" : "federal");
          const jurisdictionType = getString(levelRaw, "state").toLowerCase();

          const stateRaw =
            jurisdiction.state ?? data.state ?? parsedRaw.state ?? "";
          const state = stateRaw
            ? getString(stateRaw).toUpperCase()
            : jurisdictionType === "federal"
            ? "FEDERAL"
            : "UNKNOWN";

          const industry = getString(
            data.industry ?? parsedRaw.industry ?? "general"
          ).toLowerCase();
          const lawType = getString(
            data.lawType ?? parsedRaw.law_type ?? data.type ?? "unknown"
          ).toLowerCase();
          const scanType = getString(
            data.scan_type ?? data.scanType ?? jurisdiction.scanType ?? "full"
          ).toLowerCase();

          const parsedKeywords = toStringArray(parsedRaw.keywords);
          const keywords = toStringArray(data.keywords).length
            ? toStringArray(data.keywords)
            : parsedKeywords;

          const parsedUrl = getString(parsedRaw.url);
          const url = getString(data.url, parsedUrl);

          const parsedMetadata = toRecord(parsedRaw.metadata);

          const parsedAt = toDateString(
            parsedRaw.parsed_at ?? data.updated_at ?? data.fetched_at
          );

          const parsedBlock: StateRegulation["parsed"] = {
            breach_notification: toRecord(parsedRaw.breach_notification),
            requirements: toRecord(parsedRaw.requirements),
            timelines: Array.isArray(parsedRaw.timelines)
              ? parsedRaw.timelines
              : [],
            penalties: toRecord(parsedRaw.penalties),
            exemptions: Array.isArray(parsedRaw.exemptions)
              ? parsedRaw.exemptions
              : [],
            definitions: toRecord(parsedRaw.definitions),
            state,
            url,
            metadata: parsedMetadata,
            parsed_at: parsedAt,
            extractor: getString(parsedRaw.extractor ?? data.extractor),
            law_type: lawType,
            industry,
          };

          const fetchedAt = toDateString(
            data.fetched_at ?? data.updated_at ?? parsedRaw.parsed_at
          );
          const updatedAt = toDateString(
            data.updated_at ?? data.fetched_at ?? parsedRaw.parsed_at
          );
          return {
            id: docSnapshot.id,
            state,
            source_id: getString(data.source_id ?? data.sourceId),
            url,
            fetched_at: fetchedAt,
            metadata: toRecord(data.metadata),
            parsed: parsedBlock,
            keywords,
            changes: Array.isArray(data.changes)
              ? data.changes.filter(
                  (item): item is string => typeof item === "string"
                )
              : [],
            industry,
            scan_type: scanType,
            updated_at: updatedAt,
            jurisdictionType,
            regulationName:
              getString(
                data.name ??
                  data.title ??
                  (parsedMetadata.name as string | undefined) ??
                  ""
              ) || undefined,
            citation:
              getString(
                data.citation ??
                  (parsedMetadata.citation as string | undefined) ??
                  data.reference ??
                  ""
              ) || undefined,
            regulator:
              getString(
                data.regulator ??
                  (parsedMetadata.regulator as string | undefined) ??
                  jurisdiction.agency ??
                  ""
              ) || undefined,
            country: getString(
              data.country ??
                jurisdiction.country ??
                (parsedMetadata.country as string | undefined) ??
                "US"
            ),
          };
        }
      );

      setRegulations(fetchedRegulations);

      // Calculate stats
      const lawTypeStats: Record<string, number> = {};
      const industryStats: Record<string, number> = {};
      const uniqueStatesSet = new Set<string>();
      let federalCount = 0;
      let stateCount = 0;

      fetchedRegulations.forEach((reg) => {
        const lawType = reg.parsed.law_type || "unknown";
        lawTypeStats[lawType] = (lawTypeStats[lawType] || 0) + 1;

        const industry = reg.industry || "general";
        industryStats[industry] = (industryStats[industry] || 0) + 1;

        // Track unique states
        uniqueStatesSet.add(reg.state);

        // Track federal vs state
        if (reg.state === "FEDERAL" || reg.jurisdictionType === "federal") {
          federalCount++;
        } else {
          stateCount++;
        }
      });

      console.log("Stats calculation:", {
        total: fetchedRegulations.length,
        uniqueStates: uniqueStatesSet.size,
        federalCount,
        stateCount,
      });

      setStats({
        total: fetchedRegulations.length,
        uniqueStates: uniqueStatesSet.size,
        federalCount,
        stateCount,
        byLawType: lawTypeStats,
        byIndustry: industryStats,
      });
    } catch (error: unknown) {
      console.error("Error fetching regulations:", error);
      const err =
        error &&
        typeof error === "object" &&
        "code" in error &&
        "message" in error
          ? (error as { code?: unknown; message?: unknown })
          : null;

      if (
        err?.code === "installations/request-failed" ||
        (typeof err?.message === "string" &&
          err.message.includes("API key not valid"))
      ) {
        setHasFirebaseError(true);
        toast.error("Firebase Configuration Error", {
          description:
            "Please check your Firebase API key in the configuration.",
        });
      } else {
        toast.error("Failed to fetch state regulations", {
          description:
            error instanceof Error ? error.message : "Please try again later",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSort = (
    column:
      | "state"
      | "updated_at"
      | "fetched_at"
      | "industry"
      | "scan_type"
      | "law_type"
  ) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const viewRegulationDetails = (regulationId: string) => {
    router.push(`/admin/reference/state-regulations/${regulationId}`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredRegulations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRegulations = filteredRegulations.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const getLawTypeBadge = (lawType: string) => {
    const colors: Record<string, string> = {
      data_breach: "bg-red-500/10 text-red-500 border-red-500/20",
      general_privacy: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      security: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      consumer_protection: "bg-green-500/10 text-green-500 border-green-500/20",
      unknown: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    };

    return (
      <Badge variant="outline" className={colors[lawType] || colors.unknown}>
        {lawType.replace(/_/g, " ").toUpperCase()}
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = [
      "State",
      "State Name",
      "Law Type",
      "Industry",
      "Scan Type",
      "Updated At",
      "Fetched At",
      "URL",
      "Keywords",
      "Changes",
    ];

    const csvData = filteredRegulations.map((reg) => [
      reg.state,
      US_STATES_MAP[reg.state] || reg.state,
      reg.parsed.law_type || "unknown",
      reg.industry || "general",
      reg.scan_type || "full",
      format(new Date(reg.updated_at), "yyyy-MM-dd HH:mm:ss"),
      format(new Date(reg.fetched_at), "yyyy-MM-dd HH:mm:ss"),
      reg.url,
      reg.keywords.join("; "),
      reg.changes.join("; "),
    ]);

    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `state-regulations-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast.success("Exported to CSV successfully");
  };

  // Get unique law types and industries for filters
  const uniqueLawTypes = Array.from(
    new Set(regulations.map((r) => r.parsed.law_type).filter(Boolean))
  );
  const uniqueIndustries = Array.from(
    new Set(regulations.map((r) => r.industry).filter(Boolean))
  );

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 px-4 pb-6 pt-20 sm:px-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
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
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
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
                {/* Table Header */}
                <div className="flex gap-4 pb-3 border-b">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                {/* Table Rows */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4 py-3 items-center">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
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
              Loading state regulations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show Firebase error state
  if (hasFirebaseError) {
    return (
      <div className="container mx-auto px-4 pb-6 pt-20 sm:px-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Firebase Configuration Error
            </CardTitle>
            <CardDescription>
              Unable to connect to Firebase. Please check your configuration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold mb-2">Common Issues:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>
                  API key is invalid or missing in <code>.env.local</code>
                </li>
                <li>Firebase project ID is incorrect</li>
                <li>Firebase app is not initialized properly</li>
                <li>
                  Check the <code>lib/firebase.ts</code> configuration file
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold mb-2">
                Required Environment Variables:
              </h4>
              <ul className="list-none space-y-1 text-sm font-mono text-muted-foreground">
                <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
                <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
                <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
                <li>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
                <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
                <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
              </ul>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry Connection
            </Button>
          </CardContent>
        </Card>
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
            <Gavel className="h-8 w-8 text-primary" />
            Regulations
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor data breach notification laws and regulations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={filteredRegulations.length === 0}
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
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Regulations
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Across all states</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jurisdictions</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-3">
              <div className="text-2xl font-bold">{stats.uniqueStates}</div>
              <div className="text-sm text-muted-foreground">total</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-muted-foreground">State</span>
                </div>
                <span className="text-base font-bold text-foreground">
                  {stats.stateCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-muted-foreground">Federal</span>
                </div>
                <span className="text-base font-bold text-foreground">
                  {stats.federalCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Law Types</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(stats.byLawType).length}
            </div>
            <p className="text-xs text-muted-foreground">Unique categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industries</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(stats.byIndustry).length}
            </div>
            <p className="text-xs text-muted-foreground">Industry coverage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {regulations.length > 0
                ? format(
                    new Date(
                      Math.max(
                        ...regulations.map((r) =>
                          new Date(r.updated_at).getTime()
                        )
                      )
                    ),
                    "MMM dd"
                  )
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Most recent update</p>
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
              Filter and search through state regulations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {/* Search */}
              <div className="flex h-full flex-col justify-end gap-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search regulations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* State Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  States
                </label>
                <Select value={filterState} onValueChange={setFilterState}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name} ({state.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Law Type Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Law Types and Regulations
                </label>
                <Select value={filterLawType} onValueChange={setFilterLawType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueLawTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Industry Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Industry
                </label>
                <Select
                  value={filterIndustry}
                  onValueChange={setFilterIndustry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueIndustries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm ||
              filterState !== "all" ||
              filterLawType !== "all" ||
              filterIndustry !== "all") && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterState("all");
                    setFilterLawType("all");
                    setFilterIndustry("all");
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
            <CardTitle>Regulations ({filteredRegulations.length})</CardTitle>
            <CardDescription>
              {filteredRegulations.length === regulations.length
                ? "Showing all regulations"
                : `Filtered from ${regulations.length} total regulations`}
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
                        onClick={() => toggleSort("state")}
                        className="font-semibold"
                      >
                        State
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort("law_type")}
                        className="font-semibold"
                      >
                        Law Types
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort("industry")}
                        className="font-semibold"
                      >
                        Industry
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort("scan_type")}
                        className="font-semibold"
                      >
                        Scan Type
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Keywords</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort("updated_at")}
                        className="font-semibold"
                      >
                        Last Updated
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRegulations.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No regulations found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRegulations.map((regulation) => (
                      <TableRow key={regulation.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {US_STATES_MAP[regulation.state] ||
                                regulation.state}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {regulation.state}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getLawTypeBadge(
                            regulation.parsed.law_type || "unknown"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {regulation.industry.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {regulation.scan_type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {regulation.keywords.slice(0, 3).map((kw, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {kw}
                              </Badge>
                            ))}
                            {regulation.keywords.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{regulation.keywords.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(
                            new Date(regulation.updated_at),
                            "MMM dd, yyyy"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                viewRegulationDetails(regulation.id)
                              }
                              title="View Details"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(regulation.url, "_blank")
                              }
                              title="Open URL"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {filteredRegulations.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Rows per page:
                  </span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">
                    {startIndex + 1}-
                    {Math.min(endIndex, filteredRegulations.length)} of{" "}
                    {filteredRegulations.length}
                  </span>
                </div>

                {/* Page navigation */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <Button
                        key={index}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (typeof page === "number") {
                            setCurrentPage(page);
                          }
                        }}
                        disabled={typeof page === "string"}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
