// API route for blog posts - GET (list) and POST (create)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { Post, PostStatus } from "@/types/blog";
import { auth } from "@clerk/nextjs/server";

// GET - List all blog posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Check if Firebase is initialized
    if (!db) {
      console.error("Firebase database is not initialized");
      return NextResponse.json(
        {
          error: "Database not initialized",
          message: "Firebase configuration may be missing",
        },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as PostStatus | null;
    const tag = searchParams.get("tag");
    const category = searchParams.get("category");
    const limitParam = parseInt(searchParams.get("limit") || "10");
    const published = searchParams.get("published") === "true";

    // Build query with simpler constraints to avoid index requirements
    const queryConstraints: QueryConstraint[] = [];

    // Add status filter if specified
    if (status) {
      queryConstraints.push(where("status", "==", status));
    } else if (published) {
      // Filter for published posts only (for public view)
      queryConstraints.push(where("status", "==", "published"));
    }

    // Add tag filter if specified (note: may require index with orderBy)
    if (tag) {
      queryConstraints.push(where("tags", "array-contains", tag));
    }

    // Add category filter if specified
    if (category) {
      queryConstraints.push(where("category", "==", category));
    }

    // Add orderBy and limit
    queryConstraints.push(orderBy("createdAt", "desc"));
    queryConstraints.push(limit(limitParam));

    const q = query(collection(db, "posts"), ...queryConstraints);

    const snapshot = await getDocs(q);
    const posts: Post[] = [];

    snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        publishedAt: data.publishedAt?.toDate() || null,
        scheduledFor: data.scheduledFor?.toDate() || null,
        lastCommentAt: data.lastCommentAt?.toDate() || null,
      } as Post);
    });

    return NextResponse.json({ posts, total: posts.length });
  } catch (error) {
    console.error("Error fetching blog posts:", error);

    // Return more detailed error for debugging
    return NextResponse.json(
      {
        error: "Failed to fetch blog posts",
        message: error instanceof Error ? error.message : "Unknown error",
        code: (error as { code?: string })?.code || "unknown",
      },
      { status: 500 }
    );
  }
}

// POST - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      tags,
      category,
      status,
      scheduledFor,
      seo,
      toc,
      canonicalUrl,
      ogImage,
      twitterCard,
      noindex,
      seriesId,
      seriesOrder,
      relatedPostIds,
      language,
    } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Calculate metrics
    const htmlContent =
      content.type === "html" ? content.html : JSON.stringify(content.blocks);
    const wordCount = htmlContent.split(/\s+/).length;
    const charCount = htmlContent.length;
    const readTimeMinutes = Math.ceil(wordCount / 200); // Average reading speed

    // Create the post document
    const postData = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      featuredImage: featuredImage || null,
      tags: tags || [],
      category: category || null,
      authorId: userId,
      status: status || "draft",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      publishedAt: status === "published" ? Timestamp.now() : null,
      scheduledFor: scheduledFor
        ? Timestamp.fromDate(new Date(scheduledFor))
        : null,
      wordCount,
      charCount,
      readTimeMinutes,
      imageCount: 0, // Can be calculated from content
      codeBlockCount: 0,
      tableCount: 0,
      toc: toc || null,
      seo: seo || null,
      canonicalUrl: canonicalUrl || null,
      ogImage: ogImage || null,
      twitterCard: twitterCard || "summary_large_image",
      noindex: noindex || false,
      seriesId: seriesId || null,
      seriesOrder: seriesOrder || null,
      relatedPostIds: relatedPostIds || [],
      views: 0,
      likes: 0,
      reactions: {},
      commentCount: 0,
      lastCommentAt: null,
      language: language || "en-US",
      feedIncluded: true,
      sitemapPriority: 0.8,
    };

    const docRef = await addDoc(collection(db, "posts"), postData);

    return NextResponse.json(
      {
        success: true,
        postId: docRef.id,
        message: "Blog post created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
