import { useLanguage } from '../contexts/LanguageContext';
import { Reveal } from '../components/ui/motion';
import { Seo } from '../components/ui';
import { PageHero } from '../components/sections';

const Legal = ({ kind }: { kind: 'legal' | 'privacy' }) => {
  const { t } = useLanguage();
  const c = kind === 'legal' ? t.legal : t.privacy;
  return (
    <main>
      <Seo title={`${c.title} | Georges Claude Private Academy`} description={c.heroDesc} path={kind === 'legal' ? '/mentions-legales' : '/politique-confidentialite'} />
      <PageHero chapter={c.subtitle} title={c.title} lead={c.heroDesc} compact />
      <section className="section bg-salt">
        <div className="wrap-narrow">
          <dl className="divide-y divide-ink/12 border-y border-ink/12">
            {c.sections.map((s: any, i: number) => (
              <Reveal key={i} as="div" delay={0.04 * i} amount={0.5} className="py-8 grid md:grid-cols-[1fr_2fr] gap-3 md:gap-10">
                <dt className="t-h4">{s.title}</dt>
                <dd className="t-body text-mute">{s.content}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
};

export default Legal;
