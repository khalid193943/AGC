import { Link } from 'react-router-dom';
import { Check, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE, IMG } from '../content/site';
import { WordReveal, Reveal } from '../components/ui/motion';
import { Seo, Chapter } from '../components/ui';
import { PageHero, CtaBand } from '../components/sections';
import { TiltCard } from './home/Discover';

const Partners = () => {
  const { currentLang, t } = useLanguage();
  const fr = currentLang === 'FR';
  const points = fr
    ? ['Curriculum international reconnu mondialement', 'Développement du trilinguisme dès le plus jeune âge', 'Préparation aux certifications officielles Cambridge', 'Méthodologie axée sur l’analyse et la réflexion']
    : ['Internationally recognised curriculum', 'Trilingualism developed from the earliest age', 'Preparation for official Cambridge certifications', 'A methodology centred on analysis and reflection'];
  const network = fr
    ? [['Certifications linguistiques', 'Centres de préparation pour divers diplômes de langues.'], ['Institutions sportives', 'Collaborations avec des clubs locaux pour développer les talents.'], ['Partenaires culturels', 'Théâtres, musées et bibliothèques pour l’ouverture d’esprit.']]
    : [['Language certifications', 'Preparation centres for various language diplomas.'], ['Sports institutions', 'Collaborations with local clubs to develop talent.'], ['Cultural partners', 'Theatres, museums and libraries to open minds.']];

  return (
    <main>
      <Seo title={`${t.nav.partners} | Cambridge & ${fr ? 'réseau' : 'network'} — Georges Claude Private Academy El Jadida`} description={t.ui.partnersIntro} path="/partenaires" image={IMG.classroom} breadcrumbs={[{ name: t.nav.partners, path: '/partenaires' }]} />
      <PageHero chapter={fr ? 'Réseau d’excellence' : 'Network of excellence'} title={t.copy.partnersTitle} lead={fr ? 'Une ouverture sur le monde et des collaborations stratégiques pour offrir à nos élèves les meilleures opportunités académiques et internationales.' : 'An opening to the world and strategic collaborations to offer our students the best academic and international opportunities.'} compact />

      {/* Cambridge */}
      <section className="section bg-salt">
        <div className="wrap grid lg:grid-cols-12 gap-12 items-center">
          <Reveal className="lg:col-span-5" style={{ perspective: '1200px' }}>
            <TiltCard>
              <div className="rounded-[2rem] bg-white border border-ink/10 p-12 md:p-16 flex items-center justify-center shadow-[0_40px_80px_-40px_rgba(6,25,58,0.35)]">
                <img src={SITE.cambridgeLogo} alt="Cambridge Assessment International Education" className="w-full h-auto" loading="lazy" referrerPolicy="no-referrer" />
              </div>
            </TiltCard>
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            <Chapter className="mb-6">Cambridge Assessment International Education</Chapter>
            <h2 className="t-h2 max-w-[16ch]"><WordReveal text={t.copy.cambridgeStandard} /></h2>
            <Reveal delay={0.1}><p className="t-body text-mute mt-8 max-w-[58ch]">
              {fr ? 'L’Académie intègre progressivement le programme Cambridge pour offrir une éducation répondant aux standards mondiaux. L’approche Cambridge développe non seulement une maîtrise exceptionnelle de la langue anglaise, mais cultive également la pensée critique, la créativité et la résolution de problèmes complexes — des compétences essentielles pour exceller dans un monde globalisé.' : 'The Academy is progressively integrating the Cambridge programme to offer an education that meets global standards. The Cambridge approach not only develops exceptional mastery of English but also cultivates critical thinking, creativity and complex problem-solving — essential skills to excel in a globalised world.'}
            </p></Reveal>
            <ul className="mt-8 space-y-3">
              {points.map((p, i) => <Reveal key={i} as="li" delay={0.05 * i} className="flex gap-3 t-body"><Check size={18} className="text-leaf shrink-0 mt-1.5" />{p}</Reveal>)}
            </ul>
            <Link to="/programmes" className="btn btn-ink mt-10"><span className="swap"><span>{t.ui.seePrograms}</span><span aria-hidden>{t.ui.seePrograms}</span></span><ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* Réseau */}
      <section className="section bg-ink text-salt on-dark grain relative overflow-hidden">
        <div className="wrap">
          <Chapter saffron className="mb-6">{t.ui.partnersIntro}</Chapter>
          <h2 className="t-h2 max-w-[14ch]"><WordReveal text={fr ? 'Un réseau en croissance.' : 'A growing network.'} /></h2>
          <Reveal delay={0.1}><p className="t-body text-sea mt-6 max-w-[58ch]">{fr ? 'Nous travaillons continuellement à étendre notre réseau de partenaires académiques, institutionnels et sportifs pour enrichir l’expérience de nos élèves.' : 'We continuously work to extend our network of academic, institutional and sports partners to enrich our students’ experience.'}</p></Reveal>
          <div className="grid md:grid-cols-3 gap-px bg-white/12 border border-white/12 rounded-[1.75rem] overflow-hidden mt-12">
            {network.map(([h, d], i) => (
              <div key={i} className="bg-ink p-8 md:p-10">
                <span className="block w-2 h-2 rounded-full bg-saffron mb-6" />
                <h3 className="t-h3">{h}</h3>
                <p className="t-body text-sea mt-3">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
};

export default Partners;
