export const db = {};
export const auth = { currentUser: { uid: 'demo', email: 'demo@agc.ma' } };
export const storage = {};
export const getUserRole = async () => ({ role: 'admin' as const, permissions: [] });
