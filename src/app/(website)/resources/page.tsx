import React from "react";
import { Metadata } from "next";
import {
  Header,
  Hero,
  BrowseSection,
  BlogGrid,
  Newsletter,
  CTA,
  Footer,
} from "@/components/website/resources";
import { getPublishedPosts } from "@/lib/blog/server-fetch";
import { Post } from "@/types/blog";
import { ResourcesPageClient } from "./resources-client";

// ISR Configuration: Revalidate every hour (3600 seconds)
export const revalidate = 3600;

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Resources & Blog | Atraiva",
  description:
    "Discover insightful cybersecurity resources, expert analysis, and cutting-edge insights from Atraiva. Stay ahead of emerging threats with our comprehensive blog posts.",
  keywords: [
    "cybersecurity",
    "data breach",
    "compliance",
    "security insights",
    "threat detection",
    "incident response",
    "data protection",
    "privacy",
    "GDPR",
    "HIPAA",
  ],
  openGraph: {
    title: "Resources & Blog | Atraiva",
    description:
      "Discover insightful cybersecurity resources, expert analysis, and cutting-edge insights from Atraiva.",
    url: "https://atraiva.ai/resources",
    siteName: "Atraiva",
    images: [
      {
        url: "https://atraiva.ai/logo-light.png",
        width: 1200,
        height: 630,
        alt: "Atraiva Resources",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources & Blog | Atraiva",
    description:
      "Discover insightful cybersecurity resources, expert analysis, and cutting-edge insights from Atraiva.",
    images: ["https://atraiva.ai/logo-light.png"],
  },
  alternates: {
    canonical: "https://atraiva.ai/resources",
  },
};

export default async function ResourcesPage() {
  // Fetch published posts server-side
  const posts = await getPublishedPosts(100);

  // Find hero post (featured or most recent)
  const featuredPost = posts.find((post) => post.featured === true);
  const heroPost: Post | null = featuredPost || posts[0] || null;

  // Generate collection structured data
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://atraiva.ai";
  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Atraiva Resources",
    description: "Cybersecurity resources, blog posts, and expert insights",
    url: `${baseUrl}/resources`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "BlogPosting",
          headline: post.title,
          url: `${baseUrl}/resources/${post.slug}`,
          datePublished: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
        },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#0F0C0B] text-gray-200">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionStructuredData),
        }}
      />
      <Header />
      <ResourcesPageClient initialPosts={posts} initialHeroPost={heroPost} />
      <Newsletter />
      <CTA />
      <Footer />
    </div>
  );
}
