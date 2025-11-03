"use client";

import React, { useState, useCallback } from "react";
import { Hero, BrowseSection, BlogGrid } from "@/components/website/resources";
import type { CategoryOption } from "@/components/website/resources/BrowseSection";
import { Post } from "@/types/blog";

type ResourcesPageClientProps = {
  initialPosts: Post[];
  initialHeroPost: Post | null;
};

export function ResourcesPageClient({
  initialPosts,
  initialHeroPost,
}: ResourcesPageClientProps) {
  const [activeCategories, setActiveCategories] = useState<string[]>(["all"]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [heroPost, setHeroPost] = useState<Post | null>(initialHeroPost);
  const [isHeroLoading, setIsHeroLoading] = useState(false);

  const handleCategoryToggle = useCallback((value: string) => {
    setActiveCategories((prev) => {
      // Handle "all" category specially
      if (value === "all") {
        // If clicking "all" and it's already selected, deselect it (show nothing)
        // If clicking "all" and it's not selected, select only "all"
        return prev.includes("all") ? [] : ["all"];
      }

      // If "all" is currently selected, replace it with the new category
      if (prev.includes("all")) {
        return [value];
      }

      // Toggle the category
      if (prev.includes(value)) {
        // Remove category, but ensure at least one remains or default to "all"
        const newCategories = prev.filter((cat) => cat !== value);
        return newCategories.length > 0 ? newCategories : ["all"];
      } else {
        // Add category
        return [...prev, value];
      }
    });
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleCategoriesUpdate = useCallback((incoming: CategoryOption[]) => {
    setCategories((previous) => {
      if (previous.length === incoming.length) {
        const isSameOrder = previous.every(
          (category, index) =>
            category.value.toLowerCase() ===
              incoming[index]?.value.toLowerCase() &&
            category.label === incoming[index]?.label
        );

        if (isSameOrder) {
          return previous;
        }
      }

      return incoming;
    });
  }, []);

  // Optimized hero post selection with useMemo
  const selectedHeroPost = React.useMemo(() => {
    if (activeCategories.length === 0 || !initialPosts.length) {
      return null;
    }

    const category = activeCategories.includes("all") ? "all" : activeCategories[0] || "all";
    
    if (category === "all") {
      // Show featured or most recent
      const featured = initialPosts.find((post) => post.featured === true);
      return featured || initialPosts[0] || null;
    } else {
      // Find most recent post in selected category
      const normalizedCategory = category.toLowerCase();
      const matchingPosts = initialPosts.filter((post) => {
        const postCategory = post.category?.toLowerCase() || "";
        return (
          postCategory === normalizedCategory ||
          post.tags.some((tag) => tag.toLowerCase() === normalizedCategory)
        );
      });

      if (matchingPosts.length > 0) {
        const sorted = matchingPosts.sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.createdAt).getTime();
          const dateB = new Date(b.publishedAt || b.createdAt).getTime();
          return dateB - dateA; // Most recent first
        });
        return sorted[0];
      }
      return null;
    }
  }, [activeCategories, initialPosts]);

  // Update hero post state only when it actually changes
  React.useEffect(() => {
    setHeroPost(selectedHeroPost);
  }, [selectedHeroPost]);

  return (
    <>
      <Hero post={heroPost} isLoading={isHeroLoading} />
      <BrowseSection
        categories={categories}
        activeCategories={activeCategories}
        onCategoryToggle={handleCategoryToggle}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <BlogGrid
        activeCategories={activeCategories}
        searchQuery={searchQuery}
        onCategoriesChange={handleCategoriesUpdate}
        initialPosts={initialPosts}
      />
    </>
  );
}

