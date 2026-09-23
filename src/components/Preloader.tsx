import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE, IMG } from '../content/site';
import { EASE } from './ui/motion';

/**
 * Écran d'ouverture — une seule fois par session.
 * Logo dans un anneau qui se trace, compteur 0 → 100, bande tricolore en progression,
 * puis le rideau se lève (clip-path) et révèle le hero.
 */
const KEY = 'agc-loaded';
const DURATION = 2.6; // secondes avant la levée du rideau

export const preloaderDelay = () => {
  try { return sessionStorage.getItem(KEY) ? 0 : DURATION + 0.35; } catch { return 0; }
};

export const Preloader = () => {
  const { currentLang } = useLanguage();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => { try { return !sessionStorage.getItem(KEY); } catch { return false; } });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = 'hidden';
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (DURATION * 1000));
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t = window.setTimeout(() => {
      setShow(false);
      document.documentElement.style.overflow = '';
      try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    }, DURATION * 1000 + 150);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(t); document.documentElement.style.overflow = ''; };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-ink text-salt grain flex flex-col"
          initial={false}
          exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ clipPath: 'inset(0 0 0% 0)' }}
          role="status"
          aria-label={currentLang === 'FR' ? 'Chargement' : 'Loading'}
        >
          {/* Haut : nom */}
          <div className="wrap pt-8 flex items-center justify-between text-sm text-sea">
            <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}>{SITE.name}</motion.span>
            <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: EASE }}>El Jadida</motion.span>
          </div>

          {/* Centre : logo dans l'anneau */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-40 h-40 md:w-52 md:h-52">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90" aria-hidden>
                <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <motion.circle cx="50" cy="50" r="47" fill="none" stroke="#E8B04B" strokeWidth="1.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: DURATION, ease: [0.4, 0, 0.2, 1] }} />
              </svg>
              <motion.img
                src={IMG.logo}
                alt=""
                className="absolute inset-[22%] w-[56%] h-[56%] object-contain"
                initial={reduce ? false : { scale: 0.6, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: EASE }}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Bas : devise + compteur + tricolore */}
          <div className="wrap pb-8">
            <div className="flex items-end justify-between gap-6">
              <motion.p className="font-serif italic text-sea text-lg md:text-2xl max-w-[26ch]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: EASE }}>
                {SITE.motto[currentLang]}
              </motion.p>
              <p className="t-num tabular-nums leading-none" aria-hidden>{count}<span className="text-saffron text-[0.4em] align-top ml-1">%</span></p>
            </div>
            <div className="mt-6 h-1.5 w-full bg-white/10 rounded-full overflow-hidden" aria-hidden>
              <div className="h-full flex rounded-full overflow-hidden" style={{ width: `${count}%`, transition: 'width 120ms linear' }}>
                <div className="flex-1 bg-signal" /><div className="flex-1 bg-saffron" /><div className="flex-1 bg-ink-3" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/** Barre fine en haut pendant le chargement d'une page (changement de route). */
export const RouteProgress = () => (
  <div className="fixed inset-x-0 top-0 z-[90] h-0.5 bg-transparent" role="status" aria-live="polite">
    <span className="block h-full bg-saffron origin-left" style={{ animation: 'loader-bar 1.2s cubic-bezier(.16,1,.3,1) infinite' }} />
    <span className="sr-only">Chargement</span>
  </div>
);
