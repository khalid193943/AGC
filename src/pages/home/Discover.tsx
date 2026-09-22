import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useTransform, useReducedMotion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, BookOpen, Brain, Palette, Trophy, Leaf, Sun, Recycle, Droplets } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SITE, IMG } from '../../content/site';
import { WordReveal, Reveal, useSmoothProgress, useTrackDistance, ClipReveal, EASE } from '../../components/ui/motion';
import { Button, Chapter, useMedia } from '../../components/ui';
import { SPACES } from '../../content/site';

export const CYCLES = (t: any) => [
  { id: 'maternelle', title: t.programs.p1.title, desc: t.programs.p1.desc, features: t.programs.p1.features, image: IMG.cycles.maternelle, ages: t.ui.cycleAges.maternelle },
  { id: 'primaire', title: t.programs.p2.title, desc: t.programs.p2.desc, features: t.programs.p2.features, image: IMG.cycles.primaire, ages: t.ui.cycleAges.primaire },
  { id: 'college', title: t.programs.p3.title, desc: t.programs.p3.desc, features: t.programs.p3.features, image: IMG.cycles.college, ages: t.ui.cycleAges.college },
  { id: 'lycee', title: t.programs.p4.title, desc: t.programs.p4.desc, features: t.programs.p4.features, image: IMG.cycles.lycee, ages: t.ui.cycleAges.lycee },
];

const CycleCard = ({ c, t, index }: { c: any; t: any; index: number }) => (
  <Link to={`/programmes/${c.id}`} className="group block w-[82vw] sm:w-[440px] lg:w-[min(480px,32vw)] shrink-0">
    <div className="img-arch img-zoom aspect-[4/5] lg:aspect-auto lg:h-[clamp(200px,36vh,440px)]">
      <img src={c.image} alt={`${c.title} — ${SITE.name}`} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
    </div>
    <div className="pt-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="t-h3">{c.title}</h3>
        <span className="text-mute text-sm whitespace-nowrap">{t.ui.cycleFor} {c.ages} · {index + 1}/4</span>
      </div>
      <p className="t-body text-mute mt-2 max-w-[38ch]">{c.desc}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {c.features.map((f: string) => (
          <li key={f} className="text-[13px] font-medium rounded-full border border-ink/15 px-3 py-1">{f}</li>
        ))}
      </ul>
      <span className="inline-flex items-center gap-1.5 mt-5 font-semibold ulink">{t.programs.programDetailsBtn} <ArrowUpRight size={16} /></span>
    </div>
  </Link>
);

