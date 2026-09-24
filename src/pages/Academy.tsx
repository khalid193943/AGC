import { useRef } from 'react';
import { motion, useTransform, useReducedMotion } from 'motion/react';
import { Leaf, Sun, Recycle, Droplets, Award, Star, Scale, HeartHandshake, Lightbulb, ShieldCheck, Heart, Users, BookOpen, GraduationCap, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE, IMG } from '../content/site';
import { WordReveal, Reveal, ClipReveal, useSmoothProgress, useTrackDistance } from '../components/ui/motion';
import { Seo, Chapter } from '../components/ui';
import { PageHero, CtaBand, StatGrid, SectionHead } from '../components/sections';

const Academy = () => {
  const { t, currentLang } = useLanguage();
  const a = t.academy;
  const fr = currentLang === 'FR';
  const paragraphs: string[] = String(a.director.quote).split('\n\n');
  const values = [a.v1, a.v2, a.v3, a.v4, a.integrity, a.caring, a.community];
  const timeline: { year: string; title: string; desc: string }[] = a.history.items;
  const reduce = useReducedMotion();
  const tlRef = useRef<HTMLDivElement>(null);
  const progress = useSmoothProgress(tlRef);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useTrackDistance(trackRef, [reduce]);
  const x = useTransform(progress, [0.05, 0.95], [0, -distance]);

  const eco = [
    { icon: Leaf, title: fr ? 'Jardin pédagogique' : 'Educational garden', desc: fr ? 'Un espace dédié où nos élèves apprennent l’agriculture durable, le compostage et le respect de la biodiversité locale.' : 'A dedicated space where our students learn sustainable agriculture, composting and respect for local biodiversity.' },
    { icon: Sun, title: fr ? 'Énergie verte' : 'Green energy', desc: fr ? 'Infrastructures optimisées pour réduire notre empreinte carbone : énergies renouvelables et éclairage intelligent.' : 'Infrastructures optimised to reduce our carbon footprint: renewable energy and smart lighting.' },
    { icon: Recycle, title: fr ? 'Politique zéro déchet' : 'Zero-waste policy', desc: fr ? 'Tri sélectif, recyclage du papier et du plastique dans toutes les classes.' : 'Selective sorting, paper and plastic recycling in every classroom.' },
    { icon: Droplets, title: fr ? 'Eaux pluviales' : 'Rainwater', desc: fr ? 'Un système de récupération pour l’arrosage de nos espaces verts.' : 'A harvesting system to water our green spaces.' },
  ];

  return (
    <main>
      <Seo title={`${a.title} | ${fr ? 'Histoire, valeurs et engagement' : 'History, values and commitment'} — El Jadida`} description={a.heritageText1} path="/academie" image={IMG.classroom} breadcrumbs={[{ name: t.nav.academy, path: '/academie' }]} />
      <PageHero chapter={`${t.nav.academy} — ${a.heroSubtitle}`} title={t.copy.academyTitle} lead={t.copy.academyLead} />

      {/* Lettre du directeur — fond sombre, une seule colonne */}
      <section className="section bg-ink text-salt on-dark grain relative overflow-hidden">
        <div className="wrap-narrow text-center">
          <p className="chapter saffron justify-center mb-8">{a.directionTitle}</p>
          <span className="block mx-auto mb-8 font-serif text-saffron text-6xl leading-none select-none" aria-hidden>“</span>
          <p className="t-quote"><WordReveal text={paragraphs[0]} stagger={0.02} /></p>
          <div className="mt-10 mx-auto max-w-[64ch] text-sea/90 text-left space-y-4 font-serif text-[15px] md:text-[16px] leading-[1.7]">
            {paragraphs.slice(1).map((p, i) => <Reveal key={i} as="p" delay={0.05 * i} amount={0.5}>{p}</Reveal>)}
          </div>
          <Reveal delay={0.2} className="mt-12 pt-8 border-t border-white/12 flex flex-col items-center gap-4">
            <span className="relative inline-block p-1.5 rounded-full border border-saffron/60"><img src={IMG.director} alt={SITE.director.name} className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover ring-2 ring-saffron shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)]" loading="lazy" referrerPolicy="no-referrer" /></span>
            <span><span className="block t-h4">{SITE.director.name}</span><span className="block t-meta">{SITE.director.role[currentLang]}</span></span>
            <img src={IMG.signature} alt="" className="h-12 w-auto opacity-90 invert" loading="lazy" referrerPolicy="no-referrer" />
          </Reveal>
        </div>
      </section>

      {/* Piliers */}
      <section className="section bg-ink text-salt on-dark grain relative overflow-hidden">
        <div className="wrap">
          <SectionHead dark chapter={a.pillarsLabel} title={a.whyTitle} />
          <div className="grid md:grid-cols-3 gap-px bg-white/12 border border-white/12 rounded-none overflow-hidden mt-14">
            {a.whyCards.map((c: any, i: number) => (
              <div key={i} className="bg-ink p-8 md:p-10">
                <span className="inline-flex w-11 h-11 rounded-full border border-white/20 text-saffron items-center justify-center mb-5">{(() => { const I = [BookOpen, GraduationCap, Building2][i] || Star; return <I size={20} />; })()}</span>
                <h3 className="t-h3">{c.title}</h3>
                <p className="t-body text-sea mt-5">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6"><StatGrid dark /></div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="section bg-salt">
        <div className="wrap">
          <SectionHead chapter={a.valuesLabel} title={a.missionTitle} lead={a.presentationText2} />
          <ul className="mt-12 divide-y divide-ink/12 border-y border-ink/12">
            {values.map((v: any, i: number) => (
              <Reveal key={i} as="li" delay={0.04 * i} amount={0.5} className="py-6 grid md:grid-cols-[1fr_1.6fr] gap-2 md:gap-10 items-center">
                <span className="flex items-center gap-4"><span className="w-10 h-10 rounded-full bg-ink text-saffron flex items-center justify-center shrink-0">{(() => { const I = [Star, Scale, HeartHandshake, Lightbulb, ShieldCheck, Heart, Users][i] || Star; return <I size={18} />; })()}</span><span className="t-h4">{v.title}</span></span>
                <span className="t-body text-mute">{v.desc}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Histoire — frise horizontale épinglée */}
      <section ref={tlRef} className="bg-salt-2/60 relative" style={!reduce ? { height: '220vh', paddingTop: 'var(--section)', paddingBottom: 'var(--section)' } : undefined}>
        <div className={!reduce ? 'sticky top-0 h-[100svh] flex flex-col justify-center overflow-hidden' : 'section'}>
          <div className="wrap mb-8 lg:mb-10">
            <Chapter className="mb-6">{a.historyLabel}</Chapter>
            <h2 className="t-h2"><WordReveal text={`${a.historyTitle1} ${a.historyTitle2.toLowerCase()}`} /></h2>
            <Reveal delay={0.1} className="hidden md:block"><p className="t-body text-mute mt-4 max-w-[56ch]">{a.heritageText2}</p></Reveal>
          </div>
          {!reduce ? (
            <motion.div ref={trackRef} className="flex gap-8 pl-[var(--gutter)] will-change-transform" style={{ x }}>
              {timeline.map((it, i) => (
                <div key={i} className="w-[76vw] sm:w-[400px] lg:w-[460px] shrink-0 border-t border-ink/20 pt-6">
                  <p className="t-num">{it.year}</p>
                  <p className="t-h3 mt-4">{it.title}</p>
                  <p className="t-body text-mute mt-2 max-w-[34ch]">{it.desc}</p>
                </div>
              ))}
              <div className="w-[var(--gutter)] shrink-0" aria-hidden />
            </motion.div>
          ) : (
            <div className="snap-x">
              {timeline.map((it, i) => (
                <div key={i} className="w-[76vw] sm:w-[360px] border-t border-ink/20 pt-6">
                  <p className="t-num">{it.year}</p>
                  <p className="t-h3 mt-4">{it.title}</p>
                  <p className="t-body text-mute mt-2">{it.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Écologie */}
      <section id="ecologie" className="section bg-leaf-2 text-salt on-dark relative overflow-hidden grain">
        <div className="wrap">
          <SectionHead dark chapter={a.ecoRibbonLabel} title={`${a.ecoRibbonTitle1} ${a.ecoRibbonTitle2.toLowerCase()}`} lead={a.ecoRibbonText1} />
          <Reveal delay={0.15}><p className="t-body text-sea-2 mt-6 max-w-[64ch]">{a.ecoRibbonText2}</p></Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {eco.map((e, i) => (
              <Reveal key={i} delay={0.08 * i} className="border-t border-white/15 pt-5">
                <e.icon size={18} className="text-saffron mb-3" />
                <p className="font-semibold">{e.title}</p>
                <p className="text-sea-2 text-sm mt-1">{e.desc}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 inline-flex items-center gap-2 text-sm text-sea"><Award size={16} className="text-saffron" /> {fr ? 'Label Ruban Vert d’excellence écologique' : 'Green Ribbon label for ecological excellence'}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-salt">
        <div className="wrap max-w-[900px] mx-auto space-y-14">
          {[[a.missionM.title, a.missionText], [a.missionV.title, a.visionText]].map(([h, p], i) => (
            <Reveal key={i} delay={i * 0.1} className="border-t border-ink/15 pt-8">
              <Chapter className="mb-5">{h}</Chapter>
              <p className="t-h3 max-w-[30ch]">{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Équipe */}
      <section className="section bg-salt-2/70">
        <div className="wrap">
          <SectionHead chapter={a.team} title={a.teamTitle} lead={a.teamDesc} />
          <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 divide-y sm:divide-y-0 divide-ink/12">
            {[{ name: SITE.director.name, role: SITE.director.role[currentLang] }, ...a.teamMembers].map((m: any, i: number) => (
              <Reveal key={i} as="li" delay={0.05 * i} className="py-5 sm:border-t sm:border-ink/12">
                <p className="t-h4">{m.name}</p>
                <p className="t-meta mt-1">{m.role}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={a.ctaTitle} desc={a.ctaDesc} primary={{ label: a.ctaAdmissionBtn, to: '/inscription' }} secondary={{ label: a.ctaVisitBtn, to: '/contact' }} />
    </main>
  );
};

export default Academy;
