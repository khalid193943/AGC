import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  GraduationCap, Code, Globe, Microscope, 
  Compass, Users, Trophy, Clock,
  CheckCircle2, ArrowRight, Laptop,
  Library, Dumbbell, Zap, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

import { ASSETS } from '../constants';

import { ColorSeparator } from '../components/ColorSeparator';

const CollegePage: React.FC = () => {
  const { t, currentLang } = useLanguage();

  const sections = {
    hero: {
      title: t.college.title,
      subtitle: t.college.subtitle,
      image: 'https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a06426f924d5314fbb6e81b_WhatsApp%20Image%202026-04-08%20at%2009.29.13%20(2).jpeg'
    },
    vision: {
      title: t.college.visionTitle,
      text: t.college.visionText,
      image: 'https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a06426f924d5314fbb6e81b_WhatsApp%20Image%202026-04-08%20at%2009.29.13%20(2).jpeg'
    },
    pillars: t.college.pillars.map((pillar: any, idx: number) => ({
      ...pillar,
      icon: [
        <Code className="text-amber-400" size={32} />,
        <Globe className="text-amber-400" size={32} />,
        <Compass className="text-amber-400" size={32} />,
        <Zap className="text-amber-400" size={32} />
      ][idx]
    })),
    curriculum: t.college.curriculum,
    dailyLife: t.college.dailyLife
  };

  return (
    <main className="bg-blue-950 text-white">
      <Helmet>
        <title>Collège Privé El Jadida | Georges Claude Private Academy</title>
        <meta name="description" content="Notre collège à El Jadida prépare les élèves aux défis de demain avec un programme rigoureux, un encadrement personnalisé et un épanouissement garanti." />
        <meta property="og:title" content="Collège Privé El Jadida | Georges Claude Private Academy" />
        <meta property="og:description" content="L'excellence et l'innovation au collège à El Jadida." />
        <meta property="og:image" content={sections.hero.image} />
        <meta property="og:url" content="https://agc.ma/programmes/college" />
        <link rel="canonical" href="https://agc.ma/programmes/college" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img 
            src={sections.hero.image} 
            alt="Collège Académie Georges Claude Private Academy El Jadida" 
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
        
        <div className="max-w-[1600px] mx-auto px-4 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">{t.common.cycle4}</span>
              </div>
              <h1 className="text-white mb-8 font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-none">
                {sections.hero.title} <br />
                <span className="text-amber-400">Georges Claude Private Academy</span>
              </h1>
              <p className="text-lg md:text-xl font-light max-w-xl mx-auto lg:mx-0 text-blue-100/60 leading-relaxed mb-12 uppercase tracking-wider">
                {sections.hero.subtitle}
              </p>
            </motion.div>

            <div className="hidden lg:flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="w-64 h-64 md:w-80 md:h-80 bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/20 flex items-center justify-center text-amber-400 shadow-2xl relative group"
              >
                <div className="absolute inset-0 bg-amber-400/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img src={ASSETS.logo} alt="Logo Académie Georges Claude Private Academy El Jadida" className="w-48 h-auto relative z-10 opacity-80" referrerPolicy="no-referrer" loading="lazy" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section - Dark */}
      <section className="section-padding bg-blue-950">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-px w-12 bg-amber-500"></div>
                <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm">
                  {t.common.vision}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 tracking-tighter leading-[0.9]">
                {sections.vision.title}
              </h2>
              <p className="text-lg md:text-xl text-blue-100/60 leading-relaxed mb-12 font-light">
                {sections.vision.text}
              </p>
              <div className="grid grid-cols-2 gap-8">
                {sections.pillars.map((pillar: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-all group">
                    <div className="mb-4 group-hover:scale-110 transition-transform">{pillar.icon}</div>
                    <h4 className="text-lg font-bold mb-2">{pillar.title}</h4>
                    <p className="text-xs text-blue-100/40 leading-relaxed">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-[4rem] overflow-hidden border-8 border-white/5">
                <img 
                  src={sections.vision.image} 
                  alt="Vision Pédagogique Collège Académie Georges Claude Private Academy El Jadida" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-amber-400 p-12 rounded-[3rem] text-blue-950 hidden md:block">
                <p className="text-4xl font-bold mb-2">100%</p>
                <p className="text-sm font-bold uppercase tracking-widest">{t.common.middleSchoolCertificate}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ColorSeparator />

      {/* Curriculum Section - Darker */}
      <section className="section-padding bg-blue-900">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="h-px w-12 bg-amber-500"></div>
              <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm">
                {t.common.curriculum}
              </span>
              <div className="h-px w-12 bg-amber-500"></div>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tighter leading-[0.9]">
              {t.college.curriculumTitle}
            </h2>
            <p className="text-blue-100/40 text-lg md:text-xl max-w-2xl mx-auto font-light">
              {t.college.curriculumSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {sections.curriculum.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 p-12 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all"
              >
                <h3 className="text-2xl font-bold text-amber-400 mb-8">{item.title}</h3>
                <ul className="space-y-4">
                  {item.items.map((sub: string, sIdx: number) => (
                    <li key={sIdx} className="flex items-center text-blue-100/60 text-sm font-medium">
                      <CheckCircle2 size={18} className="text-amber-400 mr-4 flex-shrink-0" />
                      {sub}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ColorSeparator />

      {/* Daily Life - Dark */}
      <section className="section-padding bg-blue-950">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
            
            <div className="lg:w-1/3">
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-px w-12 bg-amber-500"></div>
                <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm">
                  {t.common.dailyLife}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tighter leading-[0.9]">
                {t.college.dailyLifeTitle}
              </h2>
              <p className="text-blue-100/60 leading-relaxed font-light text-xl">
                {currentLang === 'FR' ? "Un cadre de vie structuré, conçu pour harmoniser apprentissage intensif, moments de convivialité et développement de l'autonomie chez nos collégiens." : "A structured living environment, designed to harmonize intensive learning, moments of conviviality, and the development of autonomy among our middle schoolers."}
              </p>
            </div>

            <div className="lg:w-2/3 w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.dailyLife.map((item: any, idx: number) => (
                <div key={idx} className="group flex flex-col p-8 rounded-[2rem] bg-blue-900/50 border border-white/5 hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
                  <span className="text-amber-400 font-display font-bold text-4xl mb-6 group-hover:scale-105 origin-left transition-transform">{item.time}</span>
                  <span className="text-white text-lg font-bold mb-6 leading-tight">{item.activity}</span>
                  <div className="w-8 h-1 bg-white/10 group-hover:bg-amber-400 transition-colors mt-auto"></div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <ColorSeparator />

      {/* Infrastructure - Darker */}
      <section className="section-padding bg-blue-900">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-px w-12 bg-amber-500"></div>
                <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm">
                  {t.common.infrastructure}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tighter leading-[0.9]">
                {t.college.spacesTitle}
              </h2>
              <p className="text-blue-100/40 text-lg md:text-xl font-light">
                {t.college.spacesSubtitle}
              </p>
            </div>
            <Link to="/vie-scolaire" className="group flex items-center space-x-4 text-amber-400 font-bold uppercase tracking-widest text-sm">
              <span>{t.common.visitCampus}</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {t.college.spaces.map((space: any, idx: number) => (
              <div key={idx} className="group relative h-96 rounded-[3rem] overflow-hidden">
                <img 
                  src={[
                    'https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a0642fb4fb44268106e9ccc_20260408_111637.jpg',
                    'https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a06413ec3ed04098d4bd38b_20260408_103650.jpg',
                    'https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a0b4f06dcb3815df08560c6_WhatsApp%20Image%202026-05-18%20at%2018.39.00%20(1).jpeg',
                    'https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a0a1b5cda3ae5e67ecafcec_Capture%20d%E2%80%99e%CC%81cran%202026-05-17%20a%CC%80%2020.49.15.png'
                  ][idx]} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={`${space.title} Académie Georges Claude Private Academy El Jadida`} 
                  referrerPolicy="no-referrer" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-blue-950 mb-4">
                    {[<Microscope key="0" />, <Library key="1" />, <Laptop key="2" />, <Dumbbell key="3" />][idx]}
                  </div>
                  <h4 className="text-xl font-bold">{space.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ColorSeparator />

      {/* CTA Section - Dark */}
      <section className="section-padding bg-blue-950">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-16 md:p-24 rounded-[4rem] border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400/5 rounded-full -ml-48 -mt-48 blur-3xl"></div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 tracking-tighter leading-[0.9]">
              {t.college.ctaTitle}
            </h2>
            <p className="text-blue-100/40 text-lg md:text-xl max-w-3xl mx-auto mb-16 font-light leading-relaxed">
              {t.college.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <Link to="/inscription" className="btn-premium-gold px-12 py-6 text-xl shadow-2xl">
                {t.college.enrollBtn}
              </Link>
              <Link to="/inscription" className="bg-white/5 text-white border border-white/10 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all">
                {t.college.admissionBtn}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CollegePage;
