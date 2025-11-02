// API route to fetch author information for blog posts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, query, collection, where, getDocs, limit } from "firebase/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Author ID is required" },
        { status: 400 }
      );
    }

    // Try to get user from Firestore
    // First try as direct user document ID
    let userDoc = await getDoc(doc(db, "users", id));
    
    if (!userDoc.exists()) {
      // If not found, try to find by Clerk ID (authorId might be a Clerk ID)
      const q = query(
        collection(db, "users"),
        where("auth.clerkId", "==", id),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        userDoc = querySnapshot.docs[0] as any;
      } else {
        return NextResponse.json(
          { author: null, message: "Author not found" },
          { status: 404 }
        );
      }
    }

    const userData = userDoc.data();
    
    // Build author name with fallback priority:
    // 1. displayName
    // 2. firstName + lastName
    // 3. email username (part before @)
    // 4. "Atraiva Team" (fallback)
    const firstName = userData.profile?.firstName || "";
    const lastName = userData.profile?.lastName || "";
    const displayName = userData.profile?.displayName;
    const email = userData.auth?.email || "";
    
    let authorName = "Atraiva Team";
    if (displayName) {
      authorName = displayName;
    } else if (firstName || lastName) {
      authorName = `${firstName} ${lastName}`.trim();
    } else if (email) {
      authorName = email.split("@")[0];
    }
    
    // Return safe author information
    return NextResponse.json({
      author: {
        id: userDoc.id,
        name: authorName,
        profile: {
          firstName: userData.profile?.firstName || null,
          lastName: userData.profile?.lastName || null,
          displayName: userData.profile?.displayName || null,
        },
        auth: {
          email: userData.auth?.email || null,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching author:", error);
    return NextResponse.json(
      { error: "Failed to fetch author information" },
      { status: 500 }
    );
  }
}

