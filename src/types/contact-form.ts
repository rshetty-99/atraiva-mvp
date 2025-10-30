export interface ContactFormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType: string;
  message: string;
}

export interface ContactRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType: string;
  message: string;
  status: "new" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  assignedTo?: string;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    referrer?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  contactId?: string;
}
