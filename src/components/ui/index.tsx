import { ReactNode, useRef, useState, MouseEvent, useEffect, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ArrowRight, Plus } from 'lucide-react';
import { SITE, IMG } from '../../content/site';
import { EASE } from './motion';

/* ------------------------------------------------------------------ */
/* Button — pill, texte à double étage, effet magnétique (pointeur fin) */
/* ------------------------------------------------------------------ */
type BtnVariant = 'ink' | 'saffron' | 'ghost' | 'ghost-light';
interface ButtonProps {
  to?: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: BtnVariant;
  size?: 'md' | 'lg';
  icon?: 'arrow' | 'external' | 'none';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
}

export const Button = ({ to, href, onClick, children, variant = 'ink', size = 'md', icon = 'arrow', className = '', type = 'button', disabled, ariaLabel }: ButtonProps) => {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();
  const magnetic = !reduce && typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

  const onMove = (e: MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setOffset({ x: (e.clientX - (r.left + r.width / 2)) * 0.18, y: (e.clientY - (r.top + r.height / 2)) * 0.28 });
  };
  const onLeave = () => setOffset({ x: 0, y: 0 });

  const cls = `btn btn-${variant} ${size === 'lg' ? 'btn-lg' : ''} ${className}`;
  const label = typeof children === 'string' ? (
    <span className="swap"><span>{children}</span><span aria-hidden>{children}</span></span>
  ) : children;
  const Ico = icon === 'external' ? ArrowUpRight : icon === 'arrow' ? ArrowRight : null;
  const inner = (
    <>
      {label}
      {Ico && <span className="btn-ico"><Ico size={18} strokeWidth={2} /></span>}
    </>
  );
  const style: CSSProperties = { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` };
  const common = { className: cls, onMouseMove: onMove, onMouseLeave: onLeave, style, 'aria-label': ariaLabel } as any;

  if (to) return <Link ref={ref as any} to={to} {...common}>{inner}</Link>;
  if (href) return <a ref={ref as any} href={href} target="_blank" rel="noopener noreferrer" {...common}>{inner}</a>;
  return <button ref={ref as any} type={type} onClick={onClick} disabled={disabled} {...common}>{inner}</button>;
};

/* ------------------------------------------------------------------ */
/* Chapter — repère de chapitre (ligne + titre en bas de casse)        */
/* ------------------------------------------------------------------ */
export const Chapter = ({ children, className = '', saffron = false }: { children: ReactNode; className?: string; saffron?: boolean }) => (
  <p className={`chapter ${saffron ? 'saffron' : ''} ${className}`}>{children}</p>
);

/* ------------------------------------------------------------------ */
/* Marquee — bandeau défilant CSS (pausable, reduced-motion safe)      */
/* ------------------------------------------------------------------ */
export const Marquee = ({ items, className = '', reverse = false, duration = 40, separator = true }: { items: ReactNode[]; className?: string; reverse?: boolean; duration?: number; separator?: boolean }) => {
  const row = (
    <>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-8 pr-8">
          {it}
          {separator && <span className="inline-block w-1.5 h-1.5 rounded-full bg-saffron shrink-0" aria-hidden />}
        </span>
      ))}
    </>
  );
  return (
    <div className={`marquee-wrap overflow-hidden ${className}`} aria-hidden>
      <div className={`marquee ${reverse ? 'reverse' : ''}`} style={{ ['--marquee-duration' as any]: `${duration}s` }}>
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0">{row}</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Accordion                                                            */
/* ------------------------------------------------------------------ */
export const Accordion = ({ items, dark = false }: { items: { q: string; a: string }[]; dark?: boolean }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={`divide-y ${dark ? 'divide-white/12' : 'divide-ink/12'} border-y ${dark ? 'border-white/12' : 'border-ink/12'}`}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              className="w-full flex items-start justify-between gap-6 py-6 text-left group"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="t-h4 pr-4">{it.q}</span>
              <span className={`shrink-0 mt-0.5 w-9 h-9 rounded-full border flex items-center justify-center transition-transform duration-500 ${dark ? 'border-white/25' : 'border-ink/20'} ${isOpen ? 'rotate-45 bg-saffron text-ink border-saffron' : 'group-hover:border-current'}`}>
                <Plus size={16} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="c"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className={`t-body pb-7 max-w-[62ch] ${dark ? 'text-sea' : 'text-mute'}`}>{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Seo — balises par page                                               */
/* ------------------------------------------------------------------ */
export const Seo = ({ title, description, path = '/', image = IMG.school, type = 'website', jsonLd, breadcrumbs, faq }: { title: string; description: string; path?: string; image?: string; type?: 'website' | 'article'; jsonLd?: object | object[]; breadcrumbs?: { name: string; path: string }[]; faq?: { q: string; a: string }[] }) => {
  const url = `${SITE.domain}${path}`;
  const ogImage = image.startsWith('/') ? `${SITE.domain}${image}` : image;
  const blocks: object[] = [];
  if (jsonLd) blocks.push(...(Array.isArray(jsonLd) ? jsonLd : [jsonLd]));
  if (breadcrumbs && breadcrumbs.length) blocks.push(schema.breadcrumb(breadcrumbs));
  if (faq && faq.length) blocks.push(schema.faq(faq));
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <link rel="canonical" href={url} />
      {blocks.map((b, i) => <script key={i} type="application/ld+json">{JSON.stringify(b)}</script>)}
    </Helmet>
  );
};

/* ------------------------------------------------------------------ */
/* Données structurées (SEO / GEO)                                      */
/* ------------------------------------------------------------------ */
export const schema = {
  breadcrumb: (items: { name: string; path: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Accueil', path: '/' }, ...items].map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE.domain}${it.path}` })),
  }),
  faq: (items: { q: string; a: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
  }),
  course: (opts: { name: string; description: string; path: string; ages: string; lang: 'FR' | 'EN' }) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    url: `${SITE.domain}${opts.path}`,
    inLanguage: ['fr', 'ar', 'en'],
    educationalLevel: opts.name,
    audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: opts.ages },
    provider: { '@type': 'School', name: SITE.name, url: SITE.domain },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'onsite', location: { '@type': 'Place', name: SITE.name, address: `${SITE.address.line1}, ${SITE.address.line2}` } },
  }),
  article: (a: { title: string; description: string; image?: string; path: string; date?: string; category?: string }) => ({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.title,
    description: a.description,
    image: a.image ? [a.image] : undefined,
    datePublished: a.date,
    articleSection: a.category,
    mainEntityOfPage: `${SITE.domain}${a.path}`,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: IMG.logo } },
  }),
  jobs: (jobs: { title: string; description?: string; date?: string }[]) => jobs.map((j) => ({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: j.title,
    description: j.description || j.title,
    datePosted: j.date,
    employmentType: 'FULL_TIME',
    hiringOrganization: { '@type': 'Organization', name: SITE.name, sameAs: SITE.domain },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', streetAddress: SITE.address.line1, addressLocality: 'El Jadida', postalCode: '24005', addressCountry: 'MA' } },
  })),
};

