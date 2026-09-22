import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User as UserIcon, Menu } from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { ASSETS } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';

export const AdminHeader = ({ user, onToggleMenu }: { user: any, onToggleMenu?: () => void }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-blue-950 border-b border-white/10 h-20 flex items-center">
      <div className="max-w-[1800px] mx-auto px-4 md:px-12 w-full flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-12">
          {onToggleMenu && (
            <button 
              onClick={onToggleMenu}
              className="md:hidden text-white hover:text-amber-400 transition-colors"
            >
              <Menu size={24} />
            </button>
          )}
          <Link to="/" className="flex items-center group">
            <img 
              src={ASSETS.logo} 
              alt="Logo" 
              className="h-8 md:h-12 w-auto object-contain brightness-0 invert" 
              referrerPolicy="no-referrer"
            />
          </Link>
          
          <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <span className="text-white font-bold text-sm block leading-tight uppercase tracking-widest">{t.admin.dashboard.title}</span>
                <span className="text-[9px] text-white/40 uppercase tracking-[0.3em] font-bold">{t.admin.dashboard.subtitle}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-4 border-r border-white/10 pr-4 md:pr-8">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/10">
              <UserIcon size={18} />
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] font-bold text-white truncate tracking-tight">{user?.email}</p>
              <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-bold">{t.admin.dashboard.admin}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 font-bold text-[11px] uppercase tracking-widest border border-red-600/20"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">{t.admin.dashboard.logout}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
