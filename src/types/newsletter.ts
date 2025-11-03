export interface NewsletterSubscription {
  id?: string;
  email: string;
  name?: string; // User's full name
  userId?: string; // Clerk user ID if logged in
  subscribedAt: Date;
  isActive: boolean;
  source?: string; // e.g., 'website', 'landing-page', 'hero-button', etc.
  ipAddress?: string;
  userAgent?: string;
  metadata?: {
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

export interface NewsletterFormData {
  email: string;
  name?: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: NewsletterSubscription;
  error?: string;
}
