/** Accès aux données de l'administration : lecture temps réel, écriture, envoi d'images. */
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, QueryConstraint } from 'firebase/firestore';
import { ref as sref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';

export const useCollection = <T = any>(name: string, order?: string, dir: 'asc' | 'desc' = 'desc') => {
  const [rows, setRows] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const cons: QueryConstraint[] = order ? [orderBy(order, dir)] : [];
    const unsub = onSnapshot(query(collection(db, name), ...cons), (s) => { setRows(s.docs.map((d) => ({ id: d.id, ...(d.data() as T) }))); setLoading(false); }, (e) => { setError(e.message); setLoading(false); });
    return () => unsub();
  }, [name, order, dir]);
  return { rows, loading, error };
};

const clean = (o: Record<string, any>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

export const create = (name: string, data: Record<string, any>, withAuthor = false) =>
  addDoc(collection(db, name), clean({ ...data, ...(withAuthor ? { authorUid: auth.currentUser?.uid } : {}), createdAt: serverTimestamp() }));
export const update = (name: string, id: string, data: Record<string, any>) => updateDoc(doc(db, name, id), clean({ ...data, updatedAt: serverTimestamp() }));
export const patch = (name: string, id: string, data: Record<string, any>) => updateDoc(doc(db, name, id), clean(data));
export const remove = (name: string, id: string) => deleteDoc(doc(db, name, id));

/** Image → data URL compressée (max 1400 px, JPEG 82 %) : aucune configuration Storage requise. */
export const compressImage = (file: File, max = 1400, quality = 0.82) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject; img.src = String(reader.result);
    };
    reader.onerror = reject; reader.readAsDataURL(file);
  });

/** Vidéo → Firebase Storage (URL de téléchargement). */
export const uploadVideo = (file: File, folder: string, onProgress?: (p: number) => void) =>
  new Promise<string>((resolve, reject) => {
    const path = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const task = uploadBytesResumable(sref(storage, path), file);
    task.on('state_changed', (s) => onProgress?.(Math.round((s.bytesTransferred / s.totalBytes) * 100)), reject, async () => resolve(await getDownloadURL(task.snapshot.ref)));
  });

export const fmt = (d: any) => {
  if (!d) return '';
  const date = d?.seconds ? new Date(d.seconds * 1000) : d?.toDate ? d.toDate() : new Date(d);
  return isNaN(date.getTime()) ? String(d) : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};
export const fmtTime = (d: any) => {
  const date = d?.seconds ? new Date(d.seconds * 1000) : d?.toDate ? d.toDate() : null;
  return date ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
};
export const today = () => new Date().toISOString().slice(0, 10);

export const toCsv = (rows: Record<string, any>[], cols: string[]) => {
  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [cols.join(';'), ...rows.map((r) => cols.map((c) => esc(c === 'createdAt' ? fmt(r[c]) : r[c])).join(';'))].join('\n');
};
export const download = (name: string, content: string, type = 'text/csv;charset=utf-8') => {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + content], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href);
};
