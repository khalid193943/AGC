import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE, IMG } from '../content/site';
import { Reveal, WordReveal, Parallax, Counter, EASE } from './ui/motion';
import { Button, Chapter, fmtDate } from './ui';

/* ------------------------------------------------------------------ */
/* PageHero — hero des pages secondaires : encre, très grande typo,
   image en arche décalée, parallaxe légère.                           */
/* ------------------------------------------------------------------ */
export const PageHero = ({
  chapter,
  title,
  lead,
  image,
  imageAlt = '',
  children,
  compact = false,
}: {
  chapter: string;
  title: string;
  lead?: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  compact?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <section ref={ref} className="relative bg-ink text-salt on-dark overflow-hidden grain">
      <div className="wrap relative z-10" style={{ paddingTop: 'calc(var(--header-h) + clamp(3rem, 8vw, 7rem))', paddingBottom: compact ? 'clamp(3rem, 6vw, 5rem)' : 'clamp(4rem, 8vw, 7rem)' }}>
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <motion.div className={image ? 'lg:col-span-7' : 'lg:col-span-10'} style={reduce ? undefined : { y, opacity }}>
            <Chapter saffron className="mb-6">{chapter}</Chapter>
            <h1 className="t-display">
              <WordReveal text={title} inView={false} delay={0.1} />
            </h1>
            {lead && (
              <motion.p className="t-lead text-sea max-w-[40ch] mt-8" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: EASE }}>
                {lead}
              </motion.p>
            )}
            {children && <div className="mt-10 flex flex-wrap gap-3">{children}</div>}
          </motion.div>
          {image && (
            <motion.div className="lg:col-span-4 lg:col-start-9" initial={reduce ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.35, ease: EASE }}>
              <div className="img-arch aspect-[4/5] max-w-[380px] lg:max-w-none ml-auto">
                <img src={image} alt={imageAlt} loading="eager" decoding="async" referrerPolicy="no-referrer" />
              </div>
            </motion.div>
          )}
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
    <section className={`section ${tone === 'sea' ? 'bg-sea/40' : 'bg-salt'}`}>
      <div className="wrap">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h2 className="t-h2 max-w-[16ch]"><WordReveal text={title ?? t.programs.ctaTitle} /></h2>
            <Reveal delay={0.15}><p className="t-lead text-mute mt-6 max-w-[48ch]">{desc ?? t.programs.ctaDesc}</p></Reveal>
          </div>
          <Reveal className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end" delay={0.25}>
            <Button to={primary?.to ?? '/inscription'} size="lg">{primary?.label ?? t.ui.enroll}</Button>
            <Button to={secondary?.to ?? '/contact'} variant="ghost" size="lg" icon="none">{secondary?.label ?? t.contact.step2.title}</Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* VideoSection — vidéo plein cadre, lecture automatique quand visible,
   contrôles discrets.                                                  */
/* ------------------------------------------------------------------ */
export const VideoSection = ({ title, desc }: { title: string; desc: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView && !reduce) v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { v.pause(); setPlaying(false); }
  }, [inView, reduce]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else { v.pause(); setPlaying(false); }
  };

  return (
    <section ref={ref} className="bg-salt">
      <div className="wrap pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="t-h2"><WordReveal text={title} /></h2>
          <Reveal delay={0.1}><p className="t-body text-mute max-w-[40ch]">{desc}</p></Reveal>
        </div>
      </div>
      <motion.div className="relative aspect-video md:aspect-[21/9] w-full overflow-hidden bg-ink" style={reduce ? undefined : { scale, borderRadius: radius }}>
        <video ref={video} className="absolute inset-0 w-full h-full object-cover" muted={muted} loop playsInline preload="metadata" poster={IMG.campus} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
          <source src={SITE.video} type="video/mp4" />
        </video>
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 flex items-center gap-2">
          <button onClick={toggle} className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white/25 transition-colors" aria-label={playing ? 'Pause' : 'Lecture'}>
            {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button onClick={() => { setMuted((m) => !m); if (video.current) video.current.muted = !muted; }} className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white/25 transition-colors" aria-label={muted ? 'Activer le son' : 'Couper le son'}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </motion.div>
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
    { n: 100, suffix: '%', label: t.ui.success100, sub: t.ui.success100Desc },
    { n: 25, suffix: '', label: t.ui.maxClass, sub: t.ui.maxClassDesc },
    { n: 15, suffix: '+', label: t.ui.activitiesCount, sub: t.ui.activitiesDesc },
    { n: 1, suffix: currentLang === 'FR' ? 'ère' : 'st', label: t.ui.ecoFirst, sub: t.ui.ecoFirstDesc },
  ];
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-px ${dark ? 'bg-white/12' : 'bg-ink/12'} rounded-[1.75rem] overflow-hidden border ${dark ? 'border-white/12' : 'border-ink/12'}`}>
      {stats.map((s, i) => (
        <div key={i} className={`p-7 md:p-9 ${dark ? 'bg-ink' : 'bg-salt'}`}>
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
  <div className="grid grid-cols-3 gap-3 md:gap-5 items-end">
    {images.slice(0, 3).map((src, i) => (
      <Parallax key={i} amount={i === 1 ? 70 : 30} className={`img-frame ${i === 1 ? 'aspect-[3/4]' : 'aspect-square mb-10'}`}>
        <img src={src} alt={`${alt} ${i + 1}`} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-cover scale-110" />
      </Parallax>
    ))}
  </div>
);
