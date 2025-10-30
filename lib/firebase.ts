// Firebase configuration and initialization
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "demo-project.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:demo",
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-DEMO123",
};

// Check if Firebase is properly configured with valid keys
const isFirebaseConfigured =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-api-key" &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "demo-project";

// Initialize Firebase only if properly configured
let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let analytics: ReturnType<typeof getAnalytics> | null = null;

if (isFirebaseConfigured) {
  try {
    // Validate API key format before initializing
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (apiKey && apiKey.length > 20 && !apiKey.includes("demo")) {
      app =
        getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

      // Initialize Firebase services
      db = getFirestore(app);
      storage = getStorage(app);
      auth = getAuth(app);

      // Initialize Analytics (only in browser environment)
      // Note: isSupported() is async, so we just try to initialize and handle errors
      if (typeof window !== "undefined") {
        try {
          analytics = getAnalytics(app);
        } catch {
          analytics = null;
        }
      } else {
        analytics = null;
      }
    } else {
      console.warn("Firebase API key appears to be invalid or demo key");
    }
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
} else {
  console.warn(
    "Firebase not configured. Please set up your environment variables in .env.local"
  );
}

export { db, storage, auth, analytics };

// Connect to emulators in development
if (
  process.env.NODE_ENV === "development" &&
  typeof window !== "undefined" &&
  db &&
  storage &&
  auth &&
  isFirebaseConfigured
) {
  // Try to connect to emulators, but catch errors if already connected
  try {
    connectFirestoreEmulator(db, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
    connectAuthEmulator(auth, "http://localhost:9099");
  } catch {
    // Emulators already connected or not available
    console.log("Firebase emulators connection skipped");
  }
}

export default app;
