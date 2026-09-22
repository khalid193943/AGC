import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Image as ImageIcon,
  Loader2,
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import MediaUpload from './MediaUpload';

interface Moment {
  id: string;
  url: string;
  title: string;
  createdAt: any;
}

export default function MomentManagement() {
  const { t } = useLanguage();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ url: '', title: '' });
  const [activeTab, setActiveTab] = useState<'gallery' | 'add'>('gallery');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'moments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMoments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Moment)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'moments');
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    setFormError(null);
    if (!formData.title?.trim()) {
      setFormError("Veuillez saisir un titre pour le moment.");
      return;
    }
    if (!formData.url?.trim()) {
      setFormError("Veuillez ajouter une image pour le moment.");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, 'moments', editingId), formData);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'moments'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setFormData({ url: '', title: '' });
      setActiveTab('gallery');
      setIsAdding(false);
    } catch (error: any) {
      console.error("Error saving moment:", error);
      setFormError(error.message || "Une erreur est survenue lors de l'enregistrement.");
      handleFirestoreError(error, OperationType.WRITE, 'moments');
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmAction({ type: 'delete', id });
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'moments', id));
      setConfirmAction(null);
    } catch (error: any) {
      console.error("Error deleting moment:", error);
      handleFirestoreError(error, OperationType.DELETE, `moments/${id}`);
    }
  };

  const [confirmAction, setConfirmAction] = useState<{ type: 'delete', id?: string } | null>(null);

  const startEdit = (moment: Moment) => {
    setEditingId(moment.id);
    setFormData({ url: moment.url, title: moment.title });
    setFormError(null);
    setActiveTab('add');
    setIsAdding(true);
  };

  const tabs = [
    { id: 'gallery', label: t.admin.moments.tabs.gallery, icon: ImageIcon },
    { id: 'add', label: t.admin.moments.tabs.add, icon: Plus },
  ];

  return (
    <div className="space-y-10">
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
                <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-red-50 text-red-500`}>
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-950 tracking-tight mb-2">Êtes-vous sûr ?</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.admin.moments.title}</span>
                </div>
              </div>
              
              <p className="text-slate-700 mb-8 text-center text-sm leading-relaxed">
                Cette action est irréversible.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-grow py-5 px-8 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all text-[11px] uppercase tracking-widest"
                >
                  Annuler
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-display font-bold text-blue-950 mb-2">{t.admin.moments.title}</h2>
          <p className="text-slate-400 font-light tracking-widest uppercase text-[10px]">{moments.length} {t.admin.moments.title.toLowerCase()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-3xl w-fit border border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as 'gallery' | 'add');
              if (tab.id === 'add') {
                setIsAdding(true);
                if (!editingId) setFormData({ url: '', title: '' });
              } else {
                setIsAdding(false);
                setEditingId(null);
              }
            }}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${
              activeTab === tab.id
                ? 'bg-white text-blue-950 shadow-xl shadow-blue-950/5 border border-slate-100'
                : 'text-slate-400 hover:text-blue-950'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-300'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'add' ? (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50"
          >
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {formError && (
                <div className="md:col-span-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  {formError}
                </div>
              )}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">{t.admin.moments.titleLabel}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950/5 transition-all"
                  placeholder="Ex: Sortie scolaire"
                />
              </div>
              <div className="space-y-3">
                <MediaUpload
                  label={t.admin.moments.urlLabel}
                  value={formData.url}
                  onChange={(url) => setFormData({ ...formData, url })}
                  type="image"
                  path="moments"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setActiveTab('gallery');
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-950 transition-all"
              >
                {t.admin.moments.cancelBtn}
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-950 text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-blue-900 transition-all duration-500"
              >
                <Save className="w-4 h-4" />
                {editingId ? t.admin.moments.saveBtn : t.admin.moments.addBtn}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gallery-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {moments.map((moment) => (
                <motion.div
                  key={moment.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-blue-950/20 transition-all duration-700 hover:shadow-2xl hover:shadow-blue-950/10"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={moment.url}
                      alt={moment.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute bottom-8 left-8 right-8 flex justify-end gap-3 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-700">
                      <button
                        onClick={() => startEdit(moment)}
                        className="p-4 rounded-2xl bg-white text-blue-950 hover:bg-blue-950 hover:text-white transition-all duration-500 shadow-xl"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(moment.id)}
                        className="p-4 rounded-2xl bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all duration-500 shadow-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-lg font-bold text-blue-950 mb-2">{moment.title}</h3>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      {moment.createdAt?.toDate ? moment.createdAt.toDate().toLocaleDateString() : '...'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-950 animate-spin" />
        </div>
      )}
    </div>
  );
}
