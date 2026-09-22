import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, Mail, MapPin, Facebook, Instagram, Linkedin, 
  ChevronDown, ArrowRight, Menu, X, BookOpen, Trophy, 
  Users, Star, GraduationCap, Target, Eye, CheckCircle2,
  Calendar, Clock, Globe, Shield, Heart, Sparkles,
  ArrowUpRight, Play, Quote, Zap, Award, Smartphone
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Reuse the translations and logic from the original App.tsx
// For simplicity in this turn, I'll pass them as props or use a context if needed, 
// but for now I'll just define the necessary parts.

interface HeaderProps {
  t: any;
  currentLang: string;
  setCurrentLang: (lang: 'FR' | 'EN') => void;
  scrolled: boolean;
  menuItems: any[];
  activeSubmenu: string | null;
  setActiveSubmenu: (name: string | null) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  t, currentLang, setCurrentLang, scrolled, menuItems, 
  activeSubmenu, setActiveSubmenu, isMenuOpen, setIsMenuOpen 
}) => {
  const location = useLocation();
  
  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2 px-4 hidden md:block">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><Phone size={14} className="mr-2" /> +212 5233-48010</span>
            <span className="flex items-center"><Smartphone size={14} className="mr-2" /> 07 08 76 00 34</span>
            <span className="flex items-center"><Mail size={14} className="mr-2" /> contact@agc.ma</span>
            <span className="flex items-center"><MapPin size={14} className="mr-2" /> Sidi Bouzid - El Jadida</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <Facebook size={16} className="cursor-pointer hover:text-amber-400 transition-colors" />
              <Instagram size={16} className="cursor-pointer hover:text-amber-400 transition-colors" />
              <Linkedin size={16} className="cursor-pointer hover:text-amber-400 transition-colors" />
            </div>
            <div className="border-l border-white/20 pl-4 flex space-x-2">
              {['FR', 'EN'].map((lang) => (
                <button 
                  key={lang}
                  onClick={() => setCurrentLang(lang as 'FR' | 'EN')}
                  className={`cursor-pointer transition-colors ${currentLang === lang ? 'text-amber-400 font-bold' : 'hover:text-amber-400'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 py-4'}`}>
        <div className="max-w-[1600px] mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center flex-shrink-0">
            <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center text-amber-400 shadow-xl">
              <BookOpen size={36} />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-0.5 flex-nowrap">
            {menuItems.map((item) => (
              <div 
                key={item.name} 
                className="relative group"
                onMouseEnter={() => setActiveSubmenu(item.name)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                {item.href.startsWith('#') && location.pathname === '/' ? (
                  <a 
                    href={item.href} 
                    className="px-2 py-2 text-sm font-semibold text-blue-900 hover:text-amber-500 flex items-center transition-colors whitespace-nowrap"
                  >
                    {item.name}
                    {item.submenu && <ChevronDown size={14} className="ml-1" />}
                  </a>
                ) : (
                  <Link 
                    to={item.href.startsWith('#') ? `/${item.href}` : item.href}
                    className="px-2 py-2 text-sm font-semibold text-blue-900 hover:text-amber-500 flex items-center transition-colors whitespace-nowrap"
                  >
                    {item.name}
                    {item.submenu && <ChevronDown size={14} className="ml-1" />}
                  </Link>
                )}
                
                {item.submenu && (
                  <AnimatePresence>
                    {activeSubmenu === item.name && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-72 bg-white shadow-xl rounded-b-xl border-t-2 border-amber-400 py-3"
                      >
                        {item.submenu.map((sub: any) => (
                          <Link 
                            key={sub.name} 
                            to={sub.href} 
                            className="flex items-center px-6 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-900 transition-colors group/sub"
                          >
                            <ArrowRight size={12} className="text-amber-400 mr-3 opacity-0 group-hover/sub:opacity-100 transition-all -translate-x-2 group-hover/sub:translate-x-0" />
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            <Link to="/inscription" className="ml-4 bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-md whitespace-nowrap">
              {t.nav.enroll}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-blue-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    {item.submenu ? (
                      <button 
                        className="w-full text-left text-blue-900 font-bold text-lg flex justify-between items-center"
                        onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                      >
                        {item.name}
                        <ChevronDown size={20} className={`transition-transform ${activeSubmenu === item.name ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <Link 
                        to={item.href.startsWith('#') ? `/${item.href}` : item.href}
                        className="block w-full text-left text-blue-900 font-bold text-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                    
                    {item.submenu && activeSubmenu === item.name && (
                      <div className="pl-4 mt-2 space-y-2 border-l-2 border-amber-400">
                        {item.submenu.map((sub: any) => (
                          <Link 
                            key={sub.name} 
                            to={sub.href} 
                            className="block py-1 text-slate-600"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link 
                  to="/inscription" 
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.enroll}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export const Footer: React.FC<{ t: any; currentLang: string }> = ({ t, currentLang }) => {
  return (
    <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 bg-blue-900 rounded-xl flex items-center justify-center text-amber-400 shadow-lg">
                <BookOpen size={32} />
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              {currentLang === 'FR' 
                ? "Excellence en éducation. Préparer les citoyens du monde de demain avec rigueur et bienveillance."
                : "Excellence in education. Preparing tomorrow's global citizens with rigor and kindness."}
            </p>
            <div className="flex space-x-4">
              <Facebook className="text-blue-900 hover:text-amber-500 cursor-pointer transition-colors" size={20} />
              <Instagram className="text-blue-900 hover:text-amber-500 cursor-pointer transition-colors" size={20} />
              <Linkedin className="text-blue-900 hover:text-amber-500 cursor-pointer transition-colors" size={20} />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-blue-900 mb-8 border-l-4 border-amber-400 pl-4 uppercase tracking-widest text-sm">Liens Utiles</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><Link to="/" className="hover:text-blue-900 transition-colors">Accueil</Link></li>
              <li><Link to="/academie" className="hover:text-blue-900 transition-colors">L'Académie</Link></li>
              <li><Link to="/programmes" className="hover:text-blue-900 transition-colors">Programmes</Link></li>
              <li><Link to="/vie-scolaire" className="hover:text-blue-900 transition-colors">Vie scolaire</Link></li>
              <li><Link to="/inscription" className="hover:text-blue-900 transition-colors">Admissions</Link></li>
              <li><Link to="/actualites" className="hover:text-blue-900 transition-colors">Actualités</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-blue-900 mb-8 border-l-4 border-amber-400 pl-4 uppercase tracking-widest text-sm">Contact</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-amber-500 shrink-0" />
                <span>Sidi Bouzid, El Jadida, Maroc</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-amber-500 shrink-0" />
                <span>+212 5233-48010</span>
              </li>
              <li className="flex items-center">
                <Smartphone size={18} className="mr-3 text-amber-500 shrink-0" />
                <span>07 08 76 00 34</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-amber-500 shrink-0" />
                <span>contact@agc.ma</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-blue-900 mb-8 border-l-4 border-amber-400 pl-4 uppercase tracking-widest text-sm">Newsletter</h4>
            <p className="text-slate-500 text-sm mb-6">Restez informé de nos actualités et événements.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="bg-white border border-slate-200 rounded-l-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-blue-900"
              />
              <button className="bg-blue-900 text-white px-4 py-2 rounded-r-lg hover:bg-blue-800 transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs">
          <p>© 2026 Georges Claude Private Academy. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-900">Mentions Légales</a>
            <a href="#" className="hover:text-blue-900">Politique de Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
