import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";

export async function GET() {
  try {
    const authData = await auth();
    if (!authData.userId || !authData.orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const organization = await client.organizations.getOrganization({
      organizationId: authData.orgId,
    });

    // Get Firestore organization data
    const orgDoc = await getDoc(doc(db, "organizations", authData.orgId));
    const orgData = orgDoc.exists() ? orgDoc.data() : {};

    return NextResponse.json({
      success: true,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        imageUrl: organization.imageUrl,
        profile: orgData.profile || {},
        settings: orgData.settings || {},
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching organization profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch organization profile",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authData = await auth();
    if (!authData.userId || !authData.orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, profile, settings } = body;

    const client = await clerkClient();

    // Update Clerk organization
    if (name) {
      await client.organizations.updateOrganization(authData.orgId, {
        name,
      });
    }

    // Update Firestore organization data
    const orgRef = doc(db, "organizations", authData.orgId);
    const updateFields: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (profile) {
      if (profile.industry) updateFields["profile.industry"] = profile.industry;
      if (profile.website) updateFields["profile.website"] = profile.website;
      if (profile.size) updateFields["profile.size"] = profile.size;
    }

    if (settings) {
      if (settings.timezone)
        updateFields["settings.timezone"] = settings.timezone;
      if (settings.language)
        updateFields["settings.language"] = settings.language;
      if (settings.notifications) {
        updateFields["settings.notifications"] = settings.notifications;
      }
    }

    await updateDoc(orgRef, updateFields);

    return NextResponse.json({
      success: true,
      message: "Organization profile updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating organization profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to update organization profile",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
