import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Check, Bus, Clock, ShieldCheck, ArrowUpRight, Loader2 } from 'lucide-react';
import { db } from '../../firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { SITE, IMG } from '../../content/site';
import { WordReveal, Reveal } from '../../components/ui/motion';
import { Button, Chapter, Marquee, Accordion } from '../../components/ui';
import { StatGrid, NewsCard } from '../../components/sections';

/* ------------------------------------------------------------------ */
/* Preuves — résultats + témoignages                                    */
/* ------------------------------------------------------------------ */
export const Proof = () => {
  const { t } = useLanguage();
  const testimonials: { name: string; role: string; text: string }[] = t.home.testimonials;
  const half = Math.ceil(testimonials.length / 2);
  const card = (tm: any, i: number) => (
    <figure key={i} className="w-[320px] sm:w-[380px] card p-6 shrink-0">
      <blockquote className="font-serif text-[17px] leading-relaxed text-ink">« {tm.text} »</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="w-9 h-9 rounded-full bg-ink text-salt flex items-center justify-center font-display font-semibold text-sm">{tm.name.replace(/^(M\.|Mme\.?|Mr\.?)\s*/, '')[0]}</span>
        <span><span className="block font-semibold text-sm">{tm.name}</span><span className="block t-meta">{tm.role}</span></span>
      </figcaption>
    </figure>
  );
  return (
    <section className="section bg-salt overflow-hidden">
      <div className="wrap">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-7">
            <Chapter className="mb-6">{t.ui.results} — {t.ui.resultsYear}</Chapter>
            <h2 className="t-h2 max-w-[14ch]"><WordReveal text={t.ui.trustTitle} /></h2>
          </div>
          <Reveal className="lg:col-span-5" delay={0.15}>
            <p className="t-body text-mute max-w-[44ch]">{t.testimonials.desc} {t.ui.mentionsLine}</p>
          </Reveal>
        </div>
        <Reveal><StatGrid /></Reveal>
      </div>
      <div className="mt-16 space-y-5">
        <Marquee items={testimonials.slice(0, half).map(card)} duration={70} separator={false} className="[&_.marquee]:gap-5" />
        <Marquee items={testimonials.slice(half).map(card)} duration={80} reverse separator={false} className="[&_.marquee]:gap-5" />
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Journal — actualités dynamiques                                      */
/* ------------------------------------------------------------------ */
export const Journal = () => {
  const { t } = useLanguage();
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('date', 'desc'), limit(4));
    const unsub = onSnapshot(q, (snap) => setNews(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), () => setNews([]));
    return () => unsub();
  }, []);
  const featured = news.find((n) => n.isFeatured || n.featured) || news[0];
  const rest = news.filter((n) => n.id !== featured?.id).slice(0, 3);
  return (
    <section className="section bg-salt-2/60">
      <div className="wrap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Chapter className="mb-6">{t.nav.newsEvents}</Chapter>
            <h2 className="t-h2 max-w-[14ch]"><WordReveal text={t.ui.journalTitle} /></h2>
          </div>
          <Reveal delay={0.15} className="max-w-[44ch]">
            <p className="t-body text-mute">{t.ui.journalDesc}</p>
            <Link to="/actualites" className="ulink font-semibold inline-block mt-4">{t.news.allNews}</Link>
          </Reveal>
        </div>
        {news.length === 0 ? (
          <div className="card p-10 text-center text-mute">{t.ui.journalEmpty}</div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            <Reveal className="lg:col-span-7"><NewsCard item={featured} big /></Reveal>
            <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-8">
              {rest.map((n, i) => (
                <Reveal key={n.id} delay={i * 0.08}>
                  <Link to={`/actualites/${n.id}`} className="group flex gap-5 items-start">
                    <div className="img-frame img-zoom w-32 sm:w-36 aspect-square shrink-0"><img src={n.image} alt={n.title} loading="lazy" referrerPolicy="no-referrer" /></div>
                    <div>
                      <p className="t-meta">{n.category}</p>
                      <p className="t-h4 mt-1 group-hover:text-ink-3 transition-colors">{n.title}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold mt-2 ulink">{t.ui.readMore} <ArrowUpRight size={14} /></span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
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
  const faqs = [1, 2, 3, 4].map((n) => ({ q: t.faq[`q${n}`].q, a: t.faq[`q${n}`].a }));
  const fr = currentLang === 'FR';
  return (
    <section className="section bg-salt">
      <div className="wrap">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Chapter className="mb-6">{t.faq.label}</Chapter>
            <h2 className="t-h2"><WordReveal text={t.ui.practicalTitle} /></h2>
            <Reveal delay={0.1}><p className="t-body text-mute mt-6 max-w-[36ch]">{t.ui.practicalDesc}</p></Reveal>
            <Reveal delay={0.2} className="mt-10 card p-6 space-y-5">
              {[
                { icon: Clock, k: t.ui.hours, v: SITE.hours[currentLang] },
                { icon: Bus, k: fr ? 'Transport' : 'Transport', v: fr ? 'Flotte de bus couvrant El Jadida, Sidi Bouzid, Haouzia…' : 'Bus fleet covering El Jadida, Sidi Bouzid, Haouzia…' },
                { icon: ShieldCheck, k: fr ? 'Homologation' : 'Accreditation', v: fr ? 'Ministère de l’Éducation Nationale' : 'Ministry of National Education' },
              ].map((r, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-9 h-9 rounded-full bg-sea/50 flex items-center justify-center shrink-0 text-ink"><r.icon size={16} /></span>
                  <span><span className="block font-semibold text-sm">{r.k}</span><span className="block t-small text-mute">{r.v}</span></span>
                </div>
              ))}
              <div className="pt-2 border-t border-ink/10">
                <p className="font-semibold text-sm">{t.ui.moreQuestions}</p>
                <p className="t-small text-mute mt-1">{t.ui.moreQuestionsDesc}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <a href={SITE.phoneHref} className="btn btn-ghost !h-10 text-sm">{t.ui.call}</a>
                  <Link to="/contact" className="btn btn-ink !h-10 text-sm">{t.ui.writeUs}</Link>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.1}>
            <Accordion items={faqs} />
          </Reveal>
        </div>
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
            <h2 className="t-h1 max-w-[12ch]"><WordReveal text={t.contact.title} /></h2>
            <Reveal delay={0.15}><p className="t-lead text-sea mt-8 max-w-[40ch]">{t.contact.desc}</p></Reveal>
            <ol className="mt-12 space-y-6 max-w-md">
              {steps.map((s: any, i: number) => (
                <Reveal key={i} delay={0.1 + i * 0.08} as="li" className="flex gap-5 border-t border-white/15 pt-5">
                  <span className="font-display text-saffron text-xl w-8 shrink-0">{i + 1}</span>
                  <span><span className="block t-h4">{s.title}</span><span className="block t-small text-sea-2 mt-1">{s.desc}</span></span>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.2}>
            <div className="on-light rounded-[2rem] bg-salt text-ink p-7 md:p-9 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
              {state === 'done' ? (
                <div className="py-8 text-center">
                  <span className="mx-auto w-14 h-14 rounded-full bg-leaf text-salt flex items-center justify-center mb-5"><Check size={24} /></span>
                  <p className="t-h3">{t.ui.sentTitle}</p>
                  <p className="t-body text-mute mt-3">{t.ui.sentDesc}</p>
                  <button className="ulink font-semibold mt-6" onClick={() => setState('idle')}>{t.ui.newMessage}</button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <div>
                    <p className="t-h3">{t.contact.formTitle}</p>
                    <p className="t-small text-mute mt-1">{t.ui.contactFormDesc}</p>
                  </div>
                  <div className="field"><label htmlFor="h-name">{t.contact.name}</label><input id="h-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></div>
                  <div className="field"><label htmlFor="h-phone">{t.contact.phone}</label><input id="h-phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" /></div>
                  <div className="field"><label htmlFor="h-email">{t.contact.email}</label><input id="h-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></div>
                  <Button type="submit" className="w-full" size="lg" disabled={state === 'sending'} icon="none">
                    {state === 'sending' ? <Loader2 className="animate-spin" size={18} /> : t.contact.btn}
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
