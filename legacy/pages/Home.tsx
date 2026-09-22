import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Trophy, 
  Users, 
  Globe, 
  GraduationCap,
  BookOpen,
  Heart,
  Shield,
  Palette,
  Music,
  Cpu,
  ArrowRight,
  Phone,
  Mail,
  ChevronDown,
  Calendar,
  Facebook,
  Instagram,
  CheckCircle2,
  Star,
  Quote,
  Sparkles,
  Award,
  Zap,
  Clock,
  MapPin,
  Target,
  Sun,
  Camera,
  Play,
  Image as ImageIcon,
  Brain,
  Loader2,
  X,
  Briefcase,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { ASSETS } from '../constants';
import SchoolVideoSection from '../components/SchoolVideoSection';

const FloatingShape = ({ delay = 0, className = "" }: { delay?: number, className?: string }) => (
  <motion.div
    animate={{
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 0.9, 1],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className={`absolute pointer-events-none opacity-10 ${className}`}
  />
);

const WaveSeparator = ({ color = "fill-white", flip = false }: { color?: string, flip?: boolean }) => (
  <div className={`absolute left-0 w-full leading-[0] z-10 ${flip ? 'bottom-full rotate-180' : 'top-full'}`}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-full h-[60px] ${color}`}>
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
    </svg>
  </div>
);

export const Home = () => {
  const { currentLang, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedMoment, setSelectedMoment] = useState<any>(null);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [eventItems, setEventItems] = useState<any[]>([]);
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const heroImages = ASSETS.heroSlider;
  const sliderImages = ASSETS.presentation;

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  useEffect(() => {
    const newsQ = query(collection(db, 'news'), orderBy('date', 'desc'), limit(4));
    const newsUnsubscribe = onSnapshot(newsQ, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'news');
    });

    const eventsQ = query(collection(db, 'events'), orderBy('date', 'desc'), limit(3));
    const eventsUnsubscribe = onSnapshot(eventsQ, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEventItems(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'events');
    });

    const momentsQ = query(collection(db, 'moments'), orderBy('createdAt', 'desc'), limit(10));
    const momentsUnsubscribe = onSnapshot(momentsQ, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMoments(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'moments');
      setLoading(false);
    });

    return () => {
      newsUnsubscribe();
      eventsUnsubscribe();
      momentsUnsubscribe();
    };
  }, []);

  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.phone) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...contactForm,
        type: 'contact',
        status: 'new',
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      setContactForm({ name: '', email: '', phone: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'messages');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return { day: '', month: '' };
    try {
      // Try to parse YYYY-MM-DD
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const day = date.getDate().toString().padStart(2, '0');
        const locale = currentLang === 'FR' ? 'fr-FR' : 'en-GB';
        const month = date.toLocaleString(locale, { month: 'short' }).toUpperCase().replace('.', '');
        return { day, month };
      }
      // Fallback if it's already a formatted string like "15 Mai 2025"
      const parts = dateStr.split(' ');
      if (parts.length >= 2) {
        return { day: parts[0], month: parts[1].substring(0, 3).toUpperCase() };
      }
    } catch (e) {
      console.error("Error parsing date:", e);
    }
    return { day: '??', month: '???' };
  };

  const displayNews = newsItems;
  const featuredItem = displayNews.find(n => n.featured || n.isFeatured) || displayNews[0];
  const sideNews = displayNews.filter(n => n.id !== (featuredItem?.id || '')).slice(0, 3);

  const testimonials = t.home.testimonials;

  const upcomingEvents = [];
  const featuredEvent = null;
  const otherEvents = [];

  const faqs = [
    { q: t.faq.q1.q, a: t.faq.q1.a },
    { q: t.faq.q2.q, a: t.faq.q2.a },
    { q: t.faq.q3.q, a: t.faq.q3.a },
    { q: t.faq.q4.q, a: t.faq.q4.a },
  ];

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <Helmet>
        <title>Georges Claude Private Academy | École Privée El Jadida - Maternelle, Primaire, Collège, Lycée</title>
        <meta name="description" content="Bienvenue à Georges Claude Private Academy, votre école privée d'excellence à El Jadida. Enseignement trilingue de la maternelle au lycée. Inscriptions 2026-2027 ouvertes." />
        <meta property="og:title" content="Académie Georges Claude Private Academy | École Privée El Jadida" />
        <meta property="og:description" content="L'excellence académique au cœur d'El Jadida. Découvrez nos programmes trilingues de la maternelle au lycée." />
        <meta property="og:image" content={ASSETS.logo} />
        <meta property="og:url" content="https://agc.ma/" />
        <link rel="canonical" href="https://agc.ma/" />
      </Helmet>

      {/* Hero Section - Full Screen Slider */}
      <section id="home" className="relative h-screen flex items-center overflow-hidden bg-blue-950">
        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute inset-0"
            >
              <img 
                src={heroImages[heroSlide]} 
                alt={`Académie Georges Claude Private Academy El Jadida - Campus ${heroSlide + 1}`} 
                width="1920"
                height="1080"
                fetchPriority="high"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[2px]"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="container-wide relative z-10 w-full pt-20 flex flex-col items-center text-center px-4">
          <div className="max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-4 mb-8"
              >
                <div className="w-12 h-px bg-amber-400"></div>
                <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">
                  {t.hero.excellence}
                </span>
                <div className="w-12 h-px bg-amber-400"></div>
              </motion.div>
              
              <h1 
                className="text-white mb-6 font-display font-bold text-[32px] md:text-[45px] leading-tight w-full max-w-2xl"
              >
                {t.hero.heroTitle1} <br />
                <span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 italic uppercase"
                  style={{ fontSize: 'inherit' }}
                >
                  {t.hero.heroTitle2}
                </span>
              </h1>

              <p className="text-base md:text-lg font-medium max-w-xl text-white/80 mb-6 mx-auto leading-relaxed font-light uppercase tracking-widest">
                {t.hero.motto}
              </p>

              <p className="text-sm md:text-base max-w-2xl text-white/70 mb-10 mx-auto leading-relaxed">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/academie" className="bg-amber-400 text-blue-950 px-14 py-7 rounded-[30px] text-[13px] font-bold uppercase tracking-wider hover:bg-white transition-all duration-500 shadow-2xl shadow-amber-400/20 active:scale-95 flex items-center justify-center">
                  {t.hero.discoverBtn} <ArrowRight size={20} className="ml-3" />
                </Link>
                <Link to="/inscription" className="bg-red-600 text-white px-14 py-7 rounded-[30px] text-[13px] font-bold uppercase tracking-wider hover:bg-red-700 transition-all duration-500 active:scale-95 flex items-center justify-center shadow-2xl shadow-red-600/20">
                  {t.hero.admissionsBtn} <Sparkles size={20} className="ml-3 text-amber-400" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-12 right-12 z-20 flex items-center space-x-4">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setHeroSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${heroSlide === idx ? 'bg-amber-400 w-12' : 'bg-white/30 w-4 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* 100% Success Infinite Carousel */}
      <section className="bg-blue-950 py-12 md:py-16 overflow-hidden relative flex items-center border-y-8 border-red-600 shadow-2xl">
        <div className="absolute inset-0 z-0">
          {/* Glowing orbs */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-amber-400/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        </div>
        
        <div className="relative z-10 w-full flex whitespace-nowrap overflow-hidden">
          <motion.div
            animate={{ x: [0, -2500] }}
            transition={{
              repeat: Infinity,
              duration: 35,
              ease: "linear",
            }}
            className="flex items-center space-x-12 min-w-max"
          >
            {[...Array(6)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center space-x-8 mx-4">
                  {/* Item 1 - 100% */}
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] border border-red-400/50 group-hover:scale-110 transition-transform duration-300">
                      <Trophy size={32} className="text-white drop-shadow-md" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/90 font-display font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider drop-shadow-sm">
                        <span className="text-amber-400 mr-3">100%</span> 
                        DE RÉUSSITE
                      </div>
                      <div className="text-red-400 font-bold tracking-[0.2em] text-sm md:text-base uppercase ml-1">
                        Année Scolaire 2025-2026
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-blue-500/50 font-display font-bold text-5xl mx-4">✦</div>
                  
                  {/* Item 2 - Excellence */}
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.4)] border border-amber-300/50 group-hover:scale-110 transition-transform duration-300">
                      <Award size={32} className="text-blue-950 drop-shadow-md" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/90 font-display font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider drop-shadow-sm">
                        EXCELLENCE ACADÉMIQUE
                      </div>
                      <div className="text-amber-400 font-bold tracking-[0.2em] text-sm md:text-base uppercase ml-1">
                        Un parcours d'exception
                      </div>
                    </div>
                  </div>

                  <div className="text-red-500/50 font-display font-bold text-5xl mx-4">✦</div>

                  {/* Item 3 - 100% again */}
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] border border-red-400/50 group-hover:scale-110 transition-transform duration-300">
                      <Trophy size={32} className="text-white drop-shadow-md" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/90 font-display font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider drop-shadow-sm">
                        <span className="text-amber-400 mr-3">100%</span> 
                        DE RÉUSSITE
                      </div>
                      <div className="text-red-400 font-bold tracking-[0.2em] text-sm md:text-base uppercase ml-1">
                        Année Scolaire 2025-2026
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-amber-400/50 font-display font-bold text-5xl mx-4">✦</div>

                  {/* Item 4 - Mentions */}
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-blue-300/50 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles size={32} className="text-white drop-shadow-md" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/90 font-display font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider drop-shadow-sm">
                        MENTIONS TRÈS BIEN
                      </div>
                      <div className="text-blue-400 font-bold tracking-[0.2em] text-sm md:text-base uppercase ml-1">
                        Fierté & Succès
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-blue-500/50 font-display font-bold text-5xl mx-4">✦</div>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Director's Message Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl bg-blue-950 z-10">
                <img 
                  src={ASSETS.director} 
                  alt="Directeur de l'Académie Georges Claude Private Academy El Jadida" 
                  width="800"
                  height="1000"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                    <p className="text-white font-display font-bold text-xl mb-1">{t.direction.name}</p>
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">{t.direction.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-4 mb-8">
                <div className="w-12 h-px bg-red-600"></div>
                <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[11px]">
                  {t.direction.title}
                </span>
              </div>
              
              <h2 className="text-slate-900 mb-8 font-display font-bold text-[50px] md:text-[50px] lg:text-[50px] leading-none">
                {t.direction.messageFrom} <br />
                <span className="text-blue-900">{t.direction.direction}</span>
              </h2>

              <div className="relative mb-10">
                <Quote className="absolute -top-8 -left-8 text-slate-100 w-20 h-20 -z-10" />
                <p className="text-slate-600 text-base md:text-lg font-light leading-relaxed italic">
                  {t.direction.text}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="w-16 h-px bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className="text-blue-950 font-bold uppercase tracking-widest text-sm">{t.direction.name}</span>
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">{t.direction.role}</span>
                  <img src="https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/69de438361b1b716a22c54b2_signaturegen-1776170089424.png" alt="Signature" className="w-[300px] h-[120px] object-contain mt-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Welcome Section - Refined */}
      <section id="welcome" className="py-24 bg-slate-50/30">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-all duration-500">
                    <img src={sliderImages[0]} alt="Élèves de l'Académie Georges Claude Private Academy El Jadida" width="400" height="500" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-all duration-500">
                    <img src={sliderImages[1]} alt="Activités scolaires à El Jadida" width="500" height="500" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-all duration-500">
                    <img src={sliderImages[2]} alt="Infrastructure moderne école privée El Jadida" width="500" height="500" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-all duration-500">
                    <img src={sliderImages[3 % sliderImages.length]} alt="Éducation d'excellence à El Jadida" width="400" height="500" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center space-x-4 mb-8">
                <div className="w-12 h-px bg-red-600"></div>
                <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[11px]">
                  {t.welcome.presentation}
                </span>
              </div>
              
              <h2 className="text-slate-900 mb-8 font-display font-bold text-[50px] md:text-[50px] lg:text-[50px] leading-none">
                {t.welcome.welcomeTo} <br />
                <span className="text-blue-900">{t.home.academyName}</span>
              </h2>

              <p className="text-slate-500 mb-10 text-[14px] font-[Outfit] font-normal leading-relaxed uppercase tracking-wider max-w-xl">
                {t.welcome.text}
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-6 p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
                    <Shield size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950 mb-2 uppercase tracking-widest text-sm">{t.welcome.feature1}</h4>
                    <p className="text-sm text-slate-500 uppercase tracking-widest leading-relaxed text-[#dca700]">{t.welcome.text2}</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0">
                    <Globe size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950 mb-2 uppercase tracking-widest text-sm">{t.welcome.feature2}</h4>
                    <p className="text-sm text-slate-500 uppercase tracking-widest leading-relaxed">{t.welcome.text3}</p>
                  </div>
                </div>
              </div>

              <Link to="/academie" className="bg-blue-950 text-white px-12 py-5 rounded-[30px] text-sm font-bold uppercase tracking-wider hover:bg-amber-400 transition-all duration-500 shadow-xl active:scale-95">
                {t.welcome.btn}
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <SchoolVideoSection />

      {/* Cambridge Section - Redesigned */}
      <section className="py-24 bg-gradient-to-b from-blue-950 to-slate-900 relative overflow-hidden">
        <WaveSeparator color="fill-white" flip={true} />
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>
        
        <div className="container-wide relative z-10 mt-16">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 bg-white/10 px-5 py-2.5 rounded-full border border-white/20 mb-8 backdrop-blur-md">
                <Globe className="text-amber-400" size={18} />
                <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px]">
                  Partenariat Stratégique
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-6 text-white">
                Programme Cambridge <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                  Ouverture à l'International
                </span>
              </h2>
              
              <p className="text-lg text-blue-100/70 font-light leading-relaxed mb-10">
                L'Académie Privée Georges Claude intègre le programme Cambridge pour offrir à nos élèves une éducation d'excellence répondant aux standards mondiaux, favorisant le trilinguisme et la pensée critique.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                {[
                  { icon: <BookOpen />, title: "Trilinguisme", desc: "Immersion et maîtrise de la langue anglaise" },
                  { icon: <Brain />, title: "Pensée Critique", desc: "Analyse, réflexion et logique" },
                  { icon: <Palette />, title: "Créativité", desc: "Innovation et expression personnelle" },
                  { icon: <Trophy />, title: "Certifications", desc: "Diplômes reconnus mondialement" }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-amber-400 group-hover:border-amber-400 transition-colors duration-300">
                      <div className="text-amber-400 group-hover:text-blue-950 transition-colors duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">{feature.title}</h4>
                      <p className="text-blue-200/60 text-[11px] leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/partenaires" className="inline-flex items-center space-x-3 bg-amber-400 text-blue-950 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-white transition-all duration-300 shadow-xl shadow-amber-400/20 active:scale-95">
                <span>Découvrir nos partenaires</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            {/* Right SVG Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative lg:h-[600px] flex items-center justify-center"
            >
              <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                {/* Glowing Background Orbs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-amber-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
                
                {/* Official Logo */}
                <div className="relative z-10 w-[80%] h-[80%] drop-shadow-2xl hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                  <img src="https://res.cloudinary.com/ddvgp1zrz/image/upload/v1782686752/1042775c-cddc-48a8-89e7-59988c86eabd.png" alt="Cambridge Assessment International Education" className="w-full h-auto object-contain" />
                </div>
                
                {/* Floating Tags */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 -right-10 bg-white p-3 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-20 flex items-center gap-3 border border-slate-100"
                >
                  <div className="bg-amber-100 p-2 rounded-xl">
                    <Globe size={24} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="text-blue-950 font-bold text-sm">International</div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Standard</div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 -left-10 bg-blue-900 p-3 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-20 flex items-center gap-3 border border-blue-800"
                >
                  <div className="bg-blue-800 p-2 rounded-xl">
                    <Brain size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Critical Thinking</div>
                    <div className="text-blue-300 text-[10px] uppercase tracking-wider font-bold">Development</div>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </div>
        </div>
        <WaveSeparator color="fill-white" flip={false} />
      </section>

      {/* Programs Section - Refined */}
      <section id="programs" className="py-24 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[11px] mb-6 block">
              {t.programs.curriculum}
            </span>
            <h2 className="text-slate-900 mb-8 font-display font-bold text-[50px] md:text-[50px] lg:text-[50px] leading-none">
              {t.programs.ourCycles} <span className="text-blue-900">{t.programs.teaching}</span>
            </h2>
            <p className="text-slate-500 font-light uppercase tracking-widest text-xs leading-loose">
              {t.programs.desc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: t.programs.p1.title, 
                desc: t.programs.p1.desc,
                image: ASSETS.cycles.preschool,
                icon: <Palette size={24} />,
                color: "bg-pink-50 text-pink-600"
              },
              { 
                title: t.programs.p2.title, 
                desc: t.programs.p2.desc,
                image: ASSETS.cycles.primary,
                icon: <BookOpen size={24} />,
                color: "bg-blue-50 text-blue-600"
              },
              { 
                title: t.programs.p3.title, 
                desc: t.programs.p3.desc,
                image: ASSETS.cycles.middleSchool,
                icon: <Cpu size={24} />,
                color: "bg-amber-50 text-amber-600"
              },
              { 
                title: t.programs.p4.title, 
                desc: t.programs.p4.desc,
                image: ASSETS.cycles.highSchool,
                icon: <GraduationCap size={24} />,
                color: "bg-red-50 text-red-600"
              },
            ].map((program, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-slate-50 rounded-[2.5rem] overflow-hidden hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-slate-100"
              >
                <div className="h-64 relative overflow-hidden">
                  <img src={program.image} alt={`${program.title} - Académie Georges Claude Private Academy El Jadida`} width="400" height="256" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" loading="lazy" />
                  <div className={`absolute top-6 left-6 ${program.color} p-4 rounded-2xl shadow-sm`}>
                    {program.icon}
                  </div>
                </div>
                <div className="p-12">
                  <h3 className="text-xl font-bold text-blue-950 mb-6 tracking-widest uppercase">{program.title}</h3>
                  <p className="text-slate-500 text-xs mb-10 line-clamp-3 leading-loose font-light uppercase tracking-widest">{program.desc}</p>
                  <Link to="/programmes" className="text-blue-900 font-bold text-xs uppercase tracking-wider flex items-center group-hover:text-red-600 transition-colors">
                    {t.programs.learnMore} <ArrowRight size={12} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Vision & Objectives Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container-wide relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-4 mb-6"
            >
              <div className="w-12 h-px bg-red-600"></div>
              <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[11px]">{t.vision.label}</span>
              <div className="w-12 h-px bg-red-600"></div>
            </motion.div>
            <h2 className="text-slate-900 font-display font-bold text-[50px] md:text-[50px] lg:text-[50px] leading-none max-w-4xl">
              {t.vision.title}
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative p-10 rounded-[2.5rem] bg-blue-950 text-white border border-blue-900 hover:-translate-y-2 transition-all duration-500 shadow-xl"
            >
              <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center text-blue-950 mb-8 shadow-sm transition-all duration-500">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-6 uppercase tracking-widest text-amber-400">{t.vision.visionTitle}</h3>
              <p className="text-white/70 leading-relaxed font-light uppercase tracking-widest text-xs">
                {t.vision.visionText}
              </p>
            </motion.div>

            {/* Objective Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative p-10 rounded-[2.5rem] bg-red-600 text-white border border-red-500 hover:-translate-y-2 transition-all duration-500 shadow-xl"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-600 mb-8 shadow-sm transition-all duration-500">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-6 uppercase tracking-widest">{t.vision.objectiveTitle}</h3>
              <p className="text-white/70 leading-relaxed font-light uppercase tracking-widest text-xs">
                {t.vision.objectiveText}
              </p>
            </motion.div>

            {/* Daily Life Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative p-10 rounded-[2.5rem] bg-amber-400 text-blue-950 border border-amber-300 hover:-translate-y-2 transition-all duration-500 shadow-xl"
            >
              <div className="w-16 h-16 bg-blue-950 rounded-2xl flex items-center justify-center text-white mb-8 shadow-sm transition-all duration-500">
                <Sun size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-6 uppercase tracking-widest">{t.vision.dailyLifeTitle}</h3>
              <p className="text-blue-950/70 leading-relaxed font-light uppercase tracking-widest text-xs">
                {t.vision.dailyLifeText}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION ECOLOGIQUE REFONTE */}
      <section className="py-32 bg-emerald-950 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-emerald-900 via-transparent to-transparent opacity-50 mix-blend-overlay pointer-events-none"></div>
          <FloatingShape className="top-10 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-30" />
          <FloatingShape className="bottom-10 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[120px] opacity-20" />
        </div>

        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 bg-emerald-500/20 px-6 py-3 rounded-full border border-emerald-400/30 mb-8 backdrop-blur-md">
                <Leaf className="text-emerald-400" size={20} />
                <span className="text-emerald-300 font-bold uppercase tracking-widest text-sm">
                  {currentLang === 'FR' ? 'Engagement Écologique' : 'Ecological Commitment'}
                </span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-8 text-white">
                {currentLang === 'FR' ? 'L\'Excellence' : 'Excellence'} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
                  {currentLang === 'FR' ? 'Écologique' : 'Ecological'}
                </span>
                <br /> {currentLang === 'FR' ? 'Récompensée' : 'Rewarded'}
              </h2>
              
              <p className="text-xl text-emerald-100/70 font-light leading-relaxed mb-10 max-w-xl">
                {currentLang === 'FR' 
                  ? 'Georges Claude Private Academy s\'inscrit dans son époque avec audace. Nous sommes les fiers lauréats du Ruban Vert, faisant de nous la première école 100% écologique d\'El Jadida.' 
                  : 'Georges Claude Private Academy boldly embraces its era. We are the proud winners of the Green Ribbon, making us the first 100% ecological school in El Jadida.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm flex-1 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-4xl font-bold text-amber-400 mb-2">1ère</div>
                  <div className="text-sm text-emerald-100/60 uppercase tracking-widest leading-relaxed">{currentLang === 'FR' ? 'École de la ville labélisée' : 'Labeled school in the city'}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm flex-1 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-4xl font-bold text-emerald-400 mb-2">100%</div>
                  <div className="text-sm text-emerald-100/60 uppercase tracking-widest leading-relaxed">{currentLang === 'FR' ? 'Éco-responsable' : 'Eco-responsible'}</div>
                </div>
              </div>

              <Link to="/academie" className="group inline-flex items-center space-x-4 bg-amber-400 text-emerald-950 px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300">
                <span>{currentLang === 'FR' ? 'Notre Vision Durable' : 'Our Sustainable Vision'}</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
              </Link>
            </motion.div>

            {/* Right Images / Winner Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 aspect-[4/5] rounded-[3rem] p-2 bg-gradient-to-tr from-emerald-600/50 via-amber-400/50 to-emerald-400/50 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-sm px-2 py-2"></div>
                <img 
                  src="https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/69de1b48468bdf68fcdab96e_Capture%20d%E2%80%99e%CC%81cran%202026-04-14%20a%CC%80%2011.44.53.png" 
                  alt="Eco Winner" 
                  className="w-full h-full object-cover rounded-[2.5rem] relative z-10 transition-transform duration-1000 hover:scale-[1.03]"
                />
                
                {/* Winner Badge Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent rounded-[2.5rem]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="text-amber-400" size={32} />
                        <span className="text-2xl font-bold text-white uppercase tracking-widest shadow-sm">WINNER</span>
                      </div>
                      <p className="text-emerald-100 font-medium text-sm max-w-[200px] leading-relaxed drop-shadow-md">
                        {currentLang === 'FR' ? 'Label Ruban Vert d\'Excellence Écologique' : 'Green Ribbon Label for Ecological Excellence'}
                      </p>
                    </div>
                    {/* School Logo */}
                    <div className="w-36 h-36 shrink-0 relative overflow-hidden">
                      <img src={ASSETS.logo} alt="Logo" className="w-full h-full object-contain relative z-10" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements for ambiance */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400 rounded-full mix-blend-screen opacity-20 blur-2xl z-0"
              />
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500 rounded-full mix-blend-screen opacity-30 blur-2xl z-0"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="activities" className="py-24 bg-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/20 to-transparent"></div>
        </div>
        <div className="container-wide relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="h-px w-20 bg-red-600/50"></div>
                <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[11px]">
                  {t.activities.extracurricular}
                </span>
                <div className="h-px w-20 bg-red-600/50"></div>
              </div>
              <h2 className="text-slate-900 mb-8 font-display font-bold text-[50px] md:text-[50px] lg:text-[50px] leading-none text-white">
                {t.activities.extracurricular} <br />
                <span className="text-amber-400">{t.activities.parascolaires}</span>
              </h2>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: <Trophy size={24} />, title: t.activities.a1.title, desc: t.activities.a1.desc, color: "hover:border-red-600", img: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a079817dc033d19c3e68bb6_WhatsApp%20Image%202026-05-15%20at%2022.53.01%20(3).jpeg" },
              { icon: <Palette size={24} />, title: t.activities.a2.title, desc: t.activities.a2.desc, color: "hover:border-amber-400", img: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a0641a7335a4fa036c06f69_20260408_112139.jpg" },
              { icon: <Music size={24} />, title: t.activities.a3.title, desc: t.activities.a3.desc, color: "hover:border-blue-400", img: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a09f391f71666e4fc4fa209_WhatsApp%20Image%202026-05-17%20at%2001.07.32.jpeg" },
              { icon: <Cpu size={24} />, title: t.activities.a4.title, desc: t.activities.a4.desc, color: "hover:border-emerald-400", img: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a09f38dd925870ce981901a_WhatsApp%20Image%202026-05-17%20at%2000.58.02%20(3).jpeg" },
              { icon: <Brain size={24} />, title: t.activities.a5.title, desc: t.activities.a5.desc, color: "hover:border-purple-400", img: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a09f390456d7c60eaedd730_WhatsApp%20Image%202026-05-17%20at%2000.58.02.jpeg" },
              { icon: <Shield size={24} />, title: t.activities.a6.title, desc: t.activities.a6.desc, color: "hover:border-orange-400", img: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80" },
              { icon: <Heart size={24} />, title: t.activities.a7.title, desc: t.activities.a7.desc, color: "hover:border-pink-400", img: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a09f38a9d6e7a93cd71f0cd_WhatsApp%20Image%202026-05-17%20at%2000.58.02%20(1).jpeg" },
              { icon: <Sparkles size={24} />, title: t.activities.a8.title, desc: t.activities.a8.desc, color: "hover:border-yellow-400", img: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a09f39167a0469d6f6065ae_WhatsApp%20Image%202026-05-17%20at%2000.58.02%20(5).jpeg" },
            ].map((act, idx) => (
              <div 
                key={idx} 
                className={`bg-white/5 rounded-2xl border border-white/10 ${act.color} transition-all duration-700 group relative overflow-hidden flex flex-col hover:bg-white/10 shadow-lg`}
              >
                <div className="h-40 overflow-hidden relative">
                  <img src={act.img} alt={`${act.title} - Activités parascolaires`} width="300" height="160" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-transparent transition-colors duration-700"></div>
                  <div className="absolute top-4 left-4 bg-blue-950/80 backdrop-blur-md p-3 rounded-xl text-amber-400 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-2xl">
                    {act.icon}
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-sm font-bold mb-3 tracking-wider uppercase group-hover:text-amber-400 transition-colors">{act.title}</h3>
                  <p className="text-blue-100/40 text-[10px] leading-relaxed font-light uppercase tracking-wider line-clamp-2">{act.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <WaveSeparator color="fill-slate-50" flip={false} />
      </section>

      {/* Testimonials Section - Full Width Scrolling Carousel */}
      <section id="testimonials" className="py-24 bg-slate-50 overflow-hidden relative">
        <div className="container-wide mb-16">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center space-x-8 mb-8">
              <div className="h-px w-20 bg-red-600/30"></div>
              <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[11px]">
                {t.testimonials.title}
              </span>
              <div className="h-px w-20 bg-red-600/30"></div>
            </div>
            <h2 className="text-slate-900 mb-8 font-display font-bold text-[50px] md:text-[50px] lg:text-[50px] leading-none">
              {t.testimonials.whatParentsSay}
            </h2>
          </div>
        </div>
        
        <div className="relative w-full overflow-hidden">
            <div className="flex animate-marquee">
              <div className="flex space-x-6 py-4">
                {[...testimonials, ...testimonials].map((testimonial, idx) => (
                  <div 
                    key={idx}
                    className="w-[calc(100vw/1.5)] md:w-[calc(100vw/3)] lg:w-[calc(100vw/4.5)] bg-white p-8 rounded-3xl shadow-premium border border-slate-100 flex-shrink-0 flex flex-col justify-between h-64"
                  >
                    <div>
                      <div className="flex text-amber-400 mb-4 space-x-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-current" />)}
                      </div>
                      <p className="text-blue-950 text-sm leading-relaxed font-light italic line-clamp-4">
                        "{testimonial.text}"
                      </p>
                    </div>
                    <div className="flex items-center mt-6">
                      <div className="w-8 h-8 bg-blue-900/10 rounded-lg flex items-center justify-center mr-3 text-blue-900 font-display font-bold text-xs">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-blue-950 text-xs">{testimonial.name}</h4>
                        <p className="text-[8px] text-red-600 font-bold uppercase tracking-widest mt-0.5">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Gradient Overlays for smooth fade */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
          </div>
      </section>

      {/* Academy Hub Section - Inside Look / News */}
      <section id="academy-hub" className="py-24 bg-white overflow-hidden">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-6 mb-6">
                <div className="h-px w-12 bg-red-600"></div>
                <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[11px]">{t.home.hubTitle}</span>
              </div>
              <h2 className="text-slate-900 font-display font-bold text-[50px] md:text-[50px] lg:text-[50px] leading-[1.1]">
                {t.home.hubSubtitle.includes(',') ? (
                  <>
                    <span className="block">{t.home.hubSubtitle.split(',')[0]},</span>
                    <span className="block text-blue-900">{t.home.hubSubtitle.split(',').slice(1).join(',').trim()}</span>
                  </>
                ) : (
                  t.home.hubSubtitle
                )}
              </h2>
            </div>
            <Link to="/actualites" className="inline-flex items-center space-x-4 text-blue-900 font-bold uppercase tracking-widest text-xs group">
              <span>{t.home.hubViewAll}</span>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-all duration-500">
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {displayNews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 group relative rounded-[2rem] overflow-hidden"
              >
                <Link to={`/actualites/${displayNews[0].id}`} className="block h-full w-full relative">
                  <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/40 to-transparent z-10"></div>
                  <img src={displayNews[0].image} alt={displayNews[0].title} className="w-full h-full object-cover min-h-[400px] lg:min-h-full group-hover:scale-105 transition-transform duration-1000" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col justify-end">
                    <div className="bg-amber-500 text-blue-950 font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 w-fit">
                      {displayNews[0].date?.seconds 
                          ? new Date(displayNews[0].date.seconds * 1000).toLocaleDateString(currentLang === 'FR' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
                          : displayNews[0].date}
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight group-hover:text-amber-400 transition-colors">
                      {displayNews[0].title}
                    </h3>
                    <div className="inline-flex items-center text-white font-bold uppercase tracking-widest text-xs group/btn">
                      <span>Lire l'article complet</span>
                      <div className="ml-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover/btn:bg-amber-500 group-hover/btn:text-blue-950 transition-all duration-300">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {displayNews.length > 1 && (
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                {displayNews.slice(1, 4).map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex-1"
                  >
                    <Link to={`/actualites/${item.id}`} className="flex flex-col sm:flex-row gap-6 items-center bg-slate-50/50 rounded-[2rem] p-4 hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-slate-100 h-full">
                      <div className="w-full sm:w-48 h-48 sm:h-full min-h-[140px] rounded-[1.5rem] overflow-hidden flex-shrink-0 relative">
                        <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-blue-950/5 group-hover:opacity-0 transition-opacity duration-500"></div>
                      </div>
                      <div className="flex flex-col py-2 flex-grow h-full justify-center">
                        <div className="text-[#c47d00] font-bold text-[10px] uppercase tracking-widest mb-3 font-sans">
                          {item.date?.seconds 
                            ? new Date(item.date.seconds * 1000).toLocaleDateString(currentLang === 'FR' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
                            : item.date}
                        </div>
                        <h3 className="text-[36px] font-bold text-blue-950 mb-3 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-400 text-xs font-light mt-auto flex items-center group-hover:text-blue-900 transition-colors">
                          Lire la suite <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA / Contact Section (Admissions) */}
      <section id="contact" className="py-24 bg-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_var(--tw-gradient-stops))] from-red-600 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="h-px w-16 bg-red-600/50"></div>
                  <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[11px]">
                    {t.nav.admissions}
                  </span>
                </div>
              <h2 className="text-white mb-8 font-display font-bold text-[50px] md:text-[50px] lg:text-[50px] leading-none">
                {t.hero.preparing} <br />
                <span className="text-amber-400">{t.hero.future}</span>
              </h2>
              <p className="text-blue-200/80 text-lg lg:text-xl leading-relaxed font-light mb-12 max-w-xl">
                {t.contact.desc}
              </p>
              
              <div className="space-y-12">
                {[t.contact.step1, t.contact.step2, t.contact.step3].map((s, idx) => (
                  <div key={idx} className="flex items-start group">
                    <div className="text-5xl font-display font-bold text-white/10 group-hover:text-red-600/20 transition-colors duration-700 mr-10 leading-none">
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-red-600 transition-colors">{s.title}</h4>
                      <p className="text-blue-200/60 font-light leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[4rem] p-12 md:p-16 lg:p-20 shadow-2xl relative"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl transform rotate-12 z-20">
                <Sparkles size={48} />
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-blue-950 mb-12">{t.contact.formTitle}</h3>
              <form className="space-y-8" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-display font-bold uppercase tracking-widest text-slate-400 ml-4">{t.contact.name}</label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-blue-950 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all font-light" 
                      placeholder={t.contact.namePlaceholder || "Jean Dupont"} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-display font-bold uppercase tracking-widest text-slate-400 ml-4">{t.contact.email}</label>
                    <input 
                      type="email" 
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-blue-950 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all font-light" 
                      placeholder={t.contact.emailPlaceholder || "jean@exemple.com"} 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-display font-bold uppercase tracking-widest text-slate-400 ml-4">{t.contact.phone}</label>
                  <input 
                    type="tel" 
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-blue-950 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all font-light" 
                    placeholder={t.contact.phonePlaceholder || "+212 6..."} 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-premium w-full flex items-center justify-center space-x-6 py-6 text-lg bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isSubmitted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <>
                      <span>{t.contact.btn}</span>
                      <ArrowRight size={24} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600 via-transparent to-transparent"></div>
        </div>
        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-32 items-start">
            <div className="lg:col-span-5">
              <div className="sticky top-32">
                <div className="flex items-center space-x-8 mb-10">
                  <div className="h-px w-20 bg-red-600/30"></div>
                  <span className="text-red-600 font-bold uppercase tracking-widest text-sm">
                    {t.faq.title}
                  </span>
                </div>
                <h2 className="text-slate-900 mb-10 font-display font-bold text-[50px] md:text-[50px] lg:text-[50px] leading-none">
                  {t.faq.questions} <br />
                  <span className="text-blue-900">{t.faq.frequentes}</span>
                </h2>
                <p className="text-slate-500 text-[11px] uppercase tracking-widest leading-loose font-light mb-20 max-w-md">
                  {t.faq.desc}
                </p>
                <div className="bg-white p-12 rounded-3xl shadow-premium border border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-8">
                    <Shield size={32} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-blue-950 mb-4">{t.faq.stillHaveQuestions}</h3>
                  <p className="text-slate-500 mb-10 font-light">{t.faq.contactUsDesc}</p>
                  <Link to="/contact" className="btn-premium inline-flex items-center justify-center w-full bg-red-600 hover:bg-red-700">
                    {t.faq.contactUs}
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 space-y-6">
              {faqs.map((faq, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className={`rounded-3xl transition-all duration-700 overflow-hidden ${activeFaq === idx ? 'bg-white shadow-2xl border-transparent' : 'bg-white/50 border border-slate-200 hover:border-red-200'}`}
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-10 md:p-12 flex items-center justify-between text-left group"
                  >
                    <span className={`text-xl md:text-2xl font-display font-bold transition-colors duration-500 ${activeFaq === idx ? 'text-red-600' : 'text-blue-950 group-hover:text-red-600'}`}>
                      {faq.q}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeFaq === idx ? 'bg-red-600 text-white rotate-180' : 'bg-slate-100 text-blue-950 group-hover:bg-red-50'}`}>
                      {activeFaq === idx ? <ChevronDown size={20} /> : <ChevronDown size={20} className="rotate-180" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-10 md:px-12 pb-12">
                          <div className="h-px w-full bg-slate-100 mb-10"></div>
                          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-light">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment Section */}
      <section id="recruitment-home" className="py-24 bg-white relative overflow-hidden">
        <div className="container-wide">
          <div className="bg-blue-950 rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-400/10 to-transparent"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <div className="flex items-center space-x-6 mb-8">
                  <div className="h-px w-12 bg-amber-400"></div>
                  <span className="text-amber-400 font-bold uppercase tracking-[0.4em] text-[11px]">
                    {t.recruitment.title}
                  </span>
                </div>
                <h2 className="text-white mb-8 font-display font-bold text-[50px] md:text-[50px] lg:text-[50px] leading-tight">
                  {t.recruitment.subtitle} <br />
                  <span className="text-amber-400">Georges Claude Private Academy</span>
                </h2>
                <p className="text-blue-100/70 text-lg font-light leading-relaxed mb-10 max-w-xl">
                  {t.recruitment.heroDesc}
                </p>
                <Link 
                  to="/recrutement" 
                  className="inline-flex items-center gap-4 bg-amber-400 text-blue-950 px-10 py-5 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-all duration-500 shadow-xl shadow-amber-400/20 active:scale-95"
                >
                  <Briefcase size={20} />
                  <span>{t.recruitment.applyNow}</span>
                </Link>
              </div>
              
              <div className="relative">
                <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10">
                  <img 
                    src="https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/69cd5b3c8fbdc13183530b9d_team-buid%20(1).jpg" 
                    alt="Recrutement Académie Georges Claude Private Academy" 
                    width="800"
                    height="450"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                {/* Floating stats or badges */}
                <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <p className="text-blue-950 font-bold text-lg leading-none">Georges Claude Private Academy Team</p>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">Rejoignez-nous</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMoment(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/90 backdrop-blur-xl p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <button
                aria-label="Fermer"
                onClick={() => setSelectedMoment(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <X size={24} />
              </button>
              
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
              
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.3em] mb-2 block">
                  {selectedMoment.category || 'Moment'}
                </span>
                <h3 className="text-white text-2xl font-bold">{selectedMoment.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Home;
