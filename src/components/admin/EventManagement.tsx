import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType, storage, getStorageErrorMessage } from '../../firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytesResumable, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Image as ImageIcon,
  Search,
  Sparkles,
  AlertCircle,
  Loader2,
  Upload
} from 'lucide-react';
import MediaUpload from './MediaUpload';

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  image: string;
  additionalImages?: string[];
  location: string;
  description: string;
  authorUid: string;
  createdAt?: any;
}

interface EventManagementProps {
  user: any;
}

export default function EventManagement({ user }: EventManagementProps) {
  const { t } = useLanguage();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);
  const [formData, setFormData] = useState<Partial<EventItem>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete', id?: string } | null>(null);

  useEffect(() => {
    if (!user) return;

    const eventsQuery = query(collection(db, 'events'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventItem));
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'events');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleOpenModal = (item: EventItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        image: '',
        additionalImages: [],
        location: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Basic validation
    const maxSize = 5 * 1024 * 1024; // 5MB for images
    if (file.size > maxSize) {
      setError(`Le fichier est trop volumineux (max 5MB)`);
      return;
    }

    setUploading(true);
    setUploadType(type);
    setUploadProgress(0);
    setError(null);

    try {
      // Create a canvas object to resize the image
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
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
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality JPEG

          if (type === 'additionalImages' && formData.additionalImages) {
            setFormData(prev => ({ ...prev, additionalImages: [...(prev.additionalImages || []), dataUrl].slice(0, 4) }));
          } else {
            setFormData(prev => ({ ...prev, [type]: dataUrl }));
          }
          setUploading(false);
          setUploadType(null);
          setUploadProgress(0);
        } else {
            setError("Erreur lors de la création de l'image.");
            setUploading(false);
            setUploadType(null);
        }
      };
      
      img.onerror = () => {
        setError("Fichier image non valide.");
        setUploading(false);
        setUploadType(null);
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);

    } catch (err: any) {
      console.error("Error initiating upload:", err);
      setError(err.message || "Impossible de démarrer l'upload.");
      setUploading(false);
      setUploadType(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const { id, authorUid, createdAt, ...cleanData } = formData;

      if (editingItem) {
        const docRef = doc(db, 'events', editingItem.id);
        await updateDoc(docRef, {
          ...cleanData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'events'), {
          ...cleanData,
          authorUid: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      handleCloseModal();
    } catch (error) {
      handleFirestoreError(error, editingItem ? OperationType.UPDATE : OperationType.CREATE, 'events');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmAction({ type: 'delete', id });
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      setConfirmAction(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'events');
    }
  };

  const filteredEvents = events.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-blue-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl shadow-blue-950/10 border border-slate-100"
            >
              <div className="flex flex-col items-center text-center gap-4 mb-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  confirmAction.type === 'delete' || confirmAction.type === 'deleteAll'
                    ? 'bg-red-50 text-red-500'
                    : 'bg-amber-50 text-amber-500'
                }`}>
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-950 tracking-tight mb-2">{t.admin.news.confirmQuestion || "Êtes-vous sûr ?"}</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.admin.events.confirmation}</span>
                </div>
              </div>
              
              <p className="text-slate-700 mb-8 text-center text-sm leading-relaxed">
                {confirmAction.type === 'delete' && t.admin.events.confirmDeleteText}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-grow py-5 px-8 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all text-[11px] uppercase tracking-widest"
                >
                  {t.admin.events.cancelBtn}
                </button>
                <button
                  onClick={() => {
                    if (confirmAction.type === 'delete' && confirmAction.id) confirmDelete(confirmAction.id);
                  }}
                  className="flex-grow py-5 px-8 rounded-2xl font-bold transition-all text-[11px] uppercase tracking-widest bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-200"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] block mb-3">{t.admin.events.calendar}</span>
          <h1 className="text-4xl font-bold text-blue-950 tracking-tight">{t.admin.events.title}</h1>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-950 text-white rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-2xl shadow-blue-950/20 text-[11px] uppercase tracking-widest"
          >
            <Plus className="w-5 h-5" />
            <span>{t.admin.events.addBtn}</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 mb-12 flex items-center gap-6 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input
            type="text"
            placeholder={t.admin.events.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-4 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-950/10 transition-all text-sm font-medium placeholder:text-slate-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredEvents.map((item) => (
          <motion.div
            layout
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
          >
            <div className="aspect-[16/10] relative overflow-hidden bg-slate-50">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-10">
              <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-5">
                <span className="px-3 py-1 bg-slate-50 rounded-full">{item.date}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="text-blue-950">{item.time}</span>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-6 line-clamp-2 leading-tight group-hover:text-blue-800 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-8">
                <span className="font-bold uppercase tracking-widest">{t.admin.events.locationLabel}:</span>
                <span className="font-medium">{item.location}</span>
              </div>
              <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="flex items-center gap-2 text-slate-400 hover:text-blue-950 font-bold text-[10px] uppercase tracking-widest transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  {t.admin.events.editBtn}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-2 text-red-300 hover:text-red-500 font-bold text-[10px] uppercase tracking-widest transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  {t.admin.events.deleteBtn}
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.admin.events.noResults}</h3>
            <p className="text-slate-500">"Essayez de modifier votre recherche"</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-auto max-h-[90vh]"
            >
              <div className="flex-grow overflow-y-auto p-6 md:p-12">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] block mb-3">Édition d'événement</span>
                    <h2 className="text-3xl font-bold text-blue-950 tracking-tight">
                      {editingItem ? t.admin.events.editEvent : t.admin.events.newEvent}
                    </h2>
                  </div>
                  <button onClick={handleCloseModal} className="md:hidden p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-slate-300" />
                  </button>
                </div>
  
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">{t.admin.events.titleLabel}</label>
                      <input
                        required
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm font-medium text-blue-950 placeholder:text-slate-400"
                        placeholder="Ex: Portes Ouvertes..."
                      />
                    </div>
  
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">{t.admin.events.dateLabel}</label>
                      <input
                        required
                        type="date"
                        name="date"
                        value={formData.date || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm font-medium text-blue-950 placeholder:text-slate-400"
                      />
                    </div>
  
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Heure</label>
                      <input
                        required
                        type="text"
                        name="time"
                        value={formData.time || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm font-medium text-blue-950 placeholder:text-slate-400"
                        placeholder={"Ex: 09:00"}
                      />
                    </div>
  
                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">{t.admin.events.locationLabel}</label>
                      <input
                        required
                        type="text"
                        name="location"
                        value={formData.location || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm font-medium text-blue-950 placeholder:text-slate-400"
                        placeholder="Ex: Campus Principal, Grand Auditorium..."
                      />
                    </div>
  
                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Image de couverture</label>
                      {formData.image ? (
                        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-slate-200 group">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                            className="absolute inset-0 bg-red-500/20 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-8 h-8 drop-shadow-md" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className={`aspect-[21/9] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-900/30 hover:text-blue-900 hover:bg-blue-50/50 transition-all cursor-pointer ${uploading && uploadType === 'image' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, 'image')}
                              disabled={uploading}
                            />
                            {uploading && uploadType === 'image' ? (
                              <Loader2 className="w-8 h-8 animate-spin mb-3" />
                            ) : (
                              <Upload className="w-8 h-8 mb-3" />
                            )}
                            <span className="text-sm font-medium">Cliquez pour ajouter une image</span>
                          </label>
                          {error && uploadType === 'image' && (
                            <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider">
                              <AlertCircle className="w-4 h-4" />
                              <span>{error}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
  
                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Images Supplémentaires (Max 4)</label>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(formData.additionalImages || []).map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 hover:border-red-400 group">
                              <img src={img} alt="Additional" className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, additionalImages: prev.additionalImages?.filter((_, i) => i !== idx) }))}
                                className="absolute inset-0 bg-red-500/20 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="w-6 h-6 drop-shadow-md" />
                              </button>
                            </div>
                          ))}
                          
                          {(!formData.additionalImages || formData.additionalImages.length < 4) && (
                            <label className={`aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-900/30 hover:text-blue-900 hover:bg-blue-50/50 transition-all cursor-pointer ${uploading && uploadType === 'additionalImages' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'additionalImages')}
                                disabled={uploading}
                              />
                              {uploading && uploadType === 'additionalImages' ? (
                                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                              ) : (
                                <Plus className="w-6 h-6 mb-2" />
                              )}
                              <span className="text-xs font-medium">Ajouter</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
  
                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">{t.admin.events.descLabel}</label>
                      <textarea
                        required
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        rows={8}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all outline-none resize-none text-sm font-medium text-blue-950 leading-relaxed placeholder:text-slate-400"
                        placeholder={"Détails de l'événement..."}
                      />
                    </div>
                  </div>
  
                  <div className="pt-10 flex gap-6">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-grow py-5 px-10 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 hover:text-blue-950 transition-all text-[11px] uppercase tracking-widest"
                    >
                      {t.admin.events.cancelBtn}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-grow-[2] py-5 px-10 bg-blue-950 text-white rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-2xl shadow-blue-950/20 flex items-center justify-center gap-3 disabled:opacity-50 text-[11px] uppercase tracking-widest"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      <span>{editingItem ? t.admin.events.saveChanges : t.admin.events.publishEvent}</span>
                    </button>
                  </div>
                </form>
              </div>
  
              </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
