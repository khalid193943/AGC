import { useState, FormEvent } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Check, Loader2, Phone, Mail, MessageCircle, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE, IMG } from '../content/site';
import { WordReveal, Reveal } from '../components/ui/motion';
import { Seo, Chapter, Button } from '../components/ui';
import { PageHero } from '../components/sections';

const Contact = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: t.ui.subjectOptions[0], message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      await addDoc(collection(db, 'messages'), { name: form.name, email: form.email, phone: form.phone, message: `[${form.subject}] ${form.message}`, type: 'contact', status: 'new', createdAt: serverTimestamp() });
      setState('done');
      setForm({ name: '', email: '', phone: '', subject: t.ui.subjectOptions[0], message: '' });
    } catch { setState('idle'); }
  };

  const channels = [
    { icon: Phone, label: t.ui.call, value: SITE.phone, href: SITE.phoneHref, note: fr ? 'Secrétariat, lun – ven' : 'Office, Mon – Fri' },
    { icon: MessageCircle, label: 'WhatsApp', value: SITE.mobile, href: SITE.whatsappHref, note: fr ? 'Réponse rapide' : 'Quick reply' },
    { icon: Mail, label: t.ui.writeUs, value: SITE.email, href: `mailto:${SITE.email}`, note: SITE.emailAdmissions },
  ];

  return (
    <main>
      <Seo title={`${t.nav.contact} | Georges Claude Private Academy — Sidi Bouzid, El Jadida`} description={t.ui.contactDesc} path="/contact" image={IMG.campus} />
      <PageHero chapter={t.nav.contact} title={t.copy.contactTitle} lead={t.ui.contactDesc} compact />

      {/* Canaux */}
      <section className="bg-salt border-b border-ink/10">
        <div className="wrap grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/12">
          {channels.map((c, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group block py-8 md:px-8 first:pl-0">
                <c.icon size={20} className="text-ink-3 mb-4" />
                <p className="t-meta">{c.label}</p>
                <p className="t-h4 mt-1 group-hover:text-ink-3 transition-colors">{c.value}</p>
                <p className="t-small text-mute mt-1">{c.note}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Formulaire + infos */}
      <section className="section bg-salt">
        <div className="wrap grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Chapter className="mb-6">{t.ui.address}</Chapter>
            <h2 className="t-h3">{SITE.address.line1}<br />{SITE.address.line2}</h2>
            <p className="t-small text-mute mt-2">{SITE.address.plusCode}</p>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="ulink font-semibold inline-flex items-center gap-1.5 mt-4"><MapPin size={15} /> {t.ui.openMaps} <ArrowUpRight size={14} /></a>
            <div className="mt-10 border-t border-ink/12 pt-6">
              <p className="t-meta flex items-center gap-2"><Clock size={14} /> {t.ui.hours}</p>
              <p className="t-body mt-2">{SITE.hours[currentLang]}</p>
            </div>
            <div className="mt-8 border-t border-ink/12 pt-6">
              <p className="t-meta">{t.ui.followUs}</p>
              <div className="flex gap-4 mt-2">
                <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="ulink font-semibold">Instagram</a>
                <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="ulink font-semibold">Facebook</a>
              </div>
            </div>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.1}>
            <div className="card p-7 md:p-10">
              {state === 'done' ? (
                <div className="py-10 text-center">
                  <span className="mx-auto w-14 h-14 rounded-full bg-leaf text-salt flex items-center justify-center mb-5"><Check size={24} /></span>
                  <p className="t-h3">{t.ui.sentTitle}</p>
                  <p className="t-body text-mute mt-3">{t.ui.sentDesc}</p>
                  <button className="ulink font-semibold mt-6" onClick={() => setState('idle')}>{t.ui.newMessage}</button>
                </div>
              ) : (
                <form onSubmit={submit} className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <h2 className="t-h3"><WordReveal text={t.ui.contactFormTitle} /></h2>
                    <p className="t-small text-mute mt-1">{t.ui.contactFormDesc}</p>
                  </div>
                  <div className="field"><label htmlFor="c-name">{t.contact.name} *</label><input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></div>
                  <div className="field"><label htmlFor="c-phone">{t.contact.phone} *</label><input id="c-phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" /></div>
                  <div className="field"><label htmlFor="c-email">{t.contact.email} *</label><input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></div>
                  <div className="field"><label htmlFor="c-subject">{t.ui.subject}</label><select id="c-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>{t.ui.subjectOptions.map((o: string) => <option key={o}>{o}</option>)}</select></div>
                  <div className="field sm:col-span-2"><label htmlFor="c-msg">{t.ui.message} *</label><textarea id="c-msg" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
                  <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="t-meta">* {t.ui.requiredNote}</p>
                    <Button type="submit" size="lg" disabled={state === 'sending'} icon="none">{state === 'sending' ? <Loader2 className="animate-spin" size={18} /> : t.ui.send}</Button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default Contact;
