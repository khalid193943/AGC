import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, handleFirestoreError, OperationType, checkAdminStatus, getUserRole } from '../../firebase';
import { 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
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
  LayoutDashboard, 
  Newspaper, 
  Calendar, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Search,
  Users,
  BookOpen,
  Clock,
  Settings,
  Layers,
  Briefcase,
  GraduationCap,
  Mail,
  Camera
} from 'lucide-react';
import NewsManagement from '../../components/admin/NewsManagement';
import EventManagement from '../../components/admin/EventManagement';
import MessageManagement from '../../components/admin/MessageManagement';
import MomentManagement from '../../components/admin/MomentManagement';
import UserManagement from '../../components/admin/UserManagement';
import RecruitmentManagement from '../../components/admin/RecruitmentManagement';
import { AdminHeader } from '../../components/admin/AdminHeader';

type Tab = 'news' | 'events' | 'messages' | 'moments' | 'users' | 'recruitment';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'editor' | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('news');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const result = await getUserRole(user);
        if (!result) {
          navigate('/admin/login');
        } else {
          setUser(user);
          setUserRole(result.role);
          setUserPermissions(result.permissions || []);
          setLoading(false);
          
          // Set initial tab based on permissions if editor
          if (result.role === 'editor' && result.permissions && result.permissions.length > 0) {
            setActiveTab(result.permissions[0] as Tab);
          }
        }
      } else {
        navigate('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const renderContent = () => {
    // Basic role-based access control for the content area
    if (userRole === 'editor' && !userPermissions.includes(activeTab)) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-blue-950 mb-2">Accès Restreint</h3>
          <p className="text-slate-500">Vous n'avez pas les permissions nécessaires pour accéder à cette section.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'news':
        return <NewsManagement user={user} />;
      case 'events':
        return <EventManagement user={user} />;
      case 'messages':
        return <MessageManagement />;
      case 'moments':
        return <MomentManagement />;
      case 'users':
        return <UserManagement />;
      case 'recruitment':
        return <RecruitmentManagement />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
      </div>
    );
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col print:bg-white">
      <div className="print:hidden">
        <AdminHeader user={user} onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      </div>
      
      <div className="flex flex-col md:flex-row flex-grow pt-20 print:pt-0">
        {/* Sidebar */}
        <aside 
          className={`fixed md:sticky top-20 left-0 z-40 w-72 md:w-80 bg-white border-r border-slate-100 p-6 md:p-10 flex flex-col h-[calc(100vh-5rem)] transition-transform duration-300 print:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <nav className="flex-grow space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              <div className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em] px-4 mb-6 mt-4">{t.admin.dashboard.contentMedia}</div>
              {(userRole === 'admin' || userPermissions.includes('news')) && (
              <button
                onClick={() => handleTabChange('news')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 ${
                  activeTab === 'news' ? 'bg-blue-950 text-white shadow-2xl shadow-blue-950/20' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-950'
                }`}
              >
                <Newspaper className="w-5 h-5" />
                <span className="font-bold text-[11px] uppercase tracking-widest">{t.admin.dashboard.news}</span>
              </button>
              )}
              {(userRole === 'admin' || userPermissions.includes('events')) && (
              <button
                onClick={() => handleTabChange('events')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 ${
                  activeTab === 'events' ? 'bg-blue-950 text-white shadow-2xl shadow-blue-950/20' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-950'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="font-bold text-[11px] uppercase tracking-widest">{t.admin.dashboard.events}</span>
              </button>
              )}
              {(userRole === 'admin' || userPermissions.includes('messages')) && (
                <button
                  onClick={() => handleTabChange('messages')}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 ${
                    activeTab === 'messages' ? 'bg-blue-950 text-white shadow-2xl shadow-blue-950/20' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-950'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-bold text-[11px] uppercase tracking-widest">{t.admin.dashboard.messages}</span>
                </button>
              )}
              {(userRole === 'admin' || userPermissions.includes('moments')) && (
              <button
                onClick={() => handleTabChange('moments')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 ${
                  activeTab === 'moments' ? 'bg-blue-950 text-white shadow-2xl shadow-blue-950/20' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-950'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span className="font-bold text-[11px] uppercase tracking-widest">{t.admin.dashboard.moments}</span>
              </button>
              )}
              {(userRole === 'admin' || userPermissions.includes('users')) && (
                <button
                  onClick={() => handleTabChange('users')}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 ${
                    activeTab === 'users' ? 'bg-blue-950 text-white shadow-2xl shadow-blue-950/20' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-950'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-bold text-[11px] uppercase tracking-widest">{t.admin.dashboard.users}</span>
                </button>
              )}
              {(userRole === 'admin' || userPermissions.includes('recruitment')) && (
                  <button
                    onClick={() => handleTabChange('recruitment')}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 ${
                      activeTab === 'recruitment' ? 'bg-blue-950 text-white shadow-2xl shadow-blue-950/20' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-950'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span className="font-bold text-[11px] uppercase tracking-widest">{t.admin.dashboard.recruitment}</span>
                  </button>
              )}
            </nav>
          </aside>

        {/* Overlay for mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-blue-950/50 backdrop-blur-sm z-30 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-10 lg:p-16 overflow-y-auto w-full print:p-0 print:overflow-visible">
        <div className="max-w-[1400px] mx-auto print:max-w-none">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
      </div>
    </div>
  );
}
