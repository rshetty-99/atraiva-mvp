import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Regulation, UpdateRegulationRequest } from "@/types/regulation";

// GET - Fetch single regulation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const regulationId = params.id;
    const docRef = doc(db, "regulations", regulationId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Regulation not found" },
        { status: 404 }
      );
    }

    const regulation: Regulation = {
      ...docSnap.data() as Regulation,
      id: docSnap.id,
    };

    return NextResponse.json({ regulation }, { status: 200 });
  } catch (error) {
    console.error("Error fetching regulation:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch regulation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH/PUT - Update regulation
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has platform admin role
    const userMetadata = user.publicMetadata?.atraiva as
      | { primaryOrganization?: { role?: string } }
      | undefined;
    const userRole = userMetadata?.primaryOrganization?.role;
    const isPlatformRole =
      userRole === "platform_admin" || userRole === "super_admin";

    if (!isPlatformRole) {
      return NextResponse.json(
        { error: "Insufficient permissions. Platform admin access required." },
        { status: 403 }
      );
    }

    const regulationId = params.id;
    const body: Partial<UpdateRegulationRequest> = await request.json();

    // Validate that at least one field is being updated
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      ...body,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    };

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Update in Firestore
    const docRef = doc(db, "regulations", regulationId);
    await updateDoc(docRef, updateData);

    // Fetch updated document
    const updatedDoc = await getDoc(docRef);
    const updatedRegulation: Regulation = {
      ...updatedDoc.data() as Regulation,
      id: updatedDoc.id,
    };

    console.log("Regulation updated:", {
      id: regulationId,
      updatedBy: userId,
      fieldsUpdated: Object.keys(body),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Regulation updated successfully",
        regulation: updatedRegulation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating regulation:", error);
    return NextResponse.json(
      {
        error: "Failed to update regulation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete regulation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has platform admin role
    const userMetadata = user.publicMetadata?.atraiva as
      | { primaryOrganization?: { role?: string } }
      | undefined;
    const userRole = userMetadata?.primaryOrganization?.role;
    const isPlatformRole =
      userRole === "platform_admin" || userRole === "super_admin";

    if (!isPlatformRole) {
      return NextResponse.json(
        { error: "Insufficient permissions. Platform admin access required." },
        { status: 403 }
      );
    }

    const regulationId = params.id;

    // Check if regulation exists
    const docRef = doc(db, "regulations", regulationId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Regulation not found" },
        { status: 404 }
      );
    }

    // Delete from Firestore
    await deleteDoc(docRef);

    console.log("Regulation deleted:", {
      id: regulationId,
      deletedBy: userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Regulation deleted successfully",
        id: regulationId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting regulation:", error);
    return NextResponse.json(
      {
        error: "Failed to delete regulation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

