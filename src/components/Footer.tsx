import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, MapPin, Phone, Mail, Clock, Send, CalendarCheck, Landmark, BookOpen, Sparkles, Handshake, Newspaper, Images, Puzzle, Compass, GraduationCap, UserPlus, Briefcase } from 'lucide-react';
import { SocialLinks, WhatsAppIcon } from './ui/Social';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE, IMG } from '../content/site';
import { Reveal, WordReveal } from './ui/motion';

export const Footer = () => {
  const { t, currentLang } = useLanguage();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');

  const subscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState('sending');
    try {
      await addDoc(collection(db, 'messages'), { name: 'Newsletter', email, phone: '', type: 'newsletter', status: 'new', createdAt: serverTimestamp() });
      setState('done');
      setEmail('');
    } catch {
      setState('idle');
    }
  };

  const cols = [
    { title: t.nav.explore, links: [
      { label: t.nav.academy, to: '/academie', Icon: Landmark },
      { label: t.nav.programs, to: '/programmes', Icon: BookOpen },
      { label: t.nav.life, to: '/vie-scolaire', Icon: Sparkles },
      { label: t.nav.partners, to: '/partenaires', Icon: Handshake },
      { label: t.nav.newsEvents, to: '/actualites', Icon: Newspaper },
      { label: t.nav.gallery, to: '/galerie', Icon: Images },
    ]},
    { title: t.nav.cyclesTitle, links: [
      { label: t.programs.p1.title, to: '/programmes/maternelle', Icon: Puzzle },
      { label: t.programs.p2.title, to: '/programmes/primaire', Icon: BookOpen },
      { label: t.programs.p3.title, to: '/programmes/college', Icon: Compass },
      { label: t.programs.p4.title, to: '/programmes/lycee', Icon: GraduationCap },
    ]},
    { title: t.nav.admissions, links: [
      { label: t.ui.enrollShort, to: '/inscription', Icon: UserPlus },
      { label: t.nav.contact, to: '/contact', Icon: Mail },
      { label: t.nav.recruitment, to: '/recrutement', Icon: Briefcase },
    ]},
  ];

  return (
    <footer className="relative bg-ink text-salt on-dark grain overflow-hidden">
      {/* Blason en filigrane */}
      <img src={IMG.logo} alt="" className="absolute -right-[6%] top-8 w-[46vw] max-w-[640px] opacity-[0.07] pointer-events-none select-none" referrerPolicy="no-referrer" loading="lazy" aria-hidden />
      {/* Invitation */}
      <div className="wrap pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <p className="chapter saffron mb-6">{t.ui.contactTitle}</p>
            <h2 className="t-h1 max-w-[12ch]">
              <WordReveal text={t.copy.footerTitle} />
            </h2>
          </div>
          <Reveal className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 sm:items-center lg:items-start" delay={0.2}>
            <Link to="/contact" className="btn btn-saffron btn-lg"><CalendarCheck size={18} /><span className="swap"><span>{t.contact.step2.title}</span><span aria-hidden>{t.contact.step2.title}</span></span></Link>
            <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light btn-lg"><WhatsAppIcon size={18} />{t.ui.whatsapp} · {SITE.mobile}<ArrowUpRight size={18} /></a>
          </Reveal>
        </div>
      </div>

      {/* Carte + coordonnées */}
      <div className="wrap relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 rounded-[2rem] overflow-hidden border border-white/12 bg-white/4">
          <div className="lg:col-span-5 p-8 md:p-10 flex flex-col gap-8">
            <div>
              <p className="t-meta mb-2 flex items-center gap-2"><MapPin size={14} className="text-saffron" />{t.ui.address}</p>
              <p className="t-h4 font-medium leading-snug">{SITE.address.line1}<br />{SITE.address.line2}</p>
              <p className="text-sea-2 text-sm mt-1">{SITE.address.plusCode}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="t-meta mb-2 flex items-center gap-2"><Phone size={14} className="text-saffron" />{t.ui.phone}</p>
                <a href={SITE.phoneHref} className="block hover:text-saffron transition-colors">{SITE.phone}</a>
                <a href={SITE.mobileHref} className="block hover:text-saffron transition-colors">{SITE.mobile}</a>
              </div>
              <div>
                <p className="t-meta mb-2 flex items-center gap-2"><Mail size={14} className="text-saffron" />{t.ui.email}</p>
                <a href={`mailto:${SITE.email}`} className="block hover:text-saffron transition-colors">{SITE.email}</a>
                <a href={`mailto:${SITE.emailAdmissions}`} className="block hover:text-saffron transition-colors">{SITE.emailAdmissions}</a>
              </div>
            </div>
            <div>
              <p className="t-meta mb-2 flex items-center gap-2"><Clock size={14} className="text-saffron" />{t.ui.hours}</p>
              <p>{SITE.hours[currentLang]}</p>
            </div>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="ulink self-start text-sm font-semibold inline-flex items-center gap-1.5"><MapPin size={14} />{t.ui.openMaps}</a>
          </div>
          <div className="lg:col-span-7 min-h-[320px] lg:min-h-[420px] relative">
            {import.meta.env.VITE_PREVIEW === '1' ? (
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink-2 text-center p-8 hover:bg-ink-3 transition-colors">
                <span className="w-12 h-12 rounded-full bg-saffron text-ink flex items-center justify-center"><ArrowUpRight size={20} /></span>
                <span className="t-h4">{t.ui.openMaps}</span>
                <span className="text-sea-2 text-sm">{SITE.address.plusCode}</span>
              </a>
            ) : (
              <iframe
              src={SITE.mapsEmbed}
              title="Localisation Georges Claude Private Academy — Sidi Bouzid, El Jadida"
              className="absolute inset-0 w-full h-full grayscale-[0.4] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              />
            )}
          </div>
        </div>
      </div>

      {/* Liens */}
      <div className="wrap relative z-10 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={IMG.logo} alt="" className="h-20 w-20 object-contain" referrerPolicy="no-referrer" loading="lazy" />
              <span className="font-display font-semibold leading-tight text-xl">Georges Claude<br /><span className="text-sea-2 font-medium text-base">Private Academy</span></span>
            </Link>
            <p className="font-serif italic text-lg text-sea mt-6 max-w-[30ch]">{SITE.motto[currentLang]}</p>
            <p className="text-sm text-sea-2 mt-4 max-w-[38ch]">{t.footer.desc}</p>
          </div>
          {cols.map((c) => (
            <div key={c.title} className="lg:col-span-2">
              <p className="t-meta mb-4 !text-sea">{c.title}</p>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.to}><Link to={l.to} className="group inline-flex items-center gap-2 text-[15px]"><l.Icon size={14} className="text-sea-2 group-hover:text-saffron transition-colors" /><span className="ulink">{l.label}</span></Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-2 md:col-span-2 lg:col-start-11">
            <p className="t-meta mb-4 !text-sea">{t.footer.newsletter}</p>
            <p className="text-sm text-sea-2 mb-4">{t.footer.newsDesc}</p>
            <form onSubmit={subscribe} className="flex flex-col gap-2">
              <label className="sr-only" htmlFor="nl-email">{t.footer.emailPlaceholder}</label>
              <input id="nl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.footer.emailPlaceholder} className="h-11 rounded-full bg-white/6 border border-white/15 px-4 text-sm placeholder:text-sea-2/70 focus:border-saffron focus:outline-none" />
              <button className="btn btn-ghost-light !h-11 text-sm" disabled={state !== 'idle'}>
                {state === 'done' ? <><Check size={16} /> OK</> : state === 'sending' ? t.ui.sending : <><Send size={15} /> {t.footer.subscribe}</>}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-[13px] text-sea-2">
          <p>© 2026 {SITE.name}. {t.footer.rights}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <SocialLinks dark />
            <Link to="/mentions-legales" className="ulink">{t.legal.title}</Link>
            <Link to="/politique-confidentialite" className="ulink">{t.privacy.title}</Link>
            <Link to="/admin/login" className="ulink opacity-60">Admin</Link>
          </div>
        </div>
      </div>

      {/* Tricolore de l'identité, discret */}
      <div className="flex h-1.5" aria-hidden>
        <div className="flex-1 bg-signal" /><div className="flex-1 bg-saffron" /><div className="flex-1 bg-ink-3" />
      </div>
    </footer>
  );
};
