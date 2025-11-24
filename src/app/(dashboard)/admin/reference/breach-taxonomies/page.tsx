"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreachTaxonomies } from "@/hooks/useBreachData";
import type { BreachTaxonomyItem } from "@/types/breach";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertOctagon, FolderTree, RefreshCw, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORY_LABELS: Record<string, string> = {
  cause: "Incident Cause",
  impacted_data: "Impacted Data",
  detection: "Detection Method",
  industry: "Industry",
  jurisdiction: "Jurisdiction",
  response_stage: "Response Stage",
  custom: "Custom",
  personal_identifiers: "Personal Identifiers",
  financial_data: "Financial Data",
  health_information: "Health Information",
  biometric_data: "Biometric Data",
  other: "Other",
};

export default function BreachTaxonomyReferencePage() {
  const { data, isLoading, isError, refetch, isFetching } =
    useBreachTaxonomies();
  const [selectedItem, setSelectedItem] = useState<BreachTaxonomyItem | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("all");
  const [sensitivityFilter, setSensitivityFilter] = useState("all");
  const [pageSize, setPageSize] = useState("25");
  const [pageIndex, setPageIndex] = useState(0);
  const [sortState, setSortState] = useState<{
    key: keyof BreachTaxonomyItem | "jurisdiction";
    direction: "asc" | "desc";
  }>({ key: "canonicalPhrase", direction: "asc" });

  const uniqueCategories = useMemo(() => {
    if (!data) return [];
    const set = new Set<string>();
    data.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set).sort();
  }, [data]);

  const uniqueJurisdictions = useMemo(() => {
    if (!data) return [];
    const set = new Set<string>();
    data.forEach((item) => set.add(item.jurisdiction.name));
    return Array.from(set).sort();
  }, [data]);

  const uniqueSensitivities = useMemo(() => {
    if (!data) return [];
    const set = new Set<string>();
    data.forEach((item) => {
      if (item.sensitivityLevel) set.add(item.sensitivityLevel);
    });
    return Array.from(set).sort();
  }, [data]);

  useEffect(() => {
    setPageIndex(0);
  }, [searchTerm, categoryFilter, jurisdictionFilter, sensitivityFilter, pageSize]);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    const search = searchTerm.trim().toLowerCase();
    return data.filter((item) => {
      const matchesSearch = search
        ? item.canonicalPhrase.toLowerCase().includes(search) ||
          item.jurisdiction.name.toLowerCase().includes(search) ||
          item.synonyms.some((syn) => syn.toLowerCase().includes(search)) ||
          (item.originalLine?.toLowerCase().includes(search) ?? false)
        : true;
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesJurisdiction =
        jurisdictionFilter === "all" ||
        item.jurisdiction.name === jurisdictionFilter;
      const matchesSensitivity =
        sensitivityFilter === "all" ||
        item.sensitivityLevel === sensitivityFilter;
      return (
        matchesSearch &&
        matchesCategory &&
        matchesJurisdiction &&
        matchesSensitivity
      );
    });
  }, [data, searchTerm, categoryFilter, jurisdictionFilter, sensitivityFilter]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const direction = sortState.direction === "asc" ? 1 : -1;
      if (sortState.key === "jurisdiction") {
        return (
          a.jurisdiction.name.localeCompare(b.jurisdiction.name) * direction
        );
      }
      const aValue = a[sortState.key];
      const bValue = b[sortState.key];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * direction;
      }
      return direction;
    });
  }, [filteredItems, sortState]);

  const numericPageSize = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / numericPageSize));
  const currentPage = Math.min(pageIndex, totalPages - 1);
  const paginatedItems = sortedItems.slice(
    currentPage * numericPageSize,
    currentPage * numericPageSize + numericPageSize
  );

  const handleRefetch = async () => {
    try {
      await refetch();
      toast.success("Taxonomies refreshed");
    } catch (error) {
      console.error(error);
      toast.error("Unable to refresh taxonomies");
    }
  };

  const renderSynonyms = (item: BreachTaxonomyItem) => {
    if (!item.synonyms.length) return "—";
    const [first, second, ...rest] = item.synonyms;
    const label = [first, second].filter(Boolean).join(", ");
    if (rest.length > 0) {
      return `${label}${label ? " " : ""}+${rest.length}`;
    }
    return label;
  };

  const renderSource = (item: BreachTaxonomyItem) => {
    if (item.source) return item.source;
    if (item.metadata?.source) return String(item.metadata.source);
    return "—";
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
            <FolderTree className="h-8 w-8 text-primary" />
            Breach Trigger Taxonomies
          </h1>
          <p className="text-muted-foreground">
            Jurisdiction-specific breach trigger definitions with sensitivity
            context and source metadata.
          </p>
        </div>
        <Button
          onClick={handleRefetch}
          disabled={isFetching}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </motion.div>

      {isError ? (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertOctagon className="h-5 w-5" />
              Failed to load taxonomy data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-destructive">
            <p>
              Verify Firebase configuration and ensure the collection exists.
            </p>
            <Button variant="outline" size="sm" onClick={handleRefetch}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {isLoading ? (
        <Card>
          <CardContent className="py-6">
            <Skeleton className="mb-4 h-6 w-1/3" />
            {[...Array(5)].map((_, idx) => (
              <Skeleton key={idx} className="mb-3 h-5 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && filteredItems.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Taxonomy library is empty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Populate the <code>breach_trigger_taxonomies</code> collection to
              power breach trigger intelligence across jurisdictions.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && filteredItems.length > 0 ? (
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-1">
              <div>
                <CardTitle className="text-base font-semibold">
                  {Intl.NumberFormat().format(sortedItems.length)} Taxonomy Entries
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Use search, filters, and table sorting to explore canonical
                  phrases across jurisdictions. (Client-side pagination shown for
                  now; implementation can be moved server-side once API endpoints
                  are available.)
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Input
                placeholder="Search canonical phrase, jurisdiction, synonyms..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {CATEGORY_LABELS[category] ?? category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={jurisdictionFilter}
                onValueChange={setJurisdictionFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jurisdictions</SelectItem>
                  {uniqueJurisdictions.map((jurisdiction) => (
                    <SelectItem key={jurisdiction} value={jurisdiction}>
                      {jurisdiction}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sensitivityFilter}
                onValueChange={setSensitivityFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sensitivity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sensitivity Levels</SelectItem>
                  {uniqueSensitivities.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setJurisdictionFilter("all");
                  setSensitivityFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSortState((prev) => ({
                          key: "canonicalPhrase",
                          direction:
                            prev.key === "canonicalPhrase" &&
                            prev.direction === "asc"
                              ? "desc"
                              : "asc",
                        }))
                      }
                      className="flex items-center gap-2"
                    >
                      Canonical Phrase
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSortState((prev) => ({
                          key: "jurisdiction",
                          direction:
                            prev.key === "jurisdiction" && prev.direction === "asc"
                              ? "desc"
                              : "asc",
                        }))
                      }
                      className="flex items-center gap-2"
                    >
                      Jurisdiction
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSortState((prev) => ({
                          key: "category",
                          direction:
                            prev.key === "category" && prev.direction === "asc"
                              ? "desc"
                              : "asc",
                        }))
                      }
                      className="flex items-center gap-2"
                    >
                      Category
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSortState((prev) => ({
                          key: "sensitivityLevel",
                          direction:
                            prev.key === "sensitivityLevel" &&
                            prev.direction === "asc"
                              ? "desc"
                              : "asc",
                        }))
                      }
                      className="flex items-center gap-2"
                    >
                      Sensitivity
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Synonyms</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSortState((prev) => ({
                          key: "updatedAt",
                          direction:
                            prev.key === "updatedAt" && prev.direction === "asc"
                              ? "desc"
                              : "asc",
                        }))
                      }
                      className="flex items-center gap-2"
                    >
                      Updated
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow key={item.id} className="align-top">
                    <TableCell className="font-medium">
                      <div>{item.canonicalPhrase}</div>
                      {item.semanticCluster ? (
                        <div className="text-xs text-muted-foreground">
                          Cluster: {item.semanticCluster}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <div>{item.jurisdiction.name}</div>
                      {item.jurisdiction.code ? (
                        <div className="text-xs text-muted-foreground">
                          {item.jurisdiction.code}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="uppercase">
                        {item.sensitivityLevel || "unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {renderSynonyms(item)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {renderSource(item)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(item.updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page</span>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { label: "10", value: "10" },
                      { label: "25", value: "25" },
                      { label: "50", value: "50" },
                      { label: "100", value: "100" },
                    ].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <span>
                  Page {currentPage + 1} of {totalPages} · Showing {paginatedItems.length} of{" "}
                  {sortedItems.length} entries
                </span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage + 1 >= totalPages}
                    onClick={() =>
                      setPageIndex((prev) =>
                        Math.min(prev + 1, Math.max(totalPages - 1, 0))
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Dialog
        open={Boolean(selectedItem)}
        onOpenChange={(open) => {
          if (!open) setSelectedItem(null);
        }}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-3xl">
          {selectedItem ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.canonicalPhrase}</DialogTitle>
                <DialogDescription>
                  {selectedItem.jurisdiction.name}
                  {selectedItem.jurisdiction.code
                    ? ` (${selectedItem.jurisdiction.code})`
                    : ""}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Category
                    </span>
                    <div>{CATEGORY_LABELS[selectedItem.category] ?? selectedItem.category}</div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Sensitivity Level
                    </span>
                    <div>{selectedItem.sensitivityLevel}</div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Source
                    </span>
                    <div>{renderSource(selectedItem)}</div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Updated
                    </span>
                    <div>{new Date(selectedItem.updatedAt).toLocaleString()}</div>
                  </div>
                </div>

                {selectedItem.synonyms.length ? (
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Synonyms
                    </span>
                    <div>{selectedItem.synonyms.join(", ")}</div>
                  </div>
                ) : null}

                {selectedItem.keywords?.length ? (
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Keywords
                    </span>
                    <div>{selectedItem.keywords.join(", ")}</div>
                  </div>
                ) : null}

                {selectedItem.originalLine ? (
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Original Reference
                    </span>
                    <p className="whitespace-pre-wrap text-sm">
                      {selectedItem.originalLine}
                    </p>
                  </div>
                ) : null}

                {selectedItem.metadata && Object.keys(selectedItem.metadata).length ? (
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Metadata
                    </span>
                    <pre className="mt-1 overflow-x-auto rounded bg-muted/40 p-3 text-xs">
                      {JSON.stringify(selectedItem.metadata, null, 2)}
                    </pre>
                  </div>
                ) : null}

                {selectedItem.raw && Object.keys(selectedItem.raw).length ? (
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Raw Element Data
                    </span>
                    <pre className="mt-1 overflow-x-auto rounded bg-muted/40 p-3 text-xs">
                      {JSON.stringify(selectedItem.raw, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
