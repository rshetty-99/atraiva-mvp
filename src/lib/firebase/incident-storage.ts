// Firebase Storage utilities for incident simulation files
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";

export interface PurviewScanFile {
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

/**
 * Generate storage path for Purview scan
 * Path format: incident-simulations/{organizationId}/{incidentId}/purview-scans/{filename}
 */
export function generatePurviewScanPath(
  fileName: string,
  incidentId: string,
  organizationId: string
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const cleanFileName = fileName
    .split(".")
    .slice(0, -1)
    .join(".")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase();

  return `incident-simulations/${organizationId}/${incidentId}/purview-scans/${cleanFileName}-${timestamp}-${randomString}.${extension}`;
}

/**
 * Validate Purview scan file
 */
export function validateScanFile(
  file: File,
  maxSizeMB: number = 50
): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = [
    "application/json",
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "text/plain",
  ];

  const validExtensions = [".json", ".csv", ".xlsx", ".xls", ".txt"];
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

  if (
    !validTypes.includes(file.type) &&
    !validExtensions.includes(fileExtension)
  ) {
    return {
      valid: false,
      error: "Invalid file type. Only JSON, CSV, and Excel files are allowed.",
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
 * Upload Purview scan file to Firebase Storage
 */
export async function uploadPurviewScan(
  file: File,
  incidentId: string,
  organizationId: string,
  uploadedBy: string
): Promise<PurviewScanFile> {
  try {
    // Validate file
    const validation = validateScanFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate path
    const filePath = generatePurviewScanPath(
      file.name,
      incidentId,
      organizationId
    );

    // Upload file
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      fileName: file.name,
      filePath,
      fileUrl: downloadURL,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date(),
      uploadedBy,
    };
  } catch (error) {
    console.error("Error uploading Purview scan:", error);
    throw new Error("Failed to upload Purview scan file");
  }
}

/**
 * Upload Purview scan with progress tracking
 */
export async function uploadPurviewScanWithProgress(
  file: File,
  incidentId: string,
  organizationId: string,
  uploadedBy: string,
  onProgress?: (progress: number) => void
): Promise<PurviewScanFile> {
  return new Promise((resolve, reject) => {
    try {
      // Validate file
      const validation = validateScanFile(file);
      if (!validation.valid) {
        reject(new Error(validation.error));
        return;
      }

      // Generate path
      const filePath = generatePurviewScanPath(
        file.name,
        incidentId,
        organizationId
      );
      const storageRef = ref(storage, filePath);
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
        async (error) => {
          console.error("Error uploading Purview scan:", error);
          // Provide more specific error messages
          let errorMessage = "Failed to upload Purview scan file";
          if (error.code === "storage/unauthorized") {
            errorMessage =
              "Unauthorized: You don't have permission to upload files.";
          } else if (error.code === "storage/canceled") {
            errorMessage = "Upload was canceled.";
          } else if (error.code === "storage/unknown") {
            errorMessage =
              "Unknown error occurred during upload. Please try again.";
          } else if (error.message) {
            errorMessage = error.message;
          }
          reject(new Error(errorMessage));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              fileName: file.name,
              filePath,
              fileUrl: downloadURL,
              fileSize: file.size,
              mimeType: file.type,
              uploadedAt: new Date(),
              uploadedBy,
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Delete Purview scan file from Firebase Storage
 */
export async function deletePurviewScan(filePath: string): Promise<void> {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting Purview scan:", error);
    throw new Error("Failed to delete Purview scan file");
  }
}

/**
 * Get download URL for a Purview scan file
 */
export async function getScanDownloadUrl(filePath: string): Promise<string> {
  try {
    const storageRef = ref(storage, filePath);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error getting download URL:", error);
    throw new Error("Failed to get download URL");
  }
}
