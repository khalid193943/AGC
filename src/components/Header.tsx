import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Home, Landmark, BookOpen, Sparkles, Newspaper, Handshake, Images, UserPlus, Mail, Briefcase, Phone, MapPin, Puzzle, Compass, GraduationCap } from 'lucide-react';
import { SocialLinks } from './ui/Social';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE, IMG } from '../content/site';
import { EASE } from './ui/motion';

export const Header = () => {
  const { t, currentLang, setCurrentLang } = useLanguage();
  const location = useLocation();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 160 && y > lastY.current && !open);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [open]);

  const primary = [
    { label: t.nav.academy, to: '/academie', Icon: Landmark },
    { label: t.nav.programs, to: '/programmes', Icon: BookOpen },
    { label: t.nav.life, to: '/vie-scolaire', Icon: Sparkles },
    { label: t.nav.newsEvents, to: '/actualites', Icon: Newspaper },
    { label: t.nav.partners, to: '/partenaires', Icon: Handshake },
  ];
  const secondary = [
    { label: t.nav.gallery, to: '/galerie', Icon: Images },
    { label: t.nav.admissions, to: '/inscription', Icon: UserPlus },
    { label: t.nav.contact, to: '/contact', Icon: Mail },
    { label: t.nav.recruitment, to: '/recrutement', Icon: Briefcase },
  ];
  const cycles = [
    { label: t.programs.p1.title, to: '/programmes/maternelle', Icon: Puzzle, cls: 'bg-logo-yellow text-ink' },
    { label: t.programs.p2.title, to: '/programmes/primaire', Icon: BookOpen, cls: 'bg-logo-blue text-white ring-1 ring-white/30' },
    { label: t.programs.p3.title, to: '/programmes/college', Icon: Compass, cls: 'bg-logo-red text-white' },
    { label: t.programs.p4.title, to: '/programmes/lycee', Icon: GraduationCap, cls: 'bg-white text-ink' },
  ];

  const light = !scrolled && !open; // texte clair sur le hero

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className={`transition-[background-color,backdrop-filter,box-shadow] duration-500 ${scrolled && !open ? 'bg-salt/85 backdrop-blur-xl shadow-[0_1px_0_rgba(6,25,58,0.08)]' : 'bg-transparent'}`}>
          <div className="wrap flex items-center justify-between" style={{ height: 'var(--header-h)' }}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0" aria-label={t.ui.backHome}>
              <span className={`flex items-center justify-center rounded-full p-1 transition-colors duration-500 ${light || open ? 'bg-white/10 backdrop-blur-md ring-1 ring-white/25' : 'bg-white ring-1 ring-ink/10 shadow-[0_6px_20px_-10px_rgba(6,25,58,0.35)]'}`}><img src={IMG.logo} alt="" className="h-12 w-12 md:h-[60px] md:w-[60px] object-contain" width={60} height={60} referrerPolicy="no-referrer" /></span>
              <span className={`hidden sm:block font-display font-semibold tracking-tight leading-none ${light || open ? 'text-salt' : 'text-ink'}`}>
                <span className="block text-[17px] md:text-[19px]">Georges Claude</span>
                <span className={`block text-[12px] font-medium mt-0.5 ${light || open ? 'text-salt/60' : 'text-mute'}`}>{t.nav.tagline}</span>
              </span>
            </Link>

            {/* Liens principaux (desktop) */}
            <nav className={`hidden lg:flex items-center gap-1 transition-opacity duration-300 ${open ? 'opacity-0 pointer-events-none' : ''}`} aria-label="Navigation principale">
              {primary.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 text-[15px] font-medium rounded-full transition-colors duration-300 ${light ? 'text-salt/85 hover:text-white' : 'text-ink/80 hover:text-ink'} ${isActive ? (light ? 'text-white' : 'text-ink') : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1 h-1 rounded-full bg-saffron" />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Droite */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`hidden md:flex items-center text-[13px] font-semibold rounded-full border p-0.5 ${light || open ? 'border-white/25 text-salt/70' : 'border-ink/15 text-mute'}`} role="group" aria-label="Langue">
                {(['FR', 'EN'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setCurrentLang(l)}
                    className={`px-2.5 py-1 rounded-full transition-colors ${currentLang === l ? (light || open ? 'bg-white text-ink' : 'bg-ink text-salt') : ''}`}
                    aria-pressed={currentLang === l}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <Link to="/inscription" className={`btn hidden sm:inline-flex !h-10 !px-4 text-sm ${light ? 'btn-saffron' : 'btn-ink'} ${open ? 'opacity-0 pointer-events-none' : ''}`}>
                <span className="swap"><span>{t.ui.enrollShort}</span><span aria-hidden>{t.ui.enrollShort}</span></span>
              </Link>
              <button
                onClick={() => setOpen((v) => !v)}
                className={`group flex items-center gap-2.5 h-10 pl-3.5 pr-2 rounded-full border transition-colors ${light || open ? 'border-white/25 text-salt' : 'border-ink/15 text-ink'}`}
                aria-expanded={open}
                aria-controls="site-menu"
              >
                <span className="text-sm font-semibold">{open ? t.nav.close : t.nav.menu}</span>
                <span className="relative w-6 h-6 flex flex-col items-center justify-center gap-[5px]">
                  <span className={`block h-[1.5px] w-4 bg-current transition-transform duration-500 ${open ? 'translate-y-[3.25px] rotate-45' : ''}`} />
                  <span className={`block h-[1.5px] w-4 bg-current transition-transform duration-500 ${open ? '-translate-y-[3.25px] -rotate-45' : ''}`} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Menu plein écran */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="fixed inset-0 z-40 bg-ink text-salt overflow-y-auto grain"
            initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="wrap min-h-full flex flex-col pb-10" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 flex-1">
                {/* Grands liens */}
                <nav className="lg:col-span-7 flex flex-col" aria-label="Menu">
                  {[{ label: t.nav.home, to: '/', Icon: Home }, ...primary, ...secondary].map((l, i) => (
                    <motion.div
                      key={l.to}
                      initial={reduce ? false : { y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.9, delay: 0.15 + i * 0.05, ease: EASE }}
                    >
                      <NavLink
                        to={l.to}
                        className={({ isActive }) =>
                          `group flex items-baseline gap-4 py-2 sm:py-2.5 border-b border-white/10 ${isActive ? 'text-saffron' : 'text-salt hover:text-saffron'} transition-colors`
                        }
                      >
                        <l.Icon size={20} className="opacity-50 self-center shrink-0" strokeWidth={1.8} />
                        <span className="font-display font-medium text-[clamp(1.75rem,4.2vw,3.25rem)] leading-none tracking-tight">{l.label}</span>
                        <ArrowUpRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" size={22} />
                      </NavLink>
                    </motion.div>
                  ))}
                </nav>

                {/* Colonne latérale : cycles + contact */}
                <motion.aside
                  className="lg:col-span-4 lg:col-start-9 flex flex-col gap-10 lg:pt-3"
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: EASE }}
                >
                  <div>
                    <p className="chapter saffron mb-4">{t.nav.cyclesTitle}</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {cycles.map((c) => (
                        <li key={c.to}>
                          <Link to={c.to} className="flex items-center gap-3 rounded-2xl border border-white/12 px-3 py-2.5 text-[15px] font-medium hover:bg-white/8 hover:border-white/25 transition-colors"><span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${c.cls}`}><c.Icon size={15} /></span>{c.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1.5 text-[15px]">
                    <p className="chapter saffron mb-4">{t.nav.contact}</p>
                    <a href={SITE.phoneHref} className="flex items-center gap-3 hover:text-saffron transition-colors"><Phone size={15} className="text-saffron" />{SITE.phone}</a>
                    <a href={SITE.mobileHref} className="flex items-center gap-3 hover:text-saffron transition-colors"><Phone size={15} className="text-saffron" />{SITE.mobile}</a>
                    <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 hover:text-saffron transition-colors"><Mail size={15} className="text-saffron" />{SITE.email}</a>
                    <p className="flex items-start gap-3 text-sea-2 pt-2"><MapPin size={15} className="text-saffron mt-1 shrink-0" /><span>{SITE.address.line1}<br />{SITE.address.line2}</span></p>
                  </div>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="flex md:hidden items-center text-[13px] font-semibold rounded-full border border-white/25 p-0.5">
                      {(['FR', 'EN'] as const).map((l) => (
                        <button key={l} onClick={() => setCurrentLang(l)} className={`px-3 py-1 rounded-full ${currentLang === l ? 'bg-white text-ink' : 'text-salt/70'}`}>{l}</button>
                      ))}
                    </div>
                    <SocialLinks dark />
                  </div>
                </motion.aside>
              </div>
              <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-sm text-sea-2">
                <span className="font-serif italic text-base text-salt/80">{SITE.motto[currentLang]}</span>
                <Link to="/inscription" className="btn btn-saffron !h-11">{t.ui.enroll}</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