/* ------------------------------------------------------------------ */
/* Programmes — section épinglée, défilement horizontal (desktop)      */
/* ------------------------------------------------------------------ */
export const Programs = () => {
  const { t } = useLanguage();
  const cycles = CYCLES(t);
  const isDesktop = useMedia('(min-width: 1024px)');
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useSmoothProgress(ref);
  const distance = useTrackDistance(trackRef, [isDesktop, reduce]);
  const x = useTransform(progress, [0.05, 0.95], [0, -distance]);
  const bar = useTransform(progress, [0, 1], ['0%', '100%']);

  const header = (
    <div className="wrap">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Chapter className="mb-4">{t.programs.curriculum}</Chapter>
          <h2 className="t-h2 max-w-[14ch]"><WordReveal text={t.ui.programsTitle} /></h2>
        </div>
        <Reveal delay={0.15} className="max-w-[44ch]">
          <p className="t-body text-mute">{t.ui.programsDesc}</p>
          <Link to="/programmes" className="ulink font-semibold inline-block mt-4">{t.ui.seePrograms}</Link>
        </Reveal>
      </div>
    </div>
  );

  if (!isDesktop || reduce) {
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
    <section ref={ref} className="relative bg-salt" style={{ height: '280vh' }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden" style={{ paddingTop: 'calc(var(--header-h) * 0.5)' }}>
        <div className="pb-8">{header}</div>
        <motion.div ref={trackRef} className="flex gap-10 pl-[var(--gutter)] will-change-transform" style={{ x }}>
          {cycles.map((c, i) => <CycleCard key={c.id} c={c} t={t} index={i} />)}
          <div className="w-[var(--gutter)] shrink-0" aria-hidden />
        </motion.div>
        <div className="wrap mt-6 flex items-center gap-3 text-sm text-mute">
          <span className="w-24 h-px bg-ink/15 relative overflow-hidden"><motion.span className="absolute inset-y-0 left-0 bg-ink" style={{ width: bar }} /></span>
          {t.ui.dragHint}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Ouverture — Cambridge + engagement écologique                       */
/* ------------------------------------------------------------------ */
export const Openness = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const cambridge = [
    { icon: BookOpen, title: fr ? 'Trilinguisme' : 'Trilingualism', desc: fr ? 'Immersion et maîtrise de la langue anglaise' : 'Immersion and mastery of English' },
    { icon: Brain, title: fr ? 'Pensée critique' : 'Critical thinking', desc: fr ? 'Analyse, réflexion et logique' : 'Analysis, reflection and logic' },
    { icon: Palette, title: fr ? 'Créativité' : 'Creativity', desc: fr ? 'Innovation et expression personnelle' : 'Innovation and self-expression' },
    { icon: Trophy, title: fr ? 'Certifications' : 'Certifications', desc: fr ? 'Diplômes reconnus mondialement' : 'Globally recognised qualifications' },
  ];
  const eco = [
    { icon: Leaf, title: fr ? 'Jardin pédagogique' : 'Educational garden', desc: fr ? 'Agriculture durable, compostage, biodiversité locale.' : 'Sustainable farming, composting, local biodiversity.' },
    { icon: Sun, title: fr ? 'Énergie verte' : 'Green energy', desc: fr ? 'Énergies renouvelables et éclairage intelligent.' : 'Renewable energy and smart lighting.' },
    { icon: Recycle, title: fr ? 'Zéro déchet' : 'Zero waste', desc: fr ? 'Tri sélectif, recyclage du papier et du plastique.' : 'Sorting, paper and plastic recycling.' },
    { icon: Droplets, title: fr ? 'Eaux pluviales' : 'Rainwater', desc: fr ? 'Récupération pour l’arrosage des espaces verts.' : 'Harvested to water the green spaces.' },
  ];
  return (
    <section className="relative bg-ink text-salt on-dark overflow-hidden grain">
      {/* Cambridge */}
      <div className="wrap section">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Chapter saffron className="mb-6">{fr ? 'Partenariat stratégique' : 'Strategic partnership'}</Chapter>
            <h2 className="t-h2 max-w-[16ch]"><WordReveal text={fr ? 'Le programme Cambridge, une ouverture sur le monde.' : 'The Cambridge programme, a window on the world.'} /></h2>
            <Reveal delay={0.15}><p className="t-lead text-sea mt-8 max-w-[46ch]">
              {fr ? 'L’Académie intègre progressivement le programme Cambridge pour offrir une éducation répondant aux standards mondiaux, favorisant le trilinguisme et la pensée critique.' : 'The Academy is progressively integrating the Cambridge programme to offer an education that meets global standards, fostering trilingualism and critical thinking.'}
            </p></Reveal>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mt-12 max-w-2xl">
              {cambridge.map((c, i) => (
                <Reveal key={i} delay={0.1 + i * 0.06} className="flex gap-4">
                  <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0 text-saffron"><c.icon size={18} /></span>
                  <span><span className="block font-semibold">{c.title}</span><span className="block text-sea-2 text-sm mt-0.5">{c.desc}</span></span>
                </Reveal>
              ))}
            </div>
            <div className="mt-12"><Button to="/partenaires" variant="saffron">{fr ? 'Découvrir nos partenaires' : 'Discover our partners'}</Button></div>
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.2}>
            <div className="rounded-[2rem] bg-white p-10 md:p-14 flex items-center justify-center shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]">
              <img src={SITE.cambridgeLogo} alt="Cambridge Assessment International Education" className="w-full h-auto" loading="lazy" referrerPolicy="no-referrer" />
            </div>
          </Reveal>
        </div>
      </div>

      {/* Écologie */}
      <div className="bg-leaf-2">
        <div className="wrap section">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <ClipReveal className="img-frame aspect-[4/5]">
                <img src={IMG.eco} alt="Label Ruban Vert — Georges Claude Private Academy, première école écologique d’El Jadida" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </ClipReveal>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Chapter saffron className="mb-6">{t.academy.ecoRibbonLabel}</Chapter>
              <h2 className="t-h2 max-w-[14ch]"><WordReveal text={fr ? 'Première école Ruban Vert d’El Jadida.' : 'The first Green Ribbon school in El Jadida.'} /></h2>
              <Reveal delay={0.15}><p className="t-body text-sea mt-8 max-w-[56ch]">{t.academy.ecoRibbonText1}</p></Reveal>
              <div className="mt-10 grid sm:grid-cols-2 gap-6">
                {eco.map((e, i) => (
                  <Reveal key={i} delay={0.1 + i * 0.06} className="border-t border-white/15 pt-4">
                    <e.icon size={18} className="text-saffron mb-3" />
                    <p className="font-semibold">{e.title}</p>
                    <p className="text-sea-2 text-sm mt-1">{e.desc}</p>
                  </Reveal>
                ))}
              </div>
              <div className="mt-10"><Link to="/academie#ecologie" className="ulink font-semibold">{fr ? 'Notre engagement en détail' : 'Our commitment in detail'}</Link></div>
            </div>
          </div>
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
  const items = [1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => ({ title: t.activities[`a${n}`].title, desc: t.activities[`a${n}`].desc, img: IMG.activities[i] }));
  const [active, setActive] = useState(0);
  const isDesktop = useMedia('(min-width: 1024px)');
  return (
    <section className="section bg-salt overflow-hidden">
      <div className="wrap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Chapter className="mb-6">{t.activities.extracurricular} {t.activities.parascolaires.toLowerCase()}</Chapter>
            <h2 className="t-h2 max-w-[14ch]"><WordReveal text={t.activities.title} /></h2>
          </div>
          <Reveal delay={0.15}><p className="t-body text-mute max-w-[44ch]">{t.activities.desc}</p></Reveal>
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
                    <span className="flex items-baseline gap-6">
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
          <div className="snap-x -mx-[var(--gutter)]">
            {items.map((it, i) => (
              <div key={i} className="w-[72vw] sm:w-[320px]">
                <div className="img-frame aspect-[4/5]"><img src={it.img} alt={it.title} loading="lazy" referrerPolicy="no-referrer" /></div>
                <p className="t-h4 mt-4">{it.title}</p>
                <p className="t-small text-mute mt-1">{it.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Environnement — aperçu des espaces → Vie scolaire                   */
/* ------------------------------------------------------------------ */
export const LifeTeaser = () => {
  const { t, currentLang } = useLanguage();
  const spaces = Object.values(SPACES);
  return (
    <section className="section bg-salt-2/60">
      <div className="wrap">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-7">
            <Chapter className="mb-6">{t.nav.life}</Chapter>
            <h2 className="t-h2 max-w-[14ch]"><WordReveal text={t.ui.lifeTeaser} /></h2>
          </div>
          <Reveal className="lg:col-span-5" delay={0.15}>
            <p className="t-body text-mute max-w-[44ch]">{t.ui.lifeTeaserDesc}</p>
            <Link to="/vie-scolaire" className="ulink font-semibold inline-block mt-4">{t.life.discoverMore}</Link>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {spaces.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.08}>
              <Link to={`/espaces/${s.slug}`} className="group block">
                <div className={`img-frame img-zoom aspect-[16/10] md:aspect-[4/5] ${i === 1 ? '' : 'md:mt-10'}`}>
                  <img src={s.image} alt={s.title[currentLang]} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                </div>
                <div className="pt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="t-h4">{s.title[currentLang]}</p>
                    <p className="t-small text-mute mt-1 max-w-[34ch]">{s.intro[currentLang]}</p>
                  </div>
                  <span className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center shrink-0 group-hover:bg-ink group-hover:text-salt transition-colors"><ArrowUpRight size={16} /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
