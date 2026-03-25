/**
 * Firebase Configuration
 * Initializes Firebase for client-side auth and Firestore
 */

// Note: Configure these when ready
// For development, using mock Firebase

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mock-auth-domain',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mock-bucket',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'mock-sender',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'mock-app',
};

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Initialize Firebase if keys are configured
let app: any = null;
let auth: any = null;
let db: any = null;

const isConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
                     process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'mock-project';

if (isConfigured) {
  try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
  } catch (error) {
    console.warn('⚠️ Firebase not fully configured. Using fallback auth.');
  }
}

export { app, auth, db };

export function isFirebaseConfigured(): boolean {
  return !!app;
}

/**
 * Mock User Type (cuando Firebase no está configurado)
 */
export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'customer';
}

/**
 * Mock Auth for development
 */
export const mockUsers: Record<string, MockUser> = {
  'admin@negocio.com': {
    uid: 'admin-001',
    email: 'admin@negocio.com',
    displayName: 'Admin Golden Key',
    role: 'admin',
  },
  'demo@cliente.com': {
    uid: 'customer-001',
    email: 'demo@cliente.com',
    displayName: 'Demo Cliente',
    role: 'customer',
  },
};

/**
 * Authentication function (Mock or Real)
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ uid: string; email: string; role: string }> {
  // If Firebase is configured, use real auth
  if (isFirebaseConfigured() && auth) {
    const result = await auth.signInWithEmailAndPassword(email, password);
    return {
      uid: result.user.uid,
      email: result.user.email,
      role: 'customer', // Get from Firestore in production
    };
  }

  // Mock auth for development
  const mockUser = mockUsers[email];
  if (mockUser && password === 'Demo123!') {
    return {
      uid: mockUser.uid,
      email: mockUser.email,
      role: mockUser.role,
    };
  }

  throw new Error('Invalid credentials');
}
