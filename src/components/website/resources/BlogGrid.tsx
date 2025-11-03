"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Post } from "@/types/blog";
import type { CategoryOption } from "./BrowseSection";
import { LogoSpinner } from "@/components/ui/logo-spinner";

// Normalize category for comparison - handle all variations consistently
// This function must be used consistently everywhere for matching to work
const normalizeCategoryValue = (value: string | null | undefined): string => {
  if (!value) return "";
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ") // Normalize multiple spaces to single space
    .replace(/[-_]/g, " "); // Normalize hyphens/underscores to spaces for comparison
};

type BlogCardData = {
  id: string;
  title: string;
  author: string;
  date: string;
  image: string | null;
  description: string;
  slug: string;
  tags: string[];
  readTime: number;
  category?: string | null;
  likes?: number;
  views?: number;
};

type BlogGridProps = {
  activeCategories: string[]; // Array of active category values
  searchQuery: string;
  onCategoriesChange?: (categories: CategoryOption[]) => void;
  initialPosts?: Post[]; // Pre-loaded posts from server (for ISR)
};

// Sample test data for blog posts
const sampleBlogPosts: BlogCardData[] = [
  {
    id: "1",
    title: "Understanding AI-Powered Threat Detection in Modern Cybersecurity",
    author: "Dr. Sarah Chen",
    date: "March 15, 2024",
    image: "/images/website/resources/blog-thumbnail-8.jpg",
    description:
      "Explore how artificial intelligence is revolutionizing threat detection and response in cybersecurity operations.",
    slug: "ai-powered-threat-detection",
    tags: ["AI Security", "Threat Detection", "Machine Learning"],
    readTime: 5,
    category: "AI Security",
    likes: 42,
    views: 1250,
  },
  {
    id: "2",
    title: "GDPR Compliance: A Comprehensive Guide for 2024",
    author: "Michael Roberts",
    date: "March 12, 2024",
    image: "/images/website/resources/blog-thumbnail-7.jpg",
    description:
      "Stay compliant with the latest GDPR regulations and learn best practices for data protection in your organization.",
    slug: "gdpr-compliance-guide-2024",
    tags: ["Compliance", "GDPR", "Data Protection"],
    readTime: 8,
    category: "Compliance",
    likes: 38,
    views: 980,
  },
  {
    id: "3",
    title: "Zero Trust Architecture: Implementation Best Practices",
    author: "Jennifer Lee",
    date: "March 10, 2024",
    image: "/images/website/resources/blog-thumbnail-6.jpg",
    description:
      "Learn how to implement a zero trust security model in your organization with practical steps and real-world examples.",
    slug: "zero-trust-architecture-best-practices",
    tags: ["Zero Trust", "Security", "Architecture"],
    readTime: 6,
    category: "Zero Trust",
    likes: 56,
    views: 1520,
  },
  {
    id: "4",
    title: "Ransomware Defense Strategies for Enterprise Networks",
    author: "David Martinez",
    date: "March 8, 2024",
    image: "/images/website/resources/blog-thumbnail-5.jpg",
    description:
      "Protect your enterprise from ransomware attacks with these proven defense strategies and incident response protocols.",
    slug: "ransomware-defense-strategies",
    tags: ["Ransomware", "Incident Response", "Enterprise Security"],
    readTime: 7,
    category: "Ransomware",
    likes: 71,
    views: 2100,
  },
  {
    id: "5",
    title: "Cloud Security: Protecting Your Data in Multi-Cloud Environments",
    author: "Emily Watson",
    date: "March 5, 2024",
    image: "/images/website/resources/blog-thumbnail-4.jpg",
    description:
      "Navigate the complexities of securing data across multiple cloud platforms with these essential security practices.",
    slug: "cloud-security-multi-cloud",
    tags: ["Cloud Protection", "Multi-Cloud", "Data Security"],
    readTime: 6,
    category: "Cloud Protection",
    likes: 49,
    views: 1350,
  },
  {
    id: "6",
    title: "Threat Hunting: Proactive Security for Your Organization",
    author: "James Wilson",
    date: "March 3, 2024",
    image: "/images/website/resources/blog-thumbnail-1.jpg",
    description:
      "Learn the art of threat hunting and discover how proactive security measures can protect your organization.",
    slug: "threat-hunting-proactive-security",
    tags: ["Threat Hunting", "Proactive Security", "SOC"],
    readTime: 5,
    category: "Threat Hunting",
    likes: 33,
    views: 890,
  },
  {
    id: "7",
    title: "Incident Response Planning: A Step-by-Step Guide",
    author: "Dr. Sarah Chen",
    date: "February 28, 2024",
    image: "/images/website/resources/blog-thumbnail-2.jpg",
    description:
      "Build an effective incident response plan that minimizes damage and ensures business continuity during security incidents.",
    slug: "incident-response-planning-guide",
    tags: ["Incident Response", "Planning", "Security Operations"],
    readTime: 9,
    category: "Incident Response",
    likes: 64,
    views: 1780,
  },
  {
    id: "8",
    title: "The Future of Cybersecurity: Trends to Watch in 2024",
    author: "Michael Roberts",
    date: "February 25, 2024",
    image: "/images/website/resources/blog-thumbnail-3.jpg",
    description:
      "Stay ahead of the curve with insights into emerging cybersecurity trends and technologies shaping the industry.",
    slug: "cybersecurity-trends-2024",
    tags: ["Trends", "Future Tech", "Cybersecurity"],
    readTime: 7,
    category: "Trends",
    likes: 87,
    views: 2450,
  },
];

