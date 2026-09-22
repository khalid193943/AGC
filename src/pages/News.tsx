import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, ArrowUpRight, Play } from 'lucide-react';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { IMG } from '../content/site';
import { WordReveal, Reveal, EASE } from '../components/ui/motion';
import { Seo, Chapter, fmtDate } from '../components/ui';
import { PageHero, NewsCard } from '../components/sections';

const News = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const c = t.newsPage;
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any | null>(null);

  useEffect(() => {
    const u1 = onSnapshot(query(collection(db, 'news'), orderBy('date', 'desc')), (s) => { setNews(s.docs.map((d) => ({ id: d.id, ...d.data() }))); setLoading(false); }, () => setLoading(false));
    const u2 = onSnapshot(query(collection(db, 'events'), orderBy('date', 'desc')), (s) => setEvents(s.docs.map((d) => ({ id: d.id, ...d.data() }))), () => {});
    const u3 = onSnapshot(query(collection(db, 'moments'), orderBy('createdAt', 'desc'), limit(8)), (s) => setMoments(s.docs.map((d) => ({ id: d.id, ...d.data() }))), () => {});
    return () => { u1(); u2(); u3(); };
  }, []);

  // Contenu par défaut tant que la base est vide (identique aux versions précédentes du site)
  const defaultNews = [
    { id: 'default-1', title: t.news.main.title, category: c.eventLabel, date: '2025-03-15', image: IMG.event, content: t.news.main.desc },
    { id: 'default-2', title: t.news.n1, category: c.pedagogyLabel, date: '2025-03-12', image: IMG.kids, content: fr ? 'Une journée d’exploration et de sensibilisation à l’environnement pour nos élèves du primaire.' : 'A day of exploration and environmental awareness for our primary students.' },
    { id: 'default-3', title: t.news.n2, category: c.successLabel, date: '2025-03-05', image: IMG.lab, content: fr ? 'Félicitations à nos jeunes génies qui ont brillé lors du concours régional de sciences.' : 'Congratulations to our young geniuses who shone at the regional science competition.' },
  ];
  const defaultEvents = [
    { id: 'e1', title: c.openHouse, description: c.openHouseDesc, date: fr ? '15 Mars 2025' : 'March 15, 2025', time: '09:00', image: IMG.campus, location: c.location },
    { id: 'e2', title: c.yearShow, description: c.yearShowDesc, date: fr ? '20 Juin 2025' : 'June 20, 2025', time: '18:00', image: IMG.event, location: c.theater },
  ];
  const list = news.length ? news : loading ? [] : defaultNews;
  const evs = events.length ? events : loading ? [] : defaultEvents;
  const featured = list.find((n) => n.isFeatured || n.featured) || list[0];
  const rest = list.filter((n) => n.id !== featured?.id);

  return (
    <main>
      <Seo title={`${c.title1} ${c.title2} | Georges Claude Private Academy El Jadida`} description={t.news.desc} path="/actualites" image={IMG.event} />
      <PageHero chapter={t.nav.newsEvents} title={t.copy.newsTitle} lead={t.news.desc} compact />

      {/* À la une */}
      <section className="section bg-salt">
        <div className="wrap">
          {featured ? (
            <div className="grid lg:grid-cols-12 gap-10">
              <Reveal className="lg:col-span-7"><NewsCard item={featured} big /></Reveal>
              <div className="lg:col-span-5">
                <Chapter className="mb-6">{c.latestNews}</Chapter>
                <div className="divide-y divide-ink/12 border-y border-ink/12">
                  {rest.slice(0, 4).map((n) => (
                    <Link key={n.id} to={`/actualites/${n.id}`} className="group flex gap-5 py-5 items-center">
                      <div className="img-frame img-zoom w-24 aspect-square shrink-0"><img src={n.image} alt={n.title} loading="lazy" referrerPolicy="no-referrer" /></div>
                      <div>
                        <p className="t-meta">{n.category} — {fmtDate(n.date, currentLang)}</p>
                        <p className="t-h4 mt-1 group-hover:text-ink-3 transition-colors">{n.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-mute">{t.ui.journalEmpty}</p>
          )}
        </div>
      </section>

      {/* Événements */}
      <section id="events" className="section bg-ink text-salt on-dark grain relative overflow-hidden scroll-mt-20">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <Chapter saffron className="mb-6">{c.calendar}</Chapter>
              <h2 className="t-h2"><WordReveal text={c.upcomingEvents} /></h2>
            </div>
            <Reveal delay={0.1}><Link to="/contact" className="ulink font-semibold inline-flex items-center gap-1.5">{t.faq.contactUs} <ArrowUpRight size={15} /></Link></Reveal>
          </div>
          {evs.length === 0 ? <p className="text-sea">{t.home.noEvents}</p> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {evs.map((e, i) => (
                <Reveal key={e.id} delay={0.06 * i}>
                  <button onClick={() => setEvent(e)} className="group text-left w-full card-dark overflow-hidden">
                    <div className="img-frame img-zoom aspect-[16/10] !rounded-none"><img src={e.image} alt={e.title} loading="lazy" referrerPolicy="no-referrer" /></div>
                    <div className="p-6">
                      <p className="t-meta flex flex-wrap gap-x-3"><span className="text-saffron font-semibold">{fmtDate(e.date, currentLang)}</span>{e.time && <span className="inline-flex items-center gap-1"><Clock size={12} />{e.time}</span>}{e.location && <span className="inline-flex items-center gap-1"><MapPin size={12} />{e.location}</span>}</p>
                      <h3 className="t-h4 mt-3 group-hover:text-saffron transition-colors">{e.title}</h3>
                      <p className="t-small text-sea-2 mt-2 line-clamp-2">{e.description || e.desc}</p>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Toutes les actualités */}
      <section id="news" className="section bg-salt scroll-mt-20">
        <div className="wrap">
          <Chapter className="mb-6">{t.nav.news}</Chapter>
          <h2 className="t-h2 mb-12"><WordReveal text={c.allNews} /></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {list.map((n, i) => <Reveal key={n.id} delay={(i % 3) * 0.06}><NewsCard item={n} /></Reveal>)}
          </div>
        </div>
      </section>

      {/* Moments */}
      {moments.length > 0 && (
        <section className="section bg-salt-2/60">
          <div className="wrap">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <Chapter className="mb-6">{c.galleryLabel}</Chapter>
                <h2 className="t-h2"><WordReveal text={c.galleryTitle} /></h2>
              </div>
              <Link to="/galerie" className="ulink font-semibold inline-flex items-center gap-1.5">{t.life.exploreGallery} <ArrowUpRight size={15} /></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {moments.map((m, i) => (
                <Link key={m.id} to="/galerie" className={`img-frame img-zoom relative ${i % 5 === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-square'}`}>
                  {m.type === 'video' ? <video src={m.url} muted playsInline className="w-full h-full object-cover" /> : <img src={m.url} alt={m.title} loading="lazy" referrerPolicy="no-referrer" />}
                  {m.type === 'video' && <span className="absolute inset-0 flex items-center justify-center"><span className="w-12 h-12 rounded-full bg-white/80 text-ink flex items-center justify-center"><Play size={18} className="ml-0.5" /></span></span>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modal événement */}
      <AnimatePresence>
        {event && (
          <motion.div className="fixed inset-0 z-[70] bg-ink/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEvent(null)} role="dialog" aria-modal="true" aria-label={t.ui.eventDetails}>
            <motion.div className="on-light bg-salt text-ink w-full max-w-3xl rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden max-h-[92vh] overflow-y-auto" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-[16/9]">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button onClick={() => setEvent(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/85 text-ink flex items-center justify-center" aria-label={t.nav.close}><X size={18} /></button>
              </div>
              <div className="p-7 md:p-9">
                <p className="t-meta flex flex-wrap gap-x-3"><span className="text-ink font-semibold">{fmtDate(event.date, currentLang)}</span>{event.time && <span className="inline-flex items-center gap-1"><Clock size={12} />{event.time}</span>}{event.location && <span className="inline-flex items-center gap-1"><MapPin size={12} />{event.location}</span>}</p>
                <h3 className="t-h3 mt-3">{event.title}</h3>
                <p className="t-body text-mute mt-4">{event.description || event.desc}</p>
                {event.additionalImages?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-6">
                    {event.additionalImages.map((src: string, i: number) => <div key={i} className="img-frame aspect-square"><img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" /></div>)}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default News;
