export const signInWithEmailAndPassword = async (_a: any, email: string) => ({ user: { uid: 'demo', email } });
export const createUserWithEmailAndPassword = signInWithEmailAndPassword;
export const signOut = async () => { window.location.hash = '#/admin/login'; };
export const onAuthStateChanged = (_a: any, cb: (u: any) => void) => { setTimeout(() => cb({ uid: 'demo', email: 'demo@agc.ma' }), 100); return () => {}; };
export const getAuth = () => ({ currentUser: { uid: 'demo', email: 'demo@agc.ma' } });
export type User = any;
