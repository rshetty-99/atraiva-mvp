"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/website/resources";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  ThumbsUp,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
} from "lucide-react";
import { Post } from "@/types/blog";
import { toast } from "sonner";
import "react-quill-new/dist/quill.snow.css";
import { LogoSpinner } from "@/components/ui/logo-spinner";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [authorName, setAuthorName] = useState<string>("Atraiva Team");
  const [likes, setLikes] = useState<number>(0);
  const [isLiking, setIsLiking] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all posts and find by slug
      const response = await fetch("/api/blog?published=true");

      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await response.json();
      const posts: Post[] = data.posts || [];
      const foundPost = posts.find((p) => p.slug === slug);

      if (!foundPost) {
        router.push("/resources");
        return;
      }

      setPost(foundPost);
      setLikes(foundPost.likes || 0);

      // Fetch author information
      if (foundPost.authorId) {
        try {
          const authorResponse = await fetch(`/api/blog/author/${foundPost.authorId}`);
          if (authorResponse.ok) {
            const authorData = await authorResponse.json();
            if (authorData.author?.name) {
              setAuthorName(authorData.author.name);
            }
          }
        } catch (error) {
          console.error("Error fetching author:", error);
          // Keep default "Atraiva Team"
        }
      }

      // Get related posts by tags
      const related = posts
        .filter(
          (p) =>
            p.id !== foundPost.id &&
            p.tags.some((tag) => foundPost.tags.includes(tag))
        )
        .slice(0, 3);

      setRelatedPosts(related);

      // Increment view count (optional - would need API endpoint)
      incrementViewCount(foundPost.id);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load blog post");
      router.push("/resources");
    } finally {
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, fetchPost]);

  const incrementViewCount = async (postId: string) => {
    // Optional: Implement API endpoint to increment view count
    try {
      await fetch(`/api/blog/${postId}/view`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const handleLike = async () => {
    if (!post || isLiking) return;

    try {
      setIsLiking(true);
      const response = await fetch(`/api/blog/${post.id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        toast.success("Thanks for liking!");
      } else {
        toast.error("Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] py-20">
          <LogoSpinner size={80} text="Loading blog post..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
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
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center gap-2 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ThumbsUp className={`w-4 h-4 ${isLiking ? "animate-pulse" : ""}`} />
              <span>{likes} likes</span>
            </button>
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

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-12">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-border">
            <span className="text-sm text-muted-foreground">Share:</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare("twitter")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Twitter className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare("facebook")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Facebook className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare("linkedin")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Linkedin className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare("copy")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Link2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <style jsx global>{`
            .blog-content {
              color: hsl(var(--foreground));
              line-height: 1.8;
              font-size: 1.125rem;
            }

            .blog-content h1,
            .blog-content h2,
            .blog-content h3,
            .blog-content h4,
            .blog-content h5,
            .blog-content h6 {
              color: hsl(var(--foreground));
              font-weight: 700;
              margin-top: 2rem;
              margin-bottom: 1rem;
            }

            .blog-content h1 {
              font-size: 2.5rem;
            }

            .blog-content h2 {
              font-size: 2rem;
            }

            .blog-content h3 {
              font-size: 1.5rem;
            }

            .blog-content p {
              margin-bottom: 1.5rem;
            }

            .blog-content a {
              color: hsl(var(--primary));
              text-decoration: underline;
            }

            .blog-content a:hover {
              color: hsl(var(--primary) / 0.8);
            }

            .blog-content img {
              max-width: 100%;
              height: auto;
              border-radius: 0.5rem;
              margin: 2rem auto;
              display: block;
            }

            .blog-content pre {
              background: hsl(var(--muted));
              color: hsl(var(--foreground));
              padding: 1.5rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 2rem 0;
            }

            .blog-content code {
              background: hsl(var(--muted));
              color: hsl(var(--foreground));
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              font-size: 0.875rem;
            }

            .blog-content pre code {
              background: transparent;
              padding: 0;
            }

            .blog-content blockquote {
              border-left: 4px solid hsl(var(--primary));
              padding-left: 1.5rem;
              margin: 2rem 0;
              color: hsl(var(--muted-foreground));
              font-style: italic;
            }

            .blog-content ul,
            .blog-content ol {
              margin-bottom: 1.5rem;
              padding-left: 2rem;
            }

            .blog-content li {
              margin-bottom: 0.5rem;
            }

            .blog-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 2rem 0;
            }

            .blog-content th,
            .blog-content td {
              border: 1px solid hsl(var(--border));
              padding: 0.75rem;
              text-align: left;
            }

            .blog-content th {
              background: hsl(var(--muted));
              font-weight: 600;
            }

            /* Override light backgrounds from imported HTML to preserve readability in dark mode */
            .blog-content .bg-white,
            .blog-content .bg-blue-50,
            .blog-content .bg-blue-100,
            .blog-content .bg-sky-50,
            .blog-content .bg-sky-100,
            .blog-content .bg-red-50,
            .blog-content .bg-red-100,
            .blog-content .bg-rose-50,
            .blog-content .bg-rose-100,
            .blog-content .bg-pink-50,
            .blog-content .bg-pink-100,
            .blog-content .bg-gray-50,
            .blog-content .bg-gray-100,
            .blog-content .bg-slate-50,
            .blog-content .bg-slate-100,
            .blog-content .bg-green-50,
            .blog-content .bg-green-100,
            .blog-content .bg-zinc-50,
            .blog-content .bg-zinc-100,
            .blog-content .bg-neutral-50,
            .blog-content .bg-neutral-100,
            .blog-content .bg-purple-50,
            .blog-content .bg-purple-100,
            .blog-content .bg-violet-50,
            .blog-content .bg-violet-100,
            .blog-content .bg-indigo-50,
            .blog-content .bg-indigo-100,
            .blog-content .bg-orange-50,
            .blog-content .bg-orange-100,
            .blog-content .bg-amber-50,
            .blog-content .bg-amber-100,
            .blog-content .bg-yellow-50,
            .blog-content .bg-yellow-100,
            .blog-content .bg-lime-50,
            .blog-content .bg-lime-100,
            .blog-content .bg-teal-50,
            .blog-content .bg-teal-100,
            .blog-content .bg-cyan-50,
            .blog-content .bg-cyan-100,
            .blog-content [style*="background-color: #fff"],
            .blog-content [style*="background-color:#fff"],
            .blog-content [style*="background-color: #ffffff"],
            .blog-content [style*="background:#fff"],
            .blog-content [style*="background: #fff"],
            .blog-content [style*="background: rgb(255, 255, 255)"],
            .blog-content [style*="background-color: rgb(255, 255, 255)"],
            .blog-content [style*="background-color: #eff6ff"],
            .blog-content [style*="background-color:#eff6ff"],
            .blog-content [style*="background-color: #ecfeff"],
            .blog-content [style*="background-color:#ecfeff"],
            .blog-content [style*="background-color: #f0fdf4"],
            .blog-content [style*="background-color:#f0fdf4"],
            .blog-content [style*="background-color: #dcfce7"],
            .blog-content [style*="background-color:#dcfce7"],
            .blog-content [style*="background-color: #edf2ff"],
            .blog-content [style*="background-color:#edf2ff"],
            .blog-content [style*="background-color: #fef2f2"],
            .blog-content [style*="background-color:#fef2f2"],
            .blog-content [style*="background-color: #fdf2f8"],
            .blog-content [style*="background-color:#fdf2f8"],
            .blog-content [style*="background-color: #fff1f2"],
            .blog-content [style*="background-color:#fff1f2"],
            .blog-content [style*="background-color: #ffe4e6"],
            .blog-content [style*="background-color:#ffe4e6"],
            .blog-content [style*="background-color: #fdf2f2"],
            .blog-content [style*="background-color:#fdf2f2"],
            .blog-content [style*="background-color: #fde8e8"],
            .blog-content [style*="background-color:#fde8e8"],
            .blog-content [style*="background-color: #faf5ff"],
            .blog-content [style*="background-color:#faf5ff"],
            .blog-content [style*="background-color: #f5f3ff"],
            .blog-content [style*="background-color:#f5f3ff"],
            .blog-content [style*="background-color: #ede9fe"],
            .blog-content [style*="background-color:#ede9fe"],
            .blog-content [style*="background-color: #eef2ff"],
            .blog-content [style*="background-color:#eef2ff"],
            .blog-content [style*="background-color: #fff7ed"],
            .blog-content [style*="background-color:#fff7ed"],
            .blog-content [style*="background-color: #fffbeb"],
            .blog-content [style*="background-color:#fffbeb"],
            .blog-content [style*="background-color: #fefce8"],
            .blog-content [style*="background-color:#fefce8"],
            .blog-content [style*="background-color: #f7fee7"],
            .blog-content [style*="background-color:#f7fee7"],
            .blog-content [style*="background-color: #f0fdfa"],
            .blog-content [style*="background-color:#f0fdfa"],
            .blog-content [style*="background-color: #ecfeff"],
            .blog-content [style*="background-color:#ecfeff"] {
              background-color: rgba(255, 255, 255, 0.92) !important;
              color: #0f172a !important;
            }

            .blog-content .bg-blue-50 *,
            .blog-content .bg-blue-100 *,
            .blog-content .bg-sky-50 *,
            .blog-content .bg-sky-100 *,
            .blog-content .bg-green-50 *,
            .blog-content .bg-green-100 *,
            .blog-content .bg-red-50 *,
            .blog-content .bg-red-100 *,
            .blog-content .bg-rose-50 *,
            .blog-content .bg-rose-100 *,
            .blog-content .bg-pink-50 *,
            .blog-content .bg-pink-100 *,
            .blog-content .bg-purple-50 *,
            .blog-content .bg-purple-100 *,
            .blog-content .bg-violet-50 *,
            .blog-content .bg-violet-100 *,
            .blog-content .bg-indigo-50 *,
            .blog-content .bg-indigo-100 *,
            .blog-content .bg-orange-50 *,
            .blog-content .bg-orange-100 *,
            .blog-content .bg-amber-50 *,
            .blog-content .bg-amber-100 *,
            .blog-content .bg-yellow-50 *,
            .blog-content .bg-yellow-100 *,
            .blog-content .bg-lime-50 *,
            .blog-content .bg-lime-100 *,
            .blog-content .bg-teal-50 *,
            .blog-content .bg-teal-100 *,
            .blog-content .bg-cyan-50 *,
            .blog-content .bg-cyan-100 *,
            .blog-content .bg-white *,
            .blog-content [style*="background-color: rgb(255, 255, 255)"] *,
            .blog-content [style*="background-color:#eff6ff"] *,
            .blog-content [style*="background-color: #eff6ff"] *,
            .blog-content [style*="background-color:#ecfeff"] *,
            .blog-content [style*="background-color: #ecfeff"] *,
            .blog-content [style*="background-color:#f0fdf4"] *,
            .blog-content [style*="background-color: #f0fdf4"] *,
            .blog-content [style*="background-color:#dcfce7"] *,
            .blog-content [style*="background-color: #dcfce7"] *,
            .blog-content [style*="background-color:#edf2ff"] *,
            .blog-content [style*="background-color: #edf2ff"] *,
            .blog-content [style*="background-color:#fef2f2"] *,
            .blog-content [style*="background-color: #fef2f2"] *,
            .blog-content [style*="background-color:#fdf2f8"] *,
            .blog-content [style*="background-color: #fdf2f8"] *,
            .blog-content [style*="background-color:#fff1f2"] *,
            .blog-content [style*="background-color: #fff1f2"] *,
            .blog-content [style*="background-color:#ffe4e6"] *,
            .blog-content [style*="background-color: #ffe4e6"] *,
            .blog-content [style*="background-color:#fdf2f2"] *,
            .blog-content [style*="background-color: #fdf2f2"] *,
            .blog-content [style*="background-color:#fde8e8"] *,
            .blog-content [style*="background-color: #fde8e8"] *,
            .blog-content [style*="background-color:#faf5ff"] *,
            .blog-content [style*="background-color: #faf5ff"] *,
            .blog-content [style*="background-color:#f5f3ff"] *,
            .blog-content [style*="background-color: #f5f3ff"] *,
            .blog-content [style*="background-color:#ede9fe"] *,
            .blog-content [style*="background-color: #ede9fe"] *,
            .blog-content [style*="background-color:#eef2ff"] *,
            .blog-content [style*="background-color: #eef2ff"] *,
            .blog-content [style*="background-color:#fff7ed"] *,
            .blog-content [style*="background-color: #fff7ed"] *,
            .blog-content [style*="background-color:#fffbeb"] *,
            .blog-content [style*="background-color: #fffbeb"] *,
            .blog-content [style*="background-color:#fefce8"] *,
            .blog-content [style*="background-color: #fefce8"] *,
            .blog-content [style*="background-color:#f7fee7"] *,
            .blog-content [style*="background-color: #f7fee7"] *,
            .blog-content [style*="background-color:#f0fdfa"] *,
            .blog-content [style*="background-color: #f0fdfa"] * {
              color: inherit !important;
            }

            .blog-content .text-black,
            .blog-content .text-gray-900,
            .blog-content .text-gray-800,
            .blog-content .text-slate-900,
            .blog-content .text-slate-800,
            .blog-content .text-zinc-900,
            .blog-content .text-neutral-900,
            .blog-content .text-neutral-800,
            .blog-content .text-gray-700,
            .blog-content .text-slate-700,
            .blog-content .text-blue-700,
            .blog-content .text-blue-600,
            .blog-content .text-blue-500,
            .blog-content .text-sky-700,
            .blog-content .text-green-700,
            .blog-content .text-green-600,
            .blog-content .text-green-500,
            .blog-content .text-red-700,
            .blog-content .text-red-600,
            .blog-content .text-red-500,
            .blog-content .text-rose-700,
            .blog-content .text-rose-600,
            .blog-content .text-rose-500,
            .blog-content .text-pink-700,
            .blog-content .text-pink-600,
            .blog-content .text-pink-500,
            .blog-content .text-purple-700,
            .blog-content .text-purple-600,
            .blog-content .text-purple-500,
            .blog-content .text-purple-400,
            .blog-content .text-violet-700,
            .blog-content .text-violet-600,
            .blog-content .text-violet-500,
            .blog-content .text-violet-400,
            .blog-content .text-indigo-700,
            .blog-content .text-indigo-600,
            .blog-content .text-indigo-500,
            .blog-content .text-indigo-400,
            .blog-content .text-orange-700,
            .blog-content .text-orange-600,
            .blog-content .text-orange-500,
            .blog-content .text-amber-700,
            .blog-content .text-amber-600,
            .blog-content .text-amber-500,
            .blog-content .text-yellow-700,
            .blog-content .text-yellow-600,
            .blog-content .text-yellow-500 {
              color: #0f172a !important;
            }

            .blog-content .border-gray-200,
            .blog-content .border-slate-200,
            .blog-content .border-zinc-200,
            .blog-content .border-neutral-200,
            .blog-content .border-purple-200,
            .blog-content .border-violet-200,
            .blog-content .border-indigo-200,
            .blog-content .border-blue-200,
            .blog-content .border-green-200,
            .blog-content .border-orange-200,
            .blog-content [style*="border-color: #e5e7eb"],
            .blog-content [style*="border-color:#e5e7eb"],
            .blog-content [style*="border-color: #d1d5db"],
            .blog-content [style*="border-color: #e9d5ff"],
            .blog-content [style*="border-color:#e9d5ff"],
            .blog-content [style*="border-color: #ddd6fe"],
            .blog-content [style*="border-color:#ddd6fe"],
            .blog-content [style*="border: 1px solid #e5e7eb"],
            .blog-content [style*="border:1px solid #e5e7eb"],
            .blog-content [style*="border: 1px solid #d1d5db"],
            .blog-content [style*="border:1px solid #d1d5db"],
            .blog-content [style*="border: 1px solid #e9d5ff"],
            .blog-content [style*="border:1px solid #e9d5ff"],
            .blog-content [style*="border: 1px solid #ddd6fe"],
            .blog-content [style*="border:1px solid #ddd6fe"],
            .blog-content [style*="border: 4px solid #a855f7"],
            .blog-content [style*="border:4px solid #a855f7"],
            .blog-content [style*="border-left: 4px solid #a855f7"],
            .blog-content [style*="border-left:4px solid #a855f7"] {
              border-color: rgba(148, 163, 184, 0.4) !important;
            }
          `}</style>

          <div
            className="blog-content prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: post.content.type === "html" ? post.content.html : "",
            }}
          />
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-6 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/resources/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all">
                    {relatedPost.featuredImage && (
                      <div className="relative w-full h-48">
                        <Image
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{relatedPost.readTimeMinutes || 5} min read</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
