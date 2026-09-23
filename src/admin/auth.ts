/**
 * Authentification de l'administration.
 * 1) Connexion Firebase classique (email + mot de passe) — recommandée.
 * 2) Compatibilité avec les identifiants historiques (nom d'utilisateur → compte Firebase interne),
 *    conservée pour que l'accès existant continue de fonctionner. À supprimer une fois les comptes
 *    Firebase Auth créés pour chaque membre (voir README, section Sécurité).
 */
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, getUserRole } from '../firebase';

const LEGACY: Record<string, { password: string; email: string; role: 'admin' | 'editor' }> = {
  salma26: { password: 'salma26', email: 'salma26@academie.com', role: 'admin' },
  admin: { password: 'salma26', email: 'admin@academie.com', role: 'admin' },
  'khalid.lagouiti@gmail.com': { password: 'salma26', email: 'khalid.lagouiti@gmail.com', role: 'admin' },
  adminhugo: { password: 'adminhugo26', email: 'adminhugo@academie.com', role: 'admin' },
  hugo: { password: 'hugo2026$$', email: 'hugo@academie.com', role: 'admin' },
};
const INTERNAL_PASSWORD = 'salma26_secure_password';

export interface Session { user: User; role: 'admin' | 'editor'; permissions: string[] }

export const login = async (username: string, password: string): Promise<Session> => {
  const u = username.trim();
  // 1) Email + mot de passe Firebase
  if (u.includes('@')) {
    try {
      const cred = await signInWithEmailAndPassword(auth, u, password);
      const role = await getUserRole(cred.user);
      if (!role) { await signOut(auth); throw new Error('Ce compte n’a pas accès à l’administration.'); }
      return { user: cred.user, role: role.role, permissions: role.permissions || [] };
    } catch (e: any) {
      if (!(u in LEGACY) && !['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found'].includes(e?.code)) throw new Error(e?.message || 'Connexion impossible.');
    }
  }
  // 2) Identifiants historiques / admin_users
  let email = ''; let role: 'admin' | 'editor' = 'editor'; let permissions: string[] = [];
  const legacy = LEGACY[u];
  if (legacy && legacy.password === password) { email = legacy.email; role = legacy.role; }
  else {
    const snap = await getDocs(query(collection(db, 'admin_users'), where('username', '==', u), where('password', '==', password)));
    if (snap.empty) throw new Error('Identifiant ou mot de passe incorrect.');
    const d = snap.docs[0].data();
    email = d.email; role = d.role || 'editor'; permissions = d.permissions || [];
  }
  let cred;
  try { cred = await signInWithEmailAndPassword(auth, email, INTERNAL_PASSWORD); }
  catch (e: any) {
    if (['auth/user-not-found', 'auth/invalid-credential'].includes(e?.code)) cred = await createUserWithEmailAndPassword(auth, email, INTERNAL_PASSWORD);
    else throw new Error('Connexion Firebase impossible : ' + (e?.message || ''));
  }
  const ref = doc(db, 'users', cred.user.uid);
  try {
    const existing = await getDoc(ref);
    if (!existing.exists()) await setDoc(ref, { uid: cred.user.uid, email, role, permissions });
  } catch { /* droits insuffisants : l'accès reste possible via les emails reconnus par les règles */ }
  const r = await getUserRole(cred.user);
  return { user: cred.user, role: r?.role || role, permissions: r?.permissions || permissions };
};

export const logout = () => signOut(auth);

export const watchSession = (cb: (s: Session | null) => void) =>
  onAuthStateChanged(auth, async (user) => {
    if (!user) return cb(null);
    const r = await getUserRole(user);
    cb(r ? { user, role: r.role, permissions: r.permissions || [] } : null);
  });
