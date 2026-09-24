import { useLanguage } from '../contexts/LanguageContext';
import { IMG } from '../content/site';
import { FAQ } from '../content/faq';
import { Seo } from '../components/ui';
import { VideoSection } from '../components/sections';
import { Hero, Identity, Director, Vision } from './home/Hero';
import { Programs, Openness, Activities } from './home/Discover';
import { Reviews, Practical, AdmissionCta } from './home/Trust';

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
        faq={FAQ[currentLang].filter((f) => f.home)}
      />
      <Hero />
      <Identity />
      <Director />
      <VideoSection title={t.copy.videoTitle} desc={t.ui.videoDesc} />
      <Programs />
      <Vision />
      <Openness />
      <Activities />
      <Reviews />
      <AdmissionCta />
      <Practical />
    </main>
  );
};

export default Home;
