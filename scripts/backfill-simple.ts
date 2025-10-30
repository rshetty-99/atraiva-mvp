import { createClerkClient } from "@clerk/backend";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { ActivityLogService } from "../src/lib/activity-log-service";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Initialize Firebase (without auth)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    const clerkOrgs = await client.organizations.getOrganizationList({
      limit: 100,
    });

    for (const org of clerkOrgs.data) {
      try {
        const members =
          await client.organizations.getOrganizationMembershipList({
            organizationId: org.id,
          });

        const oldestMember = members.data.sort(
          (a, b) => a.createdAt - b.createdAt
        )[0];

        let creatorUser;
        if (oldestMember && oldestMember.publicUserData) {
          creatorUser = await client.users.getUser(
            oldestMember.publicUserData.userId
          );
        }

        await ActivityLogService.logActivity({
          organizationId: org.id,
          userId: creatorUser?.id || "system",
          userName: creatorUser
            ? `${creatorUser.firstName || ""} ${
                creatorUser.lastName || ""
              }`.trim() ||
              creatorUser.emailAddresses[0]?.emailAddress ||
              "Unknown"
            : "System",
          userEmail:
            creatorUser?.emailAddresses[0]?.emailAddress || "system@atraiva.ai",
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
          },
        });

        stats.logsCreated++;
        stats.organizationsProcessed++;
        console.log(`✅ Logged creation for organization: ${org.name}`);

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
                `${memberUser.firstName || ""} ${
                  memberUser.lastName || ""
                }`.trim() ||
                memberUser.emailAddresses[0]?.emailAddress ||
                "Unknown",
              userEmail: memberUser.emailAddresses[0]?.emailAddress || "",
              action:
                member.publicUserData.userId === creatorUser?.id
                  ? "onboarding_completed"
                  : "member_added",
              category: "user",
              resourceType: "member",
              resourceId: member.publicUserData.userId,
              resourceName:
                (member.publicUserData.firstName || "") +
                " " +
                (member.publicUserData.lastName || ""),
              description:
                member.publicUserData.userId === creatorUser?.id
                  ? `Completed onboarding for ${org.name}`
                  : `${member.publicUserData.firstName || "Unknown"} ${
                      member.publicUserData.lastName || ""
                    } joined the organization`,
              severity: "info",
              metadata: {
                backfilled: true,
                role: member.role,
                joinedAt: member.createdAt,
              },
            });

            stats.logsCreated++;
          } catch (error) {
            console.error(`⚠️  Error logging member:`, error);
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
    const clerkUsers = await client.users.getUserList({
      limit: 100,
    });

    for (const user of clerkUsers.data) {
      try {
        const memberships = await client.users.getOrganizationMembershipList({
          userId: user.id,
        });

        const primaryOrgId = memberships.data[0]?.organization.id || "unknown";

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
          },
        });

        stats.logsCreated++;
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

async function main() {
  console.log("🚀 Starting Audit Log Backfill Process...\n");
  console.log("=".repeat(60));

  const startTime = Date.now();

  await backfillOrganizationLogs();
  await backfillUserLogs();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log("\n" + "=".repeat(60));
  console.log("📊 Backfill Summary:");
  console.log("=".repeat(60));
  console.log(`✅ Organizations Processed: ${stats.organizationsProcessed}`);
  console.log(`✅ Users Processed: ${stats.usersProcessed}`);
  console.log(`✅ Activity Logs Created: ${stats.logsCreated}`);
  console.log(`⏱️  Total Duration: ${duration}s`);

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors Encountered: ${stats.errors.length}`);
    stats.errors.slice(0, 5).forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }

  console.log("\n✨ Backfill Complete!\n");
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Fatal error during backfill:", error);
  process.exit(1);
});
