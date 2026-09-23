import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useTransform, useReducedMotion, AnimatePresence, useMotionValueEvent, useMotionValue, useSpring, useScroll, useInView, MotionValue } from 'motion/react';
import { ArrowUpRight, BookOpen, Brain, Palette, Trophy, Leaf, Sun, Recycle, Droplets, Puzzle, Compass, GraduationCap, Drama, Bot, Crown, Swords, Waves, Cpu } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SITE, IMG } from '../../content/site';
import { WordReveal, Reveal, useHorizontalPin, ClipReveal, Counter, EASE } from '../../components/ui/motion';
import { Button, Chapter, useMedia } from '../../components/ui';

export const CYCLES = (t: any) => [
  { id: 'maternelle', title: t.programs.p1.title, desc: t.programs.p1.desc, features: t.programs.p1.features, image: IMG.cycles.maternelle, ages: t.ui.cycleAges.maternelle },
  { id: 'primaire', title: t.programs.p2.title, desc: t.programs.p2.desc, features: t.programs.p2.features, image: IMG.cycles.primaire, ages: t.ui.cycleAges.primaire },
  { id: 'college', title: t.programs.p3.title, desc: t.programs.p3.desc, features: t.programs.p3.features, image: IMG.cycles.college, ages: t.ui.cycleAges.college },
  { id: 'lycee', title: t.programs.p4.title, desc: t.programs.p4.desc, features: t.programs.p4.features, image: IMG.cycles.lycee, ages: t.ui.cycleAges.lycee },
];

/* Identité visuelle de chaque cycle : les couleurs exactes du logo (bleu, jaune, rouge, blanc) */
export const CYCLE_STYLE: Record<string, { card: string; chip: string; icon: string; link: string; ring: string; Icon: any }> = {
  maternelle: { card: 'bg-logo-yellow text-ink', chip: 'border-ink/25 text-ink', icon: 'bg-ink text-logo-yellow', link: 'text-ink', ring: 'border-logo-yellow', Icon: Puzzle },
  primaire: { card: 'bg-logo-blue text-white', chip: 'border-white/30 text-white', icon: 'bg-logo-yellow text-ink', link: 'text-logo-yellow', ring: 'border-logo-blue', Icon: BookOpen },
  college: { card: 'bg-logo-red text-white', chip: 'border-white/35 text-white', icon: 'bg-white text-logo-red', link: 'text-white', ring: 'border-logo-red', Icon: Compass },
  lycee: { card: 'bg-white text-ink', chip: 'border-ink/20 text-ink', icon: 'bg-ink text-logo-yellow', link: 'text-ink', ring: 'border-white', Icon: GraduationCap },
};

