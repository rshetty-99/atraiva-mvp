import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NewsletterSubscription, NewsletterResponse } from "@/types/newsletter";

const NEWSLETTER_COLLECTION = "newsletter";

export class NewsletterService {
  /**
   * Subscribe a user to the newsletter
   */
  static async subscribe(
    email: string,
    metadata?: Partial<NewsletterSubscription["metadata"]>,
    name?: string,
    userId?: string
  ): Promise<NewsletterResponse> {
    try {
      // Check if email already exists
      const existingSubscription = await this.checkExistingSubscription(email);

      if (existingSubscription) {
        return {
          success: false,
          message: "This email is already subscribed to our newsletter.",
          data: existingSubscription,
        };
      }

      // Create new subscription
      const subscriptionData: Omit<NewsletterSubscription, "id"> = {
        email: email.toLowerCase().trim(),
        name: name?.trim(),
        userId: userId,
        subscribedAt: new Date(),
        isActive: true,
        source: userId ? "hero-button-logged-in" : "hero-button-guest",
        metadata: {
          ...metadata,
          subscribedAt: new Date().toISOString(),
        },
      };

      const docRef = await addDoc(collection(db, NEWSLETTER_COLLECTION), {
        ...subscriptionData,
        subscribedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        message: "Successfully subscribed to newsletter!",
        data: {
          ...subscriptionData,
          id: docRef.id,
        },
      };
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      return {
        success: false,
        message: "Failed to subscribe to newsletter. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Check if email already exists in newsletter collection
   */
  static async checkExistingSubscription(
    email: string
  ): Promise<NewsletterSubscription | null> {
    try {
      const q = query(
        collection(db, NEWSLETTER_COLLECTION),
        where("email", "==", email.toLowerCase().trim()),
        where("isActive", "==", true)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as NewsletterSubscription;
    } catch (error) {
      console.error("Error checking existing subscription:", error);
      return null;
    }
  }

  /**
   * Check if user is already subscribed by userId
   */
  static async checkSubscriptionByUserId(
    userId: string
  ): Promise<NewsletterSubscription | null> {
    try {
      const q = query(
        collection(db, NEWSLETTER_COLLECTION),
        where("userId", "==", userId),
        where("isActive", "==", true)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as NewsletterSubscription;
    } catch (error) {
      console.error("Error checking subscription by userId:", error);
      return null;
    }
  }

  /**
   * Get subscription count (for analytics)
   */
  static async getSubscriptionCount(): Promise<number> {
    try {
      const q = query(
        collection(db, NEWSLETTER_COLLECTION),
        where("isActive", "==", true)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error("Error getting subscription count:", error);
      return 0;
    }
  }
}
