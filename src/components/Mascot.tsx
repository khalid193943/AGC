import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { EASE } from './ui/motion';

/**
 * « Monsieur Claude » — professeur illustré qui accompagne la visite.
 * - Sort du logo à l'arrivée (anneau de lumière + vrille), dit bonjour.
 * - Au scroll, rejoint une zone vide de la page (éléments [data-mascot-spot]) choisie au hasard
 *   parmi celles visibles ; jamais sur du texte ou une image.
 * - Desktop uniquement, désactivé si prefers-reduced-motion, masqué quand le menu est ouvert.
 */

const SIZE = 240;

const PHRASES = {
  FR: ['Bonjour !', 'Bienvenue à l’académie.', 'Ici, chaque élève compte.', 'On continue ?', 'Curieux, c’est bien.', 'Par ici la visite !', 'Apprendre, c’est grandir.'],
  EN: ['Hello!', 'Welcome to the academy.', 'Here, every student counts.', 'Shall we go on?', 'Curious? Good.', 'This way for the tour!', 'Learning is growing.'],
};

/* ------------------------------------------------------------------ */
/* Le dessin — personnage original, gradients pour un léger relief      */
/* ------------------------------------------------------------------ */
const Teacher = ({ waving }: { waving: boolean }) => (
  <svg viewBox="0 0 200 220" width={SIZE} height={SIZE * 1.1} aria-hidden style={{ overflow: 'visible' }}>
    <defs>
      <radialGradient id="mc-skin" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#F6D3B3" /><stop offset="1" stopColor="#D9A57C" /></radialGradient>
      <linearGradient id="mc-coat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1B3F7D" /><stop offset="1" stopColor="#06193A" /></linearGradient>
      <linearGradient id="mc-hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4A3A33" /><stop offset="1" stopColor="#2B211D" /></linearGradient>
      <linearGradient id="mc-book" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F3CF80" /><stop offset="1" stopColor="#E8B04B" /></linearGradient>
      <filter id="mc-shadow" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#06193A" floodOpacity="0.28" /></filter>
    </defs>
    {/* ombre au sol */}
    <ellipse cx="100" cy="212" rx="52" ry="7" fill="#06193A" opacity="0.14" />
    <g filter="url(#mc-shadow)">
      {/* jambes */}
      <rect x="72" y="160" width="22" height="46" rx="10" fill="#2B3A55" />
      <rect x="106" y="160" width="22" height="46" rx="10" fill="#2B3A55" />
      <ellipse cx="83" cy="206" rx="15" ry="6" fill="#06193A" />
      <ellipse cx="117" cy="206" rx="15" ry="6" fill="#06193A" />
      {/* corps */}
      <path d="M58 104c0-18 18-30 42-30s42 12 42 30l4 62c0 6-4 10-10 10H64c-6 0-10-4-10-10z" fill="url(#mc-coat)" />
      {/* chemise + cravate safran */}
      <path d="M88 76h24l-12 40z" fill="#F4F5F2" />
      <path d="M100 82l6 8-6 34-6-34z" fill="#E8B04B" />
      {/* bras gauche tenant un livre */}
      <path d="M62 112c-10 10-12 30-6 44 3 6 12 6 14-1 3-12 4-24 10-34z" fill="url(#mc-coat)" />
      <rect x="44" y="140" width="46" height="34" rx="4" fill="url(#mc-book)" transform="rotate(-8 67 157)" />
      <rect x="49" y="146" width="36" height="3" rx="1.5" fill="#06193A" opacity="0.35" transform="rotate(-8 67 157)" />
      <rect x="49" y="154" width="28" height="3" rx="1.5" fill="#06193A" opacity="0.35" transform="rotate(-8 67 157)" />
      <circle cx="62" cy="176" r="8" fill="url(#mc-skin)" />
      {/* bras droit qui salue */}
      <g style={{ transformOrigin: '138px 112px', animation: waving ? 'mc-wave 1.1s ease-in-out 0s 3' : 'none' }}>
        <path d="M138 112c14-6 26-24 28-42 1-7-8-10-11-4-5 12-12 24-24 30z" fill="url(#mc-coat)" />
        <circle cx="163" cy="62" r="11" fill="url(#mc-skin)" />
        <path d="M156 54l4-8M162 52l3-9M168 54l4-7" stroke="#D9A57C" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* cou + tête */}
      <rect x="90" y="62" width="20" height="18" rx="8" fill="#D9A57C" />
      <ellipse cx="100" cy="46" rx="36" ry="38" fill="url(#mc-skin)" />
      {/* cheveux */}
      <path d="M64 42c2-24 20-36 36-36s34 12 36 36c-8-10-20-14-36-14S72 32 64 42z" fill="url(#mc-hair)" />
      <path d="M62 44c6-4 10-2 12 4-4 6-8 8-12 6z" fill="url(#mc-hair)" />
      <path d="M138 44c-6-4-10-2-12 4 4 6 8 8 12 6z" fill="url(#mc-hair)" />
      {/* lunettes */}
      <g fill="none" stroke="#06193A" strokeWidth="3">
        <circle cx="86" cy="50" r="11" /><circle cx="114" cy="50" r="11" /><path d="M97 50h6M75 48l-6-3M125 48l6-3" />
      </g>
      <circle cx="86" cy="50" r="9" fill="#FFFFFF" opacity="0.35" /><circle cx="114" cy="50" r="9" fill="#FFFFFF" opacity="0.35" />
      {/* yeux (clignent) */}
      <g style={{ transformOrigin: '100px 50px', animation: 'mc-blink 4.5s ease-in-out infinite' }}>
        <circle cx="86" cy="50" r="3.2" fill="#06193A" /><circle cx="114" cy="50" r="3.2" fill="#06193A" />
        <circle cx="87.2" cy="48.8" r="1" fill="#fff" /><circle cx="115.2" cy="48.8" r="1" fill="#fff" />
      </g>
      {/* sourcils, nez, sourire, joues */}
      <path d="M78 36q8-4 16-1M106 35q8-3 16 1" stroke="#4A3A33" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M100 54v8l-4 2" stroke="#C48E68" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M86 68q14 12 28 0" stroke="#8B4A3A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="74" cy="60" r="5" fill="#F0A38F" opacity="0.5" /><circle cx="126" cy="60" r="5" fill="#F0A38F" opacity="0.5" />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/* Logique de déplacement                                                */
