import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from 'motion/react';
import { Award, Leaf, ShieldCheck, Languages, Eye, Target, Sun, Users, CalendarDays, Sparkles, GraduationCap, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SITE, IMG } from '../../content/site';
import { WordReveal, Reveal, ClipReveal, Parallax, EASE } from '../../components/ui/motion';
import { Button, Marquee, ScrollHint } from '../../components/ui';
import { preloaderDelay } from '../../components/Preloader';
import { Crest } from '../../components/ui/Crest';

/* Position du portrait de Georges Claude dans la photo (en % de l'image originale) */
const PORTRAIT = { x: 57.6, y: 17.6 };
const ZOOM = 3.6;            // grossissement final
const TARGET = { x: 0.5, y: 0.44 }; // où placer le visage à l'écran (fraction de la largeur / hauteur)

/** Mesure la géométrie de l'image affichée en "cover" et calcule la plongée exacte vers le portrait. */
const usePortraitZoom = (img: React.RefObject<HTMLImageElement | null>) => {
  const [geo, setGeo] = useState({ ox: 0, oy: 0, tx: 0, ty: 0 });
  useEffect(() => {
    const measure = () => {
      const el = img.current; if (!el) return;
      const W = el.clientWidth, H = el.clientHeight, nw = el.naturalWidth || 2048, nh = el.naturalHeight || 1536;
      const s0 = Math.max(W / nw, H / nh); const rw = nw * s0, rh = nh * s0; const offx = (W - rw) / 2, offy = (H - rh) / 2;
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
    ? ['École homologuée par le Ministère de l’Éducation Nationale', 'Maternelle · Primaire · Collège · Lycée', 'Programme Cambridge', 'Enseignement trilingue FR · EN · AR', '25 élèves maximum par classe', 'Transport scolaire El Jadida & environs', 'Cantine sur place, produits frais', 'Inscriptions 2026-2027 ouvertes']
    : ['School accredited by the Ministry of National Education', 'Preschool · Primary · Middle · High School', 'Cambridge programme', 'Trilingual teaching FR · EN · AR', '25 students maximum per class', 'School transport El Jadida & surroundings', 'On-site canteen, fresh produce', 'Enrolment 2026-2027 open'];
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
              className="absolute inset-0 w-full h-full object-cover will-change-transform"
              style={reduce ? undefined : { scale, x, y, transformOrigin: `${geo.ox}px ${geo.oy}px` }}
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/25 to-transparent" />
            <motion.div className="absolute inset-0 bg-ink" style={{ opacity: veil }} />
          </motion.div>

          {/* Contenu */}
          <motion.div className="wrap relative z-10 h-full flex flex-col justify-end pb-10 md:pb-14" style={reduce ? undefined : { opacity: contentOpacity, y: contentY }}>
            <div style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }} />
            <div className="grid lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8">
                <motion.p className="text-sea text-[15px] md:text-base mb-6 flex flex-wrap items-center gap-x-3 gap-y-1" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: d + 0.6, ease: EASE }}>
                  <span>{fr ? 'École privée homologuée' : 'Accredited private school'}</span>
                  <span className="w-1 h-1 rounded-full bg-saffron" aria-hidden />
                  <span>Sidi Bouzid · El Jadida</span>
                  <span className="w-1 h-1 rounded-full bg-saffron" aria-hidden />
                  <span className="text-saffron-2 font-semibold">{fr ? 'Inscriptions 2026-2027 ouvertes' : 'Enrolment 2026-2027 open'}</span>
                </motion.p>
                <h1 className="t-hero max-w-[16ch]">
                  <WordReveal text={t.copy.heroTitle} inView={false} delay={d + 0.45} stagger={0.05} />
                </h1>
                <motion.div className="mt-6" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: d + 1.2, ease: EASE }}>
                  <p className="font-serif italic text-saffron-2 text-[clamp(1.15rem,1.7vw,1.5rem)] leading-snug">{SITE.motto[currentLang]}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {chips.map((f) => <li key={f.text} className="inline-flex items-center gap-2 rounded-none border border-white/25 bg-white/8 backdrop-blur-sm px-3.5 py-1.5 text-[14px] font-medium text-salt"><f.Icon size={15} className="text-saffron" />{f.text}</li>)}
                  </ul>
                </motion.div>
                <motion.div className="mt-8 flex flex-wrap items-center gap-3" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: d + 1.4, ease: EASE }}>
                  <Button to="/inscription" variant="saffron" size="lg">{t.ui.enroll}</Button>
                  <Button to="/academie" variant="ghost-light" size="lg" icon="none">{t.ui.discoverAcademy}</Button>
                </motion.div>
              </div>
              <motion.div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end" initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: d + 1.3, ease: EASE }}>
                <motion.div className="hidden lg:block mb-2 mr-1" animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}><Crest size={140} /></motion.div>
                <div className="card-dark backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4 flex-1 lg:flex-none lg:min-w-[230px]">
                  <span className="w-10 h-10 rounded-full bg-saffron text-ink flex items-center justify-center shrink-0"><Award size={18} /></span>
                  <span><span className="block font-display font-semibold text-2xl leading-none">100%</span><span className="block text-sea text-[13px] mt-1 leading-tight">{t.ui.success100} · Bac & BEM 2025-26</span></span>
                </div>
                <div className="card-dark backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4 flex-1 lg:flex-none lg:min-w-[230px]">
                  <span className="w-10 h-10 rounded-full bg-leaf text-salt flex items-center justify-center shrink-0"><Leaf size={18} /></span>
                  <span><span className="block font-display font-semibold text-2xl leading-none">Ruban Vert</span><span className="block text-sea text-[13px] mt-1 leading-tight">{t.ui.ecoFirstDesc}</span></span>
                </div>
              </motion.div>
            </div>
            <motion.div className="mt-8 hidden md:flex" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d + 1.8, duration: 1 }}><ScrollHint label={t.ui.scroll} /></motion.div>
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

      {/* Ruban de repères */}
      <div className="bg-saffron text-ink py-3 border-y border-ink/10">
        <Marquee items={facts.map((f) => <span key={f} className="text-sm font-semibold whitespace-nowrap">{f}</span>)} duration={55} />
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
  const numbers = [
    { n: '5+', l: t.academy.yearsExperience, Icon: CalendarDays },
    { n: '+500', l: fr ? 'élèves inscrits' : 'students enrolled', Icon: Users },
    { n: '3', l: fr ? 'langues au quotidien' : 'languages every day', Icon: Languages },
    { n: '25', l: fr ? 'élèves maximum par classe' : 'students maximum per class', Icon: Sparkles },
  ];
  return (
    <section className="section bg-salt overflow-hidden">
      <div className="wrap">
        <div className="grid lg:grid-cols-12 gap-x-6 gap-y-12 items-start">
          {/* Titre */}
          <div className="lg:col-span-8">
            <p className="chapter mb-6">{t.welcome.presentation}</p>
            <h2 className="t-h1 max-w-[18ch]"><WordReveal text={t.copy.identityTitle} stagger={0.035} /></h2>
          </div>
          <Reveal className="lg:col-span-4 lg:pt-16" delay={0.3}>
            <p className="font-serif italic t-lead text-mute max-w-[26ch]">{t.copy.identityAside}</p>
          </Reveal>

          {/* Texte + preuves */}
          <div className="lg:col-span-5 lg:pt-6">
            <Reveal delay={0.1}><p className="t-lead">{t.welcome.text}</p></Reveal>
            <div className="mt-10 space-y-6">
              {[[t.welcome.feature1, t.welcome.feature1Desc, ShieldCheck], [t.welcome.feature2, t.welcome.feature2Desc, Languages]].map(([h, d, Ico]: any, i) => (
                <Reveal key={i} delay={0.15 + i * 0.08} className="flex gap-5 border-t border-ink/15 pt-5">
                  <span className="w-10 h-10 rounded-full bg-ink text-saffron flex items-center justify-center shrink-0"><Ico size={18} /></span>
                  <span><span className="block t-h4">{h}</span><span className="block t-body text-mute mt-1 max-w-[40ch]">{d}</span></span>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3} className="mt-10"><Link to="/academie" className="btn btn-ink">{t.ui.discoverAcademy}</Link></Reveal>
          </div>

          {/* Composition d'images */}
          <div className="lg:col-span-6 lg:col-start-7 relative">
            <ClipReveal className="img-arch aspect-[4/5] lg:w-[78%]" from="bottom">
              <Parallax amount={40} className="h-full"><img src={IMG.campus} alt={fr ? 'Le campus de l’académie à Sidi Bouzid' : 'The academy campus in Sidi Bouzid'} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-cover scale-110" /></Parallax>
            </ClipReveal>
            <Reveal delay={0.4} className="hidden lg:block absolute right-0 bottom-[14%] w-[40%]">
              <div className="img-frame aspect-square shadow-[0_40px_80px_-30px_rgba(6,25,58,0.45)] border-[6px] border-salt">
                <img src={IMG.kids} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
              </div>
            </Reveal>
            <Reveal delay={0.5} className="absolute -left-2 lg:left-[8%] -bottom-4 lg:-bottom-6 bg-ink text-salt rounded-none px-5 py-4 shadow-[0_30px_60px_-30px_rgba(6,25,58,0.6)]">
              <span className="block font-display font-semibold text-2xl leading-none">Cambridge</span>
              <span className="block text-sea text-[13px] mt-1">{t.ui.cambridgeDesc}</span>
            </Reveal>
          </div>
        </div>

        {/* Chiffres */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 mt-20 lg:mt-24 pt-8 border-t border-ink/15">
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
  const body = rest.join('. ');
  return (
    <section className="section bg-salt-2/60">
      <div className="wrap">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-2">
            <p className="chapter">{t.copy.directorTitle}</p>
          </div>
          <div className="lg:col-span-10">
            <p className="t-quote max-w-[30ch]">
              <WordReveal text={first + '.'} stagger={0.02} />
            </p>
            <Reveal delay={0.15} className="mt-10 t-body text-mute max-w-[64ch] lg:max-w-none lg:columns-2 lg:gap-12 [&>p]:mb-5 [&>p]:break-inside-avoid">
              {body.split(/(?<=\.)\s+(?=[A-ZÀÉÈÊ])/).reduce<string[][]>((acc, s, i) => { const k = Math.floor(i / 2); (acc[k] ||= []).push(s); return acc; }, []).map((para, i) => (
                <p key={i}>{para.join(' ')}</p>
              ))}
            </Reveal>
            {/* Signature : petit portrait, nom, fonction */}
            <Reveal delay={0.2} className="mt-10 pt-6 border-t border-ink/15 flex flex-wrap items-center gap-5">
              <img src={IMG.director} alt={SITE.director.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-salt shadow-md" loading="lazy" referrerPolicy="no-referrer" />
              <span><span className="block t-h4">{SITE.director.name}</span><span className="block t-meta">{SITE.director.role[currentLang]}</span></span>
              <img src={IMG.signature} alt="" className="h-12 w-auto opacity-70 mix-blend-multiply ml-auto" loading="lazy" referrerPolicy="no-referrer" />
              <Link to="/academie" className="ulink font-semibold text-sm w-full sm:w-auto sm:ml-4">{t.ui.discoverAcademy}</Link>
            </Reveal>
          </div>
        </div>
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
    { title: t.vision.visionTitle, text: t.vision.visionText, bg: 'bg-ink text-salt on-dark', Icon: Eye, ic: 'bg-saffron text-ink' },
    { title: t.vision.objectiveTitle, text: t.vision.objectiveText, bg: 'bg-ink-3 text-salt on-dark', Icon: Target, ic: 'bg-saffron text-ink' },
    { title: t.vision.dailyLifeTitle, text: t.vision.dailyLifeText, bg: 'bg-saffron text-ink', Icon: Sun, ic: 'bg-ink text-saffron' },
  ];
  return (
    <section className="section bg-salt">
      <div className="wrap">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <p className="chapter mb-6">{t.vision.label}</p>
            <h2 className="t-h2"><WordReveal text={t.copy.visionTitle} /></h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6 space-y-6">
            {cards.map((c, i) => (
              <div key={i} className={`${c.bg} rounded-none p-7 md:p-12 sticky shadow-[0_30px_60px_-30px_rgba(6,25,58,0.35)]`} style={{ top: `calc(var(--header-h) + 1rem + ${i * 1.5}rem)` }}>
                <span className={`inline-flex w-12 h-12 rounded-full items-center justify-center mb-6 ${c.ic}`}><c.Icon size={22} /></span>
                <h3 className="t-h3 mb-6">{c.title}</h3>
                <p className="t-lead opacity-90 max-w-[40ch]">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
