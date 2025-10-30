import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const authData = await auth();

    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from Clerk to check role
    const client = await clerkClient();
    const user = await client.users.getUser(authData.userId);

    // Get role from the correct metadata location
    const metadata = user.publicMetadata?.atraiva as any;
    const userRole = metadata?.primaryOrganization?.role as string;

    // Only platform_admin and super_admin can access this
    if (userRole !== "platform_admin" && userRole !== "super_admin") {
      return NextResponse.json(
        {
          error: "Forbidden",
          details: `Access denied. Your role: ${
            userRole || "unknown"
          }. Required: platform_admin or super_admin`,
        },
        { status: 403 }
      );
    }

    // Get filter parameter
    const { searchParams } = new URL(request.url);
    const orgFilter = searchParams.get("organizationId");

    // Get all users from Clerk
    let allUsers: any[] = [];
    let hasMore = true;
    let offset = 0;
    const limit = 100;

    while (hasMore) {
      const usersResponse = await client.users.getUserList({
        limit,
        offset,
      });

      allUsers = [...allUsers, ...usersResponse.data];
      hasMore = usersResponse.data.length === limit;
      offset += limit;

      // Safety limit to prevent infinite loops
      if (offset > 1000) break;
    }

    // Get all organizations to map org IDs to names
    const organizationsRef = collection(db, "organizations");
    const organizationsSnapshot = await getDocs(organizationsRef);
    const orgsMap = new Map();

    organizationsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      orgsMap.set(doc.id, {
        name: data.name,
        slug: data.slug,
      });
    });

    // Get Firestore user data
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    const firestoreUsersMap = new Map();

    usersSnapshot.docs.forEach((doc) => {
      firestoreUsersMap.set(doc.id, doc.data());
    });

    // Enrich users with organization data
    const enrichedUsers = await Promise.all(
      allUsers.map(async (clerkUser) => {
        const firestoreData = firestoreUsersMap.get(clerkUser.id) || {};

        // Try to get organization data from multiple sources
        let organizationId = null;
        let role = "org_viewer";
        let dataSource = "none";

        // Check publicMetadata.atraiva.primaryOrganization (session service format)
        const userMetadata = clerkUser.publicMetadata?.atraiva as any;
        if (
          userMetadata?.primaryOrganization?.id &&
          userMetadata.primaryOrganization.id !== "temp"
        ) {
          organizationId = userMetadata.primaryOrganization.id;
          role = userMetadata.primaryOrganization.role || "org_viewer";
          dataSource = "publicMetadata.atraiva";
        }

        // Check privateMetadata (onboarding/registration format) - separate if, not else if
        if (
          !organizationId &&
          (clerkUser.privateMetadata?.primaryOrganizationId ||
            clerkUser.privateMetadata?.organizationId)
        ) {
          organizationId = (clerkUser.privateMetadata.primaryOrganizationId ||
            clerkUser.privateMetadata.organizationId) as string;
          // Try to get role from private metadata, fallback to Firestore, then default
          role =
            (clerkUser.privateMetadata.primaryRole as string) ||
            firestoreData.role ||
            "org_viewer";
          dataSource = "privateMetadata";
        }
        // Check Firestore user data
        else if (
          firestoreData.organizations &&
          firestoreData.organizations.length > 0
        ) {
          organizationId = firestoreData.organizations[0];
          role = firestoreData.role || "org_viewer";
          dataSource = "firestore";
        }
        // Fallback: Get from Clerk organization memberships
        else {
          try {
            const memberships =
              await client.users.getOrganizationMembershipList({
                userId: clerkUser.id,
              });
            if (memberships.data && memberships.data.length > 0) {
              const membership = memberships.data[0];
              organizationId = membership.organization.id;
              // Map Clerk role to our role
              role =
                membership.role === "org:admin" ? "org_admin" : "org_viewer";
              dataSource = "clerkMemberships";
            }
          } catch (error) {
            console.log(
              `No organization memberships found for user ${clerkUser.id}`
            );
          }
        }

        const organizationName = organizationId
          ? orgsMap.get(organizationId)?.name || "Unknown Org"
          : "No Organization";

        return {
          id: clerkUser.id,
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          email: clerkUser.emailAddresses[0]?.emailAddress || "No email",
          imageUrl: clerkUser.imageUrl || undefined,
          role: role,
          organizationId: organizationId,
          organizationName: organizationName,
          createdAt: clerkUser.createdAt
            ? new Date(clerkUser.createdAt)
            : new Date(),
          lastSignInAt: clerkUser.lastSignInAt
            ? new Date(clerkUser.lastSignInAt)
            : null,
          isActive: firestoreData.isActive ?? true,
        };
      })
    );

    // Filter by organization if specified
    const filteredUsers = orgFilter
      ? enrichedUsers.filter((user) => user.organizationId === orgFilter)
      : enrichedUsers;

    // Get pending invitations count
    const invitationsQuery = query(
      collection(db, "memberInvitations"),
      where("status", "in", ["pending", "sent"])
    );
    const invitationsSnapshot = await getDocs(invitationsQuery);
    const pendingInvitationsCount = invitationsSnapshot.size;

    // Calculate stats
    const stats = {
      total: enrichedUsers.length,
      active: enrichedUsers.filter((user) => user.isActive).length,
      admins: enrichedUsers.filter(
        (user) =>
          user.role === "super_admin" ||
          user.role === "platform_admin" ||
          user.role === "org_admin"
      ).length,
      noOrg: enrichedUsers.filter((user) => !user.organizationId).length,
      pendingInvitations: pendingInvitationsCount,
    };

    return NextResponse.json({
      members: filteredUsers,
      stats,
      total: filteredUsers.length,
    });
  } catch (error: any) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
