import fs from 'node:fs';
import path from 'node:path';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function readServiceAccount(): ServiceAccount | null {
  const jsonFromEnv = process.env.FIREBASE_ADMIN_SDK_JSON;
  if (jsonFromEnv) {
    try {
      return JSON.parse(jsonFromEnv) as ServiceAccount;
    } catch {
      return null;
    }
  }

  const sdkPath = process.env.FIREBASE_ADMIN_SDK_PATH;
  if (!sdkPath) return null;

  try {
    const abs = path.isAbsolute(sdkPath) ? sdkPath : path.join(process.cwd(), sdkPath);
    const raw = fs.readFileSync(abs, 'utf8');
    return JSON.parse(raw) as ServiceAccount;
  } catch {
    return null;
  }
}

export function getAdminFirestore() {
  const serviceAccount = readServiceAccount();
  if (!serviceAccount) {
    throw new Error('Firebase Admin SDK no configurado. Define FIREBASE_ADMIN_SDK_PATH o FIREBASE_ADMIN_SDK_JSON.');
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return getFirestore();
}
