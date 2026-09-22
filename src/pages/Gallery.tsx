import { useEffect, useState, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { IMG } from '../content/site';
import { Reveal, EASE } from '../components/ui/motion';
import { Seo, fmtDate } from '../components/ui';
import { PageHero, CtaBand } from '../components/sections';

const Gallery = () => {
  const { t, currentLang } = useLanguage();
  const c = t.gallery;
  const [items, setItems] = useState<any[]>([]);
  const [cat, setCat] = useState<string>('all');
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const u = onSnapshot(query(collection(db, 'moments'), orderBy('createdAt', 'desc')), (s) => setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }))), () => setItems([]));
    return () => u();
  }, []);

  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
  const list = cat === 'all' ? items : items.filter((i) => i.category === cat);

  const prev = useCallback(() => setOpen((o) => (o === null ? null : (o - 1 + list.length) % list.length)), [list.length]);
  const next = useCallback(() => setOpen((o) => (o === null ? null : (o + 1) % list.length)), [list.length]);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, prev, next]);

  return (
    <main>
      <Seo title={`${c.title} | ${c.archive} — Georges Claude Private Academy El Jadida`} description={c.desc} path="/galerie" image={IMG.event} />
      <PageHero chapter={c.archive} title={c.title} lead={c.desc} compact />

      {/* Filtres */}
      {categories.length > 0 && (
        <div className="sticky z-30 bg-salt/85 backdrop-blur-xl border-b border-ink/10" style={{ top: 'var(--header-h)' }}>
          <div className="wrap py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="t-meta shrink-0 mr-2">{c.filterBy}</span>
            {['all', ...categories].map((k) => (
              <button key={k} onClick={() => setCat(k)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${cat === k ? 'bg-ink text-salt border-ink' : 'border-ink/15 hover:border-ink'}`}>{k === 'all' ? c.categories.all : k}</button>
            ))}
          </div>
        </div>
      )}

      <section className="section bg-salt">
        <div className="wrap">
          {list.length === 0 ? (
            <p className="text-mute">{t.ui.galleryEmpty}</p>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
              {list.map((m, i) => (
                <Reveal key={m.id} delay={(i % 4) * 0.05} amount={0.1}>
                  <button onClick={() => setOpen(i)} className="group block w-full text-left img-frame img-zoom relative">
                    {m.type === 'video' ? <video src={m.url} muted playsInline preload="metadata" className="w-full h-auto" /> : <img src={m.url} alt={m.title || ''} loading="lazy" referrerPolicy="no-referrer" className="w-full h-auto" />}
                    {m.type === 'video' && <span className="absolute inset-0 flex items-center justify-center"><span className="w-12 h-12 rounded-full bg-white/85 text-ink flex items-center justify-center"><Play size={18} className="ml-0.5" /></span></span>}
                    <span className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink/70 to-transparent text-salt opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="block text-sm font-semibold">{m.title}</span>
                      <span className="block text-xs text-sea">{m.category}{m.createdAt ? ` — ${fmtDate(m.createdAt, currentLang)}` : ''}</span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand title={c.ctaTitle} desc={c.ctaSubtitle} primary={{ label: c.ctaAppointment, to: '/contact' }} secondary={{ label: t.nav.life, to: '/vie-scolaire' }} tone="sea" />

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && list[open] && (
          <motion.div className="fixed inset-0 z-[70] bg-ink/95 backdrop-blur-sm flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} role="dialog" aria-modal="true">
            <button onClick={() => setOpen(null)} className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center" aria-label={t.nav.close}><X size={20} /></button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 md:left-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center" aria-label="Précédent"><ChevronLeft size={20} /></button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 md:right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center" aria-label="Suivant"><ChevronRight size={20} /></button>
            <motion.figure key={open} className="max-w-6xl w-full" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }} onClick={(e) => e.stopPropagation()}>
              {list[open].type === 'video' ? <video src={list[open].url} controls autoPlay className="w-full max-h-[78vh] object-contain rounded-2xl" /> : <img src={list[open].url} alt={list[open].title || ''} className="w-full max-h-[78vh] object-contain rounded-2xl" referrerPolicy="no-referrer" />}
              <figcaption className="text-salt mt-4 flex justify-between text-sm"><span>{list[open].title}</span><span className="text-sea">{open + 1} / {list.length}</span></figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Gallery;
