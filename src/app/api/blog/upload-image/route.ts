// API route for uploading blog images
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  uploadImage,
  generateImagePath,
  validateImage,
} from "@/lib/firebase/storage";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const postId = formData.get("postId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate the image
    const validation = validateImage(file, 5); // 5MB max
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Generate a unique path for the image
    const path = generateImagePath(file.name, postId || undefined);

    // Upload the image
    const downloadURL = await uploadImage(file, path);

    return NextResponse.json({
      success: true,
      url: downloadURL,
      path,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
