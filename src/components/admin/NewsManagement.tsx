import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType, storage, getStorageErrorMessage } from '../../firebase';
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
import { useLanguage } from '../../contexts/LanguageContext';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  image: string;
  additionalImages?: string[];
  category: string;
  content: string;
  isFeatured: boolean;
  authorUid: string;
  createdAt?: any;
  video?: string;
}

interface NewsManagementProps {
  user: any;
}

export default function NewsManagement({ user }: NewsManagementProps) {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState<Partial<NewsItem>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete', id?: string } | null>(null);

  const isRTL = language === 'ar';

  useEffect(() => {
    if (!user) return;

    const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(newsQuery, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      setNews(newsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'news');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleOpenModal = (item: NewsItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        image: '',
        additionalImages: [],
        category: 'Actualité',
        content: '',
        isFeatured: false
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
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
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
        const docRef = doc(db, 'news', editingItem.id);
        await updateDoc(docRef, {
          ...cleanData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'news'), {
          ...cleanData,
          authorUid: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      handleCloseModal();
    } catch (error) {
      handleFirestoreError(error, editingItem ? OperationType.UPDATE : OperationType.CREATE, 'news');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmAction({ type: 'delete', id });
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'news', id));
      setConfirmAction(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'news');
    }
  };

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-blue-950 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`space-y-12 ${isRTL ? 'rtl' : 'ltr'}`}>
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
              <div className={`flex flex-col items-center text-center gap-4 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-red-50 text-red-500`}>
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-950 tracking-tight mb-2">{t.admin.news.confirmation}</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.admin.news.title}</span>
                </div>
              </div>
              
              <p className={`text-slate-700 mb-8 text-center text-sm leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                {confirmAction.type === 'delete' && t.admin.news.confirmDeleteText}
              </p>

              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-grow py-5 px-8 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all text-[11px] uppercase tracking-widest"
                >
                  {t.admin.news.cancelBtn}
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

      <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] block mb-4">{t.admin.news.contentManagement}</span>
          <h1 className="text-4xl font-bold text-blue-950 mb-4 tracking-tight">{t.admin.news.title}</h1>
          <p className="text-slate-500 max-w-xl leading-relaxed text-sm">{t.admin.news.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-950 text-white rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-2xl shadow-blue-950/20 text-[11px] uppercase tracking-widest"
          >
            <Plus className="w-5 h-5" />
            <span>{t.admin.news.addBtn}</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 mb-12 flex items-center gap-6 shadow-sm">
        <div className="relative flex-grow">
          <Search className={`absolute ${isRTL ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300`} />
          <input
            type="text"
            placeholder={t.admin.news.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${isRTL ? 'pr-16 pl-6 text-right' : 'pl-16 pr-6'} py-5 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-950/10 transition-all text-sm placeholder:text-slate-300`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredNews.map((item) => (
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
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200">
                  <ImageIcon className="w-16 h-16" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {item.isFeatured && (
                <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'} px-4 py-1.5 bg-amber-400 text-blue-950 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg`}>
                  {t.admin.news.featured}
                </div>
              )}
            </div>
            <div className={`p-10 ${isRTL ? 'text-right' : ''}`}>
              <div className={`flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{item.date}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="text-blue-950">{item.category}</span>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-6 line-clamp-2 leading-tight tracking-tight group-hover:text-blue-900 transition-colors">{item.title}</h3>
              <div className={`flex items-center justify-between pt-8 border-t border-slate-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => handleOpenModal(item)}
                  className={`flex items-center gap-3 text-slate-400 hover:text-blue-950 font-bold text-[10px] uppercase tracking-widest transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Edit2 className="w-4 h-4" />
                  {t.admin.news.editBtn}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className={`flex items-center gap-3 text-red-300 hover:text-red-500 font-bold text-[10px] uppercase tracking-widest transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Trash2 className="w-4 h-4" />
                  {t.admin.news.deleteBtn}
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredNews.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.admin.news.noResults}</h3>
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
              className={`relative w-full max-w-6xl bg-white rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh] border border-slate-100 ${isRTL ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={`flex-grow overflow-y-auto p-6 md:p-12 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center justify-between mb-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] block mb-3">Édition d'actualité</span>
                    <h2 className="text-3xl font-bold text-blue-950 tracking-tight">
                      {editingItem ? t.admin.news.editNews : t.admin.news.newNews}
                    </h2>
                  </div>
                  <button onClick={handleCloseModal} className="md:hidden p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-slate-300" />
                  </button>
                </div>
  
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">{t.admin.news.titleLabel}</label>
                      <input
                        required
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm font-medium text-blue-950 placeholder:text-slate-400 ${isRTL ? 'text-right' : ''}`}
                        placeholder={t.admin.news.titleLabel}
                      />
                    </div>
  
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">{t.admin.news.dateLabel}</label>
                      <input
                        required
                        type="date"
                        name="date"
                        value={formData.date || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm font-medium text-blue-950 ${isRTL ? 'text-right' : ''}`}
                      />
                    </div>
  
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">{t.admin.news.categoryLabel}</label>
                      <select
                        name="category"
                        value={formData.category || 'Actualité'}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm font-medium text-blue-950 appearance-none ${isRTL ? 'text-right' : ''}`}
                      >
                        <option value="Actualité">Actualité</option>
                        <option value="Vie Scolaire">Vie Scolaire</option>
                        <option value="Pédagogie">Pédagogie</option>
                        <option value="Sport">Sport</option>
                        <option value="Culture">Culture</option>
                        <option value="Innovation">Innovation</option>
                        <option value="Succès">Succès</option>
                      </select>
                    </div>
  
                                        <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">{t.admin.news.imageLabel}</label>
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
                            <div className={`flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <AlertCircle className="w-4 h-4" />
                              <span>{error}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
 
                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Vidéo (Optionnel)</label>
                      <div className="space-y-4">
                        <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <input
                            type="url"
                            name="video"
                            value={formData.video || ''}
                            onChange={handleInputChange}
                            className={`flex-grow px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm font-medium text-blue-950 placeholder:text-slate-400 ${isRTL ? 'text-right' : ''}`}
                            placeholder={"https://youtube..."}
                          />
                          <label className={`flex items-center justify-center px-6 bg-slate-50 text-slate-400 rounded-2xl cursor-pointer hover:bg-slate-100 hover:text-blue-950 transition-all border border-slate-100 ${uploading && uploadType === 'video' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, 'video')}
                              disabled={uploading}
                            />
                            {uploading && uploadType === 'video' ? (
                              <div className="relative w-6 h-6">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-950" />
                              </div>
                            ) : (
                              <Upload className="w-6 h-6" />
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
    
                    <div className="col-span-full">
                      <div className={`flex items-center gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 w-fit ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <input
                          type="checkbox"
                          id="isFeatured"
                          name="isFeatured"
                          checked={formData.isFeatured || false}
                          onChange={handleInputChange}
                          className="w-6 h-6 rounded-lg border-slate-200 text-blue-950 focus:ring-blue-950/20 transition-all"
                        />
                        <label htmlFor="isFeatured" className="text-[11px] font-bold text-blue-950 uppercase tracking-widest">{t.admin.news.featured}</label>
                      </div>
                    </div>
  
                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">{t.admin.news.contentLabel}</label>
                      <textarea
                        required
                        name="content"
                        value={formData.content || ''}
                        onChange={handleInputChange}
                        rows={8}
                        className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all outline-none resize-none text-sm font-medium text-blue-950 leading-relaxed placeholder:text-slate-400 ${isRTL ? 'text-right' : ''}`}
                        placeholder={"Détails de l'actualité..."}
                      />
                    </div>
                  </div>
  
                  <div className={`pt-10 flex gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-grow py-5 px-10 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 hover:text-blue-950 transition-all text-[11px] uppercase tracking-widest"
                    >
                      {t.admin.news.cancelBtn}
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
                      <span>{editingItem ? t.admin.news.saveChanges : t.admin.news.publishNews}</span>
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
