/**
 * Feedback Types for Frontend
 *
 * TypeScript types and interfaces for feedback collection and management
 */

export type FeedbackType = "bug" | "feature" | "improvement" | "general";

export type FeedbackStatus = "new" | "in_progress" | "resolved" | "closed";

export type FeedbackPriority = "low" | "medium" | "high" | "critical";

export interface Feedback {
  // Core identification
  id?: string; // Firestore document ID (auto-generated)

  // User information
  userId: string; // Clerk user ID
  userEmail: string;
  userName: string;
  organizationId?: string;
  organizationName?: string;
  userRole?: string;

  // Feedback details
  type: FeedbackType;
  title: string;
  description: string;
  category?: string;
  priority?: FeedbackPriority;

  // Additional context
  page?: string; // Current page/route where feedback was submitted
  userAgent?: string; // Browser/device info
  screenResolution?: string;
  attachments?: string[]; // URLs to attached files

  // Status tracking
  status: FeedbackStatus;
  assignedTo?: string; // Admin user ID
  notes?: string; // Internal notes from admins
  supportInitiated?: boolean; // True if submitted by platform admin/support

  // Metadata
  createdAt: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
  resolvedAt?: string; // ISO timestamp
  resolvedBy?: string; // Admin user ID
}

// Request DTO for creating feedback
export interface CreateFeedbackRequest {
  type: FeedbackType;
  title: string;
  description: string;
  category?: string;
  page?: string;
  userAgent?: string;
  screenResolution?: string;
}

// Response from API
export interface CreateFeedbackResponse {
  id: string;
  message: string;
  feedback: Feedback;
}

// Update request (admin only)
export interface UpdateFeedbackRequest {
  id: string;
  status?: FeedbackStatus;
  priority?: FeedbackPriority;
  assignedTo?: string;
  notes?: string;
}