// Blog Card Component with Aceternity-style design
// Memoized BlogCard component for performance
const BlogCard = React.memo(({ post, index }: { post: BlogCardData; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Use existing thumbnail as fallback, or use first available thumbnail
  const defaultImage = "/images/website/resources/blog-thumbnail-1.jpg";
  const imageSrc = post.image && !imageError ? post.image : defaultImage;

  // Optimize hover handlers with useCallback
  const handleMouseEnter = React.useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = React.useCallback(() => setIsHovered(false), []);

  return (
    <Link href={`/resources/${post.slug}`} prefetch={index < 4}>
      <motion.div
        className="relative group block p-2 h-full w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.span
              className="absolute inset-0 h-full w-full bg-slate-800/[0.8] block rounded-3xl"
              layoutId={`hoverBackground-${post.id}`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.15 },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15, delay: 0.2 },
              }}
            />
          )}
        </AnimatePresence>

        <div
          className={cn(
            "rounded-2xl h-full w-full overflow-hidden bg-card border border-border group-hover:border-primary/50 relative z-20",
            "transition-all duration-300"
          )}
        >
          {/* Blog Image - Optimized with lazy loading */}
          <div className="h-[240px] relative overflow-hidden rounded-t-2xl bg-muted">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                quality={80}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYxZjFmIi8+PC9zdmc+"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Blog Content */}
          <div className="relative z-50 p-6">
            <div className="flex items-center gap-3 mb-4">
              {/* Author Avatar */}
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">
                  {post.author}
                </p>
                <p className="text-muted-foreground text-xs">
                  {post.date} · {post.readTime} min read
                </p>
              </div>
            </div>

            <h3 className="text-foreground font-bold tracking-wide text-lg mb-3 leading-tight">
              {post.title}
            </h3>

            <p className="text-muted-foreground tracking-wide leading-relaxed text-sm mb-4">
              {post.description}
            </p>

            {/* Engagement Metrics */}
            <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.views || 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.likes || 0}</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
});

BlogCard.displayName = "BlogCard";

// Helper function to transform Post to BlogCardData
const transformPostToCardData = (post: Post): BlogCardData => ({
  id: post.id,
  title: post.title,
  author: "Atraiva Team", // Default author - can be fetched from user data
  date: new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ),
  image: post.featuredImage || null,
  description: post.excerpt || "",
  slug: post.slug,
  tags: post.tags || [],
  readTime: post.readTimeMinutes || 5,
  category: post.category || null,
  likes: post.likes || 0,
  views: post.views || 0,
});

