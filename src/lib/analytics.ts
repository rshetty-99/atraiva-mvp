import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// Google Analytics 4 Event Tracking for Atraiva
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (analytics && typeof window !== 'undefined') {
    logEvent(analytics, eventName, parameters);
  }
};

// Compliance-specific tracking events
export const complianceEvents = {
  // User onboarding events
  signUpStarted: () => trackEvent('sign_up_started'),
  signUpCompleted: (method: string) => trackEvent('sign_up', { method }),
  onboardingCompleted: () => trackEvent('onboarding_completed'),

  // Feature usage events
  piiScanStarted: () => trackEvent('pii_scan_started'),
  piiScanCompleted: (piiFound: number) => trackEvent('pii_scan_completed', { pii_count: piiFound }),
  breachReportGenerated: (reportType: string) => trackEvent('breach_report_generated', { report_type: reportType }),
  complianceCheckRun: (regulation: string) => trackEvent('compliance_check_run', { regulation }),

  // Business events
  trialStarted: () => trackEvent('trial_started'),
  subscriptionUpgraded: (plan: string) => trackEvent('subscription_upgraded', { plan }),
  invoiceGenerated: (amount: number) => trackEvent('invoice_generated', { value: amount, currency: 'USD' }),

  // Engagement events
  dashboardVisited: () => trackEvent('dashboard_visited'),
  featureExplored: (feature: string) => trackEvent('feature_explored', { feature_name: feature }),
  documentUploaded: (fileType: string) => trackEvent('document_uploaded', { file_type: fileType }),
  
  // Support events
  helpCenterVisited: () => trackEvent('help_center_visited'),
  supportTicketCreated: (category: string) => trackEvent('support_ticket_created', { category }),
  
  // Conversion events
  ctaClicked: (ctaType: string, location: string) => trackEvent('cta_clicked', { 
    cta_type: ctaType, 
    location 
  }),
  demoRequested: () => trackEvent('demo_requested'),
  contactFormSubmitted: () => trackEvent('contact_form_submitted'),
};

// Page tracking
export const trackPageView = (pageName: string, pageTitle?: string) => {
  if (analytics && typeof window !== 'undefined') {
    logEvent(analytics, 'page_view', {
      page_title: pageTitle || document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_name: pageName,
    });
  }
};

// User properties for segmentation
export const setUserProperties = (properties: Record<string, string | number | boolean | null | undefined>) => {
  if (analytics && typeof window !== 'undefined') {
    // Set user properties for better segmentation
    Object.entries(properties).forEach(([key, value]) => {
      logEvent(analytics, 'user_property_set', { 
        property_name: key, 
        property_value: value 
      });
    });
  }
};

// E-commerce tracking for subscription plans
export const trackPurchase = (transactionId: string, value: number, items: Array<{ item_id: string; item_name: string; currency: string; price: number; quantity: number }>) => {
  if (analytics && typeof window !== 'undefined') {
    logEvent(analytics, 'purchase', {
      transaction_id: transactionId,
      value,
      currency: 'USD',
      items,
    });
  }
};

// Enhanced measurement events
export const enhancedEvents = {
  // Scroll depth tracking
  scrollDepth: (depth: number) => trackEvent('scroll_depth', { depth_percent: depth }),
  
  // Time on page
  timeOnPage: (duration: number) => trackEvent('time_on_page', { duration_seconds: duration }),
  
  // Form interactions
  formStarted: (formName: string) => trackEvent('form_started', { form_name: formName }),
  formSubmitted: (formName: string) => trackEvent('form_submitted', { form_name: formName }),
  formAbandoned: (formName: string) => trackEvent('form_abandoned', { form_name: formName }),
  
  // Video interactions
  videoPlayed: (videoName: string) => trackEvent('video_play', { video_name: videoName }),
  videoCompleted: (videoName: string) => trackEvent('video_complete', { video_name: videoName }),
  
  // Search functionality
  siteSearch: (searchTerm: string) => trackEvent('search', { search_term: searchTerm }),
  
  // Error tracking
  errorOccurred: (errorType: string, errorMessage: string) => trackEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
  }),
};