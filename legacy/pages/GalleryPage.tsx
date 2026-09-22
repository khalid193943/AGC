import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { 
  Camera, 
  Image as ImageIcon, 
  Video, 
  Filter, 
  Maximize2, 
  X,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Play
} from 'lucide-react';

import { ASSETS } from '../constants';

import { useLanguage } from '../contexts/LanguageContext';

const GalleryPage = () => {
  const { t, currentLang } = useLanguage();
  const content = t.gallery;
  const [selectedCategory, setSelectedCategory] = useState(content.categories.all);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'moments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMoments(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'moments');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    content.categories.all, 
    content.categories.events, 
    content.categories.sports, 
    content.categories.academic, 
    content.categories.academy, 
    content.categories.art
  ];

  const galleryItems = moments.length > 0 ? moments : [];

  const filteredItems = selectedCategory === content.categories.all 
    ? galleryItems 
    : galleryItems.filter(item => {
        // Map dynamic categories to translation keys if possible, or just compare
        const cat = item.category?.toLowerCase();
        const target = selectedCategory.toLowerCase();
        return cat === target || item.category === selectedCategory;
      });

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryItems.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  return (
    <main className="bg-white text-slate-900 selection:bg-red-100 selection:text-red-900">
      <Helmet>
        <title>Galerie Photos & Vidéos | Georges Claude Private Academy El Jadida</title>
        <meta name="description" content="Découvrez en images la vie à Georges Claude Private Academy El Jadida. Photos de nos événements, infrastructures, activités sportives et académiques." />
        <meta property="og:title" content="Galerie Photos & Vidéos | Académie Georges Claude Private Academy El Jadida" />
        <meta property="og:description" content="Plongez dans l'univers de notre académie à travers notre galerie multimédia." />
        <meta property="og:image" content={ASSETS.heroBg} />
        <meta property="og:url" content="https://agc.ma/galerie" />
        <link rel="canonical" href="https://agc.ma/galerie" />
      </Helmet>

      {/* Hero Section - Refined Editorial Style */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img 
            src={ASSETS.heroBg} 
            alt="Galerie Académie Georges Claude Private Academy El Jadida" 
            width="1920"
            height="1080"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-20 scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-blue-950/80 to-blue-950"></div>
          
          {/* Decorative Accents */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-amber-400/5 to-transparent"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 relative z-10 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">{content.archive}</span>
              </div>
              
              <h1 className="text-white mb-8 font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-none">
                {content.title} <br />
                <span className="text-amber-400">{content.archive}</span>
              </h1>

              <p className="text-sm md:text-base font-light max-w-xl text-blue-100/60 leading-relaxed mb-12 uppercase tracking-widest opacity-80">
                {content.desc}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Section - Clean Style */}
      <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Filter size={14} className="text-red-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{content.filterBy}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                  selectedCategory === cat 
                    ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' 
                    : 'bg-transparent border-slate-200 text-slate-500 hover:border-red-600 hover:text-red-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid - Clean Grid */}
      <section className="py-24 max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative aspect-[4/5] overflow-hidden bg-slate-100 rounded-3xl cursor-pointer border border-slate-100"
                onClick={() => setSelectedImage(idx)}
              >
                <img 
                  src={item.url || item.image} 
                  alt={`${item.title} Académie Georges Claude Private Academy El Jadida`}
                  width="400"
                  height="500"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Video Icon */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {item.category}
                    </span>
                    <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                      {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : (item.date || '')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight mb-2 uppercase">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-white/60 text-xs font-medium">
                    <MapPin size={10} className="mr-2 text-amber-400" />
                    {item.location}
                  </div>
                </div>

                {/* Corner Icon */}
                <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                  <Maximize2 size={16} className="text-white" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
          >
            <button 
              aria-label="Fermer"
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 text-slate-400 hover:text-blue-950 transition-colors z-[110]"
            >
              <X size={32} />
            </button>

            <div className="absolute top-1/2 left-8 -translate-y-1/2 hidden md:block z-[110]">
              <button 
                aria-label="Image précédente"
                onClick={prevImage}
                className="w-16 h-16 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center transition-all group"
              >
                <ChevronLeft size={32} className="text-blue-950 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="absolute top-1/2 right-8 -translate-y-1/2 hidden md:block z-[110]">
              <button 
                aria-label="Image suivante"
                onClick={nextImage}
                className="w-16 h-16 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center transition-all group"
              >
                <ChevronRight size={32} className="text-blue-950 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-6xl w-full aspect-video md:aspect-auto md:h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-black"
            >
              {galleryItems[selectedImage].type === 'video' ? (
                <video 
                  src={galleryItems[selectedImage].url} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                />
              ) : (
                <img 
                  src={galleryItems[selectedImage].url || galleryItems[selectedImage].image} 
                  alt={galleryItems[selectedImage].title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
              
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                    {galleryItems[selectedImage].category}
                  </span>
                  <span className="text-white/60 text-xs font-medium uppercase tracking-widest">
                    {galleryItems[selectedImage].createdAt?.toDate ? galleryItems[selectedImage].createdAt.toDate().toLocaleDateString() : (galleryItems[selectedImage].date || '')}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white uppercase">
                  {galleryItems[selectedImage].title}
                </h2>
              </div>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-300 text-xs font-bold uppercase tracking-[0.5em]">
              {selectedImage + 1} / {galleryItems.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-32 border-t border-slate-100 bg-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/20 to-transparent"></div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold uppercase mb-8">
            {content.ctaTitle} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-400 to-red-500">Georges Claude Private Academy</span>
          </h2>
          <p className="text-blue-100/60 text-[10px] md:text-xs font-light tracking-widest uppercase mb-12 max-w-xl mx-auto">
            {content.ctaSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="px-10 py-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-red-600 transition-all rounded-full shadow-xl shadow-red-600/20">
              {content.ctaAppointment}
            </button>
            <button className="px-10 py-4 bg-transparent border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors rounded-full">
              {content.ctaVirtualVisit}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GalleryPage;
