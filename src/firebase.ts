import { initializeApp } from 'firebase/app';
import { getAuth, User } from 'firebase/auth';
import { getFirestore, initializeFirestore, doc, getDocFromServer, getDoc, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// Use the named database if provided in the config
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  experimentalAutoDetectLongPolling: true
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

/**
 * Get the user's role from Firestore.
 */
export async function getUserRole(user: User | null): Promise<{ role: 'admin' | 'editor'; permissions?: string[] } | null> {
  if (!user) return null;

  // Pre-check for hardcoded admins to ensure they always have access even if Firestore is offline
  if (user.email === 'khalid.lagouiti@gmail.com' || user.email === 'salma26@academie.com' || user.email === 'adminhugo@academie.com' || user.email === 'hugo@academie.com') {
    return { role: 'admin' };
  }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const role = data.role;
      const permissions = data.permissions || [];
      if (role === 'admin' || role === 'editor') {
        return { role, permissions };
      }
    }
    return null;
  } catch (err: any) {
    console.warn("Could not fetch user role from Firestore, defaulting to null.", err);
    return null;
  }
}

/**
 * Check if a user has admin privileges.
 */
export async function checkAdminStatus(user: User | null): Promise<boolean> {
  const result = await getUserRole(user);
  return result !== null && (result.role === 'admin' || result.role === 'editor');
}

// Operation types for error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

/**
 * Standard error handler for Firestore operations to provide diagnostic info.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Standard error handler for Storage operations.
 */
export function getStorageErrorMessage(error: any): string {
  if (!error || !error.code) return "Une erreur inconnue est survenue.";
  
  switch (error.code) {
    case 'storage/unauthorized':
      return "Vous n'avez pas l'autorisation d'effectuer cette action.";
    case 'storage/canceled':
      return "L'upload a été annulé.";
    case 'storage/quota-exceeded':
      return "Le quota de stockage est dépassé. Veuillez contacter l'administrateur.";
    case 'storage/unauthenticated':
      return "Veuillez vous reconnecter pour continuer.";
    case 'storage/retry-limit-exceeded':
      return "Le délai d'attente est dépassé. Vérifiez votre connexion internet.";
    case 'storage/invalid-checksum':
      return "Le fichier est corrompu ou a été modifié pendant l'envoi. Veuillez réessayer.";
    case 'storage/cannot-slice-blob':
      return "Impossible de lire le fichier. Il est peut-être corrompu ou inaccessible.";
    case 'storage/server-file-wrong-size':
      return "Le fichier reçu par le serveur a une taille incorrecte. Veuillez réessayer.";
    default:
      return "Erreur lors de l'upload. Vérifiez votre connexion internet ou la validité du fichier.";
  }
}


