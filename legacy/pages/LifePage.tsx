import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Play, X, ArrowRight, Trophy, Palette, Music, Cpu, Zap, Globe, Heart, Camera, Clock, MapPin, Sparkles, Utensils, Shield
} from 'lucide-react';
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

export const LifePage: React.FC = () => {
  const { t } = useLanguage();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const content = t.lifePage;

  const activities = [
    { title: t.activities.a1.title, icon: <Trophy />, color: 'bg-red-600' },
    { title: t.activities.a2.title, icon: <Palette />, color: 'bg-amber-400' },
    { title: t.activities.a3.title, icon: <Music />, color: 'bg-blue-950' },
    { title: t.activities.a4.title, icon: <Cpu />, color: 'bg-red-600' },
    { title: t.activities.a5.title, icon: <Zap />, color: 'bg-amber-400' },
    { title: t.activities.a6.title, icon: <Globe />, color: 'bg-blue-950' },
    { title: t.activities.a7.title, icon: <Heart />, color: 'bg-red-600' },
    { title: t.activities.a8.title, icon: <Camera />, color: 'bg-amber-400' }
  ];

  return (
    <main className="bg-white text-blue-950 font-sans selection:bg-amber-400 selection:text-blue-950 overflow-x-hidden">
      <Helmet>
        <title>Vie Scolaire & Activités | Georges Claude Private Academy El Jadida</title>
        <meta name="description" content="Découvrez la vie scolaire dynamique à Georges Claude Private Academy El Jadida. Activités parascolaires, sports, infrastructures modernes et services aux élèves." />
        <meta property="og:title" content="Vie Scolaire & Activités | Académie Georges Claude Private Academy El Jadida" />
        <meta property="og:description" content="Une vie scolaire riche et épanouissante pour nos élèves à El Jadida." />
        <meta property="og:image" content={ASSETS.heroBg} />
        <meta property="og:url" content="https://agc.ma/vie-scolaire" />
        <link rel="canonical" href="https://agc.ma/vie-scolaire" />
      </Helmet>

      {/* HERO - High Impact */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-blue-950 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src={ASSETS.heroBg} 
            alt="Vie Scolaire Académie Georges Claude Private Academy El Jadida" 
            width="1920"
            height="1080"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/60 via-blue-950/40 to-blue-950"></div>
        </div>

        <FloatingShape className="top-1/4 left-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl" />
        <FloatingShape delay={2} className="bottom-1/4 right-10 w-96 h-96 bg-red-600 rounded-full blur-3xl" />

        <div className="max-w-[1600px] mx-auto px-4 relative z-10 w-full">
          <div className="max-w-6xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">
                  {t.life.title}
                </span>
              </div>
              
              <h1 className="text-white mb-8 font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-none">
                {content.heroTitle1} <br/>
                <span className="text-amber-400">{content.heroTitle2}</span>
              </h1>

              <div className="flex flex-col md:flex-row gap-12 items-start md:items-center">
                <p className="text-sm md:text-base lg:text-lg text-white/80 max-w-2xl leading-relaxed font-light">
                  {content.heroSubtitle}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        <WaveSeparator color="fill-white" />
      </section>

      {/* MARQUEE ACTIVITIES */}
      <section className="py-12 bg-amber-400 overflow-hidden border-y-4 border-blue-950 relative z-20">
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {[...activities, ...activities, ...activities].map((act, i) => (
            <div key={i} className="flex items-center mx-12 text-blue-950">
              <span className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mr-6 shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform">
                {React.cloneElement(act.icon as React.ReactElement, { size: 28, className: "text-blue-950" })}
              </span>
              <span className="text-5xl font-display font-bold uppercase tracking-tighter">{act.title}</span>
              <span className="mx-12 text-5xl font-display font-bold opacity-20">/</span>
            </div>
          ))}
        </div>
      </section>

      <SchoolVideoSection />

      {/* INFRASTRUCTURES - Bento Grid */}
      <section className="section-padding bg-slate-50 relative overflow-hidden">
        <WaveSeparator color="fill-slate-50" flip />
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-px w-12 bg-red-500"></div>
                <span className="text-red-600 font-bold uppercase tracking-[0.3em] text-sm">
                  {t.common.infrastructure}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-blue-950 tracking-tighter leading-[0.9]">
                {content.infraTitle.includes(' ') ? (
                  <>
                    {content.infraTitle.split(' ').slice(0, -1).join(' ')} <br/><span className="text-slate-300 italic">{content.infraTitle.split(' ').slice(-1)}</span>
                  </>
                ) : content.infraTitle}
              </h2>
            </div>
            <p className="max-w-md text-slate-500 text-sm md:text-base font-light leading-relaxed">
              {content.spacesTitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t.life.s1, desc: content.s1Desc, img: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a09f38a9d6e7a93cd71f0cd_WhatsApp%20Image%202026-05-17%20at%2000.58.02%20(1).jpeg", color: "bg-blue-950" },
              { title: t.life.s2, desc: content.s2Desc, img: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a0642e35c967a63aaf11e02_20260408_111256.jpg", color: "bg-red-600" },
              { title: t.life.s3, desc: content.s3Desc, img: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a06413ec3ed04098d4bd38b_20260408_103650.jpg", color: "bg-amber-400" }
            ].map((space, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden relative shadow-2xl">
                  <img src={space.img} alt={`${space.title} Académie Georges Claude Private Academy El Jadida`} width="400" height="500" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-3xl font-display font-bold text-white mb-2 uppercase tracking-tight">{space.title}</h3>
                    <p className="text-white/70 text-xs font-light line-clamp-2 transition-all duration-500">{space.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CANTINE - Split Layout Bento */}
      <section className="section-padding bg-white relative">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-px w-12 bg-red-500"></div>
                <span className="text-red-600 font-bold uppercase tracking-[0.3em] text-sm">
                  {content.canteenLabel}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-blue-950 tracking-tighter leading-[0.9] mb-12">
                {content.canteenTitle.includes('&') ? (
                  <>
                    {content.canteenTitle.split('&')[0]} <br/><span className="text-amber-500 italic">& {content.canteenTitle.split('&')[1]}</span>
                  </>
                ) : content.canteenTitle}
              </h2>
              <p className="text-base md:text-lg text-slate-600 font-light mb-12 leading-relaxed">
                {content.canteenText}
              </p>
              <div className="grid gap-6">
                {content.canteenFeatures.map((item: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group"
                  >
                    <div className="w-12 h-12 bg-blue-950 text-white rounded-2xl flex items-center justify-center font-bold shrink-0 group-hover:bg-red-600 transition-colors">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-display font-bold text-blue-950 mb-2 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10">
                <img src="https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a0641c4501289912ee5bfa9_20260408_102058.jpg" alt="Cantine Académie Georges Claude Private Academy El Jadida" width="400" height="500" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-400 rounded-[4rem] -z-10 opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-red-600 rounded-[4rem] -z-10 opacity-20 blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES - Bold Bento Cards */}
      <section className="section-padding bg-blue-950 text-white relative overflow-hidden">
        <WaveSeparator color="fill-blue-950" flip />
        <FloatingShape className="top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-[120px] opacity-10" />
        <FloatingShape delay={2} className="bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-[120px] opacity-10" />
        
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="h-px w-12 bg-amber-500"></div>
              <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm">
                {content.servicesLabel}
              </span>
              <div className="h-px w-12 bg-amber-500"></div>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter leading-tight">
              {content.servicesTitle.includes(' ') ? (
                <>
                  {content.servicesTitle.split(' ').slice(0, -1).join(' ')} <br/><span className="text-red-600 italic">{content.servicesTitle.split(' ').slice(-1)}</span>
                </>
              ) : content.servicesTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.services.map((service: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-md p-12 rounded-[3rem] border border-white/10 hover:bg-amber-400 hover:text-blue-950 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-950/10 transition-colors">
                    {idx === 0 ? <Zap size={28} /> : idx === 1 ? <Shield size={28} /> : idx === 2 ? <Globe size={28} /> : <Heart size={28} />}
                  </div>
                  <h3 className="text-2xl font-display font-bold uppercase mb-4 tracking-tight">{service.title}</h3>
                  <p className="text-white/60 group-hover:text-blue-950/80 text-sm font-light leading-relaxed">{service.desc}</p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-blue-950/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <button 
              aria-label="Fermer la vidéo"
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-8 right-8 text-white hover:text-amber-400 transition-colors"
            >
              <X size={48} />
            </button>
            <div className="w-full max-w-6xl aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Video" 
                frameBorder="0" 
                allow="autoplay; fullscreen"
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default LifePage;
