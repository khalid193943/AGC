import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Award, Leaf } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SITE, IMG } from '../../content/site';
import { WordReveal, Reveal, ClipReveal, Parallax, EASE } from '../../components/ui/motion';
import { Button, Marquee, ScrollHint } from '../../components/ui';

export const Hero = () => {
  const { t, currentLang } = useLanguage();
  const reduce = useReducedMotion();
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
          transition={{ duration: 1.6, ease: EASE }}
        >
          <motion.div className="absolute inset-0 will-change-transform" style={reduce ? undefined : { y: imgY }}>
            <motion.img
              src={IMG.school}
              alt="Georges Claude Private Academy, campus de Sidi Bouzid, El Jadida"
              className="w-full h-[115%] object-cover"
              initial={reduce ? false : { scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease: EASE }}
              fetchPriority="high"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
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
                transition={{ duration: 1, delay: 0.6, ease: EASE }}
              >
                <span>{currentLang === 'FR' ? 'École privée homologuée' : 'Accredited private school'}</span>
                <span className="w-1 h-1 rounded-full bg-saffron" aria-hidden />
                <span>El Jadida</span>
                <span className="w-1 h-1 rounded-full bg-saffron" aria-hidden />
                <span>{currentLang === 'FR' ? 'De la maternelle au lycée' : 'From preschool to high school'}</span>
              </motion.p>
              <h1 className="t-hero max-w-[19ch]">
                <WordReveal text={t.copy.heroTitle} inView={false} delay={0.45} stagger={0.045} />
              </h1>
              <motion.p
                className="mt-7 font-serif italic text-sea text-[clamp(1.2rem,1.7vw,1.6rem)] leading-snug max-w-[40ch]"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2, ease: EASE }}
              >
                {t.copy.heroSub} <span className="text-salt not-italic font-display font-medium">{SITE.motto[currentLang]}</span>
              </motion.p>
              <motion.div
                className="mt-10 flex flex-wrap items-center gap-3"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.4, ease: EASE }}
              >
                <Button to="/inscription" variant="saffron" size="lg">{t.ui.enroll}</Button>
                <Button to="/academie" variant="ghost-light" size="lg" icon="none">{t.ui.discoverAcademy}</Button>
              </motion.div>
            </div>

            {/* Preuves flottantes */}
            <motion.div
              className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end"
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.3, ease: EASE }}
            >
              <motion.div className="card-dark backdrop-blur-md px-5 py-4 flex items-center gap-4 min-w-[220px]" animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                <span className="w-10 h-10 rounded-full bg-saffron text-ink flex items-center justify-center shrink-0"><Award size={18} /></span>
                <span>
                  <span className="block font-display font-semibold text-2xl leading-none">100%</span>
                  <span className="block text-sea text-[13px] mt-1">{t.ui.success100} · Bac & BEM 2025-26</span>
                </span>
              </motion.div>
              <motion.div className="card-dark backdrop-blur-md px-5 py-4 flex items-center gap-4 min-w-[220px]" animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
                <span className="w-10 h-10 rounded-full bg-leaf text-salt flex items-center justify-center shrink-0"><Leaf size={18} /></span>
                <span>
                  <span className="block font-display font-semibold text-2xl leading-none">Ruban Vert</span>
                  <span className="block text-sea text-[13px] mt-1">{t.ui.ecoFirstDesc}</span>
                </span>
              </motion.div>
            </motion.div>
          </div>

          <motion.div className="mt-12 hidden md:flex" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }}>
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
    { n: '5+', l: t.academy.yearsExperience },
    { n: '+500', l: fr ? 'élèves inscrits' : 'students enrolled' },
    { n: '3', l: fr ? 'langues au quotidien' : 'languages every day' },
    { n: '25', l: fr ? 'élèves maximum par classe' : 'students maximum per class' },
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
              {[[t.welcome.feature1, t.welcome.feature1Desc], [t.welcome.feature2, t.welcome.feature2Desc]].map(([h, d], i) => (
                <Reveal key={i} delay={0.15 + i * 0.08} className="flex gap-5 border-t border-ink/15 pt-5">
                  <span className="w-2 h-2 rounded-full bg-saffron mt-2.5 shrink-0" aria-hidden />
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
  return (
    <section className="section bg-salt-2/60">
      <div className="wrap">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="img-arch aspect-[4/5] max-w-[320px] sm:max-w-[460px]">
              <motion.img
                src={IMG.director}
                alt={`${SITE.director.name}, ${SITE.director.role[currentLang]}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                initial={{ scale: 1.12 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.6, ease: EASE }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-6 flex items-end justify-between max-w-[460px]">
              <div>
                <p className="t-h4">{SITE.director.name}</p>
                <p className="t-meta">{SITE.director.role[currentLang]}</p>
              </div>
              <img src={IMG.signature} alt="" className="h-14 w-auto opacity-80 mix-blend-multiply" loading="lazy" referrerPolicy="no-referrer" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="chapter mb-8">{t.copy.directorTitle}</p>
            <p className="t-quote">
              <WordReveal text={first + '.'} stagger={0.02} />
            </p>
            <div className="t-body text-mute mt-10 space-y-5 max-w-[62ch]">
              {rest.join('. ').split(/(?<=\.)\s+(?=[A-ZÀÉÈÊ])/).reduce<string[][]>((acc, s, i) => { const k = Math.floor(i / 2); (acc[k] ||= []).push(s); return acc; }, []).map((para, i) => (
                <p key={i}>{para.join(' ')}</p>
              ))}
            </div>
            <div className="mt-10">
              <Link to="/academie" className="ulink font-semibold">{t.ui.discoverAcademy}</Link>
            </div>
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
    { title: t.vision.visionTitle, text: t.vision.visionText, bg: 'bg-ink text-salt on-dark' },
    { title: t.vision.objectiveTitle, text: t.vision.objectiveText, bg: 'bg-ink-3 text-salt on-dark' },
    { title: t.vision.dailyLifeTitle, text: t.vision.dailyLifeText, bg: 'bg-saffron text-ink' },
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
              <div key={i} className={`${c.bg} rounded-[1.75rem] p-8 md:p-12 lg:sticky shadow-[0_30px_60px_-30px_rgba(6,25,58,0.35)]`} style={{ top: `calc(7rem + ${i * 1.75}rem)` }}>
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
