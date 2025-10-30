// Firebase Storage utilities for blog images
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";

/**
 * Upload an image to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'blog-images/postId/imageName.jpg')
 * @returns Promise with the download URL
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

/**
 * Upload an image with progress tracking
 * @param file - The file to upload
 * @param path - The storage path
 * @param onProgress - Callback for upload progress
 * @returns Promise with the download URL
 */
export async function uploadImageWithProgress(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error("Error uploading image:", error);
        reject(new Error("Failed to upload image"));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

/**
 * Delete an image from Firebase Storage
 * @param url - The full download URL of the image
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const path = decodeURIComponent(
      urlObj.pathname.split("/o/")[1].split("?")[0]
    );
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

/**
 * Generate a unique file path for blog images
 * @param fileName - Original file name
 * @param postId - Post ID (optional, for organizing images)
 * @returns A unique storage path
 */
export function generateImagePath(fileName: string, postId?: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = fileName.split(".").pop();
  const cleanFileName = fileName
    .split(".")
    .slice(0, -1)
    .join(".")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase();

  if (postId) {
    return `blog-images/${postId}/${cleanFileName}-${timestamp}-${randomString}.${extension}`;
  }

  return `blog-images/${cleanFileName}-${timestamp}-${randomString}.${extension}`;
}

/**
 * Validate image file
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns Validation result
 */
export function validateImage(
  file: File,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit.`,
    };
  }

  return { valid: true };
}

/**
 * Extract images from HTML content
 * @param html - HTML content string
 * @returns Array of image URLs found in the content
 */
export function extractImagesFromHtml(html: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const images: string[] = [];
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
  }

  return images;
}

/**
 * Clean up unused images when a post is deleted or updated
 * @param oldImageUrls - Array of old image URLs
 * @param newImageUrls - Array of new image URLs (optional)
 */
export async function cleanupImages(
  oldImageUrls: string[],
  newImageUrls?: string[]
): Promise<void> {
  const imagesToDelete = newImageUrls
    ? oldImageUrls.filter((url) => !newImageUrls.includes(url))
    : oldImageUrls;

  const deletePromises = imagesToDelete.map((url) =>
    deleteImage(url).catch((error) => {
      console.error(`Failed to delete image: ${url}`, error);
    })
  );

  await Promise.allSettled(deletePromises);
}
