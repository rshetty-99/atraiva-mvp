// API route for uploading Purview scan files
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  validateScanFile,
  generatePurviewScanPath,
} from "@/lib/firebase/incident-storage";
import { incidentService } from "@/lib/firestore/collections";
import { Timestamp } from "firebase/firestore";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import type { IncidentSimulation } from "@/lib/firestore/types";

// Initialize Firebase Admin SDK (server-side only)
function getAdminStorage() {
  if (getApps().length === 0) {
    const serviceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };

    if (
      !serviceAccount.projectId ||
      !serviceAccount.clientEmail ||
      !serviceAccount.privateKey
    ) {
      throw new Error("Firebase Admin credentials not configured");
    }

    initializeApp({
      credential: cert({
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.clientEmail,
        privateKey: serviceAccount.privateKey,
      }),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
  return getStorage();
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ incidentId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { incidentId } = await params;
    if (!incidentId) {
      return NextResponse.json(
        { error: "Incident ID is required" },
        { status: 400 }
      );
    }

    // Get organization ID from request body or query params for draft incidents
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const organizationId = formData.get("organizationId") as string | null;

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // For draft incidents, skip incident lookup and just upload the file
    // The incident will be created/updated when the form is submitted
    const isDraft = incidentId === "draft";

    if (!isDraft) {
      // Get incident to verify ownership and get organization ID
      const incident = await incidentService.getById(incidentId);
      if (!incident) {
        return NextResponse.json(
          { error: "Incident not found" },
          { status: 404 }
        );
      }

      // Verify user has access (created by or organization member)
      if (
        incident.ownership.createdBy !== userId &&
        incident.ownership.organizationId !== organizationId
      ) {
        return NextResponse.json(
          { error: "Unauthorized to upload scan for this incident" },
          { status: 403 }
        );
      }
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    const validation = validateScanFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Generate storage path
    const filePath = generatePurviewScanPath(
      file.name,
      incidentId,
      organizationId
    );

    // Upload file using Firebase Admin SDK (server-side)
    const adminStorage = getAdminStorage();
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (!storageBucket) {
      throw new Error(
        "Firebase Storage bucket not configured. Please set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in your environment variables."
      );
    }

    const bucket = adminStorage.bucket(storageBucket);
    if (!bucket) {
      throw new Error("Storage bucket not available");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const storageFile = bucket.file(filePath);

    await storageFile.save(fileBuffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          uploadedBy: userId,
          incidentId,
          organizationId,
        },
      },
    });

    // Generate signed URL (valid for 1 year) instead of making file public
    // This provides better security - only authorized users can access the file
    const [signedUrl] = await storageFile.getSignedUrl({
      action: "read",
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year from now
    });

    const fileUrl = signedUrl;

    const scan = {
      fileName: file.name,
      filePath,
      fileUrl,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date(),
      uploadedBy: userId,
    };

    // Update incident with scan metadata (only if not draft)
    if (!isDraft) {
      await incidentService.update(incidentId, {
        purviewScan: {
          ...scan,
          uploadedAt: Timestamp.fromDate(scan.uploadedAt),
        },
      } as unknown as Partial<IncidentSimulation>);
    }

    return NextResponse.json({
      success: true,
      scan,
    });
  } catch (error) {
    console.error("Error uploading Purview scan:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to upload scan file",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ incidentId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { incidentId } = await params;
    const incident = await incidentService.getById(incidentId);

    if (!incident) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (incident.ownership.createdBy !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Remove scan from incident
    await incidentService.update(incidentId, {
      purviewScan: null,
    } as unknown as Partial<IncidentSimulation>);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing Purview scan:", error);
    return NextResponse.json(
      { error: "Failed to remove scan file" },
      { status: 500 }
    );
  }
}
