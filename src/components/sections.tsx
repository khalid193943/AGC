import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion, useInView, useSpring } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, ArrowUpRight, Award, Users, Sparkles, Leaf, GraduationCap, Cog, HeartPulse, Briefcase, Landmark, Compass } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE, IMG, AFTER_BAC } from '../content/site';
import { Reveal, WordReveal, Parallax, Counter, EASE } from './ui/motion';
import { Button, Chapter, fmtDate, Marquee } from './ui';

/* ------------------------------------------------------------------ */
/* PageHero — hero des pages secondaires : encre, très grande typo,
   image en arche décalée, parallaxe légère.                           */
/* ------------------------------------------------------------------ */
export const PageHero = ({ chapter, title, lead, children, compact = false }: { chapter: string; title: string; lead?: string; image?: string; imageAlt?: string; children?: ReactNode; compact?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  return (
    <section ref={ref} className="relative bg-ink text-salt on-dark overflow-hidden grain">
      {/* Photo en parallaxe légère ; les voiles sont posés au-dessus, sur toute la section, pour qu'aucune bande ne dépasse */}
      <motion.div className="absolute inset-x-0 -top-[10%] -bottom-[10%]" style={reduce ? undefined : { y: bgY }} aria-hidden>
        <img src={IMG.school} alt="" className="w-full h-full object-cover object-[center_60%] opacity-55" loading="eager" decoding="async" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50" aria-hidden />
      <div className="wrap relative z-10" style={{ paddingTop: 'calc(var(--header-h) + clamp(3rem, 7vw, 6rem))', paddingBottom: compact ? 'clamp(3rem, 6vw, 5rem)' : 'clamp(4rem, 7vw, 6rem)' }}>
        <div className="max-w-[900px]">
          <Chapter saffron className="mb-6">{chapter}</Chapter>
          <h1 className="t-display"><WordReveal text={title} inView={false} delay={0.1} /></h1>
          {lead && <motion.p className="t-lead text-sea max-w-[52ch] mt-6" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: EASE }}>{lead}</motion.p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* CtaBand — invitation finale, commune à la plupart des pages.        */
/* ------------------------------------------------------------------ */
export const CtaBand = ({ title, desc, primary, secondary, tone = 'salt' }: { title?: string; desc?: string; primary?: { label: string; to: string }; secondary?: { label: string; to: string }; tone?: 'salt' | 'sea' }) => {
  const { t } = useLanguage();
  return (
    <section className={`section ${tone === 'sea' ? 'bg-salt-2/70' : 'bg-salt'}`}>
      <div className="wrap flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-[720px]">
          <h2 className="t-h2"><WordReveal text={title ?? t.programs.ctaTitle} /></h2>
          <Reveal delay={0.1}><p className="t-body text-mute mt-4 max-w-[52ch]">{desc ?? t.programs.ctaDesc}</p></Reveal>
        </div>
        <Reveal className="flex flex-col sm:flex-row gap-3 shrink-0" delay={0.2}>
          <Button to={primary?.to ?? '/inscription'} size="lg">{primary?.label ?? t.ui.enroll}</Button>
          <Button to={secondary?.to ?? '/contact'} variant="ghost" size="lg" icon="none">{secondary?.label ?? t.contact.step2.title}</Button>
        </Reveal>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* VideoSection — vidéo plein cadre, lecture automatique quand visible,
   contrôles discrets.                                                  */
/* ------------------------------------------------------------------ */
export const VideoSection = ({ title }: { title: string; desc?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  // La tablette se redresse en entrant dans l'écran : couchée (inclinée) → debout, lisible.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });
  const rotateX = useTransform(p, [0, 1], [42, 0]);
  const scale = useTransform(p, [0, 1], [0.86, 1]);
  const y = useTransform(p, [0, 1], [80, 0]);
  const shadow = useTransform(p, [0, 1], [0.15, 0.55]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView && !reduce) v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { v.pause(); setPlaying(false); }
  }, [inView, reduce]);
  const toggle = () => { const v = video.current; if (!v) return; if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {}); else { v.pause(); setPlaying(false); } };

  return (
    <section ref={ref} className="section bg-salt overflow-hidden" aria-label={title}>
      <div className="wrap flex justify-center" style={{ perspective: '1600px' }}>
        <motion.div className="w-full max-w-[1040px] will-change-transform" style={reduce ? undefined : { rotateX, scale, y, transformOrigin: '50% 100%' }}>
          {/* Tablette : châssis fin, écran, caméra */}
          <motion.div className="relative bg-[#0B0F1A] p-[10px] md:p-[14px] rounded-[18px] md:rounded-[24px] ring-1 ring-white/15" style={reduce ? undefined : { boxShadow: useTransform(shadow, (v) => `0 ${60 * v}px ${120 * v}px -${30 * v}px rgba(6,25,58,${v})`) }}>
            <span className="absolute left-1/2 -translate-x-1/2 top-[5px] md:top-[6px] w-1.5 h-1.5 rounded-full bg-[#1e2637] ring-1 ring-white/20" aria-hidden />
            <div className="relative aspect-video overflow-hidden rounded-[10px] md:rounded-[14px] bg-ink">
              <video ref={video} className="absolute inset-0 w-full h-full object-contain bg-ink" muted={muted} loop playsInline preload="metadata" poster={IMG.campus} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
                <source src={SITE.video} type="video/mp4" />
              </video>
              <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 flex items-center gap-2">
                <button onClick={toggle} className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white/25 transition-colors" aria-label={playing ? 'Pause' : 'Lecture'}>{playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}</button>
                <button onClick={() => { setMuted((m) => !m); if (video.current) video.current.muted = !muted; }} className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white/25 transition-colors" aria-label={muted ? 'Activer le son' : 'Couper le son'}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
              </div>
            </div>
          </motion.div>
          {/* Reflet au sol */}
          <div className="mx-auto mt-6 h-6 w-[70%] rounded-[50%] bg-ink/25 blur-2xl" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* NewsCard                                                             */
/* ------------------------------------------------------------------ */
export const NewsCard = ({ item, big = false }: { item: any; big?: boolean }) => {
  const { currentLang, t } = useLanguage();
  return (
    <Link to={`/actualites/${item.id}`} className={`group block ${big ? '' : ''}`}>
      <div className={`img-frame img-zoom ${big ? 'aspect-[4/3] md:aspect-[16/10]' : 'aspect-[4/3]'}`}>
        <img src={item.image} alt={item.title} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
      </div>
      <div className="pt-5 flex flex-col gap-2">
        <p className="t-meta flex items-center gap-2">
          {item.category && <span className="text-ink font-semibold">{item.category}</span>}
          {item.category && <span aria-hidden>—</span>}
          <span>{fmtDate(item.date, currentLang)}</span>
        </p>
        <h3 className={`${big ? 't-h3' : 't-h4'} group-hover:text-ink-3 transition-colors`}>{item.title}</h3>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold mt-1 ulink self-start">{t.ui.readMore} <ArrowUpRight size={15} /></span>
      </div>
    </Link>
  );
};

/* ------------------------------------------------------------------ */
/* StatGrid — chiffres clés (compteurs)                                */
/* ------------------------------------------------------------------ */
export const StatGrid = ({ dark = false }: { dark?: boolean }) => {
  const { t, currentLang } = useLanguage();
  const stats = [
    { n: 100, suffix: '%', label: t.ui.success100, sub: t.ui.success100Desc, Icon: Award },
    { n: 25, suffix: '', label: t.ui.maxClass, sub: t.ui.maxClassDesc, Icon: Users },
    { n: 15, suffix: '+', label: t.ui.activitiesCount, sub: t.ui.activitiesDesc, Icon: Sparkles },
    { n: 1, suffix: currentLang === 'FR' ? 'ère' : 'st', label: t.ui.ecoFirst, sub: t.ui.ecoFirstDesc, Icon: Leaf },
  ];
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-px ${dark ? 'bg-white/12' : 'bg-ink/12'} rounded-none overflow-hidden border ${dark ? 'border-white/12' : 'border-ink/12'}`}>
      {stats.map((s, i) => (
        <div key={i} className={`p-7 md:p-9 ${dark ? 'bg-ink' : 'bg-salt'}`}>
          <s.Icon size={18} className="text-saffron mb-4" />
          <p className="t-num"><Counter to={s.n} suffix={s.suffix} /></p>
          <p className="t-h4 mt-3">{s.label}</p>
          <p className={`t-small mt-1 ${dark ? 'text-sea-2' : 'text-mute'}`}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ImageStrip — trois images qui se décalent au scroll                 */
/* ------------------------------------------------------------------ */
export const ImageStrip = ({ images, alt }: { images: string[]; alt: string }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 items-end">
    {images.slice(0, 3).map((src, i) => (
      <Parallax
        key={i}
        amount={i === 1 ? 70 : 30}
        className={`img-frame ${i === 0 ? 'col-span-2 md:col-span-1 aspect-[16/10] md:aspect-square md:mb-10' : i === 1 ? 'aspect-[3/4]' : 'aspect-[3/4] md:aspect-square md:mb-10'}`}
      >
        <img src={src} alt={`${alt} ${i + 1}`} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-cover scale-110" />
      </Parallax>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* AfterBac — poursuite d'études : les grandes filières marocaines      */
/* ------------------------------------------------------------------ */
export const AfterBac = ({ compact = false }: { compact?: boolean }) => {
  const { currentLang } = useLanguage();
  const d = AFTER_BAC[currentLang];
  const icons = [GraduationCap, Cog, HeartPulse, Briefcase, Landmark];
  const all = d.families.flatMap((f) => f.items);
  if (compact) {
    return (
      <section className="bg-ink text-salt on-dark grain relative overflow-hidden">
        <div className="wrap py-16">
          <SectionHead dark chapter={d.chapter} title={d.title} lead={d.lead} />
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-2">
              {d.families.map((f, i) => { const I = icons[i]; return <span key={f.name} className="inline-flex items-center gap-2 rounded-none border border-white/20 px-3 py-1.5 text-sm"><I size={14} className="text-saffron" />{f.name}</span>; })}
            </div>
            <Link to="/programmes/lycee" className="ulink font-semibold inline-flex items-center gap-1.5 mt-6"><Compass size={15} />{currentLang === 'FR' ? 'Le parcours du lycée' : 'The high-school path'}</Link>
          </Reveal>
        </div>
        <div className="border-t border-white/10 py-3">
          <Marquee duration={60} items={all.map((x) => <span key={x} className="font-display font-medium text-lg whitespace-nowrap text-sea">{x}</span>)} />
        </div>
      </section>
    );
  }
  return (
    <section className="section bg-ink text-salt on-dark grain relative overflow-hidden">
      <div className="wrap">
        <SectionHead dark chapter={d.chapter} title={d.title} lead={d.lead} className="mb-12" />
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
          {d.families.map((f, i) => {
            const I = icons[i];
            return (
              <Reveal key={f.name} delay={0.06 * i} className="card-dark p-6 flex flex-col">
                <span className="w-11 h-11 rounded-full bg-saffron text-ink flex items-center justify-center mb-5"><I size={20} /></span>
                <h3 className="t-h4">{f.name}</h3>
                <p className="t-small text-sea-2 mt-2">{f.desc}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {f.items.map((it) => <li key={it} className="text-[12px] font-medium rounded-none border border-white/20 px-2.5 py-1">{it}</li>)}
                </ul>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={0.2} className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="t-body text-sea max-w-[60ch] inline-flex items-start gap-3"><Compass size={18} className="text-saffron mt-1 shrink-0" />{d.note}</p>
          <Button to="/inscription" variant="saffron">{currentLang === 'FR' ? 'Inscrire mon enfant au lycée' : 'Enrol my child in high school'}</Button>
        </Reveal>
      </div>
      <div className="mt-12 border-t border-white/10 py-3">
        <Marquee duration={60} items={all.map((x) => <span key={x} className="font-display font-medium text-xl whitespace-nowrap text-sea">{x}</span>)} />
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* SectionHead — le seul modèle de titre de section : repère, titre,   */
/* une phrase. Aligné à gauche, jamais de texte en vis-à-vis.          */
/* ------------------------------------------------------------------ */
export const SectionHead = ({ chapter, title, lead, dark = false, className = '', link }: { chapter: string; title: string; lead?: string; dark?: boolean; className?: string; link?: { label: string; to: string } }) => (
  <div className={`max-w-[820px] ${className}`}>
    <Chapter saffron={dark} className="mb-5">{chapter}</Chapter>
    <h2 className="t-h2"><WordReveal text={title} /></h2>
    {lead && <Reveal delay={0.1}><p className={`t-body mt-5 max-w-[56ch] ${dark ? 'text-sea' : 'text-mute'}`}>{lead}</p></Reveal>}
    {link && <Reveal delay={0.15}><Link to={link.to} className={`ulink font-semibold inline-block mt-5 ${dark ? 'text-salt' : ''}`}>{link.label}</Link></Reveal>}
  </div>
);
