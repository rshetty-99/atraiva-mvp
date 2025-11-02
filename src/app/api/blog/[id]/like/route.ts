// API route to increment likes for a blog post
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment likes count atomically
    await updateDoc(docRef, {
      likes: increment(1),
    });

    // Get updated likes count
    const updatedDoc = await getDoc(docRef);
    const updatedLikes = updatedDoc.data()?.likes || 0;

    return NextResponse.json({
      success: true,
      likes: updatedLikes,
    });
  } catch (error) {
    console.error("Error incrementing likes:", error);
    return NextResponse.json(
      { error: "Failed to increment likes" },
      { status: 500 }
    );
  }
}

