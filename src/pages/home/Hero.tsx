import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Award, Leaf, ShieldCheck, Languages, Eye, Target, Sun, Users, CalendarDays, Sparkles, GraduationCap, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SITE, IMG } from '../../content/site';
import { WordReveal, Reveal, ClipReveal, Parallax, EASE } from '../../components/ui/motion';
import { Button, Marquee, ScrollHint } from '../../components/ui';
import { preloaderDelay } from '../../components/Preloader';
import { Crest } from '../../components/ui/Crest';

export const Hero = () => {
  const { t, currentLang } = useLanguage();
  const reduce = useReducedMotion();
  const d = preloaderDelay(); // 0 si l'écran d'ouverture a déjà été vu dans la session
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const facts = currentLang === 'FR'
    ? ['École homologuée par le Ministère de l’Éducation Nationale', 'Maternelle · Primaire · Collège · Lycée', 'Programme Cambridge', 'Enseignement trilingue FR · EN · AR', '25 élèves maximum par classe', 'Transport scolaire El Jadida & environs', 'Cantine sur place, produits frais', 'Inscriptions 2026-2027 ouvertes']
    : ['School accredited by the Ministry of National Education', 'Preschool · Primary · Middle · High School', 'Cambridge programme', 'Trilingual teaching FR · EN · AR', '25 students maximum per class', 'School transport El Jadida & surroundings', 'On-site canteen, fresh produce', 'Enrolment 2026-2027 open'];

  return (
    <>
      <section ref={ref} className="relative min-h-[100svh] bg-ink text-salt on-dark overflow-hidden">
        {/* Image de fond — révélée par clip-path, parallaxe au scroll */}
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.6, delay: d, ease: EASE }}
        >
          <motion.div className="absolute inset-0 will-change-transform" style={reduce ? undefined : { y: imgY }}>
            <motion.img
              src={IMG.school}
              alt="Georges Claude Private Academy, campus de Sidi Bouzid, El Jadida"
              className="w-full h-[115%] object-cover object-[70%_center]"
              initial={reduce ? false : { scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, delay: d, ease: EASE }}
              fetchPriority="high"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent" />
        </motion.div>


        {/* Contenu */}
        <motion.div className="wrap relative z-10 min-h-[100svh] flex flex-col justify-end pb-10 md:pb-14" style={reduce ? undefined : { y: textY, opacity: fade }} >
          <div style={{ paddingTop: 'calc(var(--header-h) + 3rem)' }} />
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-9">
              <motion.p
                className="text-sea text-[15px] md:text-base mb-8 flex flex-wrap items-center gap-x-3 gap-y-1"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: d + 0.6, ease: EASE }}
              >
                <span>{currentLang === 'FR' ? 'École privée homologuée' : 'Accredited private school'}</span>
                <span className="w-1 h-1 rounded-full bg-saffron" aria-hidden />
                <span>Sidi Bouzid · El Jadida</span>
                <span className="w-1 h-1 rounded-full bg-saffron" aria-hidden />
                <span className="text-saffron-2 font-semibold">{currentLang === 'FR' ? 'Inscriptions 2026-2027 ouvertes' : 'Enrolment 2026-2027 open'}</span>
              </motion.p>
              <h1 className="t-display max-w-[14ch]">
                <WordReveal text={t.copy.heroTitle} inView={false} delay={d + 0.45} stagger={0.045} />
              </h1>
              <motion.div
                className="mt-7"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: d + 1.2, ease: EASE }}
              >
                <p className="font-serif italic text-saffron-2 text-[clamp(1.15rem,1.7vw,1.5rem)] leading-snug">{SITE.motto[currentLang]}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {[
                    { Icon: GraduationCap, text: currentLang === 'FR' ? 'De 3 à 18 ans' : 'Ages 3 to 18' },
                    { Icon: Languages, text: currentLang === 'FR' ? 'Trilingue FR · EN · AR' : 'Trilingual FR · EN · AR' },
                    { Icon: Globe, text: currentLang === 'FR' ? 'Programme Cambridge' : 'Cambridge programme' },
                  ].map((f) => (
                    <li key={f.text} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/8 backdrop-blur-sm px-3.5 py-1.5 text-[14px] font-medium text-salt"><f.Icon size={15} className="text-saffron" />{f.text}</li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                className="mt-10 flex flex-wrap items-center gap-3"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: d + 1.4, ease: EASE }}
              >
                <Button to="/inscription" variant="saffron" size="lg">{t.ui.enroll}</Button>
                <Button to="/academie" variant="ghost-light" size="lg" icon="none">{t.ui.discoverAcademy}</Button>
              </motion.div>
            </div>

            {/* Preuves flottantes */}
            <motion.div
              className="lg:col-span-3 flex flex-row lg:flex-col gap-2 sm:gap-3 lg:items-end"
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: d + 1.3, ease: EASE }}
            >
              <motion.div className="hidden lg:block mb-3 mr-2" animate={reduce ? undefined : { y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}><Crest size={176} /></motion.div>
              <motion.div className="card-dark backdrop-blur-md px-3.5 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4 flex-1 lg:flex-none lg:min-w-[220px] min-w-0" animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-saffron text-ink flex items-center justify-center shrink-0"><Award size={18} /></span>
                <span>
                  <span className="block font-display font-semibold text-xl sm:text-2xl leading-none">100%</span>
                  <span className="block text-sea text-[12px] sm:text-[13px] mt-1 leading-tight">{t.ui.success100} · Bac & BEM 2025-26</span>
                </span>
              </motion.div>
              <motion.div className="card-dark backdrop-blur-md px-3.5 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4 flex-1 lg:flex-none lg:min-w-[220px] min-w-0" animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-leaf text-salt flex items-center justify-center shrink-0"><Leaf size={18} /></span>
                <span>
                  <span className="block font-display font-semibold text-xl sm:text-2xl leading-none">Ruban Vert</span>
                  <span className="block text-sea text-[12px] sm:text-[13px] mt-1 leading-tight">{t.ui.ecoFirstDesc}</span>
                </span>
              </motion.div>
            </motion.div>
          </div>

          <motion.div className="mt-12 hidden md:flex" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d + 1.8, duration: 1 }}>
            <ScrollHint label={t.ui.scroll} />
          </motion.div>
        </motion.div>
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
            <Reveal delay={0.5} className="absolute -left-2 lg:left-[8%] -bottom-4 lg:-bottom-6 bg-ink text-salt rounded-2xl px-5 py-4 shadow-[0_30px_60px_-30px_rgba(6,25,58,0.6)]">
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
              <div key={i} className={`${c.bg} rounded-[1.75rem] p-7 md:p-12 sticky shadow-[0_30px_60px_-30px_rgba(6,25,58,0.35)]`} style={{ top: `calc(var(--header-h) + 1rem + ${i * 1.5}rem)` }}>
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
