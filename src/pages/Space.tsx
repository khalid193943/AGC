import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SPACES, SpaceSlug, IMG } from '../content/site';
import { WordReveal, Reveal, Parallax } from '../components/ui/motion';
import { Seo, Chapter } from '../components/ui';
import { PageHero, CtaBand } from '../components/sections';

const Space = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, currentLang } = useLanguage();
  if (!slug || !(slug in SPACES)) return <Navigate to="/vie-scolaire" replace />;
  const s = SPACES[slug as SpaceSlug];
  const others = Object.values(SPACES).filter((o) => o.slug !== slug);
  const gallery = slug === 'sports' ? [IMG.sport, IMG.spaces[1], IMG.spaces[3]] : slug === 'labs' ? [IMG.lab, IMG.spaces[2], IMG.classroom] : [IMG.library, IMG.spaces[0], IMG.kids];

  return (
    <main>
      <Seo title={`${s.title[currentLang]} | ${t.nav.life} — Georges Claude Private Academy El Jadida`} description={s.intro[currentLang]} path={`/espaces/${slug}`} image={s.image} breadcrumbs={[{ name: t.nav.life, path: '/vie-scolaire' }, { name: s.title[currentLang], path: `/espaces/${slug}` }]} />
      <PageHero chapter={`${t.copy.spaceChapter} — ${t.common.infrastructure}`} title={s.title[currentLang]} lead={s.intro[currentLang]} image={s.image} imageAlt={s.title[currentLang]}>
        <Link to="/vie-scolaire" className="btn btn-ghost-light"><ArrowLeft size={16} /> {t.ui.spaceBack}</Link>
      </PageHero>

      <section className="section bg-salt">
        <div className="wrap grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="lg:sticky lg:top-28 grid grid-cols-2 gap-4">
              {gallery.map((src, i) => (
                <Parallax key={i} amount={i === 1 ? 50 : 20} className={`img-frame ${i === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-[3/4]'}`}>
                  <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover scale-110" />
                </Parallax>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
            <Chapter className="mb-6">{t.common.infrastructure}</Chapter>
            <h2 className="t-h2"><WordReveal text={s.title[currentLang]} /></h2>
            <ul className="mt-10 divide-y divide-ink/12 border-y border-ink/12">
              {s.features[currentLang].map(([title, desc], i) => (
                <Reveal key={i} as="li" delay={0.05 * i} amount={0.5} className="py-6 grid sm:grid-cols-[1fr_1.5fr] gap-2 sm:gap-8">
                  <span className="t-h4">{title}</span>
                  <span className="t-body text-mute">{desc}</span>
                </Reveal>
              ))}
            </ul>
            <div className="mt-12">
              <p className="t-meta mb-4">{t.ui.spaceOthers}</p>
              <div className="flex flex-wrap gap-3">
                {others.map((o) => <Link key={o.slug} to={`/espaces/${o.slug}`} className="btn btn-ghost">{o.title[currentLang]} <ArrowUpRight size={16} /></Link>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand tone="sea" />
    </main>
  );
};

export default Space;
