import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Sparkles, Zap, GraduationCap, ArrowRight, CheckCircle2, Heart } from 'lucide-react';

interface ProgramsPageProps {
  t: any;
  currentLang: string;
}

import { ASSETS } from '../constants';

import { ColorSeparator } from '../components/ColorSeparator';

const ProgramsPage: React.FC<ProgramsPageProps> = ({ t, currentLang }) => {
  const programs = [
    {
      id: 'maternelle',
      title: t.programs.p1.title,
      desc: t.programs.p1.desc,
      icon: <Heart size={40} />,
      color: 'bg-rose-50',
      textColor: 'text-rose-600',
      features: t.programs.p1.features,
      details: t.programs.p1.details,
      image: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a06431c03ee9b32184c769e_20260408_104421%20-%20Copie.avif"
    },
    {
      id: 'primaire',
      title: t.programs.p2.title,
      desc: t.programs.p2.desc,
      icon: <Sparkles size={40} />,
      color: 'bg-amber-50',
      textColor: 'text-amber-600',
      features: t.programs.p2.features,
      details: t.programs.p2.details,
      image: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a0642a62888461bc238b590_20260408_105811.jpg"
    },
    {
      id: 'college',
      title: t.programs.p3.title,
      desc: t.programs.p3.desc,
      icon: <Zap size={40} />,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      features: t.programs.p3.features,
      details: t.programs.p3.details,
      image: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a06426f924d5314fbb6e81b_WhatsApp%20Image%202026-04-08%20at%2009.29.13%20(2).jpeg"
    },
    {
      id: 'lycee',
      title: t.programs.p4.title,
      desc: t.programs.p4.desc,
      icon: <GraduationCap size={40} />,
      color: 'bg-slate-50',
      textColor: 'text-slate-600',
      features: t.programs.p4.features,
      details: t.programs.p4.details,
      image: "https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/6a0642a45998583a1d309187_%23exames%20%23boncourage.webp"
    }
  ];

  return (
    <main className="bg-white text-slate-900 selection:bg-amber-400 selection:text-black">
      <Helmet>
        <title>Programmes Scolaires | Georges Claude Private Academy El Jadida</title>
        <meta name="description" content="Découvrez nos cycles d'enseignement à El Jadida : Maternelle, Primaire, Collège et Lycée. Un programme trilingue d'excellence pour la réussite de vos enfants." />
        <meta property="og:title" content="Programmes Scolaires | Georges Claude Private Academy El Jadida" />
        <meta property="og:description" content="Maternelle, Primaire, Collège et Lycée à El Jadida. Un parcours éducatif complet et trilingue." />
        <meta property="og:image" content={ASSETS.heroBg} />
        <meta property="og:url" content="https://agc.ma/programmes" />
        <link rel="canonical" href="https://agc.ma/programmes" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img 
            src={ASSETS.heroBg} 
            alt="Programmes éducatifs de l'Académie Georges Claude Private Academy El Jadida" 
            width="1920"
            height="1080"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-20 scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-blue-950/80 to-blue-950"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.9)_100%)]"></div>
        </div>
        
        <div className="max-w-[1600px] mx-auto px-4 relative z-10 w-full pt-20">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">
                  {t.nav.programs}
                </span>
              </div>
              
              <h1 className="text-white mb-8 font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-none">
                {t.programs.heroTitle1} <br />
                <span className="text-amber-400">{t.programs.heroTitle2}</span>
              </h1>
              
              <p className="text-base md:text-lg text-blue-100 font-light tracking-wide max-w-3xl leading-relaxed text-balance uppercase opacity-80">
                {t.programs.heroDesc}
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Programs List */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-400/5 rounded-full blur-[150px] -mr-96 -mt-96"></div>
        
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="space-y-48 md:space-y-64">
            {programs.map((program, idx) => (
              <motion.div 
                key={program.id}
                id={program.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-32 items-center`}
              >
                {/* Content Side */}
                <div className="w-full lg:w-1/2">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="h-px w-12 bg-amber-500"></div>
                    <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm">
                      {program.title}
                    </span>
                  </div>
                  
                  <div className={`w-24 h-24 ${program.color} rounded-[2.5rem] flex items-center justify-center ${program.textColor} mb-12 shadow-premium relative group-hover:scale-110 transition-transform duration-700`}>
                    {React.cloneElement(program.icon as React.ReactElement, { size: 48 })}
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-950 mb-8 tracking-tighter leading-[0.9] uppercase">
                    {program.title}
                  </h2>
                  
                  <p className="text-base md:text-lg text-slate-500 mb-10 leading-relaxed font-light">
                    {program.desc}
                  </p>
                  
                  <p className="text-sm md:text-base text-slate-500 mb-12 leading-relaxed font-light">
                    {program.details}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
                    {program.features.map((feature: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-start space-x-4 group/feat">
                        <div className="mt-1 bg-amber-400/10 p-2 rounded-xl group-hover/feat:bg-amber-400 transition-all duration-500">
                          <CheckCircle2 size={20} className="text-amber-600 group-hover/feat:text-blue-950 transition-colors duration-500 flex-shrink-0" />
                        </div>
                        <span className="text-blue-950 font-bold text-base group-hover/feat:translate-x-1 transition-transform duration-500">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    to={`/programmes/${program.id}`} 
                    className="btn-premium px-16 py-6 text-lg group inline-flex items-center"
                  >
                    {t.programs.programDetailsBtn}
                    <ArrowRight size={22} className="ml-4 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>

                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className="w-full h-full min-h-[400px] md:min-h-[500px] rounded-[4rem] overflow-hidden shadow-premium relative z-10 flex items-stretch">
                    <img 
                      src={program.image} 
                      alt={`${program.title} - Académie Georges Claude Private Academy El Jadida`} 
                      width="800"
                      height="500"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-12 right-12 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                      <div className="text-amber-400 font-bold text-5xl mb-1">0{idx + 1}</div>
                      <div className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-bold">Cycle</div>
                    </div>
                  </div>
                  
                  {/* Decorative blobs */}
                  <div className={`absolute -bottom-20 -right-20 w-80 h-80 ${program.color} rounded-full -z-10 opacity-40 blur-[100px] group-hover:scale-125 transition-transform duration-1000`}></div>
                  <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-900 rounded-full -z-10 opacity-10 blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ColorSeparator />

      {/* CTA Section */}
      <section className="section-padding bg-slate-50 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="bg-blue-950 rounded-[5rem] p-16 md:p-32 text-center text-white shadow-premium relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-400/5 rounded-full -mr-300 -mt-300 blur-[150px] group-hover:scale-110 transition-transform duration-[3s]"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full -ml-300 -mb-300 blur-[150px] group-hover:scale-110 transition-transform duration-[3s]"></div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-12 tracking-tighter leading-[0.9] uppercase">
                {t.programs.ctaTitle}
              </h2>
              <p className="text-base md:text-lg text-blue-100/70 max-w-4xl mx-auto mb-20 font-light leading-relaxed">
                {t.programs.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-10">
                <Link 
                  to="/inscription" 
                  className="btn-premium px-20 py-8 text-xl shadow-2xl"
                >
                  {t.hero.enrollOnline}
                </Link>
                <Link 
                  to="/inscription" 
                  className="btn-premium-gold px-20 py-8 text-xl shadow-2xl"
                >
                  {t.hero.admissionsBtn}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProgramsPage;
