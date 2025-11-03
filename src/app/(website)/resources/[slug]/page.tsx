import React from "react";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Header, Footer } from "@/components/website/resources";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
} from "lucide-react";
import { Post } from "@/types/blog";
import {
  getPostBySlug,
  getAllPublishedSlugs,
  getRelatedPosts,
  getAuthorName,
} from "@/lib/blog/server-fetch";
import { BlogPostInteractions } from "@/components/website/resources/BlogPostInteractions";
import { RelatedPostsSection } from "@/components/website/resources/RelatedPostsSection";
import { BlogContent } from "@/components/website/resources/BlogContent";
import { StructuredData } from "@/components/website/resources/StructuredData";

// ISR Configuration: Revalidate every hour (3600 seconds)
export const revalidate = 3600;

// Generate static params for all published posts at build time
export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  // Get base URL from environment or default
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://atraiva.ai";
  const postUrl = `${baseUrl}/resources/${post.slug}`;
  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.excerpt || "";
  const image = post.ogImage || post.featuredImage || `${baseUrl}/logo-light.png`;
  const authorName = await (post.authorId ? getAuthorName(post.authorId) : Promise.resolve("Atraiva Team"));

  return {
    title: `${title} | Atraiva Resources`,
    description,
    keywords: post.seo?.keywords || post.tags,
    authors: [{ name: authorName }],
    creator: authorName,
    publisher: "Atraiva",
    openGraph: {
      title,
      description,
      url: postUrl,
      siteName: "Atraiva",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: post.language || "en_US",
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [authorName],
      section: post.category || undefined,
      tags: post.tags,
    },
    twitter: {
      card: post.twitterCard || "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
      creator: "@atraiva", // Update with actual Twitter handle if available
    },
    robots: post.noindex ? "noindex, nofollow" : "index, follow",
    alternates: {
      canonical: post.canonicalUrl || postUrl,
    },
    other: {
      "article:published_time": post.publishedAt?.toISOString() || "",
      "article:modified_time": post.updatedAt.toISOString(),
      "article:author": authorName,
      "article:section": post.category || "",
      "article:tag": post.tags?.join(", ") || "",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch author name and related posts in parallel
  const [authorName, relatedPosts] = await Promise.all([
    post.authorId ? getAuthorName(post.authorId) : Promise.resolve("Atraiva Team"),
    getRelatedPosts(post, 3),
  ]);

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get base URL for structured data
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://atraiva.ai";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured Data for SEO */}
      <StructuredData post={post} authorName={authorName} baseUrl={baseUrl} />
      <Header />

      {/* Hero Section */}
      <section className="relative pt-[160px] pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button and Category Badge - Aligned */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/resources">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resources
              </Button>
            </Link>
            {post.category && (
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                {post.category}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{authorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTimeMinutes || 5} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.views || 0} views</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Featured Image - LCP optimization */}
          {post.featuredImage && (
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-12">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODk2IiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYxZjFmIi8+PC9zdmc+"
              />
            </div>
          )}

          {/* Share Buttons and Like - Client Component */}
          <BlogPostInteractions
            post={post}
            initialLikes={post.likes || 0}
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <BlogContent post={post} />
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <RelatedPostsSection posts={relatedPosts} />
      )}

      <Footer />
    </div>
  );
}
