import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Check, Bus, Clock, ShieldCheck, ArrowUpRight, Loader2, Search, CalendarCheck, FileCheck, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { db } from '../../firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { SITE, IMG } from '../../content/site';
import { FAQ } from '../../content/faq';
import { WordReveal, Reveal, EASE } from '../../components/ui/motion';
import { Button, Chapter, Marquee, Accordion, fmtDate, readingTime, isRecent } from '../../components/ui';
import { SectionHead } from '../../components/sections';

/* ------------------------------------------------------------------ */
/* Avis des parents — un témoignage à la fois, en grand                */
/* ------------------------------------------------------------------ */
export const Reviews = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const list: { name: string; role: string; text: string }[] = t.home.testimonials;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % list.length), 6500);
    return () => window.clearInterval(id);
  }, [paused, reduce, list.length]);
  const cur = list[i];
  const initial = (n: string) => n.replace(/^(M\.|Mme\.?|Mr\.?)\s*/, '')[0];
  return (
    <section className="section bg-salt-2/70 relative overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="wrap">
        <SectionHead chapter={fr ? 'Avis des parents' : 'Parents’ reviews'} title={fr ? 'Ce que disent les familles.' : 'What families say.'} />
        <div className="mt-14 mx-auto max-w-[900px] text-center">
          <span className="block mx-auto font-serif text-saffron text-6xl leading-none select-none" aria-hidden>“</span>
          <div className="relative min-h-[8rem] mt-4">
            <AnimatePresence mode="wait">
              <motion.blockquote key={i} className="font-serif text-ink text-[clamp(1.3rem,2vw,2rem)] leading-[1.35]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: EASE }}>
                {cur.text}
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={'a' + i} className="mt-8 flex items-center justify-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <span className="w-10 h-10 rounded-full bg-ink text-saffron flex items-center justify-center font-display font-semibold">{initial(cur.name)}</span>
              <span className="text-left"><span className="block font-semibold text-sm">{cur.name}</span><span className="block t-meta">{cur.role}</span></span>
            </motion.div>
          </AnimatePresence>
          {/* Navigation */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button onClick={() => setI((i - 1 + list.length) % list.length)} className="w-11 h-11 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink hover:text-salt transition-colors" aria-label={fr ? 'Avis précédent' : 'Previous review'}><ArrowLeft size={16} /></button>
            <ol className="flex items-center gap-2" aria-hidden>
              {list.map((_, k) => <li key={k}><button onClick={() => setI(k)} className={`block h-1 transition-all duration-500 ${k === i ? 'w-8 bg-ink' : 'w-3 bg-ink/25'}`} /></li>)}
            </ol>
            <button onClick={() => setI((i + 1) % list.length)} className="w-11 h-11 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink hover:text-salt transition-colors" aria-label={fr ? 'Avis suivant' : 'Next review'}><ArrowRight size={16} /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Journal — actualités dynamiques                                      */
/* ------------------------------------------------------------------ */
export const Journal = () => {
  const { t, currentLang } = useLanguage();
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('date', 'desc'), limit(5));
    const unsub = onSnapshot(q, (snap) => setNews(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), () => setNews([]));
    return () => unsub();
  }, []);
  const featured = news.find((n) => n.isFeatured || n.featured) || news[0];
  const rest = news.filter((n) => n.id !== featured?.id).slice(0, 4);
  return (
    <section className="section bg-salt-2/60 overflow-hidden">
      <div className="wrap">
        <SectionHead chapter={t.nav.newsEvents} title={t.copy.journalTitle} lead={t.copy.journalDesc} className="mb-12" />
        {news.length === 0 ? (
          <div className="card p-10 text-center text-mute">{t.ui.journalEmpty}</div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Fil de titres */}
            <div className="lg:col-span-12 -mx-[var(--gutter)] px-0 border-y border-ink/10 py-2.5 mb-2">
              <Marquee duration={45} items={news.map((n) => <Link key={n.id} to={`/actualites/${n.id}`} className="text-sm font-semibold whitespace-nowrap hover:underline"><span className="text-mute mr-2">{fmtDate(n.date, currentLang)}</span>{n.title}</Link>)} />
            </div>
            {/* À la une : image plein cadre, titre posé dessus */}
            <Reveal className="lg:col-span-7">
              <Link to={`/actualites/${featured.id}`} className="group relative block img-frame img-zoom aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[560px]">
                <img src={featured.image} alt={featured.title} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 md:p-10 text-salt">
                  <p className="t-meta !text-sea flex flex-wrap items-center gap-3">
                    <span className="rounded-none bg-saffron text-ink px-3 py-1 text-xs font-semibold">{featured.category || t.newsPage.latestNews}</span>
                    {isRecent(featured.date) && <span className="rounded-none bg-salt text-ink px-3 py-1 text-xs font-semibold">{currentLang === 'FR' ? 'Nouveau' : 'New'}</span>}
                    <span>{fmtDate(featured.date, currentLang)} · {readingTime(featured.content)} min</span>
                  </p>
                  <h3 className="t-h2 mt-4 max-w-[16ch] group-hover:text-saffron-2 transition-colors">{featured.title}</h3>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold mt-5 ulink">{t.ui.readMore} <ArrowUpRight size={15} /></span>
                </div>
              </Link>
            </Reveal>
            {/* À suivre : panneau encre */}
            <Reveal className="lg:col-span-5" delay={0.1}>
              <div className="bg-ink text-salt on-dark rounded-none p-6 md:p-8 h-full flex flex-col">
                <p className="chapter saffron mb-4">{t.newsPage.latestNews}</p>
                <ul className="divide-y divide-white/10 flex-1">
                  {rest.map((n) => (
                    <li key={n.id}>
                      <Link to={`/actualites/${n.id}`} className="group flex gap-5 py-5 items-center">
                        <div className="img-frame img-zoom w-20 aspect-square shrink-0 !rounded-none"><img src={n.image} alt="" loading="lazy" referrerPolicy="no-referrer" /></div>
                        <div className="min-w-0">
                          <p className="t-meta">{n.category}{n.date ? ` — ${fmtDate(n.date, currentLang)}` : ''} · {readingTime(n.content)} min{isRecent(n.date) && <span className="text-saffron font-semibold"> · {currentLang === 'FR' ? 'Nouveau' : 'New'}</span>}</p>
                          <p className="t-h4 mt-1 group-hover:text-saffron transition-colors">{n.title}</p>
                        </div>
                        <ArrowUpRight size={18} className="ml-auto shrink-0 text-sea-2 group-hover:text-saffron group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to="/actualites" className="btn btn-saffron mt-6 self-start">{t.news.allNews}</Link>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Informations pratiques — FAQ + repères                              */
/* ------------------------------------------------------------------ */
export const Practical = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const faqs = FAQ[currentLang].slice(0, 6);
  return (
    <section className="section bg-salt">
      <div className="wrap-narrow">
        <SectionHead chapter={t.faq.label} title={fr ? 'Questions fréquentes.' : 'Frequently asked questions.'} className="mb-12" />
        <Accordion items={faqs} />
        <p className="t-small text-mute mt-8">{t.ui.moreQuestionsDesc} <Link to="/contact" className="ulink font-semibold text-ink">{t.ui.writeUs}</Link></p>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Action — demande d'informations + parcours en 3 temps                */
/* ------------------------------------------------------------------ */
export const Action = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      await addDoc(collection(db, 'messages'), { ...form, type: 'contact', status: 'new', createdAt: serverTimestamp() });
      setState('done');
      setForm({ name: '', email: '', phone: '' });
    } catch {
      setState('idle');
    }
  };

  const steps = [t.contact.step1, t.contact.step2, t.contact.step3];
  const stepIcons = [Search, CalendarCheck, FileCheck];
  return (
    <section className="relative bg-ink text-salt on-dark section overflow-hidden grain">
      <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block opacity-40" aria-hidden>
        <img src={IMG.kids} alt="" className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/40" />
      </div>
      <div className="wrap relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6">
            <Chapter saffron className="mb-6">{t.nav.admissions} {SITE.year}</Chapter>
            <h2 className="t-h1 max-w-[14ch]"><WordReveal text={t.copy.actionTitle} /></h2>
            <Reveal delay={0.15}><p className="t-lead text-sea mt-8 max-w-[40ch]">{t.copy.actionDesc} {t.contact.desc}</p></Reveal>
            <ol className="mt-12 space-y-6 max-w-md">
              {steps.map((s: any, i: number) => (
                <Reveal key={i} delay={0.1 + i * 0.08} as="li" className="flex gap-5 border-t border-white/15 pt-5">
                  <span className="w-10 h-10 rounded-full border border-white/20 text-saffron flex items-center justify-center shrink-0">{(() => { const I = stepIcons[i]; return <I size={18} />; })()}</span>
                  <span><span className="block t-h4">{s.title}</span><span className="block t-small text-sea-2 mt-1">{s.desc}</span></span>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.2}>
            <div className="card-dark p-7 md:p-9 backdrop-blur-sm">
              {state === 'done' ? (
                <div className="py-8 text-center">
                  <span className="mx-auto w-14 h-14 rounded-full bg-saffron text-ink flex items-center justify-center mb-5"><Check size={24} /></span>
                  <p className="t-h3">{t.ui.sentTitle}</p>
                  <p className="t-body text-sea mt-3">{t.ui.sentDesc}</p>
                  <button className="ulink font-semibold mt-6" onClick={() => setState('idle')}>{t.ui.newMessage}</button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <div>
                    <p className="t-h3">{t.contact.formTitle}</p>
                    <p className="t-small text-sea-2 mt-1">{t.ui.contactFormDesc}</p>
                  </div>
                  <div className="field"><label htmlFor="h-name">{t.contact.name}</label><input id="h-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></div>
                  <div className="field"><label htmlFor="h-phone">{t.contact.phone}</label><input id="h-phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" /></div>
                  <div className="field"><label htmlFor="h-email">{t.contact.email}</label><input id="h-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></div>
                  <Button type="submit" variant="saffron" className="w-full" size="lg" disabled={state === 'sending'} icon="none">
                    {state === 'sending' ? <Loader2 className="animate-spin" size={18} /> : <><Send size={16} /> {t.contact.btn}</>}
                  </Button>
                  <p className="t-meta text-center">
                    <Link to="/inscription" className="ulink">{t.enrollment.formTitle}</Link>
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Admissions — courte section sombre, directe                         */
/* ------------------------------------------------------------------ */
export const AdmissionCta = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  return (
    <section className="bg-ink text-salt on-dark grain relative overflow-hidden">
      <div className="wrap py-16 lg:py-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <Chapter saffron className="mb-4">{t.nav.admissions} {SITE.year}</Chapter>
          <h2 className="t-h2"><WordReveal text={t.copy.actionTitle} /></h2>
          <Reveal delay={0.1}><p className="t-body text-sea mt-3 max-w-[52ch]">{fr ? 'Dossier en ligne, entretien avec la direction, test de niveau. Réponse sous 48 heures.' : 'Online file, interview with the management, placement test. Answer within 48 hours.'}</p></Reveal>
        </div>
        <Reveal delay={0.15} className="flex flex-wrap gap-3 shrink-0">
          <Button to="/inscription" variant="saffron" size="lg">{t.ui.enroll}</Button>
          <Button to="/contact" variant="ghost-light" size="lg" icon="none">{t.nav.contact}</Button>
        </Reveal>
      </div>
    </section>
  );
};
