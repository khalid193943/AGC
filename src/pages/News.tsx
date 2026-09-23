import { useEffect, useMemo, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, ArrowUpRight, Play, CalendarPlus, Check, Newspaper } from 'lucide-react';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { IMG, SITE } from '../content/site';
import { WordReveal, Reveal, EASE } from '../components/ui/motion';
import { Seo, Chapter, Marquee, fmtDate, toDate, readingTime, isRecent, icsUrl } from '../components/ui';
import { PageHero } from '../components/sections';
import { SocialLinks } from '../components/ui/Social';

/**
 * Le Journal de l'Académie — conçu comme un journal en ligne :
 * manchette datée + fil de titres, à la une, cette semaine, agenda (.ics), archives par mois,
 * moments, bloc « ne rien manquer ».
 */
const News = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const c = t.newsPage;
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any | null>(null);
  const [cat, setCat] = useState('all');
  const [email, setEmail] = useState('');
  const [sub, setSub] = useState<'idle' | 'sending' | 'done'>('idle');

  useEffect(() => {
    const u1 = onSnapshot(query(collection(db, 'news'), orderBy('date', 'desc')), (s) => { setNews(s.docs.map((d) => ({ id: d.id, ...d.data() }))); setLoading(false); }, () => setLoading(false));
    const u2 = onSnapshot(query(collection(db, 'events'), orderBy('date', 'desc')), (s) => setEvents(s.docs.map((d) => ({ id: d.id, ...d.data() }))), () => {});
    const u3 = onSnapshot(query(collection(db, 'moments'), orderBy('createdAt', 'desc'), limit(8)), (s) => setMoments(s.docs.map((d) => ({ id: d.id, ...d.data() }))), () => {});
    return () => { u1(); u2(); u3(); };
  }, []);

  const defaultNews = [
    { id: 'default-1', title: t.news.main.title, category: c.eventLabel, date: '2026-09-15', image: IMG.event, content: t.news.main.desc, isFeatured: true },
    { id: 'default-2', title: t.news.n1, category: c.pedagogyLabel, date: '2026-09-10', image: IMG.kids, content: fr ? 'Une journée d’exploration et de sensibilisation à l’environnement pour nos élèves du primaire.' : 'A day of exploration and environmental awareness for our primary students.' },
    { id: 'default-3', title: t.news.n2, category: c.successLabel, date: '2026-09-03', image: IMG.lab, content: fr ? 'Félicitations à nos jeunes génies qui ont brillé lors du concours régional de sciences.' : 'Congratulations to our young geniuses who shone at the regional science competition.' },
  ];
  const defaultEvents = [
    { id: 'e1', title: c.openHouse, description: c.openHouseDesc, date: '2026-10-17', time: '09:00', image: IMG.campus, location: c.location },
    { id: 'e2', title: c.yearShow, description: c.yearShowDesc, date: '2027-06-18', time: '18:00', image: IMG.event, location: c.theater },
  ];
  const list = news.length ? news : loading ? [] : defaultNews;
  const evs = (events.length ? events : loading ? [] : defaultEvents)
    .map((e) => ({ ...e, _d: toDate(e.date) }))
    .sort((a, b) => (a._d?.getTime() || 0) - (b._d?.getTime() || 0));
  const upcoming = evs.filter((e) => !e._d || e._d.getTime() > Date.now() - 86400000);
  const agenda = (upcoming.length ? upcoming : evs.slice(-3)).slice(0, 4);

  const featured = list.find((n) => n.isFeatured || n.featured) || list[0];
  const week = list.filter((n) => n.id !== featured?.id).slice(0, 3);
  const categories = Array.from(new Set(list.map((n) => n.category).filter(Boolean)));
  const filtered = cat === 'all' ? list : list.filter((n) => n.category === cat);
  const byMonth = useMemo(() => {
    const groups: { key: string; label: string; items: any[] }[] = [];
    filtered.forEach((n) => {
      const d = toDate(n.date);
      const key = d ? `${d.getFullYear()}-${d.getMonth()}` : 'x';
      const label = d ? d.toLocaleDateString(fr ? 'fr-FR' : 'en-GB', { month: 'long', year: 'numeric' }) : '';
      let g = groups.find((x) => x.key === key);
      if (!g) { g = { key, label, items: [] }; groups.push(g); }
      g.items.push(n);
    });
    return groups;
  }, [filtered, fr]);

  const today = new Date().toLocaleDateString(fr ? 'fr-FR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const subscribe = async (e: FormEvent) => {
    e.preventDefault(); setSub('sending');
    try { await addDoc(collection(db, 'messages'), { name: 'Newsletter', email, phone: '', type: 'newsletter', status: 'new', createdAt: serverTimestamp() }); setSub('done'); setEmail(''); } catch { setSub('idle'); }
  };
  const dayOf = (d: Date | null) => (d ? d.getDate() : '—');
  const monthOf = (d: Date | null) => (d ? d.toLocaleDateString(fr ? 'fr-FR' : 'en-GB', { month: 'short' }).replace('.', '') : '');

  return (
    <main>
      <Seo title={`${fr ? 'Le Journal de l’Académie' : 'The Academy Journal'} | Georges Claude Private Academy El Jadida`} description={t.news.desc} path="/actualites" image={IMG.event} breadcrumbs={[{ name: t.nav.newsEvents, path: '/actualites' }]} />

      {/* Manchette */}
      <PageHero chapter={`${fr ? 'Édition du' : 'Edition of'} ${today}`} title={fr ? 'Le Journal de l’Académie.' : 'The Academy Journal.'} lead={t.news.desc} compact>
        <a href="#agenda" className="btn btn-saffron" onClick={(e) => { e.preventDefault(); document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' }); }}>{c.calendar}</a>
        <a href="#suivre" className="btn btn-ghost-light" onClick={(e) => { e.preventDefault(); document.getElementById('suivre')?.scrollIntoView({ behavior: 'smooth' }); }}>{fr ? 'Ne rien manquer' : 'Never miss a thing'}</a>
      </PageHero>

      {/* Fil de titres */}
      {list.length > 0 && (
        <div className="bg-saffron text-ink py-3 border-y border-ink/10">
          <Marquee duration={50} items={list.slice(0, 8).map((n) => (
            <Link key={n.id} to={`/actualites/${n.id}`} className="text-sm font-semibold whitespace-nowrap hover:underline">
              <span className="opacity-60 mr-2">{fmtDate(n.date, currentLang)}</span>{n.title}
            </Link>
          ))} />
        </div>
      )}

      {/* À la une + cette semaine */}
      <section className="section bg-salt">
        <div className="wrap">
          {loading ? <p className="text-mute">{t.ui.loading}…</p> : !featured ? <p className="text-mute">{t.ui.journalEmpty}</p> : (
            <div className="grid lg:grid-cols-12 gap-8">
              <Reveal className="lg:col-span-7">
                <Link to={`/actualites/${featured.id}`} className="group relative block img-frame img-zoom aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[600px]">
                  <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" loading="eager" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  <div className="absolute top-5 left-5 flex gap-2">
                    <span className="rounded-full bg-saffron text-ink px-3 py-1 text-xs font-semibold">{fr ? 'À la une' : 'Headline'}</span>
                    {isRecent(featured.date) && <span className="rounded-full bg-salt text-ink px-3 py-1 text-xs font-semibold">{fr ? 'Nouveau' : 'New'}</span>}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-7 md:p-10 text-salt">
                    <p className="text-sea text-sm flex flex-wrap gap-x-3">{featured.category && <span className="font-semibold text-salt">{featured.category}</span>}<span>{fmtDate(featured.date, currentLang)}</span><span>· {readingTime(featured.content)} min</span></p>
                    <h2 className="t-h2 mt-3 max-w-[18ch] group-hover:text-saffron-2 transition-colors">{featured.title}</h2>
                    <p className="t-body text-sea mt-3 max-w-[52ch] line-clamp-2 hidden sm:block">{Array.isArray(featured.content) ? featured.content[0] : featured.content}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold mt-5 ulink">{t.ui.readMore} <ArrowUpRight size={15} /></span>
                  </div>
                </Link>
              </Reveal>
              <div className="lg:col-span-5">
                <Chapter className="mb-6">{fr ? 'Cette semaine' : 'This week'}</Chapter>
                <ol className="divide-y divide-ink/12 border-y border-ink/12">
                  {week.map((n, i) => (
                    <Reveal key={n.id} as="li" delay={0.06 * i}>
                      <Link to={`/actualites/${n.id}`} className="group flex gap-5 py-6 items-start">
                        <span className="font-display text-mute text-2xl w-8 shrink-0 leading-none pt-1">{String(i + 1).padStart(2, '0')}</span>
                        <div className="flex-1 min-w-0">
                          <p className="t-meta flex flex-wrap gap-x-2">{n.category && <span className="text-ink font-semibold">{n.category}</span>}<span>{fmtDate(n.date, currentLang)}</span><span>· {readingTime(n.content)} min</span>{isRecent(n.date) && <span className="text-saffron font-semibold">{fr ? 'Nouveau' : 'New'}</span>}</p>
                          <p className="t-h4 mt-1 group-hover:text-ink-3 transition-colors">{n.title}</p>
                        </div>
                        <div className="img-frame img-zoom w-20 aspect-square shrink-0 !rounded-xl"><img src={n.image} alt="" loading="lazy" referrerPolicy="no-referrer" /></div>
                      </Link>
                    </Reveal>
                  ))}
                </ol>
                {week.length === 0 && <p className="t-body text-mute">{t.ui.journalEmpty}</p>}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Agenda */}
      <section id="agenda" className="section bg-ink text-salt on-dark grain relative overflow-hidden scroll-mt-20">
        <div className="wrap">
          <div className="grid lg:grid-cols-12 gap-8 items-end mb-12">
            <div className="lg:col-span-7">
              <Chapter saffron className="mb-6">{c.calendar}</Chapter>
              <h2 className="t-h1 max-w-[12ch]"><WordReveal text={fr ? 'À vos agendas.' : 'Save the dates.'} /></h2>
            </div>
            <Reveal className="lg:col-span-5" delay={0.15}><p className="t-body text-sea max-w-[42ch]">{fr ? 'Portes ouvertes, spectacles, réunions, sorties : chaque événement peut être ajouté à votre agenda en un geste.' : 'Open days, shows, meetings, outings: add any event to your calendar in one tap.'}</p></Reveal>
          </div>
          {agenda.length === 0 ? <p className="text-sea">{t.home.noEvents}</p> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {agenda.map((e, i) => (
                <Reveal key={e.id} delay={0.06 * i}>
                  <article className="card-dark p-5 h-full flex flex-col">
                    <div className="flex items-start gap-4">
                      <div className="w-16 shrink-0 rounded-2xl bg-salt text-ink overflow-hidden text-center">
                        <span className="block bg-logo-red text-white text-[11px] font-semibold py-1 uppercase tracking-wide">{monthOf(e._d)}</span>
                        <span className="block font-display font-semibold text-3xl py-2 leading-none">{dayOf(e._d)}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="t-h4 leading-snug">{e.title}</h3>
                        <p className="t-meta mt-1.5 flex flex-col gap-0.5">{e.time && <span className="inline-flex items-center gap-1"><Clock size={12} />{e.time}</span>}{e.location && <span className="inline-flex items-center gap-1"><MapPin size={12} />{e.location}</span>}</p>
                      </div>
                    </div>
                    <p className="t-small text-sea-2 mt-4 line-clamp-2 flex-1">{e.description || e.desc}</p>
                    <div className="mt-5 flex items-center gap-2">
                      <a href={icsUrl(e)} download={`${e.title}.ics`} className="btn btn-saffron !h-10 text-sm"><CalendarPlus size={15} /> {fr ? 'Ajouter à mon agenda' : 'Add to calendar'}</a>
                      <button onClick={() => setEvent(e)} className="btn btn-ghost-light !h-10 text-sm" aria-label={t.ui.eventDetails}>{fr ? 'Détails' : 'Details'}</button>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Archives par mois */}
      <section id="news" className="section bg-salt scroll-mt-20">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <Chapter className="mb-6">{t.nav.news}</Chapter>
              <h2 className="t-h2"><WordReveal text={fr ? 'Toutes les histoires de l’école.' : 'All the school’s stories.'} /></h2>
            </div>
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {['all', ...categories].map((k) => (
                  <button key={k} onClick={() => setCat(k)} className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${cat === k ? 'bg-ink text-salt border-ink' : 'border-ink/15 hover:border-ink'}`}>{k === 'all' ? (fr ? 'Tout' : 'All') : k}</button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-14">
            {byMonth.map((g) => (
              <div key={g.key} className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3"><p className="lg:sticky lg:top-28 t-h3 capitalize">{g.label}</p></div>
                <div className="lg:col-span-9 grid sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                  {g.items.map((n, i) => (
                    <Reveal key={n.id} delay={(i % 3) * 0.06}>
                      <Link to={`/actualites/${n.id}`} className="group block">
                        <div className="img-frame img-zoom aspect-[4/3] relative">
                          <img src={n.image} alt={n.title} loading="lazy" referrerPolicy="no-referrer" />
                          {isRecent(n.date) && <span className="absolute top-3 left-3 rounded-full bg-saffron text-ink px-2.5 py-0.5 text-[11px] font-semibold">{fr ? 'Nouveau' : 'New'}</span>}
                        </div>
                        <p className="t-meta mt-4 flex flex-wrap gap-x-2">{n.category && <span className="text-ink font-semibold">{n.category}</span>}<span>{fmtDate(n.date, currentLang)}</span><span>· {readingTime(n.content)} min</span></p>
                        <h3 className="t-h4 mt-1 group-hover:text-ink-3 transition-colors">{n.title}</h3>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
            {byMonth.length === 0 && !loading && <p className="text-mute">{t.ui.journalEmpty}</p>}
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
                <h2 className="t-h2"><WordReveal text={fr ? 'En images, cette semaine.' : 'In pictures, this week.'} /></h2>
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

      {/* Ne rien manquer */}
      <section id="suivre" className="section bg-saffron text-ink scroll-mt-20">
        <div className="wrap grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <p className="chapter !text-ink/70 mb-6"><Newspaper size={16} /> {fr ? 'Abonnement' : 'Subscribe'}</p>
            <h2 className="t-h1 max-w-[12ch]"><WordReveal text={fr ? 'Ne rien manquer.' : 'Never miss a thing.'} /></h2>
            <Reveal delay={0.1}><p className="t-body mt-6 max-w-[46ch] text-ink/80">{fr ? 'Recevez le journal de l’école par email, ou suivez-nous sur WhatsApp et les réseaux : sorties, résultats, événements, toujours au bon moment.' : 'Get the school journal by email, or follow us on WhatsApp and social media: outings, results, events, always on time.'}</p></Reveal>
          </div>
          <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.15}>
            <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-2">
              <label className="sr-only" htmlFor="j-email">{t.footer.emailPlaceholder}</label>
              <input id="j-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.footer.emailPlaceholder} className="flex-1 h-12 rounded-full bg-white/70 border border-ink/15 px-5 text-ink placeholder:text-ink/50 focus:outline-none focus:border-ink" />
              <button className="btn btn-ink !h-12" disabled={sub !== 'idle'}>{sub === 'done' ? <><Check size={16} /> {fr ? 'Inscrit' : 'Subscribed'}</> : sub === 'sending' ? t.ui.sending : t.footer.subscribe}</button>
            </form>
            <SocialLinks variant="label" className="mt-5 gap-6" />
          </Reveal>
        </div>
      </section>

      {/* Modal événement */}
      <AnimatePresence>
        {event && (
          <motion.div className="fixed inset-0 z-[70] bg-ink/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEvent(null)} role="dialog" aria-modal="true" aria-label={t.ui.eventDetails}>
            <motion.div className="bg-salt text-ink w-full max-w-3xl rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden max-h-[92vh] overflow-y-auto" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-[16/9]">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button onClick={() => setEvent(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/85 text-ink flex items-center justify-center" aria-label={t.nav.close}><X size={18} /></button>
              </div>
              <div className="p-7 md:p-9">
                <p className="t-meta flex flex-wrap gap-x-3"><span className="text-ink font-semibold">{fmtDate(event.date, currentLang)}</span>{event.time && <span className="inline-flex items-center gap-1"><Clock size={12} />{event.time}</span>}{event.location && <span className="inline-flex items-center gap-1"><MapPin size={12} />{event.location}</span>}</p>
                <h3 className="t-h3 mt-3">{event.title}</h3>
                <p className="t-body text-mute mt-4">{event.description || event.desc}</p>
                <a href={icsUrl(event)} download={`${event.title}.ics`} className="btn btn-ink mt-6"><CalendarPlus size={16} /> {fr ? 'Ajouter à mon agenda' : 'Add to calendar'}</a>
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
