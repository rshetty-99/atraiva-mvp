// Registration Link Service
// Handles creation, validation, and management of registration links

import { randomBytes } from "crypto";
import { Timestamp } from "firebase/firestore";
import {
  registrationLinkService,
  registrationLinkQueries,
  registrationEmailService,
} from "@/lib/firestore/collections";
import { RegistrationLink, RegistrationEmail } from "@/lib/firestore/types";

/**
 * Generate a cryptographically secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString("base64url");
}

/**
 * Calculate expiration date (3 days from now)
 */
export function calculateExpirationDate(): Date {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 3);
  return expirationDate;
}

/**
 * Format date for email display
 */
export function formatExpirationDate(date: Date): {
  date: string;
  time: string;
} {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return {
    date: date.toLocaleDateString("en-US", options),
    time: date.toLocaleTimeString("en-US", timeOptions),
  };
}

/**
 * Create a new registration link
 */
export async function createRegistrationLink(data: {
  organizationData: RegistrationLink["organizationData"];
  primaryUserData: RegistrationLink["primaryUserData"];
  paymentReference?: string;
  notes?: string;
  createdBy: string;
  createdByEmail: string;
}): Promise<{
  success: boolean;
  linkId?: string;
  token?: string;
  error?: string;
}> {
  try {
    console.log("=== Creating Registration Link ===");
    console.log("Input data:", {
      organizationName: data.organizationData?.name,
      primaryUserEmail: data.primaryUserData?.email,
      createdBy: data.createdBy,
      createdByEmail: data.createdByEmail,
    });

    // Check if there's already an active link for this email
    console.log("Checking for existing active links...");
    const hasActive = await registrationLinkQueries.hasActiveLink(
      data.primaryUserData.email
    );
    console.log("Has active link:", hasActive);

    if (hasActive) {
      console.log("Active link already exists for email:", data.primaryUserData.email);
      return {
        success: false,
        error:
          "An active registration link already exists for this email address.",
      };
    }

    // Generate secure token
    const token = generateSecureToken();
    console.log("Generated token:", token.substring(0, 10) + "...");

    // Calculate expiration (3 days from now)
    const expiresAt = calculateExpirationDate();
    console.log("Expiration date:", expiresAt);

    // Create registration link document
    // Note: FirestoreService.create will add createdAt and updatedAt using serverTimestamp()
    // We need to convert Date objects to Timestamps for Firestore
    const registrationLinkData = {
      token,
      organizationData: data.organizationData,
      primaryUserData: data.primaryUserData,
      paymentStatus: "completed" as const,
      paymentReference: data.paymentReference,
      status: "pending" as const,
      createdBy: data.createdBy,
      createdByEmail: data.createdByEmail,
      // Convert Date to Timestamp for Firestore
      expiresAt: Timestamp.fromDate(expiresAt),
      emailSent: false,
      emailResendCount: 0,
      notes: data.notes,
    };

    console.log("Registration link document prepared:", {
      token: token.substring(0, 10) + "...",
      status: registrationLinkData.status,
      organizationName: registrationLinkData.organizationData?.name,
      primaryUserEmail: registrationLinkData.primaryUserData?.email,
      expiresAt: expiresAt.toISOString(),
    });

    // Save to Firestore
    console.log("Saving to Firestore collection: registrationLinks");
    const linkId = await registrationLinkService.create(
      registrationLinkData as Record<string, unknown>
    );
    console.log("Registration link created successfully with ID:", linkId);

    // Verify the document was created
    const createdLink = await registrationLinkService.getById(linkId);
    if (!createdLink) {
      console.error("ERROR: Registration link document was not found after creation!");
      return {
        success: false,
        error: "Registration link was created but could not be verified. Please check Firestore.",
      };
    }
    console.log("Registration link verified in Firestore");

    return {
      success: true,
      linkId,
      token,
    };
  } catch (error) {
    console.error("ERROR creating registration link:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      error,
    });
    return {
      success: false,
      error: `Failed to create registration link: ${errorMessage}. Please check the console for details.`,
    };
  }
}

/**
 * Send registration email
 */
