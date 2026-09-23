export const ref = () => ({});
export const uploadBytesResumable = () => ({ on: (_e: any, _p: any, _err: any, done: () => void) => setTimeout(done, 500), snapshot: { ref: {} } });
export const getDownloadURL = async () => 'data:video/mp4;base64,';
export const getStorage = () => ({});
