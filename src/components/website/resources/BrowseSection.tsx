"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";

export type CategoryOption = {
  label: string;
  value: string;
};

type BrowseSectionProps = {
  categories?: CategoryOption[];
  activeCategories: string[]; // Array of active category values
  onCategoryToggle: (value: string) => void; // Toggle category on/off
  searchQuery: string;
  onSearchChange: (value: string) => void;
  maxVisibleCategories?: number; // Maximum number of categories to show before "..."
};

const fallbackCategories: CategoryOption[] = [
  { label: "Browse All", value: "all" },
  { label: "AI Security", value: "AI Security" },
  { label: "Ransomware", value: "Ransomware" },
  { label: "Cloud Protection", value: "Cloud Protection" },
  { label: "Threat Hunting", value: "Threat Hunting" },
  { label: "Incident Response", value: "Incident Response" },
  { label: "Zero Trust", value: "Zero Trust" },
];

export function BrowseSection({
  categories,
  activeCategories,
  onCategoryToggle,
  searchQuery,
  onSearchChange,
  maxVisibleCategories = 6, // Default to showing 6 categories before "..."
}: BrowseSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCategories, setDialogCategories] = useState<string[]>([]);

  const displayCategories = useMemo(() => {
    if (!categories || categories.length === 0) {
      return fallbackCategories;
    }

    const seen = new Set<string>();
    const deduped = categories.filter((category) => {
      if (!category.value) return false;
      const key = category.value.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    if (!deduped.some((category) => category.value === "all")) {
      return [{ label: "Browse All", value: "all" }, ...deduped];
    }

    return deduped;
  }, [categories]);

  // Split categories into visible and hidden
  const visibleCategories = useMemo(() => {
    return displayCategories.slice(0, maxVisibleCategories);
  }, [displayCategories, maxVisibleCategories]);

  const hasMoreCategories = displayCategories.length > maxVisibleCategories;

  const isCategoryActive = (value: string): boolean => {
    return activeCategories.some(
      (cat) => cat.toLowerCase() === value.toLowerCase()
    );
  };

  // Check if category is active in dialog (local state)
  const isDialogCategoryActive = (value: string): boolean => {
    if (dialogCategories.length === 0 && activeCategories.length > 0) {
      // Use activeCategories if dialogCategories not initialized
      return isCategoryActive(value);
    }
    return dialogCategories.some(
      (cat) => cat.toLowerCase() === value.toLowerCase()
    );
  };

  // Initialize dialog categories when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      setDialogCategories([...activeCategories]);
    }
  }, [dialogOpen, activeCategories]);

  const handleCategoryClick = (value: string) => {
    // Update local dialog state instead of immediately applying
    setDialogCategories((prev) => {
      if (value === "all") {
        return prev.includes("all") ? [] : ["all"];
      }

      if (prev.includes("all")) {
        return [value];
      }

      if (prev.includes(value)) {
        const newCategories = prev.filter((cat) => cat !== value);
        return newCategories.length > 0 ? newCategories : ["all"];
      } else {
        return [...prev, value];
      }
    });
  };

  const handleResetFilters = () => {
    // Reset dialog state to "all"
    setDialogCategories(["all"]);
    
    // Reset parent state to "all"
    // If "all" is not currently selected, toggle it on (which will replace other selections)
    if (!activeCategories.includes("all")) {
      onCategoryToggle("all");
    } else if (activeCategories.length > 1) {
      // If "all" is already selected but there are other categories, 
      // we need to clear the other categories by toggling them off
      const otherCategories = activeCategories.filter(cat => cat !== "all");
      otherCategories.forEach(cat => {
        onCategoryToggle(cat);
      });
    }
    
    // Close dialog after reset
    setDialogOpen(false);
  };

  const handleApplyFilters = () => {
    // Ensure we have at least "all" if nothing is selected
    const categoriesToApply = dialogCategories.length === 0 ? ["all"] : dialogCategories;
    
    // Compare current vs dialog state (case-insensitive)
    const currentSet = new Set(activeCategories.map(c => c.toLowerCase()));
    const dialogSet = new Set(categoriesToApply.map(c => c.toLowerCase()));
    
    const areEqual = 
      currentSet.size === dialogSet.size &&
      Array.from(currentSet).every(cat => dialogSet.has(cat)) &&
      Array.from(dialogSet).every(cat => currentSet.has(cat));

    if (!areEqual) {
      // Reset to "all" first if we're switching from multiple to "all" or vice versa
      if (activeCategories.includes("all") !== categoriesToApply.includes("all")) {
        // If going from "all" to specific categories, clear "all"
        if (activeCategories.includes("all") && !categoriesToApply.includes("all")) {
          onCategoryToggle("all");
        }
        // If going from specific to "all", just set "all" 
        if (!activeCategories.includes("all") && categoriesToApply.includes("all")) {
          // Clear all current selections by toggling them off, then set "all"
          activeCategories.forEach(cat => {
            if (cat !== "all") onCategoryToggle(cat);
          });
          if (!activeCategories.includes("all")) {
            onCategoryToggle("all");
          }
        }
      }
      
      // Apply new categories that aren't currently selected
      categoriesToApply.forEach((cat) => {
        if (!activeCategories.some(ac => ac.toLowerCase() === cat.toLowerCase())) {
          onCategoryToggle(cat);
        }
      });
      
      // Remove categories that are no longer selected (and aren't "all")
      activeCategories.forEach((cat) => {
        if (cat !== "all" && !categoriesToApply.some(dc => dc.toLowerCase() === cat.toLowerCase())) {
          onCategoryToggle(cat);
        }
      });
    }
    
    setDialogOpen(false);
  };

  return (
    <section className="bg-background pt-[100px] pb-20 px-20">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex gap-30">
          {/* Browse by Category */}
          <div className="flex flex-col gap-4 w-full">
            <h2 className="font-lato text-lg font-semibold leading-[1.2] text-left text-foreground">
              Browse by category
            </h2>
            <div className="flex flex-wrap gap-4">
              {visibleCategories.map((category) => {
                const isActive = isCategoryActive(category.value);
                return (
                  <Button
                    key={category.value}
                    onClick={() => onCategoryToggle(category.value)}
                    className={`px-6 py-4 h-12 rounded-[60px] text-base font-normal border ${
                      isActive
                        ? "bg-primary text-primary-foreground border-none"
                        : "bg-transparent text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {category.label}
                  </Button>
                );
              })}
              {hasMoreCategories && (
                <>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className={`px-6 py-4 h-12 rounded-[60px] text-base font-normal border ${
                      displayCategories
                        .slice(maxVisibleCategories)
                        .some((cat) => isCategoryActive(cat.value))
                        ? "bg-primary text-primary-foreground border-none"
                        : "bg-transparent text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    ...{(() => {
                      const hiddenActiveCount = displayCategories
                        .slice(maxVisibleCategories)
                        .filter((cat) => isCategoryActive(cat.value)).length;
                      return hiddenActiveCount > 0 ? ` (${hiddenActiveCount})` : "";
                    })()}
                  </Button>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>All Categories</DialogTitle>
                        <DialogDescription>
                          Select multiple categories to filter blog posts. Posts matching any selected category will be shown.
                        </DialogDescription>
                      </DialogHeader>
                      
                      {/* Action Buttons at Top */}
                      <div className="flex gap-3 pt-4 pb-2 border-b border-border">
                        <Button
                          onClick={handleResetFilters}
                          variant="outline"
                          className="flex-1"
                        >
                          Reset Filter
                        </Button>
                        <Button
                          onClick={handleApplyFilters}
                          className="flex-1"
                        >
                          Apply Filter
                        </Button>
                      </div>

                      {/* Category Grid */}
                      <div className="grid grid-cols-2 gap-3 py-4">
                        {displayCategories.map((category) => {
                          const isActive = isDialogCategoryActive(category.value);
                          return (
                            <Button
                              key={category.value}
                              onClick={() => handleCategoryClick(category.value)}
                              className={`px-4 py-3 h-auto rounded-[60px] text-sm font-normal border text-left justify-start relative ${
                                isActive
                                  ? "bg-primary text-primary-foreground border-none"
                                  : "bg-transparent text-foreground border-border hover:bg-muted"
                              }`}
                            >
                              {category.label}
                              {isActive && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                                  ✓
                                </span>
                              )}
                            </Button>
                          );
                        })}
                      </div>

                      {/* Status and Action Buttons at Bottom */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-3">
                          {(() => {
                            const selected = dialogCategories.length === 0 
                              ? activeCategories 
                              : dialogCategories;
                            return selected.includes("all")
                              ? "Showing all posts"
                              : `${selected.filter(c => c !== "all").length} categor${selected.filter(c => c !== "all").length === 1 ? "y" : "ies"} selected`;
                          })()}
                        </p>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleResetFilters}
                            variant="outline"
                            className="flex-1"
                          >
                            Reset Filter
                          </Button>
                          <Button
                            onClick={handleApplyFilters}
                            className="flex-1"
                          >
                            Apply Filter
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col justify-center gap-4">
            <h2 className="font-lato text-lg font-semibold leading-[1.2] text-left text-foreground">
              Search
            </h2>
            <div className="relative w-[400px]">
              <Input
                type="text"
                placeholder="Browse articles"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-12 rounded-[60px] pl-5 pr-16"
              />
              <div className="absolute right-0 top-0 h-full bg-primary rounded-r-[60px] flex items-center justify-center px-4">
                <Search className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
