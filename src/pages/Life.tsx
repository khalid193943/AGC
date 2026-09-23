import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, HeartPulse, Bus, UtensilsCrossed, Leaf, Scale, Sparkles, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { IMG, SPACES } from '../content/site';
import { WordReveal, Reveal, ClipReveal, Parallax } from '../components/ui/motion';
import { Seo, Chapter, Marquee } from '../components/ui';
import { PageHero, CtaBand, VideoSection, ImageStrip } from '../components/sections';
import { LifeTeaser } from './home/Discover';

const Life = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const c = t.lifePage;
  const activities = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => t.activities[`a${n}`].title);
  const serviceIcons = [ShieldCheck, HeartPulse, Bus, UtensilsCrossed];
  const canteenIcons = [Leaf, Scale, ShieldCheck, Users];
  const spaces = Object.values(SPACES);

  return (
    <main>
      <Seo title={`${t.nav.life} | ${fr ? 'Infrastructures, cantine, services' : 'Facilities, canteen, services'} — Georges Claude Private Academy`} description={c.heroSubtitle} path="/vie-scolaire" image={IMG.sport} breadcrumbs={[{ name: t.nav.life, path: '/vie-scolaire' }]} />
      <PageHero chapter={t.nav.life} title={t.copy.lifeTitleHero} lead={c.heroSubtitle} image={IMG.kids} imageAlt={fr ? 'Élèves dans la cour' : 'Students in the playground'} />

      <div className="bg-saffron text-ink py-4 border-b border-ink/10">
        <Marquee items={activities.map((a) => <span key={a} className="font-display font-medium text-2xl md:text-3xl whitespace-nowrap">{a}</span>)} duration={45} />
      </div>

      {/* Espaces — exploration du campus (même composant que l'accueil) */}
      <LifeTeaser />

      <VideoSection title={c.videoTitle} desc={t.videoSection.subtitle} />

      {/* Cantine */}
      <section className="section bg-salt-2/60">
        <div className="wrap grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <ClipReveal className="img-arch aspect-[4/5]" from="left">
              <img src={IMG.canteen} alt={fr ? 'Cantine de l’académie' : 'Academy canteen'} loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </ClipReveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
            <Chapter className="mb-6">{c.canteenLabel}</Chapter>
            <h2 className="t-h2 max-w-[14ch]"><WordReveal text={c.canteenTitle} /></h2>
            <Reveal delay={0.1}><p className="t-body text-mute mt-8 max-w-[58ch]">{c.canteenText}</p></Reveal>
            <div className="grid sm:grid-cols-2 gap-6 mt-10">
              {c.canteenFeatures.map((f: any, i: number) => {
                const Ico = canteenIcons[i];
                return (
                  <Reveal key={i} delay={0.08 * i} className="border-t border-ink/15 pt-4">
                    <Ico size={18} className="text-ink-3 mb-3" />
                    <p className="font-semibold">{f.title}</p>
                    <p className="t-small text-mute mt-1">{f.desc}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-ink text-salt on-dark grain relative overflow-hidden">
        <div className="wrap">
          <Chapter saffron className="mb-6">{c.servicesLabel}</Chapter>
          <h2 className="t-h2 max-w-[14ch]"><WordReveal text={c.servicesTitle} /></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/12 border border-white/12 rounded-none overflow-hidden mt-12">
            {c.services.map((s: any, i: number) => {
              const Ico = serviceIcons[i];
              return (
                <div key={i} className="bg-ink p-8">
                  <span className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-saffron mb-6"><Ico size={20} /></span>
                  <h3 className="t-h4">{s.title}</h3>
                  <p className="t-small text-sea-2 mt-2">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Moments */}
      <section className="section bg-salt overflow-hidden">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <h2 className="t-h2"><WordReveal text={t.copy.lifeMoments} /></h2>
            <Reveal delay={0.1}><Link to="/galerie" className="ulink font-semibold inline-flex items-center gap-1.5">{t.life.exploreGallery} <ArrowUpRight size={15} /></Link></Reveal>
          </div>
          <ImageStrip images={[IMG.spaces[0], IMG.event, IMG.spaces[3]]} alt={fr ? 'Vie de l’académie' : 'Academy life'} />
        </div>
      </section>

      <CtaBand title={t.copy.lifeMoments} desc={c.ctaDesc} primary={{ label: c.ctaEnroll, to: '/inscription' }} secondary={{ label: c.ctaPrograms, to: '/programmes' }} tone="sea" />
    </main>
  );
};

export default Life;
