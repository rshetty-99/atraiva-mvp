import React from "react";
import { Post } from "@/types/blog";

type StructuredDataProps = {
  post: Post;
  authorName: string;
  baseUrl?: string;
};

export function StructuredData({ post, authorName, baseUrl = "https://atraiva.ai" }: StructuredDataProps) {
  const postUrl = `${baseUrl}/resources/${post.slug}`;
  const imageUrl = post.ogImage || post.featuredImage || `${baseUrl}/logo-light.png`;
  const publishedDate = post.publishedAt?.toISOString() || post.createdAt.toISOString();
  const modifiedDate = post.updatedAt.toISOString();

  // Article structured data (JSON-LD)
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.seo?.description || "",
    image: imageUrl,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Atraiva",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo-light.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    url: postUrl,
    articleSection: post.category || "General",
    keywords: post.tags?.join(", ") || post.seo?.keywords?.join(", ") || "",
    wordCount: post.wordCount || 0,
    timeRequired: `PT${post.readTimeMinutes || 5}M`,
    inLanguage: post.language || "en-US",
    ...(post.featuredImage && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
      },
    }),
  };

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Resources",
        item: `${baseUrl}/resources`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  // Organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Atraiva",
    url: baseUrl,
    logo: `${baseUrl}/logo-light.png`,
    sameAs: [
      // Add social media links if available
      // "https://twitter.com/atraiva",
      // "https://linkedin.com/company/atraiva",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
    </>
  );
}

