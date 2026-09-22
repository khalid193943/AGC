import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Check, Loader2, Phone, Mail, MessageCircle } from 'lucide-react';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE, IMG, REQUIREMENTS } from '../content/site';
import { WordReveal, Reveal } from '../components/ui/motion';
import { Seo, Chapter, Button, Accordion, scrollToId } from '../components/ui';
import { PageHero } from '../components/sections';

const Enrollment = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const e = t.enrollment;
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', grade: '', message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const faqs = [1, 2, 3, 4].map((n) => ({ q: t.faq[`q${n}`].q, a: t.faq[`q${n}`].a }));

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    setState('sending');
    try {
      await addDoc(collection(db, 'messages'), {
        name: form.fullName, email: form.email, phone: form.phone,
        message: `Niveau: ${form.grade}. ${form.message || ''}`.trim(),
        type: 'admissions', status: 'new', createdAt: serverTimestamp(),
      });
      setState('done');
      setForm({ fullName: '', phone: '', email: '', grade: '', message: '' });
    } catch { setState('idle'); }
  };

  return (
    <main>
      <Seo title={`${fr ? 'Inscription en ligne' : 'Online enrolment'} ${SITE.year} | Georges Claude Private Academy El Jadida`} description={e.heroDesc} path="/inscription" image={IMG.kids} />
      <PageHero chapter={`${t.nav.admissions} ${SITE.year}`} title={t.copy.enrollTitle} lead={t.copy.enrollLead} image={IMG.kids} imageAlt={fr ? 'Élèves de l’académie' : 'Academy students'}>
        <a href="#formulaire" onClick={scrollToId('formulaire')} className="btn btn-saffron">{e.formTitle}</a>
        <a href={SITE.phoneHref} className="btn btn-ghost-light"><Phone size={16} /> {SITE.phone}</a>
      </PageHero>

      {/* Étapes */}
      <section className="section bg-salt">
        <div className="wrap">
          <div className="grid lg:grid-cols-12 items-end">
            <div className="lg:col-span-8">
              <Chapter className="mb-6">{t.admissionsPage.journey}</Chapter>
              <h2 className="t-h2 max-w-[14ch]"><WordReveal text={t.ui.stepsTitle} /></h2>
            </div>
            <div data-mascot-spot className="hidden lg:block lg:col-span-3 lg:col-start-10 h-56" aria-hidden />
          </div>
          <ol className="grid md:grid-cols-4 gap-px bg-ink/12 border border-ink/12 rounded-[1.75rem] overflow-hidden mt-12">
            {e.steps.map((s: any, i: number) => (
              <Reveal key={i} as="li" delay={0.08 * i} className="bg-salt p-7 md:p-8">
                <span className="font-display text-saffron text-4xl font-medium">{s.number}</span>
                <p className="t-h4 mt-5">{s.title}</p>
                <p className="t-small text-mute mt-2">{s.desc}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.2}><p className="t-body text-mute mt-8 max-w-[60ch]">{t.admissions.requirementsDesc}</p></Reveal>
        </div>
      </section>

      {/* Formulaire + aide */}
      <section id="formulaire" className="section bg-ink text-salt on-dark grain relative overflow-hidden scroll-mt-16">
        <div className="wrap grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Chapter saffron className="mb-6">{e.formTitle}</Chapter>
            <h2 className="t-h2 max-w-[12ch]"><WordReveal text={t.copy.enrollFormTitle} /></h2>
            <Reveal delay={0.1}><p className="t-body text-sea mt-6 max-w-[42ch]">{e.formDesc}</p></Reveal>
            <Reveal delay={0.2} className="mt-10 space-y-6">
              <div>
                <p className="t-meta mb-3">{t.enrollment.whyTitle}</p>
                <ul className="space-y-3">
                  {e.whyItems.map((w: any) => <li key={w.title} className="flex gap-3"><Check size={18} className="text-saffron shrink-0 mt-0.5" /><span><strong className="font-semibold">{w.title}</strong> <span className="text-sea-2">— {w.desc}</span></span></li>)}
                </ul>
              </div>
              <div className="card-dark p-6">
                <p className="font-semibold mb-3">{e.helpTitle}</p>
                <div className="space-y-2 text-[15px]">
                  <a href={SITE.phoneHref} className="flex items-center gap-3 hover:text-saffron transition-colors"><Phone size={15} /> {SITE.phone}</a>
                  <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-saffron transition-colors"><MessageCircle size={15} /> {SITE.mobile} (WhatsApp)</a>
                  <a href={`mailto:${SITE.emailAdmissions}`} className="flex items-center gap-3 hover:text-saffron transition-colors"><Mail size={15} /> {SITE.emailAdmissions}</a>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.15}>
            <div className="on-light rounded-[2rem] bg-salt text-ink p-7 md:p-10">
              {state === 'done' ? (
                <div className="py-10 text-center">
                  <span className="mx-auto w-14 h-14 rounded-full bg-leaf text-salt flex items-center justify-center mb-5"><Check size={24} /></span>
                  <p className="t-h3">{e.successTitle}</p>
                  <p className="t-body text-mute mt-3 max-w-[40ch] mx-auto">{e.successDesc}</p>
                  <button className="ulink font-semibold mt-6" onClick={() => setState('idle')}>{e.newRequest}</button>
                </div>
              ) : (
                <form onSubmit={submit} className="grid sm:grid-cols-2 gap-5">
                  <div className="field sm:col-span-2"><label htmlFor="f-name">{e.fullName} *</label><input id="f-name" required value={form.fullName} onChange={(ev) => setForm({ ...form, fullName: ev.target.value })} placeholder={e.fullNamePlaceholder} autoComplete="name" /></div>
                  <div className="field"><label htmlFor="f-phone">{e.phone} *</label><input id="f-phone" type="tel" required value={form.phone} onChange={(ev) => setForm({ ...form, phone: ev.target.value })} autoComplete="tel" /></div>
                  <div className="field"><label htmlFor="f-email">{e.email}</label><input id="f-email" type="email" value={form.email} onChange={(ev) => setForm({ ...form, email: ev.target.value })} autoComplete="email" /></div>
                  <div className="field sm:col-span-2">
                    <label htmlFor="f-grade">{e.grade} *</label>
                    <select id="f-grade" required value={form.grade} onChange={(ev) => setForm({ ...form, grade: ev.target.value })}>
                      <option value="">{e.gradePlaceholder}</option>
                      <option value="maternelle">{t.programs.p1.title} — {t.ui.cycleAges.maternelle}</option>
                      <option value="primaire">{t.programs.p2.title} — {t.ui.cycleAges.primaire}</option>
                      <option value="college">{t.programs.p3.title} — {t.ui.cycleAges.college}</option>
                      <option value="lycee">{t.programs.p4.title} — {t.ui.cycleAges.lycee}</option>
                    </select>
                  </div>
                  <div className="field sm:col-span-2"><label htmlFor="f-msg">{e.message}</label><textarea id="f-msg" rows={4} value={form.message} onChange={(ev) => setForm({ ...form, message: ev.target.value })} placeholder={e.messagePlaceholder} /></div>
                  <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="t-meta">* {t.ui.requiredNote}</p>
                    <Button type="submit" size="lg" disabled={state === 'sending'} icon="none">{state === 'sending' ? <Loader2 className="animate-spin" size={18} /> : e.submitBtn}</Button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Dossier + FAQ */}
      <section className="section bg-salt">
        <div className="wrap grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Chapter className="mb-6">{t.admissions.requirementsTitle}</Chapter>
            <h2 className="t-h2"><WordReveal text={t.ui.requirementsTitle} /></h2>
            <Reveal delay={0.1}><p className="t-body text-mute mt-5 max-w-[40ch]">{t.ui.requirementsDesc}</p></Reveal>
            <ul className="mt-8 divide-y divide-ink/12 border-y border-ink/12">
              {REQUIREMENTS[currentLang].map((r, i) => (
                <Reveal key={i} as="li" delay={0.04 * i} amount={0.6} className="py-4 flex gap-4"><span className="w-7 h-7 rounded-full bg-sea/50 flex items-center justify-center shrink-0 text-ink"><Check size={14} /></span><span className="t-body">{r}</span></Reveal>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Chapter className="mb-6">{t.faq.label}</Chapter>
            <h2 className="t-h2 mb-8"><WordReveal text={t.faq.title} /></h2>
            <Accordion items={faqs} />
            <p className="t-small text-mute mt-6">{t.faq.contactUsDesc} <Link to="/contact" className="ulink font-semibold text-ink">{t.faq.contactUs}</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Enrollment;
