import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, HeartPulse, Bus, UtensilsCrossed, Leaf, Scale, Sparkles, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { IMG, SPACES } from '../content/site';
import { WordReveal, Reveal, ClipReveal, Parallax } from '../components/ui/motion';
import { Seo, Chapter, Marquee } from '../components/ui';
import { PageHero, CtaBand, VideoSection, SectionHead } from '../components/sections';
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
      <PageHero chapter={t.nav.life} title={t.copy.lifeTitleHero} lead={c.heroSubtitle} />

      <div className="bg-saffron text-ink py-4 border-b border-ink/10">
        <Marquee items={activities.map((a) => <span key={a} className="font-display font-medium text-2xl md:text-3xl whitespace-nowrap">{a}</span>)} duration={45} />
      </div>

      {/* Espaces — exploration du campus (même composant que l'accueil) */}
      <LifeTeaser />

      <VideoSection title={c.videoTitle} desc={t.videoSection.subtitle} />

      {/* Cantine */}
      <section className="section bg-salt-2/70">
        <div className="wrap">
          <SectionHead chapter={c.canteenLabel} title={c.canteenTitle} lead={c.canteenText} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {c.canteenFeatures.map((f: any, i: number) => {
              const Ico = canteenIcons[i];
              return (
                <Reveal key={i} delay={0.08 * i} className="border-t border-ink/15 pt-5">
                  <Ico size={18} className="text-ink-3 mb-3" />
                  <p className="font-semibold">{f.title}</p>
                  <p className="t-small text-mute mt-1">{f.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-ink text-salt on-dark grain relative overflow-hidden">
        <div className="wrap">
          <SectionHead dark chapter={c.servicesLabel} title={c.servicesTitle} />
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

      <CtaBand title={t.copy.lifeMoments} desc={c.ctaDesc} primary={{ label: c.ctaEnroll, to: '/inscription' }} secondary={{ label: c.ctaPrograms, to: '/programmes' }} tone="sea" />
    </main>
  );
};

export default Life;
