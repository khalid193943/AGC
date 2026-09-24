import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { IMG, AFTER_BAC } from '../content/site';
import { WordReveal, Reveal, ClipReveal } from '../components/ui/motion';
import { Seo, Chapter, scrollToId, schema } from '../components/ui';
import { PageHero, CtaBand } from '../components/sections';
import { CYCLES, CYCLE_STYLE } from './home/Discover';

const Programs = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const cycles = CYCLES(t);
  const details: Record<string, string> = { maternelle: t.programs.p1.details, primaire: t.programs.p2.details, college: t.programs.p3.details, lycee: t.programs.p4.details };
  const badges: Record<string, string> = { maternelle: t.common.cycle1, primaire: t.common.cycle23, college: t.common.cycle4, lycee: t.lycee.cycleLabel };

  return (
    <main>
      <Seo title={`${t.nav.programs} | ${fr ? 'Maternelle, Primaire, Collège, Lycée' : 'Preschool, Primary, Middle, High School'} — ${fr ? 'École privée El Jadida' : 'Private school El Jadida'}`} description={t.programs.heroDesc} path="/programmes" image={IMG.cycles.primaire} breadcrumbs={[{ name: t.nav.programs, path: '/programmes' }]} jsonLd={cycles.map((c) => schema.course({ name: c.title, description: c.desc, path: `/programmes/${c.id}`, ages: c.ages, lang: currentLang }))} />
      <PageHero chapter={`${t.programs.curriculum} — ${t.copy.programsRail}`} title={t.copy.programsPageTitle} lead={t.programs.heroDesc} />

      {/* Le parcours : quatre capsules aux couleurs du logo */}
      <section className="bg-salt border-b border-ink/10">
        <div className="wrap py-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {cycles.map((c, i) => {
            const st = CYCLE_STYLE[c.id];
            return (
              <Reveal key={c.id} delay={0.06 * i}>
                <a href={`#${c.id}`} onClick={scrollToId(c.id)} className={`group flex items-center gap-3 rounded-none px-2 py-2 pr-5 ${st.card} ring-1 ring-ink/10 transition-transform duration-500 hover:-translate-y-0.5`}>
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${st.icon}`}><st.Icon size={18} /></span>
                  <span className="min-w-0"><span className="block font-semibold leading-tight truncate">{c.title}</span><span className="block text-xs opacity-75">{c.ages}</span></span>
                </a>
              </Reveal>
            );
          })}
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
                  <li key={f} className="flex gap-3 text-[15px]"><span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${{ maternelle: 'bg-logo-yellow', primaire: 'bg-logo-blue', college: 'bg-logo-red', lycee: 'bg-ink' }[c.id]}`} />{f}</li>
                ))}
              </ul>
              {c.id === 'maternelle' && (
                <p className="mt-8 t-small text-mute max-w-[60ch]"><span className="font-semibold text-ink">{fr ? 'Trois sections :' : 'Three sections:'}</span> {fr ? 'Petite Section (3–4 ans), Moyenne Section (4–5 ans), Grande Section (5–6 ans).' : 'Petite Section (3–4), Moyenne Section (4–5), Grande Section (5–6).'}</p>
              )}
              {c.id === 'lycee' && (
                <p className="mt-8 t-small text-mute max-w-[60ch]"><span className="font-semibold text-ink">{AFTER_BAC[currentLang].chapter}</span> {AFTER_BAC[currentLang].families.map((f) => f.items.slice(0, 2).join(', ')).join(' · ')}…</p>
              )}
              <Link to={`/programmes/${c.id}`} className={`btn mt-10 ${{ maternelle: 'btn-saffron', primaire: 'btn-ink', college: 'bg-logo-red text-white hover:bg-[#c4163d]', lycee: 'btn-ink' }[c.id]}`}>
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
