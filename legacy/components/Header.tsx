import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  BookOpen,
  ArrowRight,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { ASSETS } from '../constants';

export const Header = () => {
  const { currentLang, setCurrentLang, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setActiveSubmenu(name);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveSubmenu(null);
    }, 150);
    setHoverTimeout(timeout);
  };

  const menuItems: { name: string; href?: string; to?: string; badge?: string; submenu?: { name: string; to: string }[] }[] = [
    { name: t.nav.home, to: '/' },
    { 
      name: t.nav.discover, 
      to: '/academie'
    },
    { 
      name: t.nav.programs, 
      to: '/programmes',
      submenu: [
        { name: t.programs.p1.title, to: '/programmes/maternelle' },
        { name: t.programs.p2.title, to: '/programmes/primaire' },
        { name: t.programs.p3.title, to: '/programmes/college' },
        { name: t.programs.p4.title, to: '/programmes/lycee' }
      ]
    },
    { 
      name: t.nav.life, 
      to: '/vie-scolaire'
    },
    {
      name: "Partenaires",
      to: "/partenaires",
      badge: "NEW"
    },
    { 
      name: t.nav.admissions, 
      to: '/inscription'
    },
    { 
      name: t.nav.newsEvents, 
      to: '/actualites',
      submenu: [
        { name: t.nav.news, to: '/actualites#news' },
        { name: t.nav.newsEvents.split(' & ')[1] || 'Events', to: '/actualites#events' },
        { name: t.nav.gallery, to: '/galerie' }
      ]
    },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-blue-950/95 backdrop-blur-xl py-3 shadow-lg border-b border-white/10' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1800px] mx-auto px-6 xl:px-12 flex items-center justify-between xl:grid xl:grid-cols-[auto_1fr_auto] gap-8">
          
          {/* Logo - Left */}
          <Link to="/" className="flex items-center justify-start flex-shrink-0 group relative z-10" aria-label="Georges Claude Private Academy - Accueil">
            <div className={`transition-all duration-500 w-24 xl:w-32 h-16`}></div>
            <div 
              className={`absolute left-0 transition-all duration-500 flex items-center justify-center
              ${scrolled ? 'top-0 h-full' : 'top-0'}`}
            >
              {/* Subtle Watermark for Academy page */}
              {location.pathname === '/academie' && (
                <motion.img 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.05, scale: 1.4 }}
                  src={ASSETS.logo} 
                  alt="" 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain blur-[4px] pointer-events-none select-none z-[-2]"
                  referrerPolicy="no-referrer"
                />
              )}

              <img 
                src={ASSETS.logo} 
                alt="Logo Georges Claude Private Academy El Jadida" 
                width="200"
                height="96"
                className={`logo-img transition-all duration-500 object-contain ${scrolled ? 'h-16 xl:h-20' : 'h-24 xl:h-28'} drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]`} 
                referrerPolicy="no-referrer" 
                loading="eager"
              />
            </div>
          </Link>

          {/* Center Menu (Desktop) */}
          <div className="hidden xl:flex items-center justify-center space-x-4 2xl:space-x-8">
            {menuItems.map((item) => (
              <div 
                key={item.to || item.href || item.name} 
                className="relative group"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to={item.to || '#'} 
                  className="text-[14px] font-bold uppercase tracking-[0.15em] flex items-center transition-all py-2 whitespace-nowrap text-white/90 hover:text-amber-400"
                >
                  {item.name}
                  {item.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold bg-amber-400 text-blue-950 rounded-md animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
                <AnimatePresence>
                  {item.submenu && activeSubmenu === item.name && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64 z-50"
                    >
                      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6">
                        <div className="space-y-4">
                          {item.submenu.map((sub) => (
                            <Link 
                              key={sub.to} 
                              to={sub.to} 
                              className="block text-[12px] font-bold uppercase tracking-widest text-slate-500 hover:text-amber-500 transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Section: Socials + Lang + Admin + Enroll */}
          <div className="hidden xl:flex items-center space-x-4 2xl:space-x-8 justify-end">
            {/* Socials Integrated */}
            <div className="flex items-center space-x-4 border-r border-white/10 pr-6">
              <a href="https://www.facebook.com/AcademieGeorgesClaude" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/60 hover:text-amber-400 transition-all hover:scale-110">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/academiegeorgesclaude.officiel/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/60 hover:text-amber-400 transition-all hover:scale-110">
                <Instagram size={18} />
              </a>
            </div>

            {/* Language & Admin Integrated */}
            <div className="flex items-center space-x-5">
              <div className="flex items-center space-x-3">
                {['FR', 'EN'].map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => setCurrentLang(lang as 'FR' | 'EN')}
                    aria-label={`Changer la langue en ${lang}`}
                    className={`text-[13px] font-black transition-all duration-300 ${currentLang === lang ? 'text-amber-400' : 'text-white/30 hover:text-white'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <Link to="/admin/login" aria-label="Admin Login" className="text-white/40 hover:text-white transition-all hover:scale-110">
                <User size={20} />
              </Link>
            </div>

            <Link to="/inscription" className="px-8 py-4 rounded-[30px] text-[13px] font-black uppercase tracking-widest transition-all duration-500 bg-amber-400 text-blue-950 hover:bg-white hover:shadow-xl active:scale-95">
              {t.nav.enroll}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            aria-label="Toggle menu"
            className={`xl:hidden w-11 h-11 flex items-center justify-center rounded-xl transition-all active:scale-90 border ${
              scrolled 
                ? 'bg-blue-950 text-white border-blue-900 shadow-lg' 
                : 'bg-white/10 backdrop-blur-md text-white border-white/20'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Colored Lines removed per user request */}

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="xl:hidden bg-blue-950/95 backdrop-blur-xl border-t border-white/10 overflow-y-auto max-h-[calc(100vh-80px)]"
            >
              <div className="px-6 py-8 space-y-2">
                {menuItems.map((item) => (
                  <div key={item.to || item.href || item.name} className="border-b border-white/5 last:border-0 pb-2 mb-2">
                    {item.submenu ? (
                      <button 
                        aria-label={`Toggle ${item.name} submenu`}
                        className="w-full text-left text-white font-bold text-xl flex justify-between items-center group py-3"
                        onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                      >
                        <span className={activeSubmenu === item.name ? 'text-amber-400' : ''}>{item.name}</span>
                        <ChevronDown size={24} className={`transition-transform duration-300 ${activeSubmenu === item.name ? 'rotate-180 text-amber-400' : 'text-white/50'}`} />
                      </button>
                    ) : (
                      item.to ? (
                        <Link 
                          to={item.to}
                          className={`flex items-center w-full text-left font-bold text-xl transition-colors py-3 ${location.pathname === item.to ? 'text-amber-400' : 'text-white hover:text-amber-400'}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                          {item.badge && (
                            <span className="ml-3 px-2 py-0.5 text-xs font-bold bg-amber-400 text-blue-950 rounded-md animate-pulse">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ) : (
                        <a 
                          href={item.href}
                          className="flex items-center w-full text-left text-white font-bold text-xl hover:text-amber-400 transition-colors py-3"
                          onClick={(e) => {
                            if (location.pathname === '/') {
                              e.preventDefault();
                              handleNavClick(item.href as string);
                            } else {
                              setIsMenuOpen(false);
                            }
                          }}
                        >
                          {item.name}
                          {item.badge && (
                            <span className="ml-3 px-2 py-0.5 text-xs font-bold bg-amber-400 text-blue-950 rounded-md animate-pulse">
                              {item.badge}
                            </span>
                          )}
                        </a>
                      )
                    )}
                    
                    <AnimatePresence>
                      {item.submenu && activeSubmenu === item.name && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-6 space-y-2 border-l-2 border-amber-400/30 overflow-hidden mb-2"
                        >
                          {item.submenu.map((sub) => (
                            <Link 
                              key={sub.to} 
                              to={sub.to} 
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-3 text-blue-100/70 hover:text-amber-400 font-bold text-base transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                
                <div className="flex items-center justify-center space-x-6 py-6 mt-4 border-t border-white/10">
                  {['FR', 'EN'].map((lang) => (
                    <button 
                      key={lang}
                      onClick={() => {
                        setCurrentLang(lang as 'FR' | 'EN');
                        setIsMenuOpen(false);
                      }}
                      aria-label={`Changer la langue en ${lang}`}
                      className={`text-lg font-black transition-all duration-300 p-2 ${currentLang === lang ? 'text-amber-400' : 'text-white/30 hover:text-white'}`}
                    >
                      {lang}
                    </button>
                  ))}
                  <div className="w-px h-6 bg-white/10"></div>
                  <Link 
                    to="/admin/login" 
                    aria-label="Admin Login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/40 hover:text-amber-400 transition-colors p-2"
                  >
                    <User size={24} />
                  </Link>
                </div>

                <div className="pt-2 pb-6">
                  <Link 
                    to="/inscription" 
                    className="w-full bg-amber-400 text-blue-950 py-4 rounded-2xl font-bold text-center block shadow-xl shadow-amber-400/10 uppercase tracking-widest"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.nav.enroll}
                  </Link>
                </div>

                {/* Social Links in Mobile Menu */}
                <div className="flex items-center justify-center space-x-8 pb-8">
                  <a href="https://www.facebook.com/AcademieGeorgesClaude" className="text-white/50 hover:text-amber-400 transition-colors p-2">
                    <Facebook size={24} />
                  </a>
                  <a href="https://www.instagram.com/academiegeorgesclaude.officiel/" className="text-white/50 hover:text-amber-400 transition-colors p-2">
                    <Instagram size={24} />
                  </a>
                  <a href="https://linkedin.com" className="text-white/50 hover:text-amber-400 transition-colors p-2">
                    <Linkedin size={24} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
