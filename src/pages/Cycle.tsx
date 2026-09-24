import { useRef } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ArrowLeft, ArrowRight, BookOpen, Palette, Globe, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { IMG, MATERNELLE_SECTIONS } from '../content/site';
import { WordReveal, Reveal, Parallax } from '../components/ui/motion';
import { Seo, Chapter, schema } from '../components/ui';
import { PageHero, CtaBand, AfterBac, SectionHead } from '../components/sections';
import { CYCLE_STYLE } from './home/Discover';

const ORDER = ['maternelle', 'primaire', 'college', 'lycee'] as const;
type CycleId = (typeof ORDER)[number];

const Cycle = () => {
  const { id } = useParams<{ id: string }>();
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const dayRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: dayRef, offset: ['start 70%', 'end 60%'] });
  const line = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  if (!id || !ORDER.includes(id as CycleId)) return <Navigate to="/programmes" replace />;
  const cid = id as CycleId;
  const c = t[cid];
  const idx = ORDER.indexOf(cid);
  const prev = idx > 0 ? ORDER[idx - 1] : null;
  const next = idx < 3 ? ORDER[idx + 1] : null;
  const badge = { maternelle: t.common.cycle1, primaire: t.common.cycle23, college: t.common.cycle4, lycee: t.lycee.cycleLabel }[cid];
  const marker = { maternelle: t.common.fulfillment, primaire: t.common.academicSuccess, college: t.common.middleSchoolCertificate, lycee: t.lycee.successLabel }[cid];
  const gallery = IMG.cycleGallery[cid];
  const st = CYCLE_STYLE[cid];
  const accent = { maternelle: 'bg-logo-yellow text-ink', primaire: 'bg-logo-blue text-white', college: 'bg-logo-red text-white', lycee: 'bg-ink text-white' }[cid];
  const spacesImgs = [IMG.spaces[0], IMG.library, IMG.spaces[1], IMG.spaces[2]];

  return (
    <main>
      <Seo title={`${c.title} — ${c.subtitle} | Georges Claude Private Academy El Jadida`} description={c.heroDesc} path={`/programmes/${cid}`} image={IMG.cycles[cid]} breadcrumbs={[{ name: t.nav.programs, path: '/programmes' }, { name: c.title, path: `/programmes/${cid}` }]} jsonLd={schema.course({ name: c.title, description: c.heroDesc, path: `/programmes/${cid}`, ages: t.ui.cycleAges[cid], lang: currentLang })} />
      <PageHero chapter={`${c.title} — ${badge} — ${t.ui.cycleFor} ${t.ui.cycleAges[cid]}`} title={t.copy.cycleTitles[cid]} lead={c.heroDesc}>
        <Link to="/inscription" className="btn btn-saffron">{c.enrollBtn}</Link>
        <Link to="/contact" className="btn btn-ghost-light">{c.admissionBtn}</Link>
      </PageHero>

      {/* Présentation */}
      <section className="section bg-salt">
        <div className="wrap max-w-[900px] mx-auto">
          <p className="t-h2"><WordReveal text={c.presentation} stagger={0.02} /></p>
          <Reveal delay={0.2} className="mt-10 border-t border-ink/15 pt-6">
            <Chapter className="mb-3">{c.visionTitle}</Chapter>
            <p className="t-body text-mute max-w-[62ch]">{c.visionText}</p>
            <p className={`mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold ${accent}`}><st.Icon size={16} /> {marker}</p>
          </Reveal>
        </div>
      </section>

      {cid === 'maternelle' && (() => { const m = MATERNELLE_SECTIONS[currentLang]; return (
        <section className="section bg-logo-yellow text-ink overflow-hidden">
          <div className="wrap">
            <div className="grid lg:grid-cols-12 gap-8 items-end mb-12">
              <div className="lg:col-span-7"><Chapter className="mb-6 !text-ink/70">{m.chapter}</Chapter><h2 className="t-h1 max-w-[12ch]"><WordReveal text={m.title} /></h2></div>
              <Reveal className="lg:col-span-5" delay={0.15}><p className="t-body text-ink/80 max-w-[44ch]">{m.lead}</p></Reveal>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {m.items.map((it, i) => (
                <Reveal key={it.short} delay={0.08 * i} className="rounded-none bg-ink text-salt p-7 flex flex-col">
                  <div className="flex items-center justify-between"><span className="font-display font-semibold text-4xl text-saffron">{it.short}</span><span className="rounded-none border border-white/20 px-3 py-1 text-sm">{it.ages}</span></div>
                  <h3 className="t-h3 mt-4">{it.name}</h3>
                  <p className="t-body text-sea mt-3">{it.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {it.points.map((pt) => <li key={pt} className="flex gap-3 text-[15px]"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-saffron shrink-0" />{pt}</li>)}
                  </ul>
                  {i < 2 && <span className="hidden md:block absolute" aria-hidden />}
                </Reveal>
              ))}
            </div>
            <p className="mt-8 text-sm text-ink/70">{fr ? 'Petite Section → Moyenne Section → Grande Section → CP, sans changer d’école.' : 'PS → MS → GS → Grade 1, without changing school.'}</p>
          </div>
        </section>
      ); })()}
      {cid === 'lycee' && <AfterBac />}

      {/* Programme */}
      <section className="section bg-salt">
        <div className="wrap">
          <SectionHead chapter={t.common.curriculum} title={c.curriculumTitle} lead={c.curriculumSubtitle} className="mb-12" />
          <div className="grid md:grid-cols-3 gap-5">
            {c.curriculum.map((col: any, i: number) => (
              <Reveal key={i} delay={0.08 * i} className="card p-7">
                <span className={`inline-flex w-10 h-10 rounded-full items-center justify-center mb-4 ${st.icon}`}>{(() => { const I = [BookOpen, Palette, Globe][i] || BookOpen; return <I size={18} />; })()}</span>
                <h3 className="t-h4">{col.title}</h3>
                <ul className="mt-5 divide-y divide-ink/10">
                  {col.items.map((it: string) => <li key={it} className="py-2.5 text-[15px]">{it}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Journée type — ligne de temps progressive */}
      <section className="section bg-salt-2/70">
        <div className="wrap">
          <SectionHead chapter={t.common.dailyLife} title={c.dailyLifeTitle} />
          <div ref={dayRef} className="relative pl-10 mt-12 max-w-[760px]">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-ink/12" aria-hidden>
              <motion.div className="w-full bg-ink origin-top" style={reduce ? { height: '100%' } : { height: line }} />
            </div>
            <ol className="space-y-7">
              {c.dailyLife.map((d: any, i: number) => (
                <Reveal key={i} as="li" amount={0.6} className="relative">
                  <span className="absolute -left-10 top-1.5 w-[17px] h-[17px] rounded-full bg-salt border border-ink/25 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-ink" /></span>
                  <p className="font-display text-mute text-sm inline-flex items-center gap-1.5"><Clock size={13} />{d.time}</p>
                  <p className="t-h3 mt-1">{d.activity}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Espaces */}
      <section className="section bg-salt">
        <div className="wrap">
          <SectionHead chapter={t.common.infrastructure} title={c.spacesTitle} lead={c.spacesSubtitle} link={{ label: t.common.visitCampus, to: '/vie-scolaire' }} className="mb-10" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {c.spaces.map((s: any, i: number) => (
              <Reveal key={i} delay={0.06 * i} className="group">
                <div className="img-frame img-zoom aspect-[4/5]"><img src={spacesImgs[i % spacesImgs.length]} alt={s.title} loading="lazy" referrerPolicy="no-referrer" /></div>
                <p className="t-h4 mt-4">{s.title}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation entre cycles */}
      <nav className="bg-salt border-t border-ink/10" aria-label={fr ? 'Autres cycles' : 'Other cycles'}>
        <div className="wrap py-6 flex justify-between gap-4">
          {prev ? <Link to={`/programmes/${prev}`} className="group inline-flex items-center gap-3 font-semibold"><ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /><span><span className="block t-meta">{t.ui.prevCycle}</span>{t[prev].title}</span></Link> : <span />}
          {next ? <Link to={`/programmes/${next}`} className="group inline-flex items-center gap-3 font-semibold text-right"><span><span className="block t-meta">{t.ui.nextCycle}</span>{t[next].title}</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link> : <span />}
        </div>
      </nav>

      <CtaBand title={c.ctaTitle} desc={c.ctaDesc} primary={{ label: c.enrollBtn, to: '/inscription' }} secondary={{ label: c.admissionBtn, to: '/contact' }} tone="sea" />
    </main>
  );
};

export default Cycle;