/* ------------------------------------------------------------------ */
type Spot = { el: Element; say?: string };

const pick = <T,>(arr: T[], avoid?: T) => {
  const pool = arr.filter((x) => x !== avoid);
  return (pool.length ? pool : arr)[Math.floor(Math.random() * (pool.length ? pool.length : arr.length))];
};

export const Mascot = () => {
  const { currentLang } = useLanguage();
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const [enabled, setEnabled] = useState(false);
  const [phase, setPhase] = useState<'hidden' | 'burst' | 'live'>('hidden');
  const [bubble, setBubble] = useState<string | null>(null);
  const [waving, setWaving] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 70, damping: 16, mass: 1.1 });
  const sy = useSpring(y, { stiffness: 70, damping: 16, mass: 1.1 });
  const current = useRef<Spot | null>(null);
  const bubbleTimer = useRef<number>(0);
  const [start, setStart] = useState({ left: 60, top: 40 });

  // Desktop + pointeur fin uniquement
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    const set = () => setEnabled(mq.matches && !reduce);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, [reduce]);

  const say = useCallback((text: string, ms = 2800) => {
    setBubble(text);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), ms);
  }, []);

  // Entrée : sort du logo, puis vie (une seule fois)
  const started = useRef(false);
  useEffect(() => {
    if (!enabled || started.current) return;
    started.current = true;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => {
      // Position du logo : point de départ de l'apparition
      const lr = document.querySelector('header img')?.getBoundingClientRect();
      const st = { left: (lr ? lr.left + lr.width / 2 : 60) - SIZE / 2, top: (lr ? lr.top + lr.height / 2 : 40) - (SIZE * 1.1) / 2 };
      setStart(st);
      x.set(st.left); y.set(st.top); sx.jump(st.left); sy.jump(st.top);
      setPhase('burst');
    }, 1900));
    timers.push(window.setTimeout(() => { setPhase('live'); setWaving(true); say(PHRASES[currentLang][0], 3200); }, 2900));
    timers.push(window.setTimeout(() => setWaving(false), 6500));
    return () => { if (!enabled) timers.forEach((t) => window.clearTimeout(t)); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Suivi des zones vides
  useEffect(() => {
    if (!enabled || phase !== 'live') return;
    let raf = 0;
    const margin = 40;
    const tick = () => {
      raf = 0;
      const menuOpen = document.getElementById('site-menu');
      if (menuOpen) { setVisible(false); return; }
      const spots: Spot[] = Array.from(document.querySelectorAll('[data-mascot-spot]')).map((el) => ({ el, say: (el as HTMLElement).dataset.say }));
      const vh = window.innerHeight;
      const inView = spots.filter((s) => {
        const r = s.el.getBoundingClientRect();
        return r.top > 100 + margin && r.bottom < vh - margin && r.width > SIZE && r.height > SIZE * 0.8;
      });
      const stillVisible = current.current && inView.some((s) => s.el === current.current!.el);
      if (!stillVisible) {
        if (!inView.length) { setVisible(false); return; }
        const next = pick(inView, current.current ?? undefined);
        current.current = next;
        setVisible(true);
        if (Math.random() < 0.55) say(next.say || pick(PHRASES[currentLang].slice(1)));
      }
      const r = current.current!.el.getBoundingClientRect();
      x.set(r.left + r.width / 2 - SIZE / 2);
      y.set(r.top + r.height / 2 - (SIZE * 1.1) / 2);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const obs = new MutationObserver(onScroll);
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['id'] });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); obs.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [enabled, phase, x, y, say, currentLang]);

  // Changement de page : nouvelle zone
  useEffect(() => { current.current = null; }, [pathname]);

  if (!enabled || phase === 'hidden') return null;

  if (phase === 'burst') {
    return (
      <div className="fixed inset-0 z-[45] pointer-events-none" aria-hidden>
        {/* anneau de lumière */}
        <motion.span className="absolute rounded-full border-4 border-saffron" style={{ left: start.left + SIZE / 2 - 30, top: start.top + SIZE * 0.55 - 30, width: 60, height: 60 }} initial={{ scale: 0.2, opacity: 1 }} animate={{ scale: 5, opacity: 0 }} transition={{ duration: 0.9, ease: EASE }} />
        <motion.span className="absolute rounded-full bg-saffron" style={{ left: start.left + SIZE / 2 - 30, top: start.top + SIZE * 0.55 - 30, width: 60, height: 60 }} initial={{ scale: 0.1, opacity: 0.9 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.7, ease: EASE }} />
        <motion.div className="absolute" style={{ left: start.left, top: start.top }} initial={{ scale: 0, rotate: -540, opacity: 0 }} animate={{ scale: [0, 1.25, 1], rotate: 0, opacity: 1 }} transition={{ duration: 1, ease: EASE }}>
          <Teacher waving={false} />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed left-0 top-0 z-[45] pointer-events-none"
      style={{ x: sx, y: sy, width: SIZE }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
      transition={{ duration: 0.6, ease: EASE }}
      aria-hidden
    >
      <AnimatePresence>
        {bubble && (
          <motion.div
            key={bubble}
            className="absolute -top-2 left-[58%] whitespace-nowrap rounded-2xl rounded-bl-sm bg-ink text-salt font-display font-medium text-[15px] px-4 py-2 shadow-[0_20px_40px_-20px_rgba(6,25,58,0.6)]"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {bubble}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
        <Teacher waving={waving} />
      </motion.div>
    </motion.div>
  );
};
