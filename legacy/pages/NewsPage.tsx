import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { 
  ArrowRight, Calendar, Clock, Globe, 
  Shield, Heart, Sparkles, Play, Quote, 
  Zap, Award, Camera, Image as ImageIcon,
  Share2, Bookmark, MessageSquare, BookOpen,
  MapPin, X
} from 'lucide-react';

interface NewsPageProps {
  t: any;
  currentLang: string;
}

import { ASSETS } from '../constants';
import { ImageSlider } from '../components/ImageSlider';
import { EventGallery } from '../components/EventGallery';

import { ColorSeparator } from '../components/ColorSeparator';

const NewsPage: React.FC<NewsPageProps> = ({ t, currentLang }) => {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [eventsItems, setEventsItems] = useState<any[]>([]);
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMoment, setSelectedMoment] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // New state for Event Modal
  const content = t.newsPage;

  useEffect(() => {
    // Fetch News
    const qNews = query(collection(db, 'news'), orderBy('date', 'desc'));
    const unsubscribeNews = onSnapshot(qNews, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'news');
    });

    // Fetch Events
    const qEvents = query(collection(db, 'events'), orderBy('date', 'desc'));
    const unsubscribeEvents = onSnapshot(qEvents, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEventsItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'events');
    });

    // Fetch Moments
    const qMoments = query(collection(db, 'moments'), orderBy('createdAt', 'desc'), limit(8));
    const unsubscribeMoments = onSnapshot(qMoments, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMoments(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'moments');
      setLoading(false);
    });

    return () => {
      unsubscribeNews();
      unsubscribeEvents();
      unsubscribeMoments();
    };
  }, []);

  const defaultNews = [
    { 
      id: '1',
      title: t.news.main.title, 
      desc: t.news.main.desc, 
      date: currentLang === 'FR' ? '15 Mars 2025' : 'March 15, 2025', 
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
      category: content.eventLabel,
      featured: true
    },
    { 
      id: '2',
      title: t.news.n1, 
      desc: currentLang === 'FR' ? "Une journée d'exploration et de sensibilisation à l'environnement pour nos élèves du primaire." : "A day of exploration and environmental awareness for our primary students.",
      date: currentLang === 'FR' ? '12 Mars 2025' : 'March 12, 2025', 
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80',
      category: content.pedagogyLabel
    },
    { 
      id: '3',
      title: t.news.n2, 
      desc: currentLang === 'FR' ? "Félicitations à nos jeunes génies qui ont brillé lors du concours régional de sciences." : "Congratulations to our young geniuses who shone at the regional science competition.",
      date: currentLang === 'FR' ? '05 Mars 2025' : 'March 05, 2025', 
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80',
      category: content.successLabel
    }
  ];

  const defaultEvents = [
    {
      id: 'e1',
      title: content.openHouse,
      desc: content.openHouseDesc,
      date: '2025-04-20',
      time: '09:00 - 16:00',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dee81c?auto=format&fit=crop&q=80',
      location: content.location
    },
    {
      id: 'e2',
      title: content.yearShow,
      desc: content.yearShowDesc,
      date: '2025-06-15',
      time: '18:30',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80',
      location: content.theater
    }
  ];

  const displayNews = newsItems.length > 0 ? newsItems : (loading ? [] : defaultNews);
  const displayEvents = eventsItems.length > 0 ? eventsItems : (loading ? [] : defaultEvents);
  const featuredNews = displayNews.find(n => n.featured || n.isFeatured) || displayNews[0];
  const recentNews = displayNews.filter(n => n.id !== (featuredNews?.id || '')).slice(0, 3);
  const allNews = displayNews;

  return (
    <main className="bg-white text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      <Helmet>
        <title>Actualités & Événements | Georges Claude Private Academy El Jadida</title>
        <meta name="description" content="Restez informé des dernières actualités, événements et succès de Georges Claude Private Academy à El Jadida. Vie scolaire, pédagogie et vie de l'académie." />
        <meta property="og:title" content="Actualités & Événements | Académie Georges Claude Private Academy El Jadida" />
        <meta property="og:description" content="Découvrez les moments forts et les actualités de notre école à El Jadida." />
        <meta property="og:image" content={ASSETS.heroBg} />
        <meta property="og:url" content="https://agc.ma/actualites" />
        <link rel="canonical" href="https://agc.ma/actualites" />
      </Helmet>

      {/* Hero Section - Refined Editorial Style */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img 
            src={ASSETS.heroBg} 
            alt="Actualités et Événements Académie Georges Claude Private Academy El Jadida" 
            width="1920"
            height="1080"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-20 scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-blue-950/80 to-blue-950"></div>
        </div>
        
        <div className="max-w-[1600px] mx-auto px-4 relative z-10 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">{t.nav.newsEvents}</span>
              </div>
              <h1 className="text-white mb-8 font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-none">
                {content.title1} <br />
                <span className="text-amber-400">{content.title2}</span>
              </h1>
              <p className="text-xs md:text-sm font-light max-w-xl text-blue-100/60 leading-relaxed mb-12 uppercase tracking-widest opacity-80">
                {t.news.desc}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured News - Clean Layout */}
      {featuredNews && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-16">
              {/* Main Featured */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-8 group cursor-pointer"
              >
                <Link to={`/actualites/${featuredNews.id}`}>
                  <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-10">
                    <img 
                      src={featuredNews.image} 
                      alt={featuredNews.title} 
                      width="800"
                      height="450"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
                      referrerPolicy="no-referrer" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  <div className="flex items-center space-x-4 text-amber-600 mb-4 font-bold text-[10px] tracking-widest uppercase">
                    <span>{featuredNews.date}</span>
                    <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                    <span>{featuredNews.category}</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold mb-6 text-blue-950 group-hover:text-amber-600 transition-colors leading-tight uppercase tracking-tight">{featuredNews.title}</h2>
                  <p className="text-slate-500 text-xs md:text-sm line-clamp-2 font-light leading-relaxed max-w-2xl">{featuredNews.desc || featuredNews.content}</p>
                </Link>
              </motion.div>

              {/* Sidebar / Recent */}
              <div className="lg:col-span-4 space-y-10">
                <h3 className="font-bold text-blue-950 mb-10 border-l-4 border-amber-500 pl-4 uppercase tracking-widest text-[10px]">
                  {content.latestNews}
                </h3>
                {recentNews.map((news, idx) => (
                  <motion.div 
                    key={news.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <Link to={`/actualites/${news.id}`}>
                      <div className="flex gap-6">
                        <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border border-slate-100">
                          <img src={news.image} alt={news.title} width="96" height="96" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" loading="lazy" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 mb-2 block">{news.category}</span>
                          <h4 className="text-sm font-bold text-blue-950 group-hover:text-amber-600 transition-colors leading-tight line-clamp-2 uppercase tracking-tight">{news.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-2 font-medium">{news.date}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) }

      {/* Events Grid - Refined */}
      <section id="events" className="py-24 md:py-32 bg-slate-50 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-px w-8 bg-amber-500"></div>
                <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-[10px]">{content.calendar}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-blue-950 uppercase">
                {content.upcomingEvents}
              </h2>
            </div>
            <Link to="/inscription" className="inline-flex items-center space-x-3 text-blue-950 hover:text-amber-600 transition-all font-bold uppercase tracking-widest text-[10px]">
              <span>{content.fullCalendar}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {displayEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all flex flex-col sm:flex-row"
              >
                <div className="sm:w-1/3 aspect-video sm:aspect-auto relative overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" referrerPolicy="no-referrer" loading="lazy" />
                </div>
                <div className="p-8 sm:w-2/3 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 text-slate-400 mb-4 font-bold text-[9px] uppercase tracking-widest">
                    <span className="flex items-center"><Clock size={12} className="mr-1.5" /> {event.time}</span>
                    <span className="flex items-center"><MapPin size={12} className="mr-1.5" /> {event.location}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-4 text-blue-950 group-hover:text-amber-600 transition-colors leading-tight uppercase tracking-tight">{event.title}</h3>
                  <p className="text-slate-500 text-[10px] font-light leading-relaxed mb-6 line-clamp-2">{event.desc || event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{event.date}</span>
                    <button onClick={() => setSelectedEvent(event)} aria-label="Voir l'événement" className="text-blue-950 hover:text-amber-600 transition-colors cursor-pointer z-10 flex items-center justify-center p-2 rounded-full bg-slate-50 hover:bg-amber-50">
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid - Clean Grid */}
      <section id="news" className="py-24 md:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-px w-8 bg-blue-900"></div>
                <span className="text-blue-900 font-bold uppercase tracking-[0.3em] text-[10px]">{t.nav.news}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-blue-950 uppercase">
                {content.allNews}
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {allNews.map((news, idx) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={`/actualites/${news.id}`}>
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-100 mb-6">
                    <img src={news.image} alt={news.title} width="400" height="300" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600">{news.category}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{news.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-blue-950 mb-4 group-hover:text-amber-600 transition-colors line-clamp-2 leading-tight uppercase tracking-tight">{news.title}</h3>
                  <p className="text-slate-500 text-[10px] leading-relaxed mb-6 line-clamp-3 font-light">{news.desc || news.content}</p>
                  
                  <div className="flex items-center text-blue-950 font-bold text-[10px] uppercase tracking-widest group-hover:text-amber-600 transition-colors">
                    {t.news.btn}
                    <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ColorSeparator />

      {/* Galerie Section */}
      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="h-px w-12 bg-amber-500"></div>
              <span className="text-amber-600 font-bold uppercase tracking-[0.2em] text-sm">{content.galleryLabel}</span>
              <div className="h-px w-12 bg-amber-500"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-blue-950 mb-8 tracking-tight">
              {content.galleryTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {moments.map((moment, i) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedMoment(moment)}
                className="aspect-square rounded-2xl overflow-hidden shadow-lg group relative cursor-pointer"
              >
                <img 
                  src={moment.url} 
                  alt={moment.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {moment.type === 'video' ? (
                    <Play className="text-white" size={32} fill="currentColor" />
                  ) : (
                    <ImageIcon className="text-white" size={32} />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">{moment.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-[100] bg-blue-950/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          >
            <button 
              aria-label="Fermer"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-[110]"
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[90vh]"
            >
              <div className="w-full h-[300px] md:h-[450px] shrink-0 p-4 md:p-6 pb-0">
                <EventGallery mainImage={selectedEvent.image} additionalImages={selectedEvent.additionalImages} title={selectedEvent.title} />
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto flex-grow bg-white">
                <div className="mb-4">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px] bg-amber-50 px-3 py-1 rounded-full">{content.eventLabel || 'Événement'}</span>
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{selectedEvent.date}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-blue-950 uppercase tracking-tight leading-tight">{selectedEvent.title}</h2>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <Clock size={16} className="text-amber-500" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <MapPin size={16} className="text-amber-500" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>

                <div className="prose prose-slate prose-sm max-w-none">
                  <p className="text-slate-600 leading-relaxed font-light">{selectedEvent.description || selectedEvent.desc}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMoment(null)}
            className="fixed inset-0 z-[100] bg-blue-950/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          >
            <button 
              aria-label="Fermer"
              onClick={() => setSelectedMoment(null)}
              className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors z-[110]"
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              {selectedMoment.type === 'video' ? (
                <video 
                  src={selectedMoment.url} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                />
              ) : (
                <img 
                  src={selectedMoment.url} 
                  alt={selectedMoment.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
              
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                    {selectedMoment.category || 'Moment'}
                  </span>
                  <span className="text-white/60 text-xs font-medium uppercase tracking-widest">
                    {selectedMoment.createdAt?.toDate ? selectedMoment.createdAt.toDate().toLocaleDateString() : ''}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white uppercase">
                  {selectedMoment.title}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default NewsPage;
