import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { 
  collection, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Archive, 
  Clock, 
  User, 
  Phone, 
  Inbox,
  Filter,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  type: 'contact' | 'admissions';
  status: 'new' | 'read' | 'archived';
  createdAt: any;
}

type MessageFilter = 'all' | 'contact' | 'admissions' | 'new' | 'read' | 'archived';

export default function MessageManagement() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<MessageFilter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'messages');
    });

    return () => unsubscribe();
  }, []);

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    if (filter === 'contact') return msg.type === 'contact';
    if (filter === 'admissions') return msg.type === 'admissions';
    if (filter === 'new') return msg.status === 'new';
    if (filter === 'read') return msg.status === 'read';
    if (filter === 'archived') return msg.status === 'archived';
    return true;
  });

  const updateStatus = async (id: string, status: Message['status']) => {
    try {
      await updateDoc(doc(db, 'messages', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `messages/${id}`);
    }
  };

  const deleteMessage = async (id: string) => {
    if (window.confirm(t.admin.sections.confirmDelete)) {
      try {
        await deleteDoc(doc(db, 'messages', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `messages/${id}`);
      }
    }
  };

  const tabs: { id: MessageFilter; label: string }[] = [
    { id: 'all', label: t.admin.messages.tabs.all },
    { id: 'contact', label: t.admin.messages.tabs.homepage },
    { id: 'admissions', label: t.admin.messages.tabs.admissions },
    { id: 'new', label: t.admin.messages.tabs.new },
    { id: 'read', label: t.admin.messages.tabs.read },
    { id: 'archived', label: t.admin.messages.tabs.archived },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-display font-bold text-blue-950 mb-2">{t.admin.messages.title}</h2>
          <p className="text-slate-400 font-light tracking-widest uppercase text-[10px]">{filteredMessages.length} {t.admin.messages.title.toLowerCase()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100/50 p-1.5 rounded-[2rem] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${
              filter === tab.id 
                ? 'bg-blue-950 text-white shadow-lg shadow-blue-950/20' 
                : 'text-slate-400 hover:text-blue-950 hover:bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white p-8 rounded-[2.5rem] border transition-all duration-500 group ${
                  msg.status === 'new' ? 'border-amber-400/30 shadow-xl shadow-amber-400/5' : 'border-slate-100'
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-grow space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        msg.type === 'contact' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {msg.type === 'contact' ? t.admin.messages.tabs.homepage : t.admin.messages.tabs.admissions}
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        msg.status === 'new' ? 'bg-amber-50 text-amber-600' : 
                        msg.status === 'read' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {msg.status === 'new' ? t.admin.messages.tabs.new : 
                         msg.status === 'read' ? t.admin.messages.tabs.read : t.admin.messages.tabs.archived}
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 text-[9px] font-bold uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : '...'}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">{t.admin.messages.from}</p>
                          <p className="text-sm font-bold text-blue-950">{msg.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Email</p>
                          <p className="text-sm font-bold text-blue-950">{msg.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">{t.contact.phone}</p>
                          <p className="text-sm font-bold text-blue-950">{msg.phone}</p>
                        </div>
                      </div>
                    </div>

                    {msg.message && (
                      <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                        <div className="flex items-start gap-4">
                          <MessageSquare className="w-5 h-5 text-slate-300 mt-1" />
                          <p className="text-slate-600 leading-relaxed italic">{msg.message}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-3 justify-end lg:justify-start">
                    {msg.status === 'new' && (
                      <button
                        onClick={() => updateStatus(msg.id, 'read')}
                        className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-500"
                        title={t.admin.messages.markRead}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                    {msg.status !== 'archived' && (
                      <button
                        onClick={() => updateStatus(msg.id, 'archived')}
                        className="p-4 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-950 hover:text-white transition-all duration-500"
                        title={t.admin.messages.archive}
                      >
                        <Archive className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="p-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-500"
                      title={t.admin.messages.delete}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
                <Inbox className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{t.admin.messages.empty}</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