export async function sendRegistrationEmail(
  linkId: string,
  token: string,
  baseUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get registration link
    const link = await registrationLinkService.getById(linkId);
    if (!link) {
      return { success: false, error: "Registration link not found." };
    }

    // Build registration URL
    const registrationUrl = `${baseUrl}/register?token=${token}`;

    // Format expiration date
    const { date: expirationDate, time: expirationTime } = formatExpirationDate(
      link.expiresAt
    );

    // Create email document
    const emailData: Omit<RegistrationEmail, "id"> = {
      to: [link.primaryUserData.email],
      template: {
        name: "registration_link",
        data: {
          firstName: link.primaryUserData.firstName,
          lastName: link.primaryUserData.lastName,
          organizationName: link.organizationData.name,
          registrationLink: registrationUrl,
          expirationDate,
          expirationTime,
          supportEmail:
            process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@atraiva.com",
          companyName: "Atraiva",
        },
      },
      subject: `Complete Your Registration for ${link.organizationData.name}`,
      html: generateEmailHTML(
        link.primaryUserData.firstName,
        link.organizationData.name,
        registrationUrl,
        expirationDate,
        expirationTime
      ),
      text: generateEmailText(
        link.primaryUserData.firstName,
        link.organizationData.name,
        registrationUrl,
        expirationDate,
        expirationTime
      ),
      createdAt: new Date(),
      delivery: {
        state: "PENDING",
        attempts: 0,
      },
    };

    // Save email to trigger Firebase Extension
    console.log("Creating registration email document in Firestore...");
    console.log("Email data:", {
      to: emailData.to,
      subject: emailData.subject,
      hasHtml: !!emailData.html,
      hasText: !!emailData.text,
    });
    
    const emailDocId = await registrationEmailService.create(emailData as any);
    console.log("Registration email document created with ID:", emailDocId);

    // Verify the email document was created
    const createdEmail = await registrationEmailService.getById(emailDocId);
    if (!createdEmail) {
      console.error("Failed to verify email document creation");
      return {
        success: false,
        error: "Email document was not created in Firestore. Please check Firebase Extension configuration.",
      };
    }

    console.log("Email document verified. Firebase Extension should process it.");

    // Update registration link
    await registrationLinkService.update(linkId, {
      emailSent: true,
      emailSentAt: new Date(),
      lastEmailSentAt: new Date(),
      status: "sent",
    } as any);

    console.log("Registration link updated. Email sending process initiated.");

    return { 
      success: true,
      emailDocId,
      message: "Email queued for delivery. Please verify Firebase Extension is configured and running.",
    };
  } catch (error) {
    console.error("Error sending registration email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage, error);
    return {
      success: false,
      error: `Failed to send registration email: ${errorMessage}. Please check Firebase Extension configuration.`,
    };
  }
}

/**
 * Resend registration email
 */
export async function resendRegistrationEmail(
  linkId: string,
  baseUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const link = await registrationLinkService.getById(linkId);
    if (!link) {
      return { success: false, error: "Registration link not found." };
    }

    // Check if link is expired
    if (new Date() > link.expiresAt) {
      return { success: false, error: "Registration link has expired." };
    }

    // Check if link is already used or cancelled
    if (link.status === "used" || link.status === "cancelled") {
      return {
        success: false,
        error: `Registration link has been ${link.status}.`,
      };
    }

    // Send email
    const result = await sendRegistrationEmail(linkId, link.token, baseUrl);

    if (result.success) {
      // Update resend count
      await registrationLinkService.update(linkId, {
        emailResendCount: link.emailResendCount + 1,
        lastEmailSentAt: new Date(),
      } as any);
    }

    return result;
  } catch (error) {
    console.error("Error resending registration email:", error);
    return {
      success: false,
      error: "Failed to resend registration email. Please try again.",
    };
  }
}

/**
 * Validate registration token
 */
