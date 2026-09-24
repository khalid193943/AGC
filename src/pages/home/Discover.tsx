import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useTransform, useReducedMotion, AnimatePresence, useMotionValueEvent, useMotionValue, useSpring, useScroll, useInView, MotionValue } from 'motion/react';
import { ArrowUpRight, BookOpen, Brain, Palette, Trophy, Leaf, Sun, Recycle, Droplets, Puzzle, Compass, GraduationCap, Drama, Bot, Crown, Swords, Waves, Cpu } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SITE, IMG } from '../../content/site';
import { WordReveal, Reveal, useHorizontalPin, ClipReveal, Counter, EASE } from '../../components/ui/motion';
import { Button, Chapter, useMedia } from '../../components/ui';
import { SectionHead } from '../../components/sections';

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

/* ------------------------------------------------------------------ */
/* Programmes — index sobre et sombre des quatre cycles                */
/* ------------------------------------------------------------------ */
export const Programs = () => {
  const { t } = useLanguage();
  const cycles = CYCLES(t);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  return (
    <section className="section bg-ink text-salt on-dark grain relative overflow-hidden">
      <div className="wrap">
        <SectionHead dark chapter={`${t.programs.curriculum} — ${t.copy.programsRail}`} title={t.copy.programsTitle} lead={t.copy.programsDesc} />
        <div className="grid lg:grid-cols-12 gap-10 mt-14 items-start">
          {/* Image du cycle survolé (la première par défaut) */}
          <div className="lg:col-span-5 lg:order-2 lg:sticky lg:top-24">
            <div className="relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden bg-white/5 ring-1 ring-white/10">
              <AnimatePresence mode="sync" initial={false}>
                <motion.img
                  key={cycles[active].id}
                  src={cycles[active].image}
                  alt={cycles[active].title}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ opacity: { duration: 0.6, ease: EASE }, scale: { duration: 1.6, ease: EASE } }}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="absolute left-5 bottom-5 right-5 flex items-end justify-between gap-4">
                <span><span className="block text-saffron text-xs font-semibold">{String(active + 1).padStart(2, '0')} / 04</span><span className="block font-display font-medium text-2xl leading-none mt-1">{cycles[active].title}</span></span>
                <span className="text-sea text-sm">{t.ui.cycleFor} {cycles[active].ages}</span>
              </div>
            </div>
          </div>
          {/* Index des cycles */}
          <ol className="lg:col-span-7 lg:order-1 border-t border-white/12" onMouseLeave={() => setActive(active)}>
            {cycles.map((c, i) => {
              const st = CYCLE_STYLE[c.id];
              const on = active === i;
              return (
                <Reveal key={c.id} as="li" delay={0.08 * i} amount={0.4} className="border-b border-white/12">
                  <Link to={`/programmes/${c.id}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onTouchStart={() => setActive(i)} className={`group grid grid-cols-[auto_1fr_auto] items-center gap-5 md:gap-8 py-6 md:py-7 transition-colors -mx-4 px-4 ${on ? 'bg-white/[0.04]' : ''}`}>
                    <span className={`font-display text-sm md:text-base transition-colors ${on ? 'text-saffron' : 'text-sea-2'}`}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex items-center gap-4 min-w-0">
                      <span className={`hidden sm:flex w-11 h-11 rounded-full items-center justify-center shrink-0 transition-transform duration-500 ${st.icon} ${on ? 'scale-100' : 'scale-90 opacity-70'}`}><st.Icon size={18} /></span>
                      <span className="min-w-0">
                        <span className={`block font-display font-medium text-[clamp(1.5rem,2.4vw,2.4rem)] leading-none tracking-tight transition-colors ${on ? 'text-salt' : 'text-salt/60'}`}>{c.title}</span>
                        <span className="block text-sea-2 text-sm mt-1.5">{t.ui.cycleFor} {c.ages}</span>
                        <motion.span className="block text-sea text-[15px] overflow-hidden" initial={false} animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }}><span className="block pt-2 max-w-[44ch]">{c.desc}</span></motion.span>
                      </span>
                    </span>
                    <span className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-500 ${on ? 'bg-saffron text-ink border-saffron' : 'border-white/20 text-salt'}`}><ArrowUpRight size={18} /></span>
                  </Link>
                </Reveal>
              );
            })}
          </ol>
        </div>
        <Reveal delay={0.3} className="mt-10"><Button to="/programmes" variant="saffron">{t.ui.seePrograms}</Button></Reveal>
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
    { icon: BookOpen, title: fr ? 'Trilinguisme' : 'Trilingualism' },
    { icon: Brain, title: fr ? 'Pensée critique' : 'Critical thinking' },
    { icon: Palette, title: fr ? 'Créativité' : 'Creativity' },
    { icon: Trophy, title: fr ? 'Certifications reconnues' : 'Recognised certifications' },
  ];
  const eco = [
    { Icon: Leaf, title: fr ? 'Jardin pédagogique' : 'Educational garden' },
    { Icon: Sun, title: fr ? 'Énergie verte' : 'Green energy' },
    { Icon: Recycle, title: fr ? 'Zéro déchet' : 'Zero waste' },
    { Icon: Droplets, title: fr ? 'Eaux pluviales' : 'Rainwater' },
  ];
  return (
    <section className="grid lg:grid-cols-2 text-salt on-dark">
      {/* Cambridge — encre */}
      <div className="bg-ink grain relative overflow-hidden">
        <div className="px-[var(--gutter)] py-[var(--section)] lg:pr-16 h-full flex flex-col">
          <Chapter saffron className="mb-5">{fr ? 'Partenariat stratégique' : 'Strategic partnership'}</Chapter>
          <h2 className="t-h2"><WordReveal text={t.copy.cambridgeTitle} /></h2>
          <Reveal delay={0.1}><p className="t-body text-sea mt-5 max-w-[48ch]">{fr ? 'L’Académie intègre progressivement le programme Cambridge : une éducation aux standards mondiaux, en trois langues.' : 'The Academy is progressively integrating the Cambridge programme: an education to global standards, in three languages.'}</p></Reveal>
          <Reveal delay={0.2} className="mt-10 flex items-center gap-6">
            <div className="bg-white p-5 w-[150px] shrink-0 ring-1 ring-white/20"><img src={SITE.cambridgeLogo} alt="Cambridge Assessment International Education" className="w-full h-auto" loading="lazy" referrerPolicy="no-referrer" /></div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {cambridge.map((c) => <li key={c.title} className="flex items-center gap-2.5 text-[15px]"><c.icon size={16} className="text-saffron shrink-0" />{c.title}</li>)}
            </ul>
          </Reveal>
          <div className="mt-auto pt-10"><Button to="/partenaires" variant="saffron">{fr ? 'Découvrir nos partenaires' : 'Discover our partners'}</Button></div>
        </div>
      </div>
      {/* Ruban Vert — vert */}
      <div className="bg-leaf-2 grain relative overflow-hidden">
        <div className="px-[var(--gutter)] py-[var(--section)] lg:pl-16 h-full flex flex-col">
          <Chapter saffron className="mb-5">{t.academy.ecoRibbonLabel}</Chapter>
          <div className="flex items-end gap-4">
            <span className="font-display font-medium text-saffron leading-none text-[clamp(5rem,9vw,8.5rem)] tracking-tight"><Counter to={1} /></span>
            <span className="pb-3 font-display font-medium text-saffron text-[clamp(1.4rem,2vw,2rem)] leading-none">{fr ? 'ère' : 'st'}</span>
          </div>
          <h2 className="t-h2 mt-3"><WordReveal text={fr ? 'école Ruban Vert d’El Jadida.' : 'Green Ribbon school in El Jadida.'} /></h2>
          <Reveal delay={0.1}><p className="t-body text-sea mt-5 max-w-[48ch]">{t.academy.ecoRibbonText1}</p></Reveal>
          <Reveal delay={0.2} className="mt-10">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {eco.map((e) => <li key={e.title} className="flex items-center gap-2.5 text-[15px]"><e.Icon size={16} className="text-saffron shrink-0" />{e.title}</li>)}
            </ul>
          </Reveal>
          <div className="mt-auto pt-10"><Link to="/academie#ecologie" className="btn btn-ghost-light">{fr ? 'Notre engagement en détail' : 'Our commitment in detail'}</Link></div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Activités — liste interactive : survol = image (desktop)            */
/* ------------------------------------------------------------------ */
export const Activities = () => {
  const { t } = useLanguage();
  const ICONS = [Trophy, Palette, Drama, Bot, Crown, Swords, Waves, Cpu];
  const items = [1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => ({ title: t.activities[`a${n}`].title, desc: t.activities[`a${n}`].desc, img: IMG.activities[i], Icon: ICONS[i], n: i + 1 }));
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isDesktop = useMedia('(min-width: 1024px)');
  // Deux rangées de huit vignettes (largeur ≈ 2 écrans) qui glissent en sens opposés : jamais de vide, toutes visibles
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 24 });
  const xTop = useTransform(p, [0, 1], ['0vw', '-98vw']);
  const xBottom = useTransform(p, [0, 1], ['-98vw', '0vw']);
  const Card = ({ it }: { it: (typeof items)[number] }) => (
    <li className="group w-full lg:w-[23vw] shrink-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-sea/40">
        <img src={it.img} alt={it.title} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
        <span className="absolute top-4 left-4 w-9 h-9 rounded-full bg-salt/90 text-ink flex items-center justify-center"><it.Icon size={15} strokeWidth={1.8} /></span>
        <span className="absolute bottom-4 right-4 font-display text-[11px] text-salt/90 tracking-wide">{String(it.n).padStart(2, '0')}</span>
      </div>
      <div className="pt-4">
        <h3 className="t-h4">{it.title}</h3>
        <p className="t-small text-mute mt-1 line-clamp-2">{it.desc}</p>
      </div>
    </li>
  );
  const rowTop = items;
  const rowBottom = [...items.slice(4), ...items.slice(0, 4)];
  return (
    <section ref={ref} className="section bg-salt overflow-hidden">
      <div className="wrap">
        <SectionHead chapter={`${t.activities.extracurricular} ${t.activities.parascolaires.toLowerCase()}`} title={t.copy.activitiesTitle} lead={t.copy.activitiesDesc} className="mb-14" />
      </div>
      {isDesktop && !reduce ? (
        <div className="space-y-10">
          <motion.ul className="flex gap-[1.5vw] w-max pl-[var(--gutter)] will-change-transform" style={{ x: xTop }}>{rowTop.map((it) => <Card key={'t' + it.n} it={it} />)}</motion.ul>
          <motion.ul className="flex gap-[1.5vw] w-max pl-[var(--gutter)] will-change-transform" style={{ x: xBottom }}>{rowBottom.map((it) => <Card key={'b' + it.n} it={it} />)}</motion.ul>
        </div>
      ) : (
        <div className="wrap"><ul className="grid grid-cols-2 gap-x-5 gap-y-10">{items.map((it) => <Card key={it.n} it={it} />)}</ul></div>
      )}
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
        <SectionHead dark chapter={t.nav.life} title={t.copy.lifeTitle} lead={t.ui.lifeTeaserDesc} />
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
