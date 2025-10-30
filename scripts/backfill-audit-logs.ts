import { createClerkClient } from "@clerk/backend";
import { db } from "../src/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ActivityLogService } from "../src/lib/activity-log-service";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const client = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

interface BackfillStats {
  organizationsProcessed: number;
  usersProcessed: number;
  logsCreated: number;
  errors: string[];
}

const stats: BackfillStats = {
  organizationsProcessed: 0,
  usersProcessed: 0,
  logsCreated: 0,
  errors: [],
};

async function backfillOrganizationLogs() {
  console.log("\n🏢 Backfilling Organization Activity Logs...\n");

  try {
    // Get all organizations from Clerk
    const clerkOrgs = await client.organizations.getOrganizationList({
      limit: 100,
    });

    for (const org of clerkOrgs.data) {
      try {
        // Get organization from Firestore for additional data
        const firestoreOrgs = await getDocs(
          query(collection(db, "organizations"))
        );
        const firestoreOrg = firestoreOrgs.docs.find(
          (doc) => doc.id === org.id
        );

        // Get organization members to find who created it
        const members = await client.organizations.getOrganizationMembershipList(
          {
            organizationId: org.id,
          }
        );

        // Find the oldest member (likely the creator)
        const oldestMember = members.data.sort(
          (a, b) => a.createdAt - b.createdAt
        )[0];

        let creatorUser;
        if (oldestMember && oldestMember.publicUserData) {
          creatorUser = await client.users.getUser(oldestMember.publicUserData.userId);
        }

        // Log organization creation
        await ActivityLogService.logActivity({
          organizationId: org.id,
          userId: creatorUser?.id || "system",
          userName: creatorUser
            ? `${creatorUser.firstName || ""} ${creatorUser.lastName || ""}`.trim() ||
              creatorUser.emailAddresses[0]?.emailAddress ||
              "Unknown"
            : "System",
          userEmail: creatorUser?.emailAddresses[0]?.emailAddress || "system@atraiva.ai",
          action: "created",
          category: "organization",
          resourceType: "organization",
          resourceId: org.id,
          resourceName: org.name,
          description: `Organization "${org.name}" was created`,
          severity: "info",
          metadata: {
            backfilled: true,
            createdAt: org.createdAt,
            slug: org.slug,
            membersCount: members.data.length,
            ...(firestoreOrg?.data() || {}),
          },
        });

        stats.logsCreated++;
        stats.organizationsProcessed++;
        console.log(`✅ Logged creation for organization: ${org.name}`);

        // Log for each member joining
        for (const member of members.data) {
          try {
            if (!member.publicUserData) continue;

            const memberUser = await client.users.getUser(
              member.publicUserData.userId
            );

            await ActivityLogService.logActivity({
              organizationId: org.id,
              userId: member.publicUserData.userId,
              userName:
                `${memberUser.firstName || ""} ${memberUser.lastName || ""}`.trim() ||
                memberUser.emailAddresses[0]?.emailAddress ||
                "Unknown",
              userEmail: memberUser.emailAddresses[0]?.emailAddress || "",
              action: member.publicUserData.userId === creatorUser?.id ? "onboarding_completed" : "member_added",
              category: "user",
              resourceType: "member",
              resourceId: member.publicUserData.userId,
              resourceName: (member.publicUserData.firstName || "") + " " + (member.publicUserData.lastName || ""),
              description:
                member.publicUserData.userId === creatorUser?.id
                  ? `Completed onboarding for ${org.name}`
                  : `${member.publicUserData.firstName || "Unknown"} ${member.publicUserData.lastName || ""} joined the organization`,
              severity: "info",
              metadata: {
                backfilled: true,
                role: member.role,
                joinedAt: member.createdAt,
              },
            });

            stats.logsCreated++;
          } catch (error) {
            console.error(
              `⚠️  Error logging member ${member.publicUserData?.userId || "unknown"}:`,
              error
            );
            stats.errors.push(
              `Member ${member.publicUserData?.userId || "unknown"}: ${error}`
            );
          }
        }
      } catch (error) {
        console.error(`❌ Error processing organization ${org.id}:`, error);
        stats.errors.push(`Organization ${org.id}: ${error}`);
      }
    }
  } catch (error) {
    console.error("❌ Error fetching organizations from Clerk:", error);
    stats.errors.push(`Clerk organizations fetch: ${error}`);
  }
}

