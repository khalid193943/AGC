import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, MessageSquare, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { ImageSlider } from '../components/ImageSlider';

interface ArticleDetailPageProps {
  t: any;
  currentLang: string;
}

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ t, currentLang }) => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [similarArticles, setSimilarArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'news', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
          
          // Fetch similar articles
          const q = query(collection(db, 'news'), limit(4));
          const querySnapshot = await getDocs(q);
          const articles: any[] = [];
          querySnapshot.forEach((doc) => {
            if (doc.id !== id) {
              articles.push({ id: doc.id, ...doc.data() });
            }
          });
          setSimilarArticles(articles.slice(0, 3));
        } else {
          // ... (keep fallback)
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `news/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentLang, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Article non trouvé</h2>
          <Link to="/actualites" className="text-blue-600 font-bold hover:underline">Retour aux actualités</Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `Découvrez cet article de l'Académie Georges Claude : ${article.title}`,
          url: window.location.href,
        });
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Share canceled by user.');
        } else {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier');
    }
  };

  const contentParagraphs = Array.isArray(article.content) 
    ? article.content 
    : (article.content ? article.content.split('\n\n') : []);

  return (
    <main className="bg-blue-950 text-white">
      <Helmet>
        <title>{`${article.title} | Actualités Georges Claude Private Academy El Jadida`}</title>
        <meta name="description" content={article.content ? article.content[0].substring(0, 155) : `Découvrez les dernières actualités de l'Georges Claude Private Academy à El Jadida : ${article.title}.`} />
        <meta property="og:title" content={`${article.title} | Académie Georges Claude Private Academy El Jadida`} />
        <meta property="og:description" content={article.category} />
        <meta property="og:image" content={article.image} />
        <meta property="og:url" content={`https://agc.ma/actualites/${id}`} />
        <link rel="canonical" href={`https://agc.ma/actualites/${id}`} />
      </Helmet>

      {/* Article Header */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img 
            src={article.image} 
            alt={`${article.title} - Académie Georges Claude Private Academy El Jadida`} 
            width="1920"
            height="1080"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-30 scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-blue-950/80 to-blue-950"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.8)_100%)]"></div>
        </div>
        
        <div className="container-wide relative z-10 w-full">
          <Link 
            to="/actualites" 
            className="inline-flex items-center space-x-2 text-white/60 hover:text-amber-400 transition-colors mb-12 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span className="font-bold uppercase tracking-widest text-[10px] md:text-xs">Retour aux actualités</span>
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-6 text-amber-400 mb-8 font-bold text-[10px] md:text-sm tracking-widest uppercase">
                <span className="bg-white/5 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10">{article.category}</span>
                <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
                <span className="text-white/60">{article.date}</span>
              </div>
              
              <h1 className="text-white mb-8 font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-none">
                {article.title}
              </h1>
              
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Rédigé par</p>
                    <p className="text-white font-bold text-sm md:text-base">{article.author}</p>
                  </div>
                </div>
                <div className="h-12 w-px bg-white/10 hidden sm:block"></div>
                <div className="hidden sm:flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-white/60">
                    <Clock size={18} />
                    <span className="text-xs md:text-sm font-bold">5 min de lecture</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="hidden lg:flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="w-48 h-48 md:w-64 md:h-64 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 flex items-center justify-center text-amber-400 shadow-2xl relative group"
              >
                <div className="absolute inset-0 bg-amber-400/20 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <BookOpen size={120} className="relative z-10" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid lg:grid-cols-12 gap-20">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl mb-16">
                <img src={article.image} alt={`${article.title} Académie Georges Claude Private Academy`} className="w-full h-auto" referrerPolicy="no-referrer" loading="lazy" />
              </div>
              
              <div className="prose prose-lg prose-slate max-w-none">
                {contentParagraphs.map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-base md:text-lg text-slate-600 font-light leading-relaxed mb-8">
                    {paragraph}
                  </p>
                ))}
              </div>

              {article.additionalImages && article.additionalImages.length > 0 && (
                <div className="mt-16 pt-16 border-t border-slate-100">
                  <h3 className="font-bold text-blue-950 mb-8 border-l-8 border-amber-400 pl-6 uppercase tracking-widest text-sm">
                    Galerie
                  </h3>
                  <ImageSlider images={article.additionalImages} />
                </div>
              )}
              
              <div className="mt-16 pt-16 border-t border-slate-100 flex flex-wrap gap-4">
                {article.tags && article.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-slate-50 text-slate-500 px-6 py-2 rounded-full text-sm font-bold border border-slate-100">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-16 bg-slate-50 p-12 rounded-[3rem] flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <span className="font-bold text-blue-950 uppercase tracking-widest text-sm">Partager l'article</span>
                  <div className="flex space-x-4">
                    <button onClick={handleShare} aria-label="Partager l'article" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-900 shadow-sm hover:bg-blue-900 hover:text-white transition-all">
                      <Share2 size={20} />
                    </button>
                    <button aria-label="Sauvegarder l'article" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-900 shadow-sm hover:bg-blue-900 hover:text-white transition-all">
                      <Bookmark size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-12">
                {/* Related Articles */}
                <div>
                  <h3 className="font-bold text-blue-950 mb-8 border-l-8 border-amber-400 pl-6 uppercase tracking-widest text-sm">
                    Articles Similaires
                  </h3>
                  <div className="space-y-8">
                    {similarArticles.map((art) => (
                      <Link to={`/actualites/${art.id}`} key={art.id} className="group cursor-pointer">
                        <div className="flex gap-6">
                          <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg">
                            <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="text-lg font-bold text-blue-950 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">{art.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">{art.date}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter Removed */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ArticleDetailPage;
