// API route for individual blog post - GET, PUT (update), DELETE
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { Post } from "@/types/blog";
import { auth } from "@clerk/nextjs/server";
import { cleanupImages, extractImagesFromHtml } from "@/lib/firebase/storage";

// GET - Get a single blog post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const data = docSnap.data();
    const post: Post = {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      publishedAt: data.publishedAt?.toDate() || null,
      scheduledFor: data.scheduledFor?.toDate() || null,
      lastCommentAt: data.lastCommentAt?.toDate() || null,
    } as Post;

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Get the existing post to check ownership and compare images
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existingData = docSnap.data();

    // Optional: Check if user is the author (can be adjusted based on your permission system)
    // if (existingData.authorId !== userId) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

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

    // Calculate metrics
    const htmlContent =
      content.type === "html" ? content.html : JSON.stringify(content.blocks);
    const wordCount = htmlContent.split(/\s+/).length;
    const charCount = htmlContent.length;
    const readTimeMinutes = Math.ceil(wordCount / 200);

    // Check if status changed to published
    const shouldUpdatePublishedAt =
      status === "published" && existingData.status !== "published";

    // Prepare update data
    const updateData: any = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      featuredImage: featuredImage || null,
      tags: tags || [],
      category: category || null,
      status: status || "draft",
      updatedAt: Timestamp.now(),
      scheduledFor: scheduledFor
        ? Timestamp.fromDate(new Date(scheduledFor))
        : null,
      wordCount,
      charCount,
      readTimeMinutes,
      toc: toc || null,
      seo: seo || null,
      canonicalUrl: canonicalUrl || null,
      ogImage: ogImage || null,
      twitterCard: twitterCard || "summary_large_image",
      noindex: noindex || false,
      seriesId: seriesId || null,
      seriesOrder: seriesOrder || null,
      relatedPostIds: relatedPostIds || [],
      language: language || "en-US",
    };

    // Update publishedAt if newly published
    if (shouldUpdatePublishedAt) {
      updateData.publishedAt = Timestamp.now();
    }

    await updateDoc(docRef, updateData);

    // Clean up unused images (optional - can be done in a background job)
    try {
      const oldImages = extractImagesFromHtml(
        existingData.content?.type === "html" ? existingData.content.html : ""
      );
      const newImages = extractImagesFromHtml(
        content.type === "html" ? content.html : ""
      );

      // Add featured images to the comparison
      if (existingData.featuredImage)
        oldImages.push(existingData.featuredImage);
      if (featuredImage) newImages.push(featuredImage);

      await cleanupImages(oldImages, newImages);
    } catch (cleanupError) {
      console.error("Error cleaning up images:", cleanupError);
      // Don't fail the update if cleanup fails
    }

    return NextResponse.json({
      success: true,
      message: "Blog post updated successfully",
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the post to check ownership and clean up images
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existingData = docSnap.data();

    // Optional: Check if user is the author
    // if (existingData.authorId !== userId) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    // Delete the post
    await deleteDoc(docRef);

    // Clean up images (optional - can be done in a background job)
    try {
      const images = extractImagesFromHtml(
        existingData.content?.type === "html" ? existingData.content.html : ""
      );

      if (existingData.featuredImage) {
        images.push(existingData.featuredImage);
      }

      await cleanupImages(images);
    } catch (cleanupError) {
      console.error("Error cleaning up images:", cleanupError);
      // Don't fail the delete if cleanup fails
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
