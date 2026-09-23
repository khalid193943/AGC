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
  messages: [
    { id: 'm1', name: 'Amina Benali', email: 'amina@example.com', phone: '0661000000', message: 'Niveau: primaire. Bonjour, je souhaite inscrire ma fille en CE2.', type: 'admissions', status: 'new', createdAt: { seconds: 1789000000 } },
    { id: 'm2', name: 'Youssef El Idrissi', email: 'youssef@example.com', phone: '0662000000', message: '[Visite du campus] Est-il possible de visiter un samedi ?', type: 'contact', status: 'new', createdAt: { seconds: 1788900000 } },
    { id: 'm3', name: 'Newsletter', email: 'parent@example.com', phone: '', type: 'newsletter', status: 'new', createdAt: { seconds: 1788800000 } },
    { id: 'm4', name: 'Sara Amrani', email: 'sara@example.com', phone: '0663000000', message: 'Niveau: maternelle. Demande de rappel.', type: 'admissions', status: 'answered', createdAt: { seconds: 1788700000 } },
  ],
  applications: [
    { id: 'a1', firstName: 'Khadija', lastName: 'Rami', email: 'k.rami@example.com', phone: '0664000000', jobId: 'job-1', jobTitle: 'Professeur·e de mathématiques — collège', subject: 'Mathématiques', message: 'Candidature pour le poste.', status: 'new', createdAt: { seconds: 1788950000 } },
  ],
  admin_users: [ { id: 'u1', username: 'secretariat', email: 'secretariat@agc.ma', password: '••••', role: 'editor' } ],
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
export const onSnapshot = (c: any, next: (s: any) => void) => { const fire = () => next(snap(c.name)); setTimeout(fire, 150); listeners.push(fire); return () => { const i = listeners.indexOf(fire); if (i >= 0) listeners.splice(i, 1); }; };
export const getDocs = async (c: any) => snap(c.name);
export const getDoc = async (d: any) => {
  const r = (DATA[d.name] || []).find((x) => x.id === d.id);
  return { id: d.id, exists: () => !!r, data: () => r };
};
export const addDoc = async (c: any, data: any) => { await new Promise((r) => setTimeout(r, 400)); const id = 'new-' + Date.now(); (DATA[c.name] ||= []).unshift({ id, ...data, createdAt: { seconds: Math.floor(Date.now() / 1000) } }); listeners.forEach((l) => l()); return { id }; };

export const updateDoc = async (d: any, data: any) => { const r = (DATA[d.name] || []).find((x) => x.id === d.id); if (r) Object.assign(r, data); listeners.forEach((l) => l()); };
export const deleteDoc = async (d: any) => { DATA[d.name] = (DATA[d.name] || []).filter((x) => x.id !== d.id); listeners.forEach((l) => l()); };
export const setDoc = async () => {};
const listeners: (() => void)[] = [];
