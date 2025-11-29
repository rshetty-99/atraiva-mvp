// Firebase configuration for Atraiva
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics, Analytics } from "firebase/analytics";

// Suppress Firebase telemetry errors in browser
if (typeof window !== "undefined") {
  // Override console.error to filter out Firebase telemetry errors
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const message = args[0]?.toString() || "";
    if (
      message.includes("Failed to create telemetry flag file") ||
      message.includes("mkdir is not a function") ||
      message.includes("keyless-telemetry")
    ) {
      // Suppress Firebase telemetry errors
      return;
    }
    originalError.apply(console, args);
  };
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Storage - ensure we're using production storage by default
// Only connect to emulator if explicitly enabled via environment variable
// IMPORTANT: Storage is initialized BEFORE emulator connection check
// to ensure production storage is used by default
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export let analytics: Analytics | null = null;
if (typeof window !== "undefined" && firebaseConfig.measurementId) {
  analytics = getAnalytics(app);
}

// Connect to emulators in development (only if explicitly enabled)
// Set NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true in .env.local to enable emulators
// IMPORTANT: By default, emulators are DISABLED - use production Firebase services
const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";

// Only connect to emulators if explicitly enabled
if (useEmulator) {
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    const isLocalhost = window.location.hostname === "localhost";

    if (isLocalhost) {
      try {
        connectAuthEmulator(auth, "http://localhost:9099");
      } catch (error) {
        // Emulator already connected or not available
        console.log("Auth emulator connection skipped:", error);
      }

      try {
        connectFirestoreEmulator(db, "localhost", 8080);
      } catch (error) {
        // Emulator already connected or not available
        console.log("Firestore emulator connection skipped:", error);
      }

      try {
        connectStorageEmulator(storage, "localhost", 9199);
      } catch (error) {
        // Emulator already connected or not available
        console.log("Storage emulator connection skipped:", error);
      }
    }
  }
} else {
  // Ensure we're using production Firebase (not emulator)
  // This is the default behavior - no emulator connection
  if (typeof window !== "undefined") {
    console.log("Firebase emulators disabled - using production services");
  }
}

export { app };
export default app;
