import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Target, Eye, Award, Compass, Sparkles, Quote, Zap, Shield, GraduationCap, Heart, Leaf, Sun, Recycle, TreePine, Droplet } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ASSETS } from '../constants';

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
  <div className={`absolute left-0 w-full bottom-0 z-10 scale-y-[-1] leading-none ${flip ? 'scale-x-[-1]' : ''}`}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-full h-[60px] ${color}`}>
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
    </svg>
  </div>
);

export const Academy: React.FC = () => {
  const { t, currentLang } = useLanguage();
  const academy = t.academy;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main className="bg-white text-blue-950 font-sans selection:bg-amber-400 selection:text-blue-950 overflow-x-hidden" ref={containerRef}>
      <Helmet>
        <title>Georges Claude Private Academy | Excellence Éducative à El Jadida</title>
        <meta name="description" content="Découvrez l'histoire, la mission et les valeurs de Georges Claude Private Academy. Une institution de référence à El Jadida dédiée à la réussite de chaque élève." />
        <meta property="og:title" content="Georges Claude Private Academy | Excellence Éducative à El Jadida" />
        <meta property="og:description" content="Découvrez notre vision pédagogique et notre engagement pour l'excellence à El Jadida." />
        <meta property="og:image" content={ASSETS.heroSlider[1]} />
        <meta property="og:url" content="https://agc.ma/academie" />
        <link rel="canonical" href="https://agc.ma/academie" />
      </Helmet>

      {/* HERO - Editorial Style */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-blue-950 text-white">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <img 
            src={ASSETS.heroSlider[1]} 
            alt="Georges Claude Private Academy El Jadida - Excellence et Tradition" 
            width="1920"
            height="1080"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-950/50 to-blue-950"></div>
        </motion.div>

        <FloatingShape className="top-1/4 left-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl" />
        <FloatingShape delay={2} className="bottom-1/4 right-10 w-96 h-96 bg-red-600 rounded-full blur-3xl" />

        <div className="container-wide relative z-10 w-full">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-4 mb-8"
              >
                <div className="w-12 h-px bg-amber-400"></div>
                <span className="text-amber-400 font-bold uppercase tracking-[0.5em] text-[10px]">
                  {academy.heritageLabel}
                </span>
                <div className="w-12 h-px bg-amber-400"></div>
              </motion.div>
              
              <h1 className="text-white mb-8 font-display font-normal text-5xl md:text-8xl lg:text-[90px] leading-[0.8] md:leading-[80px] tracking-tighter uppercase">
                {academy.heroTitle1} <br/>
                <span className="text-amber-400">{academy.heroTitle2}</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl leading-relaxed font-light">
                {academy.heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-6">
                <Link to="/inscription" className="bg-amber-400 text-blue-950 px-10 py-5 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-white transition-all duration-500 shadow-2xl shadow-amber-400/20 flex items-center">
                  {t.hero.admissionsBtn} <ArrowRight size={20} className="ml-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        <WaveSeparator color="fill-white" />
      </section>

      {/* MANIFESTO - Split Layout */}
      <section className="py-32 md:py-48 bg-white relative">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src={ASSETS.director} 
                  alt="Directeur de l'Académie Georges Claude Private Academy El Jadida" 
                  width="400"
                  height="500"
                  className="w-full aspect-[4/5] object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-red-600 rounded-[3rem] -z-10 opacity-20 blur-2xl"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <Quote className="w-16 h-16 text-amber-400 mb-8 opacity-50" />
              <div className="text-lg md:text-xl lg:text-2xl font-display font-normal leading-[35px] text-blue-950 mb-12 italic whitespace-pre-line">
                "{academy.director.quote}"
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-px bg-blue-950/20"></div>
                <div>
                  <p className="text-xl font-bold text-blue-950">{academy.directionName}</p>
                  <p className="text-sm text-amber-600 font-bold uppercase tracking-widest">{academy.directionTitle}</p>
                  <img src="https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/69de438361b1b716a22c54b2_signaturegen-1776170089424.png" alt="Signature" className="h-12 mt-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <WaveSeparator color="fill-slate-50" />
      </section>

      {/* PILLARS - Bento Grid Style */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container-wide">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-6 py-2 bg-blue-950/5 rounded-full text-blue-950 text-xs font-bold uppercase tracking-[0.3em] mb-6"
            >
              {academy.pillarsLabel}
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-blue-950 tracking-tighter">
              {academy.excellenceMovement.includes(' ') ? (
                <>
                  {academy.excellenceMovement.split(' ').slice(0, -1).join(' ')} <span className="text-red-600 italic">{academy.excellenceMovement.split(' ').slice(-1)}</span>
                </>
              ) : (
                academy.excellenceMovement
              )}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {academy.whyCards.map((card: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className={`p-12 rounded-[3rem] transition-all duration-500 group relative overflow-hidden ${
                  idx === 0 ? 'bg-blue-950 text-white' : 
                  idx === 1 ? 'bg-red-600 text-white' : 
                  'bg-amber-400 text-blue-950'
                }`}
              >
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${
                    idx === 2 ? 'bg-blue-950/10' : 'bg-white/10'
                  }`}>
                    {idx === 0 ? <Zap size={32} /> : idx === 1 ? <Shield size={32} /> : <GraduationCap size={32} />}
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-6 leading-tight">
                    {card.title}
                  </h3>
                  <p className={`text-lg leading-relaxed font-light ${
                    idx === 2 ? 'text-blue-950/70' : 'text-white/70'
                  }`}>
                    {card.desc}
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              </motion.div>
            ))}
          </div>
        </div>
        <WaveSeparator color="fill-white" />
      </section>

      {/* HISTORY / HERITAGE - Modern Split */}
      <section className="py-32 md:py-48 bg-white relative">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-xs mb-6 block">{academy.historyLabel}</span>
                <h2 className="text-6xl md:text-8xl font-display font-bold mb-12 tracking-tighter leading-[0.9]">
                  {academy.historyTitle1} <br/><span className="text-amber-500 italic">{academy.historyTitle2}</span>
                </h2>
                <div className="space-y-8 text-lg text-slate-600 font-light leading-relaxed">
                  <p>{academy.heritageText1}</p>
                  <p>{academy.heritageText2}</p>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-8">
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <span className="block text-4xl font-display font-bold text-blue-950 mb-2">5+</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{academy.yearsExperience}</span>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <span className="block text-4xl font-display font-bold text-red-600 mb-2">100%</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{academy.academicSuccess}</span>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-6 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
              >
                <img 
                  src={ASSETS.presentation[2]} 
                  alt="Héritage et éducation à l'Académie Georges Claude Private Academy El Jadida" 
                  width="500"
                  height="500"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </motion.div>
              <FloatingShape className="top-0 -right-10 w-32 h-32 bg-amber-400 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
        <WaveSeparator color="fill-emerald-900" />
      </section>

      {/* ECOLOGY - Green Ribbon & Eco-Initiatives Bento Layout */}
      <section className="py-32 md:py-48 bg-emerald-950 text-white relative overflow-hidden">
        {/* Ambient Nature Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-900/80 to-blue-950"></div>
          <FloatingShape className="top-10 left-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[150px] opacity-20" />
          <FloatingShape className="bottom-10 right-1/4 w-[400px] h-[400px] bg-amber-500 rounded-full blur-[150px] opacity-10" />
        </div>

        <div className="container-wide relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20 md:mb-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8"
            >
              <Leaf className="text-emerald-400" size={20} />
              <span className="text-emerald-300 font-bold uppercase tracking-widest text-sm">
                {currentLang === 'FR' ? 'Engagement Écologique' : 'Ecological Commitment'}
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl lg:text-[90px] font-display font-bold leading-[1.1] mb-8 text-white tracking-tighter"
            >
              {currentLang === 'FR' ? 'Une École qui' : 'A School that'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 italic">
                {currentLang === 'FR' ? 'Respire la Nature' : 'Breathes Nature'}
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-emerald-100/80 font-light leading-relaxed"
            >
              {academy.ecoRibbonText1}
            </motion.p>
          </div>

          {/* Bento Eco-Grid */}
          <div className="grid md:grid-cols-12 gap-6 md:gap-8">
            
            {/* Main Feature: Green Ribbon Label */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-8 bg-emerald-900/40 backdrop-blur-xl rounded-[3rem] p-10 md:p-16 border border-emerald-500/30 relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-amber-500/20">
                    <Award className="text-white" size={32} />
                  </div>
                  <h3 className="text-4xl font-display font-bold text-white mb-6">
                    {currentLang === 'FR' ? 'Label Ruban Vert' : 'Green Ribbon Label'}
                  </h3>
                  <p className="text-emerald-100/70 text-lg leading-relaxed mb-8">
                    {academy.ecoRibbonText2}
                  </p>
                  <div className="inline-flex items-center space-x-2 bg-emerald-950/50 px-4 py-2 rounded-lg border border-emerald-800/50">
                    <span className="text-emerald-400 font-bold text-xl">1ère</span>
                    <span className="text-emerald-100/50 text-xs uppercase tracking-widest">{currentLang === 'FR' ? 'École certifiée' : 'Certified school'}</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-full overflow-hidden border-8 border-emerald-800/30">
                    <img 
                      src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80" 
                      alt="École écologique El Jadida" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-400 rounded-full blur-[40px] opacity-40"></div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Eco-Garden */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4 bg-emerald-800/30 backdrop-blur-xl rounded-[3rem] p-10 border border-emerald-500/20 relative overflow-hidden group shadow-2xl flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <TreePine size={120} className="text-emerald-300 transform rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <TreePine className="text-emerald-400" size={28} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">
                  {currentLang === 'FR' ? 'Jardin Pédagogique' : 'Educational Garden'}
                </h3>
                <p className="text-emerald-100/70 leading-relaxed font-light">
                  {currentLang === 'FR' 
                    ? 'Un espace dédié où nos élèves apprennent l\'agriculture durable, le compostage et le respect de la biodiversité locale.' 
                    : 'A dedicated space where our students learn sustainable agriculture, composting, and respect for local biodiversity.'}
                </p>
              </div>
            </motion.div>

            {/* Feature 3: Renewable Energy */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-4 bg-blue-900/30 backdrop-blur-xl rounded-[3rem] p-10 border border-blue-500/20 relative overflow-hidden group shadow-2xl flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sun size={120} className="text-amber-300 transform -rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Sun className="text-amber-400" size={28} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">
                  {currentLang === 'FR' ? 'Énergie Verte' : 'Green Energy'}
                </h3>
                <p className="text-blue-100/70 leading-relaxed font-light">
                  {currentLang === 'FR' 
                    ? 'Infrastructures optimisées pour réduire notre empreinte carbone avec l\'utilisation d\'énergies renouvelables et d\'éclairage intelligent.' 
                    : 'Infrastructures optimized to reduce our carbon footprint using renewable energies and smart lighting.'}
                </p>
              </div>
            </motion.div>

            {/* Feature 4: Recycling & Water */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-8 bg-emerald-900/40 backdrop-blur-xl rounded-[3rem] p-10 border border-emerald-500/20 relative overflow-hidden group shadow-2xl"
            >
              <div className="relative z-10 flex flex-col md:flex-row gap-10">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Droplet className="text-blue-400" size={20} />
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <Recycle className="text-emerald-400" size={20} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white mb-4">
                    {currentLang === 'FR' ? 'Politique Zéro Déchet' : 'Zero Waste Policy'}
                  </h3>
                  <p className="text-emerald-100/70 leading-relaxed font-light">
                    {currentLang === 'FR' 
                      ? 'Des programmes stricts de tri sélectif, de recyclage du papier et du plastique, ainsi qu\'un système innovant de récupération des eaux pluviales pour l\'arrosage de nos espaces verts.' 
                      : 'Strict programs for selective sorting, paper and plastic recycling, as well as an innovative rainwater harvesting system for watering our green spaces.'}
                  </p>
                </div>
                <div className="flex-1 rounded-[2rem] overflow-hidden hidden md:block">
                  <img 
                    src="https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&q=80" 
                    alt="Gestion écologique" 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
        <WaveSeparator color="fill-blue-950" />
      </section>

      {/* MISSION & VISION - Dark Luxury Bento */}
      <section className="bg-blue-950 text-white py-32 md:py-48 relative overflow-hidden">
        <FloatingShape className="top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-[120px] opacity-10" />
        <FloatingShape delay={2} className="bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-[120px] opacity-10" />
        
        <div className="container-wide relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="bg-white/5 backdrop-blur-md p-16 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-colors duration-500"
            >
              <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center mb-12">
                <Target className="text-blue-950" size={32} />
              </div>
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-8 text-amber-400">{academy.mission}</h3>
              <p className="text-lg text-white/70 font-light leading-relaxed">
                {academy.missionText}
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-md p-16 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-colors duration-500"
            >
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-12">
                <Eye className="text-white" size={32} />
              </div>
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-8 text-red-600">{academy.missionV.title}</h3>
              <p className="text-lg text-white/70 font-light leading-relaxed">
                {academy.visionText}
              </p>
            </motion.div>
          </div>
        </div>
        <WaveSeparator color="fill-white" />
      </section>

      {/* CTA - High Impact */}
      <section className="py-24 relative bg-white">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-amber-400 rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden group"
          >
            <FloatingShape className="top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-20" />
            <div className="relative z-10">
              <h2 className="text-[79px] font-display font-bold text-blue-950 mb-12 tracking-tighter leading-tight">
                {academy.ctaTitle.includes('?') ? (
                  <>
                    {academy.ctaTitle.split('?')[0]} <br/> {academy.ctaTitle.split('?')[1]}?
                  </>
                ) : (
                  academy.ctaTitle
                )}
              </h2>
              <Link to="/inscription" className="inline-flex items-center gap-6 bg-blue-950 text-white px-12 py-6 rounded-full text-lg font-bold uppercase tracking-widest hover:bg-red-600 transition-all duration-500 shadow-2xl">
                {academy.ctaBtn} <ArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
        <WaveSeparator color="fill-blue-950" />
      </section>
    </main>
  );
};

export default Academy;
