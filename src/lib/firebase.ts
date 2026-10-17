import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'manmayascake.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'manmayascake',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'manmayascake.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

export const app = getApps().length > 0 
  ? getApp() 
  : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);

let storageInstance: FirebaseStorage | null = null;
try {
  storageInstance = getStorage(app);
} catch (err) {
  console.warn('Firebase Storage initialization notice:', err);
}
export const storage = storageInstance;
