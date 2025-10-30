// types/blog.ts
export type PostStatus =
  | "draft"
  | "review"
  | "scheduled"
  | "published"
  | "archived";
export type TwitterCard = "summary" | "summary_large_image";

export type TocItem = {
  text: string;
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
};

export type ReactionMap = Record<string, number>; // e.g., { "👍": 12, "💡": 3 }

export type PostSEO = {
  title?: string;
  description?: string;
  keywords?: string[];
};

export type PostContent =
  | {
      // Editor.js/Slate-style JSON
      type: "blocks";
      blocks: unknown[]; // keep unknown for editor-agnostic storage
      time?: number;
      version?: string;
    }
  | {
      // Rendered or curated HTML
      type: "html";
      html: string;
    };

export type Post = {
  id: string; // Firestore doc id
  title: string;
  slug: string; // immutable after publish
  excerpt?: string | null;
  content: PostContent;
  featuredImage?: string | null; // Firebase Storage URL
  tags: string[]; // tag slugs or names
  category?: string | null;

  authorId: string; // reference to users/{id}
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
  scheduledFor?: Date | null;

  // Metrics
  wordCount?: number;
  charCount?: number;
  readTimeMinutes?: number;
  imageCount?: number;
  codeBlockCount?: number;
  tableCount?: number;

  // Navigation/SEO
  toc?: TocItem[];
  seo?: PostSEO;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  twitterCard?: TwitterCard;
  noindex?: boolean;

  // Relationships
  seriesId?: string | null;
  seriesOrder?: number | null;
  relatedPostIds?: string[]; // curated

  // Engagement (denormalized)
  views?: number;
  likes?: number;
  reactions?: ReactionMap;
  commentCount?: number;
  lastCommentAt?: Date | null;

  // Ops
  language?: string; // e.g., "en-US"
  translatedFromPostId?: string | null;
  readingLevel?: number | null; // e.g., Flesch score
  sensitivity?: string[]; // e.g., ["finance", "pii"]
  a11yScore?: number | null;
  brokenLinksCount?: number | null;

  rev?: string; // content hash
  renderedHtmlRev?: string; // for cache busting / ISR
  feedIncluded?: boolean;
  sitemapPriority?: number | null; // 0.0 - 1.0
};

export type UserAuthor = {
  id: string;
  name: string;
  email?: string;
  bio?: string;
  avatar?: string | null; // Storage URL
  social?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    github?: string;
  };
  role: "admin" | "editor" | "author" | "reader";
  joinedAt: Date;
};

export type Comment = {
  id: string;
  postId: string;
  userId: string; // or anonymous token if you support guests
  content: string;
  createdAt: Date;
  likes?: number;
  approved: boolean;
  parentId?: string | null; // for threads
  repliesCount?: number; // optional denormalization
};

export type Tag = {
  id: string; // tag slug
  name: string; // display name
  description?: string;
  postCount?: number; // denormalized
};

export type Analytics = {
  id: string; // same as postId or composite
  postId: string;
  views: number;
  uniqueVisitors?: number;
  lastViewedAt?: Date | null;
};

// Blog Template System
export type BlogTemplate = {
  id: string;
  name: string;
  description: string;
  category: "news" | "tutorial" | "case-study" | "announcement" | "general";
  icon?: string; // emoji or icon name
  defaultTitle?: string;
  defaultExcerpt?: string;
  defaultContent: string; // HTML template with placeholders
  defaultTags?: string[];
  defaultCategory?: string;
  sections: TemplateSection[];
  placeholders?: TemplatePlaceholder[];
};

export type TemplateSection = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  order: number;
};

export type TemplatePlaceholder = {
  id: string;
  label: string;
  type: "text" | "date" | "number" | "url" | "list";
  description?: string;
  example?: string;
};
