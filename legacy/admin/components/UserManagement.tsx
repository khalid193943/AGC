import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Plus, Edit2, Trash2, User as UserIcon, Mail, Shield, X, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'editor';
  permissions?: string[];
  name: string;
  createdAt: any;
}

export default function UserManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete', id: string } | null>(null);
  const [editingItem, setEditingItem] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<Omit<AdminUser, 'id' | 'createdAt'>>({
    username: '',
    email: '',
    password: '',
    role: 'admin',
    permissions: [],
    name: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'admin_users'), orderBy('username', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'admin_users');
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (item: AdminUser | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        username: item.username,
        email: item.email,
        password: item.password || '',
        role: item.role,
        permissions: item.permissions || [],
        name: item.name
      });
    } else {
      setEditingItem(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'admin',
        permissions: [],
        name: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateDoc(doc(db, 'admin_users', editingItem.id), formData);
      } else {
        await addDoc(collection(db, 'admin_users'), {
          ...formData,
          createdAt: new Date().toISOString()
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, editingItem ? OperationType.UPDATE : OperationType.CREATE, 'admin_users');
    }
  };

  const isSuperAdmin = (username: string) => {
    return ['hugo', 'salma26', 'admin'].includes(username.toLowerCase());
  };

  const handleDelete = (id: string, username: string) => {
    if (isSuperAdmin(username)) {
      return; // Safety check
    }
    setConfirmAction({ type: 'delete', id });
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'admin_users', id));
      setConfirmAction(null);
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.DELETE, 'admin_users');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 text-blue-950 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmAction(null)}
              className="absolute inset-0 bg-blue-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[3rem] p-12 shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                  <Trash2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] block mb-1">Confirmation</span>
                  <h3 className="text-2xl font-bold text-blue-950 tracking-tight">{t.admin.users.confirmDelete}</h3>
                </div>
              </div>
              
              <p className="text-slate-500 mb-10 text-sm leading-relaxed">
                {t.admin.users.deleteWarning}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-grow py-5 px-8 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 hover:text-blue-950 transition-all text-[11px] uppercase tracking-widest"
                >
                  {t.admin.users.cancelBtn}
                </button>
                <button
                  onClick={() => confirmDelete(confirmAction.id)}
                  className="flex-grow py-5 px-8 rounded-2xl font-bold transition-all text-[11px] uppercase tracking-widest shadow-xl bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                >
                  {t.admin.users.deleteBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] block mb-3">Administration</span>
          <h2 className="text-3xl font-bold text-blue-950 tracking-tight">{t.admin.users.title}</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-md leading-relaxed">{t.admin.users.subtitle}</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="group flex items-center gap-3 px-8 py-4 bg-blue-950 text-white rounded-full font-bold hover:bg-blue-900 transition-all shadow-2xl shadow-blue-950/20 active:scale-95"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm tracking-wide">{t.admin.users.addBtn}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map(user => (
          <motion.div
            layout
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-blue-950 group-hover:bg-blue-950 group-hover:text-white transition-all duration-500">
                  <UserIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-950 tracking-tight">{user.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                    <span className="font-bold text-blue-950/40">@{user.username}</span>
                    {isSuperAdmin(user.username) && (
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">Super Admin</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 opacity-100 translate-x-0 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-x-4 md:group-hover:translate-x-0">
                <button 
                  onClick={() => handleOpenModal(user)} 
                  className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(user.id, user.username)} 
                  disabled={isSuperAdmin(user.username)}
                  className={`p-3 rounded-xl transition-all ${
                    isSuperAdmin(user.username) 
                      ? 'text-slate-200 cursor-not-allowed' 
                      : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-500">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-widest text-[10px]">
                  {user.role === 'admin' ? t.admin.users.roleAdmin : t.admin.users.roleEditor}
                </span>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
                  {t.admin.users.activeStatus}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl md:rounded-[3rem] p-6 md:p-12 w-full max-w-2xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] block mb-3">Fiche Utilisateur</span>
                  <h3 className="text-3xl font-bold text-blue-950 tracking-tight">
                    {editingItem ? t.admin.users.editBtn : t.admin.users.addBtn}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-blue-950 hover:bg-slate-100 rounded-2xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t.admin.users.nameLabel}</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-950 focus:bg-white transition-all outline-none text-blue-950 font-medium"
                      placeholder="Ex: Hugo Admin"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t.admin.users.usernameLabel}</label>
                    <input
                      required
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-950 focus:bg-white transition-all outline-none text-blue-950 font-medium"
                      placeholder="Ex: adminhugo"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t.admin.password}</label>
                    <input
                      required
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-950 focus:bg-white transition-all outline-none text-blue-950 font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t.admin.users.emailLabel}</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-950 focus:bg-white transition-all outline-none text-blue-950 font-medium"
                      placeholder="admin@ecole.com"
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t.admin.users.roleLabel}</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any, permissions: e.target.value === 'admin' ? [] : formData.permissions })}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-950 focus:bg-white transition-all outline-none text-blue-950 font-medium"
                    >
                      <option value="admin">{t.admin.users.roleAdmin} (Accès Complet)</option>
                      <option value="editor">{t.admin.users.roleEditor} (Accès Restreint)</option>
                    </select>
                  </div>

                  {formData.role === 'editor' && (
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Permissions (Sections accessibles)</label>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { id: 'news', label: t.admin.dashboard.news },
                          { id: 'events', label: t.admin.dashboard.events },
                          { id: 'messages', label: t.admin.dashboard.messages },
                          { id: 'moments', label: t.admin.dashboard.moments },
                          { id: 'users', label: t.admin.dashboard.users },
                          { id: 'recruitment', label: t.admin.dashboard.recruitment },
                        ].map(perm => (
                          <label key={perm.id} className="flex items-center gap-3 p-4 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
                            <input
                              type="checkbox"
                              checked={(formData.permissions || []).includes(perm.id)}
                              onChange={(e) => {
                                const newPerms = e.target.checked 
                                  ? [...(formData.permissions || []), perm.id]
                                  : (formData.permissions || []).filter(p => p !== perm.id);
                                setFormData({ ...formData, permissions: newPerms });
                              }}
                              className="w-5 h-5 rounded-md border-slate-300 text-blue-950 focus:ring-blue-950"
                            />
                            <span className="text-sm font-bold text-blue-950">{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-10 border-t border-slate-50">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-grow py-4 px-6 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm tracking-wide"
                  >
                    {t.admin.users.cancelBtn}
                  </button>
                  <button 
                    type="submit" 
                    className="flex-grow py-4 px-6 bg-blue-950 text-white rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-xl shadow-blue-950/20 text-sm tracking-wide"
                  >
                    {t.admin.users.saveBtn}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
