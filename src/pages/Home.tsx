import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { IMG } from '../content/site';
import { Seo } from '../components/ui';
import { VideoSection } from '../components/sections';
import { Reveal } from '../components/ui/motion';
import { Hero, Identity, Director, Vision } from './home/Hero';
import { Programs, Openness, Activities, LifeTeaser } from './home/Discover';
import { Proof, Journal, Practical, Action } from './home/Trust';

/**
 * Accueil — un récit en neuf temps :
 * arrivée → identité → vision → expérience (vidéo) → programmes → ouverture
 * → activités & environnement → preuves → informations → action.
 */
export const Home = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  return (
    <main>
      <Seo
        title={fr ? 'Georges Claude Private Academy | École privée El Jadida — de la maternelle au lycée' : 'Georges Claude Private Academy | Private school El Jadida — preschool to high school'}
        description={fr ? 'École privée homologuée à El Jadida : enseignement trilingue de la maternelle au lycée, programme Cambridge, 100 % de réussite au Bac et au BEM. Inscriptions 2026-2027 ouvertes.' : 'Accredited private school in El Jadida: trilingual teaching from preschool to high school, Cambridge programme, 100% success rate. Enrolment 2026-2027 open.'}
        path="/"
        image={IMG.school}
      />
      <Hero />
      <Identity />
      <Director />
      <Vision />
      <VideoSection title={t.ui.videoTitle} desc={t.ui.videoDesc} />
      <Programs />
      <Openness />
      <Activities />
      <LifeTeaser />
      <Proof />
      <Journal />
      <Practical />
      <Action />
      {/* Recrutement — une ligne, pas une section : ce n'est pas la cible principale */}
      <Reveal as="div" className="bg-salt border-b border-ink/10">
        <div className="wrap py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="t-small text-mute">{t.recruitment.heroDesc}</p>
          <Link to="/recrutement" className="inline-flex items-center gap-1.5 font-semibold ulink shrink-0">{t.recruitment.subtitle} <ArrowUpRight size={16} /></Link>
        </div>
      </Reveal>
    </main>
  );
};

export default Home;