export function BlogGrid({
  activeCategories,
  searchQuery,
  onCategoriesChange,
  initialPosts,
}: BlogGridProps) {
  const [blogPosts, setBlogPosts] = useState<BlogCardData[]>(() => {
    // If initialPosts provided, use them; otherwise use sample data
    if (initialPosts && initialPosts.length > 0) {
      return initialPosts.map(transformPostToCardData);
    }
    return sampleBlogPosts;
  });
  const [loading, setLoading] = useState(!initialPosts || initialPosts.length === 0);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  // Only fetch if initialPosts not provided (fallback for client-side navigation)
  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/blog?published=true&limit=100");

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        const posts: Post[] = data.posts || [];

        // Transform posts to BlogCardData format
        const transformedPosts: BlogCardData[] = posts.map(transformPostToCardData);

        // Use transformed posts if available, otherwise fall back to sample data
        if (transformedPosts.length > 0) {
          setBlogPosts(transformedPosts);
        } else {
          setBlogPosts(sampleBlogPosts);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        // Fall back to sample data on error
        setBlogPosts(sampleBlogPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [initialPosts]);

  const derivedCategories = useMemo(() => {
    // Use normalized keys to dedupe, but keep original values for matching
    const categoryMap = new Map<string, string>();

    const addCategory = (value?: string | null) => {
      if (!value) return;
      const trimmed = value.trim();
      if (!trimmed) return;
      // Use normalized value as key for deduplication
      const normalizedKey = normalizeCategoryValue(trimmed);
      if (categoryMap.has(normalizedKey)) return;
      // Store original value for matching (will be normalized during comparison)
      categoryMap.set(normalizedKey, trimmed);
    };

    blogPosts.forEach((post) => {
      addCategory(post.category ?? null);
      post.tags.forEach((tag) => addCategory(tag));
    });

    const formatLabel = (value: string) =>
      value
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());

    return Array.from(categoryMap.values())
      .map((value) => ({
        value, // Keep original value - will be normalized during comparison
        label: formatLabel(value),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [blogPosts]);

  useEffect(() => {
    if (onCategoriesChange) {
      onCategoriesChange(derivedCategories);
    }
  }, [derivedCategories, onCategoriesChange]);

  // Normalize all active categories
  const normalizedActiveCategories = useMemo(() => {
    if (!activeCategories || activeCategories.length === 0) {
      return ["all"];
    }
    return activeCategories.map((cat) => normalizeCategoryValue(cat));
  }, [activeCategories]);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedActiveCategories, normalizedSearch]);

  // Optimized filtering with early returns
  const filteredPosts = useMemo(() => {
    // Fast path: if "all" is selected and no search, return all posts
    if (
      normalizedActiveCategories.includes("all") &&
      !normalizedSearch
    ) {
      return blogPosts;
    }

    // Pre-compute normalized category values for all posts
    const postsWithNormalizedCategories = blogPosts.map((post) => ({
      post,
      normalizedCategories: [
        post.category ?? undefined,
        ...post.tags,
      ]
        .filter(Boolean)
        .map((value) => normalizeCategoryValue(value)),
      searchableText: [
        post.title,
        post.description,
        post.author,
        ...post.tags,
        post.category,
      ]
        .filter(Boolean)
        .map((value) => value.toString().toLowerCase())
        .join(" "),
    }));

    return postsWithNormalizedCategories
      .filter(({ post, normalizedCategories, searchableText }) => {
        // Category filter
        if (!normalizedActiveCategories.includes("all")) {
          const matchesCategory = normalizedActiveCategories.some((activeCat) =>
            normalizedCategories.includes(activeCat)
          );
          if (!matchesCategory) return false;
        }

        // Search filter
        if (normalizedSearch) {
          return searchableText.includes(normalizedSearch);
        }

        return true;
      })
      .map(({ post }) => post);
  }, [blogPosts, normalizedActiveCategories, normalizedSearch]);

  const totalPosts = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (loading) {
    return (
      <section className="bg-background py-20 px-20">
        <div className="w-full">
          <div className="flex items-center justify-center min-h-[400px]">
            <LogoSpinner size={80} text="Loading blog posts..." />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-20 px-20">
      <div className="w-full">
        <div className="flex flex-col items-center gap-12">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Blog
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover insightful resources and expert advice from our seasoned
              team to elevate your knowledge.
            </p>
          </div>

          {/* Blog Grid */}
          {totalPosts === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No resources match your filters yet. Try adjusting your search or
              browsing all categories.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-[52px] w-full">
                {currentPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2 mt-8">
                  <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-muted border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "px-3 py-2 transition-all duration-300 ease-in-out",
                            currentPage === page
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-transparent"
                          )}
                          variant={currentPage === page ? "default" : "ghost"}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="text-muted-foreground px-2">...</span>
                        <Button
                          onClick={() => setCurrentPage(totalPages)}
                          variant="ghost"
                          className="px-3 py-2 bg-muted border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all duration-300 ease-in-out"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-muted border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