export async function validateRegistrationToken(
  token: string
): Promise<{ valid: boolean; link?: RegistrationLink; error?: string }> {
  try {
    // Find link by token
    const link = await registrationLinkQueries.getByToken(token);

    if (!link) {
      return { valid: false, error: "Invalid registration link." };
    }

    const now = new Date();

    console.log("Validating registration link:", {
      token: token.substring(0, 10) + "...",
      expiresAt: link.expiresAt,
      now: now,
      isExpired: now > link.expiresAt,
      status: link.status,
    });

    // Check if expired
    if (now > link.expiresAt) {
      // Mark as expired
      await registrationLinkService.update(link.id, {
        status: "expired",
      } as any);

      return { valid: false, error: "This registration link has expired." };
    }

    // Check if already used
    if (link.status === "used") {
      return {
        valid: false,
        error: "This registration link has already been used.",
      };
    }

    // Check if cancelled
    if (link.status === "cancelled") {
      return {
        valid: false,
        error: "This registration link has been cancelled.",
      };
    }

    return { valid: true, link };
  } catch (error) {
    console.error("Error validating registration token:", error);
    return { valid: false, error: "Failed to validate registration link." };
  }
}

/**
 * Mark registration link as used
 */
export async function markRegistrationLinkUsed(
  linkId: string,
  userId: string,
  clerkUserId: string,
  clerkOrgId: string,
  firestoreUserId: string,
  firestoreOrgId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await registrationLinkService.update(linkId, {
      status: "used",
      usedAt: new Date(),
      usedBy: userId,
      clerkUserId,
      clerkOrgId,
      firestoreUserId,
      firestoreOrgId,
    } as any);

    return { success: true };
  } catch (error) {
    console.error("Error marking registration link as used:", error);
    return {
      success: false,
      error: "Failed to update registration link status.",
    };
  }
}

/**
 * Cancel registration link
 */
export async function cancelRegistrationLink(
  linkId: string,
  cancelledBy: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const link = await registrationLinkService.getById(linkId);
    if (!link) {
      return { success: false, error: "Registration link not found." };
    }

    if (link.status === "used") {
      return {
        success: false,
        error: "Cannot cancel a registration link that has already been used.",
      };
    }

    await registrationLinkService.update(linkId, {
      status: "cancelled",
      cancelledAt: new Date(),
      cancelledBy,
      cancellationReason: reason,
    } as any);

    return { success: true };
  } catch (error) {
    console.error("Error cancelling registration link:", error);
    return {
      success: false,
      error: "Failed to cancel registration link.",
    };
  }
}

/**
 * Generate HTML email template
 */
function generateEmailHTML(
  firstName: string,
  organizationName: string,
  registrationLink: string,
  expirationDate: string,
  expirationTime: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your Registration</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #5568d3; }
    .info-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Atraiva!</h1>
    </div>
    <div class="content">
      <p>Hi ${firstName},</p>
      
      <p>Your organization <strong>${organizationName}</strong> has been set up on the Atraiva Compliance Platform. We're excited to have you on board!</p>
      
      <p>To complete your registration and activate your account, please click the button below:</p>
      
      <div style="text-align: center;">
        <a href="${registrationLink}" class="button">Complete Registration</a>
      </div>
      
      <div class="info-box">
        <strong>⏰ Important:</strong> This registration link will expire on <strong>${expirationDate}</strong> at <strong>${expirationTime}</strong>. Please complete your registration before this time.
      </div>
      
      <p>During registration, you'll be able to:</p>
      <ul>
        <li>Set your password and verify your email</li>
        <li>Review your organization details</li>
        <li>Add additional team members and assign roles</li>
        <li>Access your compliance dashboard</li>
      </ul>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      
      <p>Best regards,<br>The Atraiva Team</p>
    </div>
    <div class="footer">
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${registrationLink}</p>
      <p>© ${new Date().getFullYear()} Atraiva. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text email
 */
function generateEmailText(
  firstName: string,
  organizationName: string,
  registrationLink: string,
  expirationDate: string,
  expirationTime: string
): string {
  return `
Welcome to Atraiva!

Hi ${firstName},

Your organization ${organizationName} has been set up on the Atraiva Compliance Platform. We're excited to have you on board!

To complete your registration and activate your account, please visit:
${registrationLink}

IMPORTANT: This registration link will expire on ${expirationDate} at ${expirationTime}. Please complete your registration before this time.

During registration, you'll be able to:
- Set your password and verify your email
- Review your organization details
- Add additional team members and assign roles
- Access your compliance dashboard

If you have any questions or need assistance, please don't hesitate to contact our support team.

Best regards,
The Atraiva Team

© ${new Date().getFullYear()} Atraiva. All rights reserved.
  `.trim();
}
