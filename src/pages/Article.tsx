import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { IMG } from '../content/site';
import { Reveal, WordReveal } from '../components/ui/motion';
import { Seo, Chapter, fmtDate } from '../components/ui';
import { NewsCard } from '../components/sections';

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const [article, setArticle] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>('loading');
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);

  useEffect(() => {
    if (!id) return;
    setState('loading');
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'news', id));
        if (!snap.exists()) { setState('missing'); return; }
        setArticle({ id: snap.id, ...snap.data() });
        setState('ok');
        const rs = await getDocs(query(collection(db, 'news'), orderBy('date', 'desc'), limit(4)));
        setRelated(rs.docs.map((d) => ({ id: d.id, ...d.data() })).filter((n) => n.id !== id).slice(0, 3));
      } catch {
        setState('missing');
      }
    })();
  }, [id]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: article.title, url }); } catch { /* cancelled */ } return; }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (state === 'loading') return <main className="min-h-[60vh]" />;
  if (state === 'missing' || !article) {
    return (
      <main className="wrap section" style={{ paddingTop: 'calc(var(--header-h) + 5rem)' }}>
        <h1 className="t-h2">{t.ui.notFound}</h1>
        <Link to="/actualites" className="btn btn-ink mt-8"><ArrowLeft size={16} /> {t.ui.backNews}</Link>
      </main>
    );
  }

  const paragraphs: string[] = Array.isArray(article.content) ? article.content : String(article.content || '').split(/\n\n+/);

  return (
    <main>
      <Seo title={`${article.title} | ${t.nav.news} — Georges Claude Private Academy`} description={paragraphs[0]?.slice(0, 155) || article.title} path={`/actualites/${id}`} image={article.image || IMG.event} type="article" breadcrumbs={[{ name: t.nav.newsEvents, path: '/actualites' }, { name: article.title, path: `/actualites/${id}` }]} jsonLd={{ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: article.title, image: article.image, datePublished: typeof article.date === 'string' ? article.date : undefined, author: { '@type': 'Organization', name: 'Georges Claude Private Academy' }, publisher: { '@id': 'https://agc.ma/#school' } }} />
      <article>
        <header className="relative bg-ink text-salt on-dark overflow-hidden min-h-[70svh] flex items-end">
          <motion.div className="absolute inset-0" style={reduce ? undefined : { y }}>
            <img src={article.image} alt="" className="w-full h-[120%] object-cover" referrerPolicy="no-referrer" fetchPriority="high" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
          <div className="wrap relative z-10 pb-14" style={{ paddingTop: 'calc(var(--header-h) + 6rem)' }}>
            <Link to="/actualites" className="flex w-fit items-center gap-2 text-sm text-sea hover:text-white mb-8 group"><ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> {t.ui.backNews}</Link>
            <Chapter saffron className="mb-5">{article.category}{article.date ? ` — ${fmtDate(article.date, currentLang)}` : ''}</Chapter>
            <h1 className="t-h1 max-w-[18ch]"><WordReveal text={article.title} inView={false} /></h1>
            {article.author && <p className="text-sea mt-6">{article.author}</p>}
          </div>
        </header>

        <div className="wrap section grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 lg:col-start-2">
            <div className="t-body space-y-6 max-w-[64ch]">
              {paragraphs.map((p, i) => <p key={i} className={i === 0 ? 't-lead text-ink' : 'text-ink/85'}>{p}</p>)}
            </div>
            {article.additionalImages?.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4 mt-12">
                {article.additionalImages.map((src: string, i: number) => (
                  <Reveal key={i} delay={0.05 * i} className={`img-frame ${i === 0 ? 'sm:col-span-2 aspect-[16/10]' : 'aspect-[4/3]'}`}><img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" /></Reveal>
                ))}
              </div>
            )}
            {article.tags?.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-10">{article.tags.map((tag: string) => <li key={tag} className="text-[13px] font-medium rounded-full border border-ink/15 px-3 py-1">{tag}</li>)}</ul>
            )}
            <div className="mt-10 pt-6 border-t border-ink/12 flex items-center gap-4">
              <button onClick={share} className="btn btn-ghost">{copied ? <><Check size={16} /> {t.ui.copied}</> : <><Share2 size={16} /> {t.ui.share}</>}</button>
            </div>
          </div>
          <aside className="lg:col-span-3 lg:col-start-10">
            {related.length > 0 && (
              <div className="lg:sticky lg:top-28">
                <Chapter className="mb-6">{t.ui.related}</Chapter>
                <div className="space-y-8">{related.map((r) => <NewsCard key={r.id} item={r} />)}</div>
              </div>
            )}
          </aside>
        </div>
      </article>
    </main>
  );
};

export default Article;
