export interface NewsletterSubscription {
  id?: string;
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  source?: string; // e.g., 'website', 'landing-page', etc.
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
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: NewsletterSubscription;
  error?: string;
}