/* Carte : arche en haut, base droite — photo en haut, contenu en bas */
const CycleCard = ({ c, t, index, progress, active }: { c: any; t: any; index: number; progress?: MotionValue<number>; active?: number }) => {
  const st = CYCLE_STYLE[c.id];
  const reduce = useReducedMotion();
  const fallback = useMotionValue(0);
  // La photo glisse dans son arche pendant le défilement : effet de profondeur
  const imgX = useTransform(progress ?? fallback, [0, 1], [`${-12 + index * 5}%`, `${8 - index * 5}%`]);
  const isActive = active === undefined || active === index;
  return (
    <motion.div
      className={`group relative shrink-0 w-[86vw] sm:w-[440px] lg:w-[clamp(420px,34vw,540px)] rounded-t-full rounded-b-none overflow-hidden ${st.card} shadow-[0_50px_90px_-45px_rgba(6,25,58,0.55)] ring-1 ring-ink/10`}
      animate={reduce ? undefined : { scale: isActive ? 1 : 0.94, opacity: isActive ? 1 : 0.7, y: isActive ? 0 : 14 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <Link to={`/programmes/${c.id}`} className="block">
        {/* Photo dans l'arche */}
        <div className="relative h-[32svh] lg:h-[clamp(200px,31vh,420px)] overflow-hidden bg-black/10">
          <motion.img
            src={c.image}
            alt={`${c.title} — ${SITE.name}`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-[125%] max-w-none h-full object-cover -ml-[12.5%] will-change-transform group-hover:scale-105 transition-transform duration-[1200ms]"
            style={reduce ? undefined : { x: imgX }}
          />
                  </div>
        {/* Médaillon à la jonction */}
                <div className="relative px-7 pt-10 pb-7">
          <span className={`absolute left-7 -top-8 w-16 h-16 rounded-full flex items-center justify-center ${st.icon} border-4 ${st.ring} shadow-lg transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110`}><st.Icon size={22} /></span>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display font-medium text-[clamp(1.75rem,2.4vw,2.5rem)] leading-none tracking-tight">{c.title}</h3>
            <span className="text-[15px] opacity-75 whitespace-nowrap">{c.ages}</span>
          </div>
          <p className="t-body opacity-90 mt-3 line-clamp-2 [@media(max-height:820px)]:hidden">{c.desc}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {c.features.slice(0, 3).map((f: string, i: number) => (
              <li key={f} className={`text-[13px] font-medium rounded-none border px-3 py-1.5 ${st.chip} ${i === 2 ? '[@media(max-height:820px)]:hidden' : ''}`}>{f}</li>
            ))}
            {c.features.length > 3 && <li className={`text-[13px] font-medium rounded-none border px-3 py-1.5 ${st.chip}`}>+{c.features.length - 3}</li>}
          </ul>
          <span className={`mt-6 inline-flex items-center gap-1.5 font-semibold text-[15px] ${st.link}`}>
            <span className="swap"><span>{t.programs.programDetailsBtn}</span><span aria-hidden>{t.programs.programDetailsBtn}</span></span>
            <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Programmes — section épinglée, défilement horizontal (desktop)      */
/* ------------------------------------------------------------------ */
export const Programs = () => {
  const { t } = useLanguage();
  const cycles = CYCLES(t);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { progress, x } = useHorizontalPin(ref, trackRef);
  const bar = useTransform(progress, [0, 1], ['0%', '100%']);
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, 'change', (v) => setActive(Math.min(3, Math.max(0, Math.round(v * 3)))));

  const header = (
    <div className="wrap">
      <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 items-end">
        <div className="lg:col-span-7">
          <Chapter className="mb-4 lg:mb-6">{t.programs.curriculum} — {t.copy.programsRail}</Chapter>
          <h2 className="t-h2 max-w-[14ch]"><WordReveal text={t.copy.programsTitle} /></h2>
        </div>
        <Reveal delay={0.15} className="hidden md:block lg:col-span-4 lg:col-start-9">
          <p className="t-body text-mute max-w-[38ch]">{t.copy.programsDesc}</p>
          <Link to="/programmes" className="ulink font-semibold inline-block mt-4">{t.ui.seePrograms}</Link>
        </Reveal>
      </div>
    </div>
  );

  if (reduce) {
    return (
      <section className="section bg-salt overflow-hidden">
        {header}
        <div className="snap-x mt-12">
          {cycles.map((c, i) => <CycleCard key={c.id} c={c} t={t} index={i} />)}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative bg-salt" style={{ height: '360vh', paddingTop: 'var(--section)', paddingBottom: 'var(--section)' }}>
      <div className="sticky top-0 h-[100svh] flex flex-col justify-center overflow-hidden">
        <div className="pb-3 lg:pb-4">{header}</div>
        <motion.div ref={trackRef} className="flex gap-6 lg:gap-10 pl-[var(--gutter)] lg:pl-[max(var(--gutter),12vw)] py-3 will-change-transform" style={{ x }}>
          {cycles.map((c, i) => <CycleCard key={c.id} c={c} t={t} index={i} progress={progress} active={active} />)}
          <div className="w-[var(--gutter)] lg:w-[14vw] shrink-0" aria-hidden />
        </motion.div>
        {/* Rail de progression : où en est-on dans le parcours */}
        <div className="wrap mt-3 lg:mt-4 pb-1">
          <div className="relative flex items-center">
            <div className="absolute inset-x-0 top-1.5 h-px bg-ink/12" />
            <motion.div className="absolute left-0 top-1.5 h-px bg-ink" style={{ width: bar }} />
            <ol className="relative w-full grid grid-cols-4">
              {cycles.map((c, i) => (
                <li key={c.id} className="flex flex-col items-start gap-2">
                  <span className={`w-3 h-3 rounded-full border-2 border-salt transition-colors duration-500 ${i <= active ? 'bg-ink' : 'bg-sea'}`} />
                  <span className={`text-[13px] lg:text-sm transition-colors duration-500 ${i === active ? 'text-ink font-semibold' : 'text-mute'} ${i === active ? '' : 'hidden sm:block'}`}>{c.title}<span className="hidden lg:inline"> · {c.ages}</span></span>
                </li>
              ))}
            </ol>
          </div>
          <Link to="/programmes" className="md:hidden ulink font-semibold inline-block mt-5 text-sm">{t.ui.seePrograms}</Link>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Ouverture — Cambridge : orbites des langues + carte inclinable      */
/* ------------------------------------------------------------------ */
export const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 18);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 18);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className="will-change-transform">
      {children}
    </motion.div>
  );
};

export const Openness = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const cambridge = [
    { icon: BookOpen, title: fr ? 'Trilinguisme' : 'Trilingualism', desc: fr ? 'Immersion et maîtrise de la langue anglaise, dès la maternelle.' : 'Immersion and mastery of English, from preschool.' },
    { icon: Brain, title: fr ? 'Pensée critique' : 'Critical thinking', desc: fr ? 'Analyser, argumenter, résoudre : la méthode Cambridge au quotidien.' : 'Analyse, argue, solve: the Cambridge method every day.' },
    { icon: Palette, title: fr ? 'Créativité' : 'Creativity', desc: fr ? 'Projets, expression personnelle et innovation encouragés.' : 'Projects, self-expression and innovation encouraged.' },
    { icon: Trophy, title: fr ? 'Certifications' : 'Certifications', desc: fr ? 'Des diplômes d’anglais reconnus par les universités du monde entier.' : 'English qualifications recognised by universities worldwide.' },
  ];
  const [hovered, setHovered] = useState<number | null>(null);
  const orbits = [
    { label: 'FR', name: 'Français', r: 'w-[74%]', dur: 22, delay: 0 },
    { label: 'EN', name: 'English', r: 'w-[90%]', dur: 30, delay: -10 },
    { label: 'AR', name: 'العربية', r: 'w-[104%]', dur: 40, delay: -25 },
  ];
  return (
    <section className="relative bg-ink text-salt on-dark overflow-hidden grain">
      <div className="wrap section">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-8 items-center">
          {/* Texte */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Chapter saffron className="mb-6">{fr ? 'Partenariat stratégique' : 'Strategic partnership'}</Chapter>
            <h2 className="t-h1 max-w-[12ch]"><WordReveal text={t.copy.cambridgeTitle} /></h2>
            <Reveal delay={0.15}><p className="t-lead text-sea mt-8 max-w-[42ch]">
              {fr ? 'L’Académie intègre progressivement le programme Cambridge : une éducation aux standards mondiaux, qui cultive le trilinguisme et la pensée critique.' : 'The Academy is progressively integrating the Cambridge programme: an education to global standards, cultivating trilingualism and critical thinking.'}
            </p></Reveal>
            <ol className="mt-12 border-t border-white/12">
              {cambridge.map((c, i) => (
                <Reveal key={i} delay={0.1 + i * 0.08} as="li" className="group border-b border-white/12" amount={0.5}>
                  <button onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(i)} className="w-full text-left py-5 flex items-center gap-5">
                    <span className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border transition-all duration-500 ${hovered === i ? 'bg-saffron border-saffron text-ink' : 'border-white/20 text-saffron'}`}><c.icon size={18} /></span>
                    <span className="flex-1 min-w-0">
                      <span className="block t-h4">{c.title}</span>
                      <motion.span className="block text-sea-2 text-sm overflow-hidden" initial={false} animate={{ height: hovered === i ? 'auto' : 0, opacity: hovered === i ? 1 : 0 }} transition={{ duration: 0.45, ease: EASE }}>
                        <span className="block pt-1">{c.desc}</span>
                      </motion.span>
                    </span>
                    <span className="hidden sm:block w-16 h-px bg-white/15 relative overflow-hidden shrink-0"><motion.span className="absolute inset-y-0 left-0 bg-saffron" initial={false} animate={{ width: hovered === i ? '100%' : '0%' }} transition={{ duration: 0.6, ease: EASE }} /></span>
                  </button>
                </Reveal>
              ))}
            </ol>
            <div className="mt-10"><Button to="/partenaires" variant="saffron">{fr ? 'Découvrir nos partenaires' : 'Discover our partners'}</Button></div>
          </div>

          {/* Système d'orbites */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center" style={{ perspective: '1200px' }}>
            <Reveal className="relative w-[min(78vw,520px)] aspect-square" delay={0.2}>
              {/* Anneaux */}
              {orbits.map((o, i) => (
                <div key={i} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${o.r} aspect-square rounded-full border border-white/12`} aria-hidden />
              ))}
              {/* Satellites : une langue par orbite, rotation continue (transform uniquement) */}
              {orbits.map((o, i) => (
                <div key={i} className={`absolute left-1/2 top-1/2 ${o.r} aspect-square orbit`} style={{ animationDuration: `${o.dur}s`, animationDelay: `${o.delay}s` }} aria-hidden>
                  <span className="absolute left-1/2 top-0 orbit-counter" style={{ animationDuration: `${o.dur}s`, animationDelay: `${o.delay}s` }}>
                    <span className="flex items-center gap-2 rounded-none bg-ink border border-white/20 pl-1 pr-3 py-1 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
                      <span className="w-7 h-7 rounded-full bg-saffron text-ink text-[11px] font-bold flex items-center justify-center">{o.label}</span>
                      <span className="text-sm font-medium text-salt">{o.name}</span>
                    </span>
                  </span>
                </div>
              ))}
              {/* Carte Cambridge */}
              <div className="absolute inset-[22%] flex items-center justify-center">
                <TiltCard>
                  <div className="rounded-none bg-white p-8 md:p-10 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.7)] ring-1 ring-white/20">
                    <img src={SITE.cambridgeLogo} alt="Cambridge Assessment International Education" className="w-full h-auto" loading="lazy" referrerPolicy="no-referrer" />
                  </div>
                </TiltCard>
              </div>
              {/* Halo */}
              <div className="absolute inset-[30%] rounded-full bg-saffron/20 blur-3xl -z-10" aria-hidden />
            </Reveal>
          </div>
        </div>
      </div>

      {/* Écologie — le ruban vert relie les engagements */}
      <EcoRibbon />
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Ruban Vert — un ruban qui se dessine au défilement                  */
/* ------------------------------------------------------------------ */
const ECO_NODES = [
  { x: 130, y: 150, Icon: Leaf },
  { x: 440, y: 70, Icon: Sun },
  { x: 760, y: 170, Icon: Recycle },
  { x: 1070, y: 80, Icon: Droplets },
];
const ECO_PATH = 'M -40 120 C 60 120, 80 150, 130 150 S 300 60, 440 70 S 620 180, 760 170 S 950 70, 1070 80 S 1180 110, 1260 90';

const EcoRibbon = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const draw = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const [reached, setReached] = useState(0);
  useMotionValueEvent(draw, 'change', (v) => setReached(Math.floor(v * 4.6)));
  const items = [
    { title: fr ? 'Jardin pédagogique' : 'Educational garden', desc: fr ? 'Agriculture durable, compostage, biodiversité locale.' : 'Sustainable farming, composting, local biodiversity.' },
    { title: fr ? 'Énergie verte' : 'Green energy', desc: fr ? 'Énergies renouvelables et éclairage intelligent.' : 'Renewable energy and smart lighting.' },
    { title: fr ? 'Zéro déchet' : 'Zero waste', desc: fr ? 'Tri sélectif, recyclage du papier et du plastique.' : 'Sorting, paper and plastic recycling.' },
    { title: fr ? 'Eaux pluviales' : 'Rainwater', desc: fr ? 'Récupération pour l’arrosage des espaces verts.' : 'Harvested to water the green spaces.' },
  ];
  return (
    <div className="bg-leaf-2 relative overflow-hidden">
      <div className="wrap section">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <Chapter saffron className="mb-6">{t.academy.ecoRibbonLabel}</Chapter>
            <h2 className="t-h1 max-w-[12ch]"><WordReveal text={t.copy.ecoTitle} /></h2>
          </div>
          <Reveal className="lg:col-span-5" delay={0.15}>
            <p className="t-body text-sea max-w-[46ch]">{t.academy.ecoRibbonText1}</p>
            <Link to="/academie#ecologie" className="ulink font-semibold inline-block mt-4 text-salt">{fr ? 'Notre engagement en détail' : 'Our commitment in detail'}</Link>
          </Reveal>
        </div>

        {/* Ruban (desktop) */}
        <div ref={ref} className="hidden md:block relative mt-16">
          <svg viewBox="0 0 1220 240" className="w-full h-auto overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="eco-grad" x1="0" x2="1"><stop offset="0" stopColor="#7FBF9A" /><stop offset="1" stopColor="#E8B04B" /></linearGradient>
            </defs>
            <path d={ECO_PATH} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="14" strokeLinecap="round" />
            <motion.path d={ECO_PATH} fill="none" stroke="url(#eco-grad)" strokeWidth="14" strokeLinecap="round" style={{ pathLength: reduce ? 1 : draw }} />
          </svg>
          {ECO_NODES.map((n, i) => {
            const on = reduce || reached > i;
            return (
              <div key={i} className="absolute" style={{ left: `${(n.x / 1220) * 100}%`, top: `${(n.y / 240) * 100}%`, transform: 'translate(-50%, -50%)' }}>
                <motion.div className="flex flex-col items-center" initial={false} animate={{ scale: on ? 1 : 0.6, opacity: on ? 1 : 0.35 }} transition={{ duration: 0.6, ease: EASE }}>
                  <span className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-leaf-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] transition-colors duration-500 ${on ? 'bg-saffron text-ink' : 'bg-leaf text-salt'}`}><n.Icon size={22} /></span>
                  <span className={`mt-3 text-center w-[190px] ${n.y > 120 ? '' : ''}`}>
                    <span className="block font-semibold text-salt">{items[i].title}</span>
                    <span className="block text-sea-2 text-sm mt-0.5">{items[i].desc}</span>
                  </span>
                </motion.div>
              </div>
            );
          })}
          <div className="h-28" aria-hidden />
        </div>

        {/* Mobile : tige verticale */}
        <div className="md:hidden relative mt-12 pl-10">
          <div className="absolute left-3 top-2 bottom-2 w-1 rounded-full bg-white/12 overflow-hidden" aria-hidden>
            <motion.div className="w-full bg-gradient-to-b from-[#7FBF9A] to-saffron origin-top" initial={reduce ? false : { scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.6, ease: EASE }} style={{ height: '100%' }} />
          </div>
          <ol className="space-y-8">
            {items.map((it, i) => {
              const Ico = ECO_NODES[i].Icon;
              return (
                <Reveal key={i} as="li" delay={0.1 * i} amount={0.6} className="relative">
                  <span className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-saffron text-ink flex items-center justify-center border-4 border-leaf-2"><Ico size={14} /></span>
                  <p className="font-semibold text-salt">{it.title}</p>
                  <p className="text-sea-2 text-sm mt-1">{it.desc}</p>
                </Reveal>
              );
            })}
          </ol>
        </div>

        {/* Photo + label */}
        <div className="grid lg:grid-cols-12 gap-8 items-center mt-16 lg:mt-20">
          <div className="lg:col-span-5">
            <ClipReveal className="img-arch aspect-[4/5]" from="left">
              <img src={IMG.eco} alt="Label Ruban Vert — Georges Claude Private Academy" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </ClipReveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="t-num text-saffron"><Counter to={1} suffix={fr ? 'ère' : 'st'} /></p>
            <p className="t-h3 mt-3 max-w-[18ch]">{fr ? 'école labellisée Ruban Vert à El Jadida.' : 'Green Ribbon certified school in El Jadida.'}</p>
            <Reveal delay={0.1}><p className="t-body text-sea mt-6 max-w-[54ch]">{t.academy.ecoRibbonText2}</p></Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Activités — liste interactive : survol = image (desktop)            */
/* ------------------------------------------------------------------ */
export const Activities = () => {
  const { t } = useLanguage();
  const ICONS = [Trophy, Palette, Drama, Bot, Crown, Swords, Waves, Cpu];
  const items = [1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => ({ title: t.activities[`a${n}`].title, desc: t.activities[`a${n}`].desc, img: IMG.activities[i], Icon: ICONS[i] }));
  const [active, setActive] = useState(0);
  const isDesktop = useMedia('(min-width: 1024px)');
  return (
    <section className="section bg-salt overflow-hidden">
      <div className="wrap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Chapter className="mb-6">{t.activities.extracurricular} {t.activities.parascolaires.toLowerCase()}</Chapter>
            <h2 className="t-h2 max-w-[14ch]"><WordReveal text={t.copy.activitiesTitle} /></h2>
          </div>
          <Reveal delay={0.15}><p className="t-body text-mute max-w-[44ch]">{t.copy.activitiesDesc}</p></Reveal>
        </div>

        {isDesktop ? (
          <div className="grid grid-cols-12 gap-10">
            <ul className="col-span-7 divide-y divide-ink/12 border-y border-ink/12" onMouseLeave={() => {}}>
              {items.map((it, i) => (
                <li key={i}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={`w-full text-left py-5 flex items-center justify-between gap-6 transition-colors ${active === i ? 'text-ink' : 'text-ink/55 hover:text-ink'}`}
                  >
                    <span className="flex items-center gap-5">
                      <span className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-colors ${active === i ? 'bg-ink text-saffron border-ink' : 'border-ink/15'}`}><it.Icon size={18} /></span>
                      <span className="t-h3">{it.title}</span>
                    </span>
                    <span className={`t-small max-w-[30ch] text-right transition-opacity ${active === i ? 'opacity-100 text-mute' : 'opacity-0'}`}>{it.desc}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="col-span-5 sticky top-28 self-start">
              <div className="img-arch aspect-[4/5] relative">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={active}
                    src={items[active].img}
                    alt={items[active].title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-ink/12 border-y border-ink/12">
            {items.map((it, i) => {
              const open = active === i;
              return (
                <li key={i}>
                  <button onClick={() => setActive(open ? -1 : i)} className="w-full text-left py-4 flex items-center justify-between gap-4" aria-expanded={open}>
                    <span className="flex items-center gap-4"><span className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors ${open ? 'bg-ink text-saffron border-ink' : 'border-ink/15 text-ink/60'}`}><it.Icon size={16} /></span><span className={`t-h3 transition-colors ${open ? 'text-ink' : 'text-ink/60'}`}>{it.title}</span></span>
                    <span className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500 ${open ? 'bg-saffron border-saffron rotate-45' : 'border-ink/20'}`}><span className="text-lg leading-none">+</span></span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div key="c" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.55, ease: EASE }} className="overflow-hidden">
                        <div className="pb-6">
                          <div className="img-frame aspect-[16/10]"><img src={it.img} alt={it.title} loading="lazy" referrerPolicy="no-referrer" /></div>
                          <p className="t-body text-mute mt-4">{it.desc}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Environnement — exploration du campus : image fixe qui change au    */
/* défilement de la liste des lieux (scrollytelling).                   */
/* ------------------------------------------------------------------ */
const CampusItem = ({ item, index, onActive }: { item: any; index: number; onActive: (i: number) => void }) => {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: '-42% 0px -42% 0px' });
  useEffect(() => { if (inView) onActive(index); }, [inView, index, onActive]);
  return (
    <li ref={ref} className="min-h-[52svh] lg:min-h-[70vh] flex items-center">
      <motion.div initial={false} animate={{ opacity: inView ? 1 : 0.28, x: inView ? 0 : -8 }} transition={{ duration: 0.6, ease: EASE }} className="w-full">
        <p className="text-sm text-saffron mb-4">{String(index + 1).padStart(2, '0')}</p>
        <h3 className="t-h2">{item.title}</h3>
        <p className="t-body text-sea mt-4 max-w-[40ch]">{item.desc}</p>
        <div className="mt-6 flex items-end gap-8">
          <div><p className="t-num text-saffron">{item.stat}</p><p className="t-small text-sea-2 mt-1">{item.statLabel}</p></div>
        </div>
        <Link to={item.to} className="inline-flex items-center gap-1.5 mt-6 font-semibold ulink text-salt">{item.cta} <ArrowUpRight size={16} /></Link>
      </motion.div>
    </li>
  );
};

export const LifeTeaser = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const items = [
    { title: fr ? 'Infrastructures sportives' : 'Sports facilities', desc: fr ? 'Piscine semi-olympique, terrain synthétique homologué, gymnase omnisports et salle de fitness : plus de 15 disciplines pratiquées dans des conditions professionnelles.' : 'Semi-Olympic pool, approved synthetic pitch, multi-sport gym and fitness room: more than 15 disciplines in professional conditions.', stat: '15+', statLabel: fr ? 'disciplines' : 'disciplines', image: IMG.sport, to: '/espaces/sports', cta: t.ui.spacesLink },
    { title: fr ? 'Laboratoires de sciences' : 'Science laboratories', desc: fr ? 'Physique, chimie, SVT et un espace robotique avec drones, imprimantes 3D et robots programmables : expérimenter, mesurer, se tromper et recommencer.' : 'Physics, chemistry, life sciences and a robotics space with drones, 3D printers and programmable robots: experiment, measure, fail and try again.', stat: '4', statLabel: fr ? 'laboratoires' : 'laboratories', image: IMG.lab, to: '/espaces/labs', cta: t.ui.spacesLink },
    { title: fr ? 'Médiathèque' : 'Media library', desc: fr ? 'Un lieu calme pour lire, chercher et travailler ensemble, avec un fonds trilingue et des ressources numériques.' : 'A quiet place to read, research and work together, with a trilingual collection and digital resources.', stat: '15 000', statLabel: fr ? 'ouvrages en trois langues' : 'books in three languages', image: IMG.library, to: '/espaces/library', cta: t.ui.spacesLink },
    { title: fr ? 'Cantine' : 'Canteen', desc: fr ? 'Des repas préparés sur place avec des produits frais, sous contrôle HACCP, des menus équilibrés adaptés à chaque âge.' : 'Meals prepared on site with fresh produce, under HACCP control, balanced menus adapted to each age.', stat: 'HACCP', statLabel: fr ? 'normes d’hygiène respectées' : 'hygiene standards met', image: IMG.canteen, to: '/vie-scolaire', cta: t.life.discoverMore },
    { title: fr ? 'Salles de classe' : 'Classrooms', desc: fr ? 'Lumineuses, équipées, pensées pour 25 élèves au maximum : l’enseignant connaît chaque enfant.' : 'Bright, equipped, designed for 25 students at most: the teacher knows every child.', stat: '25', statLabel: fr ? 'élèves maximum par classe' : 'students maximum per class', image: IMG.classroom, to: '/programmes', cta: t.ui.seePrograms },
    { title: fr ? 'Cour & jardin pédagogique' : 'Playground & garden', desc: fr ? 'Des espaces extérieurs sûrs pour jouer, et un jardin où l’on apprend l’agriculture durable — première école Ruban Vert d’El Jadida.' : 'Safe outdoor spaces to play, and a garden to learn sustainable farming — El Jadida’s first Green Ribbon school.', stat: '1ère', statLabel: fr ? 'école Ruban Vert d’El Jadida' : 'Green Ribbon school in El Jadida', image: IMG.spaces[0], to: '/academie#ecologie', cta: fr ? 'Notre engagement' : 'Our commitment' },
  ];
  const [active, setActive] = useState(0);
  const onActive = useCallback((i: number) => setActive(i), []);
  const reduce = useReducedMotion();
  return (
    <section className="bg-ink text-salt on-dark grain relative">
      {/* En-tête */}
      <div className="wrap pt-[var(--section)] pb-10 lg:pb-14">
        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7">
            <Chapter saffron className="mb-6">{t.nav.life}</Chapter>
            <h2 className="t-h1 max-w-[12ch]"><WordReveal text={t.copy.lifeTitle} /></h2>
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.15}>
            <p className="t-body text-sea max-w-[40ch]">{t.ui.lifeTeaserDesc}</p>
            <Link to="/vie-scolaire" className="ulink font-semibold inline-block mt-4 text-salt">{t.life.discoverMore}</Link>
          </Reveal>
        </div>
      </div>

      {/* Moitié texte / moitié image, pleine largeur */}
      <div className="lg:grid lg:grid-cols-2">
        {/* Image : pleine hauteur, collée à l'écran, change avec le lieu actif */}
        <div className="sticky top-0 lg:top-0 z-20 lg:order-2 h-[42svh] lg:h-screen bg-ink">
          <div className="relative h-full w-full overflow-hidden">
            <AnimatePresence mode="sync" initial={false}>
              <motion.img
                key={active}
                src={items[active].image}
                alt={items[active].title}
                className="absolute inset-0 w-full h-full object-cover"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.7, ease: EASE }, scale: { duration: 6, ease: 'linear' } }}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 lg:p-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-sea text-sm">{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</p>
                <p className="t-h4 mt-1">{items[active].title}</p>
              </div>
              <ol className="flex gap-1.5" aria-hidden>
                {items.map((_, i) => <li key={i} className={`h-1 transition-all duration-500 ${i === active ? 'w-8 bg-saffron' : 'w-3 bg-white/40'}`} />)}
              </ol>
            </div>
          </div>
        </div>
        {/* Texte : la liste des lieux, sur la moitié gauche */}
        <ol className="lg:order-1 px-[var(--gutter)] lg:pr-16 lg:pl-[var(--gutter)] pb-[var(--section)]">
          {items.map((it, i) => <CampusItem key={i} item={it} index={i} onActive={onActive} />)}
        </ol>
      </div>
    </section>
  );
};
