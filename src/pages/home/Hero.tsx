import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from 'motion/react';
import { Languages, Eye, Target, Sun, Users, CalendarDays, Sparkles, GraduationCap, Globe, Newspaper } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { SITE, IMG } from '../../content/site';
import { WordReveal, Reveal, LineMask, EASE } from '../../components/ui/motion';
import { Button, Marquee, ScrollHint, fmtDate } from '../../components/ui';
import { preloaderDelay } from '../../components/Preloader';

/* Position du portrait de Georges Claude dans la photo (en % de l'image originale) */
const PORTRAIT = { x: 51.8, y: 46.5 }; // visage du portrait, en % de la photo
const ZOOM = 5.2;            // grossissement final
const TARGET = { x: 0.5, y: 0.42 }; // où placer le visage à l'écran (fraction de la largeur / hauteur)

/** Mesure la géométrie de l'image affichée en "cover" et calcule la plongée exacte vers le portrait. */
const usePortraitZoom = (img: React.RefObject<HTMLImageElement | null>) => {
  const [geo, setGeo] = useState({ ox: 0, oy: 0, tx: 0, ty: 0 });
  useEffect(() => {
    const measure = () => {
      const el = img.current; if (!el) return;
      const W = el.clientWidth, H = el.clientHeight, nw = el.naturalWidth || 2048, nh = el.naturalHeight || 1536;
      // La photo couvre l'écran, calée en bas : c'est le ciel qui est rogné, jamais le bâtiment
      const s0 = Math.max(W / nw, H / nh); const rw = nw * s0, rh = nh * s0; const offx = (W - rw) / 2, offy = H - rh;
      const px = offx + (PORTRAIT.x / 100) * rw, py = offy + (PORTRAIT.y / 100) * rh; // portrait dans l'élément
      let tx = W * TARGET.x - px, ty = H * TARGET.y - py; // translation pour amener le portrait à la cible
      // Garantir que l'image agrandie couvre encore tout l'écran (aucun bord visible)
      const left = px + (offx - px) * ZOOM + tx, right = px + (offx + rw - px) * ZOOM + tx;
      const top = py + (offy - py) * ZOOM + ty, bottom = py + (offy + rh - py) * ZOOM + ty;
      if (left > 0) tx -= left; if (right < W) tx += W - right; if (top > 0) ty -= top; if (bottom < H) ty += H - bottom;
      setGeo({ ox: px, oy: py, tx, ty });
    };
    const el = img.current;
    if (el?.complete) measure(); else el?.addEventListener('load', measure, { once: true });
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [img]);
  return geo;
};

export const Hero = () => {
  const { t, currentLang } = useLanguage();
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'news'), orderBy('date', 'desc'), limit(6)), (snap) => setNews(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), () => setNews([]));
    return () => unsub();
  }, []);
  const reduce = useReducedMotion();
  const d = preloaderDelay(); // 0 si l'écran d'ouverture a déjà été vu dans la session
  const fr = currentLang === 'FR';
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const geo = usePortraitZoom(imgRef);
  // Scène épinglée : le défilement pilote la plongée vers le portrait
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.6 });
  const scale = useTransform(p, [0, 1], [1, ZOOM]);
  const x = useTransform(p, [0, 1], [0, geo.tx]);
  const y = useTransform(p, [0, 1], [0, geo.ty]);
  const veil = useTransform(p, [0, 0.6, 1], [0, 0.1, 0.3]);
  const contentOpacity = useTransform(p, [0, 0.28], [1, 0]);
  const contentY = useTransform(p, [0, 0.28], [0, -40]);
  const captionOpacity = useTransform(p, [0.62, 0.85], [0, 1]);
  const captionY = useTransform(p, [0.62, 0.85], [24, 0]);

  const facts = fr
    ? ['Inscriptions 2026-2027 ouvertes', 'Journées portes ouvertes sur rendez-vous', 'École privée homologuée · Sidi Bouzid, El Jadida', 'Maternelle · Primaire · Collège · Lycée', 'Programme Cambridge', `${SITE.phone}`]
    : ['Enrolment 2026-2027 open', 'Open days by appointment', 'Accredited private school · Sidi Bouzid, El Jadida', 'Preschool · Primary · Middle · High School', 'Cambridge programme', `${SITE.phone}`];
  const chips = [
    { Icon: GraduationCap, text: fr ? 'De 3 à 18 ans' : 'Ages 3 to 18' },
    { Icon: Languages, text: fr ? 'Trilingue FR · EN · AR' : 'Trilingual FR · EN · AR' },
    { Icon: Globe, text: fr ? 'Programme Cambridge' : 'Cambridge programme' },
  ];

  return (
    <>
      <section ref={ref} className="relative bg-ink text-salt on-dark" style={{ height: reduce ? 'auto' : '190svh' }}>
        <div className={`${reduce ? 'relative min-h-[100svh]' : 'sticky top-0 h-[100svh]'} overflow-hidden`}>
          {/* Photo plein cadre — révélée à l'arrivée, puis plongée vers le portrait au défilement */}
          <motion.div className="absolute inset-0" initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.6, delay: d, ease: EASE }}>
            <motion.img
              ref={imgRef}
              src={IMG.school}
              alt={fr ? 'La façade de Georges Claude Private Academy à Sidi Bouzid, El Jadida' : 'The facade of Georges Claude Private Academy in Sidi Bouzid, El Jadida'}
              className="absolute inset-0 w-full h-full object-cover object-[center_bottom] will-change-transform"
              style={reduce ? undefined : { scale, x, y, transformOrigin: `${geo.ox}px ${geo.oy}px` }}
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/15 to-transparent" />
            <motion.div className="absolute inset-0 bg-ink" style={{ opacity: veil }} />
          </motion.div>

          {/* Contenu */}
          <motion.div className="wrap relative z-10 h-full flex flex-col justify-end pb-10 md:pb-14" style={reduce ? undefined : { opacity: contentOpacity, y: contentY }}>
            <div style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }} />
            <div className="grid lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-9">
                <h1 className="t-hero max-w-[18ch]">
                  {(() => {
                    const [place, ...rest] = String(t.copy.heroTitle).split(/,\s*/);
                    const l2 = rest.length > 1 ? rest.slice(0, -1).join(', ') + ',' : rest[0] || '';
                    const l3 = rest.length > 1 ? rest[rest.length - 1] : '';
                    return (
                      <>
                        <LineMask inView={false} delay={d + 0.4}><span className="font-serif italic font-normal text-saffron-2 text-[0.72em] tracking-normal">{place},</span></LineMask>
                        <LineMask inView={false} delay={d + 0.55}>{l2}</LineMask>
                        {l3 && <LineMask inView={false} delay={d + 0.7}>{l3}</LineMask>}
                      </>
                    );
                  })()}
                </h1>
                <motion.div className="mt-6 [@media(max-height:700px)]:mt-3" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: d + 1.2, ease: EASE }}>
                  <p className="font-serif italic text-saffron-2 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-snug">{SITE.motto[currentLang]}</p>
                  <ul className="hidden">
                    {chips.map((f) => <li key={f.text} className="inline-flex items-center gap-2 rounded-none border border-white/25 bg-white/8 backdrop-blur-sm px-3.5 py-1.5 text-[14px] font-medium text-salt"><f.Icon size={15} className="text-saffron" />{f.text}</li>)}
                  </ul>
                </motion.div>
                <motion.div className="mt-8 [@media(max-height:700px)]:mt-4 flex flex-wrap items-center gap-3" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: d + 1.4, ease: EASE }}>
                  <Button to="/inscription" variant="saffron">{t.ui.enroll}</Button>
                  <Button to="/academie" variant="ghost-light" icon="none">{t.ui.discoverAcademy}</Button>
                </motion.div>
              </div>
            </div>
            <motion.div className="mt-8 hidden md:flex [@media(max-height:800px)]:!hidden" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d + 1.8, duration: 1 }}><ScrollHint label={t.ui.scroll} /></motion.div>
          </motion.div>

          {/* Légende du portrait : apparaît en fin de plongée */}
          {!reduce && (
            <motion.div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ opacity: captionOpacity, y: captionY }}>
              <div className="wrap pb-12 md:pb-16">
                <p className="chapter saffron mb-4">{fr ? 'Il donne son nom à l’école' : 'The man behind the name'}</p>
                <p className="t-h2 max-w-[16ch]">Georges Claude</p>
                <p className="t-lead text-sea mt-3 max-w-[40ch]">{fr ? 'Physicien et inventeur français (1870 – 1960). Son portrait veille sur la façade : l’exigence et la curiosité comme héritage.' : 'French physicist and inventor (1870 – 1960). His portrait watches over the facade: rigour and curiosity as a legacy.'}</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Fil d'actualités — jaune, avec l'étiquette « Actualités » et les derniers titres */}
      <div className="bg-saffron text-ink border-y border-ink/10">
        <div className="flex items-stretch">
          <Link to="/actualites" className="shrink-0 flex items-center gap-2.5 bg-ink text-salt px-5 md:px-7 py-4 font-semibold text-sm hover:bg-ink-2 transition-colors">
            <Newspaper size={16} className="text-saffron" /><span className="hidden sm:inline">{fr ? 'Actualités' : 'News'}</span><span className="hidden md:inline text-sea-2 font-medium">· {fr ? 'à la une' : 'headlines'}</span>
          </Link>
          <div className="min-w-0 flex-1 py-4">
            <Marquee duration={news.length ? 60 : 50} items={(news.length ? news : []).map((n) => (
              <Link key={n.id} to={`/actualites/${n.id}`} className="inline-flex items-center gap-3 whitespace-nowrap hover:underline">
                <span className="text-[13px] font-semibold text-ink/60">{fmtDate(n.date, currentLang)}</span>
                <span className="text-[15px] font-semibold">{n.title}</span>
              </Link>
            )).concat(facts.map((f) => <span key={f} className="text-[15px] font-semibold whitespace-nowrap">{f}</span>))} />
          </div>
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Identité — déclaration d'ouverture + preuves                        */
/* ------------------------------------------------------------------ */
export const Identity = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const reduce = useReducedMotion();
  const numbers = [
    { n: '5+', l: t.academy.yearsExperience, Icon: CalendarDays },
    { n: '+500', l: fr ? 'élèves inscrits' : 'students enrolled', Icon: Users },
    { n: '3', l: fr ? 'langues au quotidien' : 'languages every day', Icon: Languages },
    { n: '25', l: fr ? 'élèves maximum par classe' : 'students maximum per class', Icon: Sparkles },
  ];
  return (
    <section className="section bg-salt">
      <div className="wrap">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="chapter mb-6">{t.welcome.presentation}</p>
            <h2 className="t-h1 max-w-[16ch]"><WordReveal text={t.copy.identityTitle} stagger={0.035} /></h2>
            <Reveal delay={0.15}><p className="t-lead text-mute mt-8 max-w-[52ch]">{t.welcome.text}</p></Reveal>
            <Reveal delay={0.25} className="mt-8"><Link to="/academie" className="btn btn-ink">{t.ui.discoverAcademy}</Link></Reveal>
          </div>
          {/* Le blason, en grand */}
          <Reveal className="lg:col-span-5 flex justify-center lg:justify-end" delay={0.2}>
            <motion.img
              src={IMG.logo}
              alt="Blason de Georges Claude Private Academy"
              className="w-[min(70vw,340px)] lg:w-[min(32vw,460px)] h-auto object-contain drop-shadow-[0_40px_60px_rgba(6,25,58,0.25)]"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              animate={reduce ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </Reveal>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mt-20 pt-10 border-t border-ink/15">
          {numbers.map((x, i) => (
            <Reveal key={i} delay={i * 0.06} amount={0.6}>
              <x.Icon size={18} className="text-saffron mb-3" />
              <p className="t-num">{x.n}</p>
              <p className="t-small text-mute mt-2 max-w-[18ch]">{x.l}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Le mot du directeur                                                  */
/* ------------------------------------------------------------------ */
export const Director = () => {
  const { t, currentLang } = useLanguage();
  const quote: string = t.home.director.quote;
  const [first, ...rest] = quote.split('. ');
  const paras = rest.join('. ').split(/(?<=\.)\s+(?=[A-ZÀÉÈÊ])/).reduce<string[][]>((acc, x, i) => { const k = Math.floor(i / 2); (acc[k] ||= []).push(x); return acc; }, []).map((p) => p.join(' '));
  return (
    <section className="section bg-ink text-salt on-dark grain relative overflow-hidden">
      <div className="wrap-narrow text-center">
        <p className="chapter saffron justify-center mb-8">{t.copy.directorTitle}</p>
        <span className="block mx-auto mb-8 font-serif text-saffron text-6xl leading-none select-none" aria-hidden>“</span>
        <p className="t-quote text-salt">
          <WordReveal text={first + '.'} stagger={0.02} />
        </p>
        <div className="mt-10 mx-auto max-w-[64ch] text-sea/90 text-left space-y-4 font-serif text-[15px] md:text-[16px] leading-[1.7]">
          {paras.map((x, i) => <Reveal key={i} as="p" delay={0.05 * i} amount={0.5}>{x}</Reveal>)}
        </div>
        <Reveal delay={0.2} className="mt-12 pt-8 border-t border-white/12 flex flex-col items-center gap-4">
          <span className="relative inline-block p-1.5 rounded-full border border-saffron/60"><img src={IMG.director} alt={SITE.director.name} className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover ring-2 ring-saffron shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)]" loading="lazy" referrerPolicy="no-referrer" /></span>
          <span><span className="block t-h4">{SITE.director.name}</span><span className="block t-meta">{SITE.director.role[currentLang]}</span></span>
          <img src={IMG.signature} alt="" className="h-12 w-auto opacity-90 invert" loading="lazy" referrerPolicy="no-referrer" />
          <Link to="/academie" className="ulink font-semibold text-sm text-saffron mt-2">{t.ui.discoverAcademy}</Link>
        </Reveal>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Vision — trois cartes empilées qui se superposent au scroll         */
/* ------------------------------------------------------------------ */
export const Vision = () => {
  const { t } = useLanguage();
  const cards = [
    { title: t.vision.visionTitle, text: t.vision.visionText, Icon: Eye },
    { title: t.vision.objectiveTitle, text: t.vision.objectiveText, Icon: Target },
    { title: t.vision.dailyLifeTitle, text: t.vision.dailyLifeText, Icon: Sun },
  ];
  return (
    <section className="section bg-salt-2/70 relative overflow-hidden">
      {/* Filigrane du blason */}
      <img src={IMG.logo} alt="" aria-hidden className="absolute -right-[8%] -bottom-[14%] w-[38vw] max-w-[560px] opacity-[0.05] pointer-events-none select-none" loading="lazy" referrerPolicy="no-referrer" />
      <div className="wrap relative">
        <div className="max-w-[820px]">
          <p className="chapter mb-5">{t.vision.label}</p>
          <h2 className="t-h2"><WordReveal text={t.copy.visionTitle} /></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-ink/12 mt-16">
          {cards.map((c, i) => (
            <Reveal key={i} delay={0.1 * i} className="md:px-10 first:md:pl-0 last:md:pr-0">
              <span className="block h-px w-12 bg-saffron mb-8" aria-hidden />
              <span className="inline-flex w-12 h-12 rounded-full items-center justify-center border border-saffron/60 text-saffron mb-6"><c.Icon size={20} strokeWidth={1.6} /></span>
              <h3 className="font-serif italic text-ink text-[clamp(1.5rem,2.1vw,2rem)] leading-tight">{c.title}</h3>
              <p className="t-body text-mute mt-4 max-w-[36ch]">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
