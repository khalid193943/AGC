import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { IMG } from '../content/site';
import { WordReveal, Reveal, ClipReveal } from '../components/ui/motion';
import { Seo, Chapter } from '../components/ui';
import { PageHero, CtaBand } from '../components/sections';
import { CYCLES } from './home/Discover';

const Programs = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const cycles = CYCLES(t);
  const details: Record<string, string> = { maternelle: t.programs.p1.details, primaire: t.programs.p2.details, college: t.programs.p3.details, lycee: t.programs.p4.details };
  const badges: Record<string, string> = { maternelle: t.common.cycle1, primaire: t.common.cycle23, college: t.common.cycle4, lycee: t.lycee.cycleLabel };

  return (
    <main>
      <Seo title={`${t.nav.programs} | ${fr ? 'Maternelle, Primaire, Collège, Lycée' : 'Preschool, Primary, Middle, High School'} — ${fr ? 'École privée El Jadida' : 'Private school El Jadida'}`} description={t.programs.heroDesc} path="/programmes" image={IMG.cycles.primaire} />
      <PageHero chapter={t.programs.curriculum} title={`${t.programs.heroTitle1} ${t.programs.heroTitle2}`} lead={t.programs.heroDesc} image={IMG.cycles.college} imageAlt={fr ? 'Élèves de l’académie' : 'Academy students'} />

      {/* Le parcours en une ligne */}
      <section className="bg-salt border-b border-ink/10">
        <div className="wrap py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {cycles.map((c, i) => (
            <a key={c.id} href={`#${c.id}`} className="group flex items-baseline gap-3 border-l border-ink/15 pl-4 py-1">
              <span className="text-mute text-sm">{c.ages}</span>
              <span className="font-semibold group-hover:text-ink-3 transition-colors">{c.title}</span>
              {i < 3 && <span className="hidden md:inline text-mute ml-auto" aria-hidden>→</span>}
            </a>
          ))}
        </div>
      </section>

      {/* Les cycles — rangées éditoriales alternées */}
      {cycles.map((c, i) => (
        <section key={c.id} id={c.id} className={`section ${i % 2 ? 'bg-salt-2/60' : 'bg-salt'} scroll-mt-20`}>
          <div className="wrap grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
            <div className={`lg:col-span-5 ${i % 2 ? 'lg:col-start-8 lg:order-2' : ''}`}>
              <ClipReveal className="img-arch aspect-[4/5]" from={i % 2 ? 'right' : 'left'}>
                <img src={c.image} alt={c.title} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </ClipReveal>
            </div>
            <div className={`lg:col-span-6 ${i % 2 ? 'lg:col-start-1 lg:order-1' : 'lg:col-start-7'}`}>
              <Chapter className="mb-6">{badges[c.id]} — {t.ui.cycleFor} {c.ages}</Chapter>
              <h2 className="t-h1"><WordReveal text={c.title} /></h2>
              <Reveal delay={0.1}><p className="t-lead text-mute mt-6 max-w-[40ch]">{c.desc}</p></Reveal>
              <Reveal delay={0.15}><p className="t-body text-mute mt-4 max-w-[56ch]">{details[c.id]}</p></Reveal>
              <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3 max-w-lg">
                {c.features.map((f: string) => (
                  <li key={f} className="flex gap-3 text-[15px]"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-saffron shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to={`/programmes/${c.id}`} className="btn btn-ink mt-10">
                <span className="swap"><span>{t.programs.programDetailsBtn}</span><span aria-hidden>{t.programs.programDetailsBtn}</span></span>
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </main>
  );
};

export default Programs;
