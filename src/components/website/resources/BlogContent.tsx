"use client";

import React from "react";
import { Post } from "@/types/blog";

type BlogContentProps = {
  post: Post;
};

export function BlogContent({ post }: BlogContentProps) {
  return (
    <>
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
        .blog-content [style*="background-color: #edf2ff"],
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
        .blog-content [style*="background-color: #eef2ff"],
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
    </>
  );
}

