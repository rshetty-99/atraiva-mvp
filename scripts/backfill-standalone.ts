import { createClerkClient } from "@clerk/backend";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Initialize Firebase
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

const stats = {
  organizationsProcessed: 0,
  usersProcessed: 0,
  logsCreated: 0,
  errors: [] as string[],
};

async function logActivity(params: any) {
  try {
    await addDoc(collection(db, "auditLogs"), {
      ...params,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error logging activity:", error);
    return false;
  }
}

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
        if (oldestMember?.publicUserData) {
          creatorUser = await client.users.getUser(
            oldestMember.publicUserData.userId
          );
        }

        await logActivity({
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
          success: true,
          metadata: {
            backfilled: true,
            createdAt: org.createdAt,
            slug: org.slug,
            membersCount: members.data.length,
          },
        });

        stats.logsCreated++;
        stats.organizationsProcessed++;
        console.log(`✅ Organization: ${org.name}`);

        for (const member of members.data) {
          if (!member.publicUserData) continue;

          try {
            const memberUser = await client.users.getUser(
              member.publicUserData.userId
            );

            await logActivity({
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
              resourceName: `${member.publicUserData.firstName || ""} ${
                member.publicUserData.lastName || ""
              }`,
              description:
                member.publicUserData.userId === creatorUser?.id
                  ? `Completed onboarding for ${org.name}`
                  : `${
                      member.publicUserData.firstName || "Member"
                    } joined the organization`,
              severity: "info",
              success: true,
              metadata: {
                backfilled: true,
                role: member.role,
                joinedAt: member.createdAt,
              },
            });

            stats.logsCreated++;
          } catch (error) {
            console.error(`  ⚠️  Error with member:`, error);
          }
        }
      } catch (error) {
        console.error(`❌ Error with org ${org.id}:`, error);
        stats.errors.push(`Org ${org.id}: ${error}`);
      }
    }
  } catch (error) {
    console.error("❌ Error fetching organizations:", error);
    stats.errors.push(`Fetch orgs: ${error}`);
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

        await logActivity({
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
          description: `Account created for ${user.emailAddresses[0]?.emailAddress}`,
          severity: "info",
          success: true,
          metadata: {
            backfilled: true,
            createdAt: user.createdAt,
            twoFactorEnabled: user.twoFactorEnabled,
          },
        });

        stats.logsCreated++;
        stats.usersProcessed++;
        console.log(`✅ User: ${user.emailAddresses[0]?.emailAddress}`);
      } catch (error) {
        console.error(`❌ Error with user ${user.id}:`, error);
        stats.errors.push(`User ${user.id}: ${error}`);
      }
    }
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    stats.errors.push(`Fetch users: ${error}`);
  }
}

async function main() {
  console.log("🚀 Starting Audit Log Backfill...\n");
  console.log("=".repeat(60));

  const startTime = Date.now();

  await backfillOrganizationLogs();
  await backfillUserLogs();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log("\n" + "=".repeat(60));
  console.log("📊 Backfill Summary");
  console.log("=".repeat(60));
  console.log(`✅ Organizations: ${stats.organizationsProcessed}`);
  console.log(`✅ Users: ${stats.usersProcessed}`);
  console.log(`✅ Logs Created: ${stats.logsCreated}`);
  console.log(`⏱️  Duration: ${duration}s`);

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors: ${stats.errors.length}`);
  }

  console.log("\n✨ Complete!\n");
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
