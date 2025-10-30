"use client";

import React, { useState, useEffect } from "react";
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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
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
  };

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
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
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
      <div className="min-h-screen bg-[#0F0C0B] text-gray-200">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-zinc-400">Loading blog post...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0F0C0B] text-gray-200">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/resources">
            <Button
              variant="ghost"
              className="mb-8 text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Button>
          </Link>

          {/* Category Badge */}
          {post.category && (
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500">
              {post.category}
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-8">
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
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              <span>{post.likes || 0} likes</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-zinc-300">
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
          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-zinc-800">
            <span className="text-sm text-zinc-400">Share:</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare("twitter")}
              className="text-zinc-400 hover:text-white"
            >
              <Twitter className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare("facebook")}
              className="text-zinc-400 hover:text-white"
            >
              <Facebook className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare("linkedin")}
              className="text-zinc-400 hover:text-white"
            >
              <Linkedin className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare("copy")}
              className="text-zinc-400 hover:text-white"
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
              color: #e2e8f0;
              line-height: 1.8;
              font-size: 1.125rem;
            }

            .blog-content h1,
            .blog-content h2,
            .blog-content h3,
            .blog-content h4,
            .blog-content h5,
            .blog-content h6 {
              color: #fff;
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
              color: #3b82f6;
              text-decoration: underline;
            }

            .blog-content a:hover {
              color: #60a5fa;
            }

            .blog-content img {
              max-width: 100%;
              height: auto;
              border-radius: 0.5rem;
              margin: 2rem auto;
              display: block;
            }

            .blog-content pre {
              background: #1e293b;
              color: #e2e8f0;
              padding: 1.5rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 2rem 0;
            }

            .blog-content code {
              background: #1e293b;
              color: #e2e8f0;
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              font-size: 0.875rem;
            }

            .blog-content pre code {
              background: transparent;
              padding: 0;
            }

            .blog-content blockquote {
              border-left: 4px solid #3b82f6;
              padding-left: 1.5rem;
              margin: 2rem 0;
              color: #94a3b8;
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
              border: 1px solid #334155;
              padding: 0.75rem;
              text-align: left;
            }

            .blog-content th {
              background: #1e293b;
              font-weight: 600;
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
        <section className="py-16 px-6 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/resources/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all">
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
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.excerpt && (
                        <p className="text-sm text-zinc-400 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500">
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