async function backfillUserLogs() {
  console.log("\n👤 Backfilling User Activity Logs...\n");

  try {
    // Get all users from Clerk
    const clerkUsers = await client.users.getUserList({
      limit: 100,
    });

    for (const user of clerkUsers.data) {
      try {
        // Get user's organization memberships
        const memberships = await client.users.getOrganizationMembershipList({
          userId: user.id,
        });

        const primaryOrgId =
          memberships.data[0]?.organization.id || "unknown";

        // Log user account creation
        await ActivityLogService.logActivity({
          organizationId: primaryOrgId,
          userId: user.id,
          userName:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.emailAddresses[0]?.emailAddress ||
            "Unknown",
          userEmail: user.emailAddresses[0]?.emailAddress || "",
          action: "account_created",
          category: "user",
          resourceType: "user",
          resourceId: user.id,
          resourceName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          description: `User account created for ${user.emailAddresses[0]?.emailAddress}`,
          severity: "info",
          metadata: {
            backfilled: true,
            createdAt: user.createdAt,
            twoFactorEnabled: user.twoFactorEnabled,
            emailVerified:
              user.emailAddresses[0]?.verification?.status === "verified",
          },
        });

        stats.logsCreated++;

        // Log last sign in if available
        if (user.lastSignInAt) {
          await ActivityLogService.logActivity({
            organizationId: primaryOrgId,
            userId: user.id,
            userName:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.emailAddresses[0]?.emailAddress ||
              "Unknown",
            userEmail: user.emailAddresses[0]?.emailAddress || "",
            action: "sign_in",
            category: "security",
            resourceType: "authentication",
            resourceId: user.id,
            resourceName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            description: `User signed in`,
            severity: "info",
            metadata: {
              backfilled: true,
              lastSignInAt: user.lastSignInAt,
            },
          });

          stats.logsCreated++;
        }

        stats.usersProcessed++;
        console.log(
          `✅ Logged activity for user: ${user.emailAddresses[0]?.emailAddress}`
        );
      } catch (error) {
        console.error(`❌ Error processing user ${user.id}:`, error);
        stats.errors.push(`User ${user.id}: ${error}`);
      }
    }
  } catch (error) {
    console.error("❌ Error fetching users from Clerk:", error);
    stats.errors.push(`Clerk users fetch: ${error}`);
  }
}

async function backfillRegistrationLinks() {
  console.log("\n🔗 Backfilling Registration Link Activity Logs...\n");

  try {
    const registrationLinksSnapshot = await getDocs(
      query(collection(db, "registrationLinks"), orderBy("createdAt", "desc"))
    );

    for (const doc of registrationLinksSnapshot.docs) {
      const link = doc.data();

      try {
        // Log registration link creation
        await ActivityLogService.logActivity({
          organizationId: link.clerkOrgId || "system",
          userId: link.createdBy || "system",
          userName: link.createdByEmail || "System",
          userEmail: link.createdByEmail || "system@atraiva.ai",
          action: "registration_link_created",
          category: "organization",
          resourceType: "registration_link",
          resourceId: doc.id,
          resourceName: link.organizationData?.name || "Unknown Organization",
          description: `Registration link created for ${link.organizationData?.name || "Unknown"}`,
          severity: "info",
          metadata: {
            backfilled: true,
            token: link.token,
            status: link.status,
            primaryUserEmail: link.primaryUserData?.email,
            expiresAt: link.expiresAt,
          },
        });

        stats.logsCreated++;

        // If the link was used, log the completion
        if (link.status === "used" && link.usedAt && link.clerkOrgId) {
          await ActivityLogService.logActivity({
            organizationId: link.clerkOrgId,
            userId: link.clerkUserId || link.usedBy || "unknown",
            userName:
              `${link.primaryUserData?.firstName || ""} ${link.primaryUserData?.lastName || ""}`.trim() ||
              link.primaryUserData?.email ||
              "Unknown",
            userEmail: link.primaryUserData?.email || "",
            action: "registration_completed",
            category: "organization",
            resourceType: "registration",
            resourceId: doc.id,
            resourceName: link.organizationData?.name || "Unknown",
            description: `Registration completed for ${link.organizationData?.name || "Unknown"}`,
            severity: "info",
            metadata: {
              backfilled: true,
              usedAt: link.usedAt,
              registrationLinkId: doc.id,
            },
          });

          stats.logsCreated++;
        }

        console.log(
          `✅ Logged registration link: ${link.organizationData?.name}`
        );
      } catch (error) {
        console.error(`❌ Error processing registration link ${doc.id}:`, error);
        stats.errors.push(`Registration link ${doc.id}: ${error}`);
      }
    }
  } catch (error) {
    console.error("❌ Error fetching registration links:", error);
    stats.errors.push(`Registration links fetch: ${error}`);
  }
}

async function main() {
  console.log("🚀 Starting Audit Log Backfill Process...\n");
  console.log("=" .repeat(60));

  const startTime = Date.now();

  // Run backfill operations
  await backfillOrganizationLogs();
  await backfillUserLogs();
  await backfillRegistrationLinks();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 Backfill Summary:");
  console.log("=".repeat(60));
  console.log(`✅ Organizations Processed: ${stats.organizationsProcessed}`);
  console.log(`✅ Users Processed: ${stats.usersProcessed}`);
  console.log(`✅ Activity Logs Created: ${stats.logsCreated}`);
  console.log(`⏱️  Total Duration: ${duration}s`);

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors Encountered: ${stats.errors.length}`);
    stats.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }

  console.log("\n✨ Backfill Complete!\n");
}

// Run the script
main().catch((error) => {
  console.error("❌ Fatal error during backfill:", error);
  process.exit(1);
});

