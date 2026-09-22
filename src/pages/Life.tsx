import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, HeartPulse, Bus, UtensilsCrossed, Leaf, Scale, Sparkles, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { IMG, SPACES } from '../content/site';
import { WordReveal, Reveal, ClipReveal, Parallax } from '../components/ui/motion';
import { Seo, Chapter, Marquee } from '../components/ui';
import { PageHero, CtaBand, VideoSection } from '../components/sections';

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
      <Seo title={`${t.nav.life} | ${fr ? 'Infrastructures, cantine, services' : 'Facilities, canteen, services'} — Georges Claude Private Academy`} description={c.heroSubtitle} path="/vie-scolaire" image={IMG.sport} />
      <PageHero chapter={t.nav.life} title={t.copy.lifeTitleHero} lead={c.heroSubtitle} image={IMG.kids} imageAlt={fr ? 'Élèves dans la cour' : 'Students in the playground'} />

      <div className="bg-saffron text-ink py-4 border-b border-ink/10">
        <Marquee items={activities.map((a) => <span key={a} className="font-display font-medium text-2xl md:text-3xl whitespace-nowrap">{a}</span>)} duration={45} />
      </div>

      {/* Espaces — trois fiches */}
      <section className="section bg-salt">
        <div className="wrap">
          <div className="grid lg:grid-cols-12 gap-8 items-end mb-12">
            <div className="lg:col-span-7">
              <Chapter className="mb-6">{c.infraLabel}</Chapter>
              <h2 className="t-h2 max-w-[14ch]"><WordReveal text={c.infraTitle} /></h2>
            </div>
            <Reveal className="lg:col-span-5" delay={0.1}><p className="t-lead text-mute max-w-[40ch]">{c.spacesTitle}</p></Reveal>
          </div>
          <div className="space-y-6">
            {spaces.map((s, i) => (
              <Reveal key={s.slug} delay={0.05}>
                <Link to={`/espaces/${s.slug}`} className="group grid md:grid-cols-12 gap-6 md:gap-10 items-center card p-4 md:p-6 hover:shadow-[0_30px_60px_-30px_rgba(6,25,58,0.25)] transition-shadow">
                  <div className={`md:col-span-5 ${i % 2 ? 'md:order-2' : ''}`}>
                    <div className="img-frame img-zoom aspect-[16/10]"><img src={s.image} alt={s.title[currentLang]} loading="lazy" referrerPolicy="no-referrer" /></div>
                  </div>
                  <div className={`md:col-span-7 md:px-4 ${i % 2 ? 'md:order-1' : ''}`}>
                    <h3 className="t-h3">{s.title[currentLang]}</h3>
                    <p className="t-body text-mute mt-3 max-w-[50ch]">{s.intro[currentLang]}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {s.features[currentLang].map(([f]) => <li key={f} className="text-[13px] font-medium rounded-full border border-ink/15 px-3 py-1">{f}</li>)}
                    </ul>
                    <span className="inline-flex items-center gap-1.5 mt-6 font-semibold ulink">{c.discoverSpace} <ArrowUpRight size={16} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <VideoSection title={c.videoTitle} desc={t.videoSection.subtitle} />

      {/* Cantine */}
      <section className="section bg-salt-2/60">
        <div className="wrap grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <ClipReveal className="img-arch aspect-[4/5]" from="left">
              <img src={IMG.canteen} alt={fr ? 'Cantine de l’académie' : 'Academy canteen'} loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </ClipReveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/12 border border-white/12 rounded-[1.75rem] overflow-hidden mt-12">
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
            <h2 className="t-h2"><WordReveal text={c.ctaTitle} /></h2>
            <Reveal delay={0.1}><Link to="/galerie" className="ulink font-semibold inline-flex items-center gap-1.5">{t.life.exploreGallery} <ArrowUpRight size={15} /></Link></Reveal>
          </div>
          <div className="grid grid-cols-3 gap-4 items-end">
            {[IMG.spaces[0], IMG.event, IMG.spaces[3]].map((src, i) => (
              <Parallax key={i} amount={i === 1 ? 60 : 25} className={`img-frame ${i === 1 ? 'aspect-[3/4]' : 'aspect-square mb-12'}`}>
                <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover scale-110" />
              </Parallax>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={c.ctaTitle} desc={c.ctaDesc} primary={{ label: c.ctaEnroll, to: '/inscription' }} secondary={{ label: c.ctaPrograms, to: '/programmes' }} tone="sea" />
    </main>
  );
};

export default Life;
