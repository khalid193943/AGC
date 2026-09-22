import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
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
    { label: t.nav.academy, to: '/academie' },
    { label: t.nav.programs, to: '/programmes' },
    { label: t.nav.life, to: '/vie-scolaire' },
    { label: t.nav.newsEvents, to: '/actualites' },
    { label: t.nav.partners, to: '/partenaires' },
  ];
  const secondary = [
    { label: t.nav.gallery, to: '/galerie' },
    { label: t.nav.admissions, to: '/inscription' },
    { label: t.nav.contact, to: '/contact' },
    { label: t.nav.recruitment, to: '/recrutement' },
  ];
  const cycles = [
    { label: t.programs.p1.title, to: '/programmes/maternelle' },
    { label: t.programs.p2.title, to: '/programmes/primaire' },
    { label: t.programs.p3.title, to: '/programmes/college' },
    { label: t.programs.p4.title, to: '/programmes/lycee' },
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
              <img src={IMG.logo} alt="" className="h-11 w-11 object-contain" width={44} height={44} referrerPolicy="no-referrer" />
              <span className={`hidden sm:block font-display font-semibold tracking-tight leading-none ${light || open ? 'text-salt' : 'text-ink'}`}>
                <span className="block text-[15px]">Georges Claude</span>
                <span className={`block text-[11px] font-medium mt-0.5 ${light || open ? 'text-salt/60' : 'text-mute'}`}>{t.nav.tagline}</span>
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
                  {[{ label: t.nav.home, to: '/' }, ...primary, ...secondary].map((l, i) => (
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
                          <Link to={c.to} className="block rounded-2xl border border-white/12 px-4 py-3 text-[15px] font-medium hover:bg-white/8 hover:border-white/25 transition-colors">{c.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1.5 text-[15px]">
                    <p className="chapter saffron mb-4">{t.nav.contact}</p>
                    <a href={SITE.phoneHref} className="block hover:text-saffron transition-colors">{SITE.phone}</a>
                    <a href={SITE.mobileHref} className="block hover:text-saffron transition-colors">{SITE.mobile}</a>
                    <a href={`mailto:${SITE.email}`} className="block hover:text-saffron transition-colors">{SITE.email}</a>
                    <p className="text-sea-2 pt-2">{SITE.address.line1}<br />{SITE.address.line2}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="flex md:hidden items-center text-[13px] font-semibold rounded-full border border-white/25 p-0.5">
                      {(['FR', 'EN'] as const).map((l) => (
                        <button key={l} onClick={() => setCurrentLang(l)} className={`px-3 py-1 rounded-full ${currentLang === l ? 'bg-white text-ink' : 'text-salt/70'}`}>{l}</button>
                      ))}
                    </div>
                    <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="ulink text-sm">Instagram</a>
                    <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="ulink text-sm">Facebook</a>
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
