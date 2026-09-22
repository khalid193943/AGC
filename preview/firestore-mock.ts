/* Aperçu uniquement : remplace firebase/firestore par des données d'exemple locales. */
import { TRANSLATIONS } from '../src/constants';
import { IMG } from '../src/content/site';

const T: any = (TRANSLATIONS as any).FR;
const DATA: Record<string, any[]> = {
  news: [
    { id: 'exemple-1', title: T.news.main.title, category: T.newsPage.eventLabel, date: '2026-09-15', image: IMG.event, isFeatured: true,
      content: `${T.news.main.desc}\n\nCet article est un exemple affiché dans l'aperçu. Sur le site en ligne, les actualités proviennent de l'espace d'administration.` },
    { id: 'exemple-2', title: T.news.n1, category: T.newsPage.pedagogyLabel, date: '2026-09-10', image: IMG.kids,
      content: "Une journée d'exploration et de sensibilisation à l'environnement pour nos élèves du primaire.\n\nCet article est un exemple affiché dans l'aperçu." },
    { id: 'exemple-3', title: T.news.n2, category: T.newsPage.successLabel, date: '2026-09-03', image: IMG.lab,
      content: 'Félicitations à nos jeunes génies qui ont brillé lors du concours régional de sciences.\n\nCet article est un exemple affiché dans l’aperçu.' },
  ],
  events: [
    { id: 'ev-1', title: T.newsPage.openHouse, description: T.newsPage.openHouseDesc, date: '2026-10-17', time: '09:00', image: IMG.campus, location: T.newsPage.location },
    { id: 'ev-2', title: T.newsPage.yearShow, description: T.newsPage.yearShowDesc, date: '2027-06-18', time: '18:00', image: IMG.event, location: T.newsPage.theater },
  ],
  moments: [IMG.spaces[0], IMG.event, IMG.kids, IMG.sport, IMG.library, IMG.lab, IMG.canteen, IMG.spaces[3]].map((url, i) => ({
    id: 'm' + i, url, type: 'image', title: ['Cour de récréation', 'Fête de fin d’année', 'En classe', 'Tournoi sportif', 'Médiathèque', 'Laboratoire', 'Cantine', 'Atelier'][i],
    category: ['Vie scolaire', 'Événements', 'Vie scolaire', 'Sport', 'Espaces', 'Espaces', 'Vie scolaire', 'Activités'][i],
    createdAt: { seconds: 1789000000 - i * 86400 },
  })),
  jobs: [
    { id: 'job-1', title: 'Professeur·e de mathématiques — collège', category: 'teacher', active: true, description: 'Poste d’exemple affiché dans l’aperçu.', requirements: ['Licence ou master', 'Expérience appréciée'] },
  ],
};

const snap = (name: string) => {
  const rows = DATA[name] || [];
  return { docs: rows.map((r) => ({ id: r.id, data: () => r, exists: () => true })), empty: rows.length === 0 };
};

export const collection = (_db: any, name: string) => ({ name });
export const doc = (_db: any, name: string, id: string) => ({ name, id });
export const query = (c: any, ..._rest: any[]) => c;
export const orderBy = (..._a: any[]) => null;
export const limit = (..._a: any[]) => null;
export const where = (..._a: any[]) => null;
export const serverTimestamp = () => ({ seconds: Math.floor(Date.now() / 1000) });
export const onSnapshot = (c: any, next: (s: any) => void) => { setTimeout(() => next(snap(c.name)), 150); return () => {}; };
export const getDocs = async (c: any) => snap(c.name);
export const getDoc = async (d: any) => {
  const r = (DATA[d.name] || []).find((x) => x.id === d.id);
  return { id: d.id, exists: () => !!r, data: () => r };
};
export const addDoc = async (..._a: any[]) => { await new Promise((r) => setTimeout(r, 700)); return { id: 'apercu' }; };