/* ------------------------------------------------------------------ */
/* ArchImage — image en arche (signature visuelle : arcades d'El Jadida) */
/* ------------------------------------------------------------------ */
export const ArchImage = ({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) => (
  <div className={`img-arch ${className}`}>
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" referrerPolicy="no-referrer" />
  </div>
);

/* ------------------------------------------------------------------ */
/* ScrollHint                                                           */
/* ------------------------------------------------------------------ */
export const ScrollHint = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 text-salt/70 text-sm">
    <span className="relative block w-px h-12 bg-white/25 overflow-hidden">
      <motion.span
        className="absolute left-0 top-0 w-px h-6 bg-saffron"
        animate={{ y: ['-100%', '200%'] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </span>
    {label}
  </div>
);

/* ------------------------------------------------------------------ */
/* useIsDesktop                                                         */
/* ------------------------------------------------------------------ */
export const useMedia = (query: string) => {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = () => setM(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [query]);
  return m;
};

/* ------------------------------------------------------------------ */
/* Formatage de date Firestore / string                                 */
/* ------------------------------------------------------------------ */
export const fmtDate = (d: any, lang: 'FR' | 'EN') => {
  if (!d) return '';
  let date: Date | null = null;
  if (d?.seconds) date = new Date(d.seconds * 1000);
  else if (d?.toDate) date = d.toDate();
  else if (typeof d === 'string') {
    const p = new Date(d);
    if (!isNaN(p.getTime())) date = p;
    else return d;
  }
  if (!date) return '';
  return date.toLocaleDateString(lang === 'FR' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

/* ------------------------------------------------------------------ */
/* Défilement vers une ancre de la page (compatible avec tout routeur)  */
/* ------------------------------------------------------------------ */
export const scrollToId = (id: string) => (e?: { preventDefault: () => void }) => {
  e?.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};

/* ------------------------------------------------------------------ */
/* Outils du journal : date, temps de lecture, nouveauté, fichier .ics  */
/* ------------------------------------------------------------------ */
export const toDate = (d: any): Date | null => {
  if (!d) return null;
  if (d?.seconds) return new Date(d.seconds * 1000);
  if (d?.toDate) return d.toDate();
  if (d instanceof Date) return d;
  const p = new Date(d);
  return isNaN(p.getTime()) ? null : p;
};
export const readingTime = (text: any) => Math.max(1, Math.round(String(Array.isArray(text) ? text.join(' ') : text || '').split(/\s+/).length / 180));
export const isRecent = (d: any, days = 14) => { const dt = toDate(d); return !!dt && Date.now() - dt.getTime() < days * 86400000; };
export const icsUrl = (ev: { title: string; description?: string; date: any; time?: string; location?: string }) => {
  const dt = toDate(ev.date) || new Date();
  const [h, m] = (ev.time || '09:00').split(':').map((x) => parseInt(x, 10) || 0);
  const start = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), h, m);
  const end = new Date(start.getTime() + 2 * 3600000);
  const f = (x: Date) => x.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const esc = (x = '') => x.replace(/\n/g, '\\n').replace(/,/g, '\\,');
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Georges Claude Private Academy//FR', 'BEGIN:VEVENT', `UID:${start.getTime()}@agc.ma`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`, `SUMMARY:${esc(ev.title)}`, `DESCRIPTION:${esc(ev.description || '')}`, `LOCATION:${esc(ev.location || SITE.address.line1 + ', ' + SITE.address.line2)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(body);
};
