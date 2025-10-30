// Firebase configuration for Atraiva
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  analytics = getAnalytics(app);
}

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = window.location.hostname === 'localhost';
  
  if (isDevelopment && isLocalhost) {
    try {
      // Only connect if not already connected
      if (!auth._delegate._isInitialized) {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
    } catch (error) {
      // Emulator already connected or not available
      console.log('Auth emulator connection skipped:', error);
    }
    
    try {
      if (!db._delegate._terminated) {
        connectFirestoreEmulator(db, 'localhost', 8080);
      }
    } catch (error) {
      // Emulator already connected or not available  
      console.log('Firestore emulator connection skipped:', error);
    }
    
    try {
      connectStorageEmulator(storage, 'localhost', 9199);
    } catch (error) {
      // Emulator already connected or not available
      console.log('Storage emulator connection skipped:', error);
    }
  }
}

export { app };
export default app;