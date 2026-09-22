import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2, AlertCircle, Film } from 'lucide-react';
import { storage, getStorageErrorMessage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface MediaUploadProps {
  value: string;
  onChange: (url: string) => void;
  type?: 'image' | 'video';
  label?: string;
  path: string; // e.g., 'events', 'news', 'moments'
}

export default function MediaUpload({ value, onChange, type = 'image', label, path }: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = async (file: File) => {
    const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`Le fichier est trop volumineux (max ${type === 'image' ? '5MB' : '50MB'})`);
      return;
    }

    if (type === 'image' && !file.type.startsWith('image/')) {
      setError("Veuillez sélectionner une image valide.");
      return;
    }

    if (type === 'video' && !file.type.startsWith('video/')) {
      setError("Veuillez sélectionner une vidéo valide.");
      return;
    }

    setUploading(true);
    setProgress(10);
    setError(null);

    // SOLUTION DE SECOURS: Convertir les images en Base64 compressé pour éviter les erreurs de Storage
    if (type === 'image') {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          setProgress(40);
          const img = new window.Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            setProgress(70);
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1000;
            const MAX_HEIGHT = 1000;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Compressor l'image en un petit format WEBP (approx 50-100kb max)
            const dataUrl = canvas.toDataURL('image/webp', 0.7);
            
            setProgress(100);
            onChange(dataUrl);
            setUploading(false);
            setShowUrlInput(false);
          };
          img.onerror = () => {
            setError("Erreur lors de la lecture de l'image.");
            setUploading(false);
          };
        };
        reader.onerror = () => {
          setError("Erreur lors de la lecture du fichier.");
          setUploading(false);
        };
        return; // Ne pas exécuter le code de Firebase Storage pour les images
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue lors du traitement de l'image.");
        setUploading(false);
        return;
      }
    }

    // Le code suivant s'exécute uniquement pour les vidéos (Firebase Storage)
    try {
      if (!storage) throw new Error("Le service de stockage n'est pas initialisé.");

      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storagePath = `${path}/${fileName}`;
      const storageRef = ref(storage, storagePath);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        }, 
        (err) => {
          setError(getStorageErrorMessage(err));
          setUploading(false);
        }, 
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onChange(downloadURL);
            setUploading(false);
            setShowUrlInput(false);
          } catch (err) {
            setError("Erreur lors de la récupération du lien.");
            setUploading(false);
          }
        }
      );
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      setUploading(false);
    }
  };

  const Icon = type === 'image' ? ImageIcon : Film;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
          {type === 'image' ? (
            <img src={value} alt="Preview" className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
          ) : (
            <video src={value} className="w-full h-48 object-cover" controls />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
              title="Supprimer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {!showUrlInput ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`relative w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all cursor-pointer overflow-hidden ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
              } ${uploading ? 'pointer-events-none' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={type === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <div className="text-sm font-bold text-blue-950">Téléchargement... {Math.round(progress)}%</div>
                  <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-blue-950">
                      Cliquez ou glissez une {type === 'image' ? 'image' : 'vidéo'} ici
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Max {type === 'image' ? '5MB' : '50MB'}
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`https://...`}
                className="flex-grow px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-950/10 focus:bg-white transition-all outline-none text-sm font-medium placeholder:text-slate-300"
              />
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-colors font-bold text-sm"
              >
                Annuler
              </button>
            </div>
          )}

          {!uploading && !showUrlInput && (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUrlInput(true);
                }}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                <LinkIcon className="w-3 h-3" />
                Ou utiliser un lien URL
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
