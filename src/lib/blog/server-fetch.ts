// Server-side data fetching utilities for blog posts
// These functions are used by Server Components and API routes for ISR

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { Post } from "@/types/blog";

/**
 * Fetch all published blog posts for server-side rendering
 * Used for the listing page and generating static params
 */
export async function getPublishedPosts(
  limitCount: number = 100
): Promise<Post[]> {
  try {
    if (!db) {
      console.error("Firebase database is not initialized");
      return [];
    }

    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
      firestoreLimit(limitCount)
    );

    const snapshot = await getDocs(q);
    const posts: Post[] = [];

    snapshot.forEach((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
      const data = docSnapshot.data();
      posts.push({
        id: docSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        publishedAt: data.publishedAt?.toDate() || null,
        scheduledFor: data.scheduledFor?.toDate() || null,
        lastCommentAt: data.lastCommentAt?.toDate() || null,
      } as Post);
    });

    return posts;
  } catch (error) {
    console.error("Error fetching published posts:", error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug
 * Used for the detail page server-side rendering
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    if (!db) {
      console.error("Firebase database is not initialized");
      return null;
    }

    // First, query for posts with this slug and published status
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      where("slug", "==", slug)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    // Get the first matching document
    const docSnapshot = snapshot.docs[0];
    const data = docSnapshot.data();

    return {
      id: docSnapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      publishedAt: data.publishedAt?.toDate() || null,
      scheduledFor: data.scheduledFor?.toDate() || null,
      lastCommentAt: data.lastCommentAt?.toDate() || null,
    } as Post;
  } catch (error) {
    console.error(`Error fetching post by slug (${slug}):`, error);
    return null;
  }
}

/**
 * Fetch a blog post by ID
 * Alternative method for direct ID lookup
 */
export async function getPostById(id: string): Promise<Post | null> {
  try {
    if (!db) {
      console.error("Firebase database is not initialized");
      return null;
    }

    const docRef = doc(db, "posts", id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      return null;
    }

    const data = docSnapshot.data();

    return {
      id: docSnapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      publishedAt: data.publishedAt?.toDate() || null,
      scheduledFor: data.scheduledFor?.toDate() || null,
      lastCommentAt: data.lastCommentAt?.toDate() || null,
    } as Post;
  } catch (error) {
    console.error(`Error fetching post by ID (${id}):`, error);
    return null;
  }
}

/**
 * Get all published post slugs for generateStaticParams
 * Returns array of slugs for static path generation
 */
export async function getAllPublishedSlugs(): Promise<string[]> {
  try {
    if (!db) {
      console.error("Firebase database is not initialized");
      return [];
    }

    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const slugs: string[] = [];

    snapshot.forEach((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
      const data = docSnapshot.data();
      if (data.slug) {
        slugs.push(data.slug);
      }
    });

    return slugs;
  } catch (error) {
    console.error("Error fetching published slugs:", error);
    return [];
  }
}

/**
 * Get related posts by matching tags
 * Used for the "Related Articles" section on detail pages
 */
export async function getRelatedPosts(
  currentPost: Post,
  limitCount: number = 3
): Promise<Post[]> {
  try {
    if (!db || !currentPost.tags || currentPost.tags.length === 0) {
      return [];
    }

    // Get all published posts
    const allPosts = await getPublishedPosts(100);

    // Filter and sort by tag overlap
    const related = allPosts
      .filter((post) => {
        // Exclude the current post
        if (post.id === currentPost.id) return false;

        // Check if posts share any tags
        return post.tags.some((tag) => currentPost.tags.includes(tag));
      })
      .sort((a, b) => {
        // Sort by number of matching tags (more matches = higher priority)
        const aMatches = a.tags.filter((tag) =>
          currentPost.tags.includes(tag)
        ).length;
        const bMatches = b.tags.filter((tag) =>
          currentPost.tags.includes(tag)
        ).length;

        if (bMatches !== aMatches) {
          return bMatches - aMatches;
        }

        // If same number of matches, sort by most recent
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, limitCount);

    return related;
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

/**
 * Get author name by author ID
 * Used for server-side rendering of author information
 */
export async function getAuthorName(authorId: string): Promise<string> {
  try {
    if (!db || !authorId) {
      return "Atraiva Team";
    }

    const { doc, getDoc, query, collection, where, getDocs, limit } =
      await import("firebase/firestore");

    // Try to get user from Firestore
    let userDoc = await getDoc(doc(db, "users", authorId));

    if (!userDoc.exists()) {
      // If not found, try to find by Clerk ID (authorId might be a Clerk ID)
      const q = query(
        collection(db, "users"),
        where("auth.clerkId", "==", authorId),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        userDoc = querySnapshot.docs[0];
      } else {
        return "Atraiva Team";
      }
    }

    const userData = userDoc.data();
    if (!userData) {
      return "Atraiva Team";
    }

    // Build author name with fallback priority
    const firstName = userData.profile?.firstName || "";
    const lastName = userData.profile?.lastName || "";
    const displayName = userData.profile?.displayName;
    const email = userData.auth?.email || "";

    if (displayName) {
      return displayName;
    } else if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    } else if (email) {
      return email.split("@")[0];
    }

    return "Atraiva Team";
  } catch (error) {
    console.error(`Error fetching author name (${authorId}):`, error);
    return "Atraiva Team";
  }
}
