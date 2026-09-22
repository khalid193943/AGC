import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Trophy, Users, BookOpen, GraduationCap, Target, Eye, CheckCircle2, Calendar, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ASSETS } from '../constants';
import SchoolVideoSection from '../components/SchoolVideoSection';

const AcademyPage: React.FC = () => {
  const { t } = useLanguage();
  const academy = t.academy;

  return (
    <div className="pt-20 bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] lg:h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={ASSETS.heroBg} 
            alt={academy.title} 
            width="1920"
            height="1080"
            fetchPriority="high"
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-transparent to-white"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">
                {academy.heritageLabel}
              </span>
            </div>

            <h1 className="text-white mb-8 font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-none">
              L’Académie Georges <br /> 
              <span className="text-amber-400">CLAUDE</span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-blue-100 font-light tracking-wide max-w-4xl mx-auto leading-relaxed text-balance uppercase opacity-80">
              {academy.heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notre Héritage */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-px w-12 bg-amber-500"></div>
                <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm">
                  {academy.heritageLabel}
                </span>
              </div>
              
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-blue-950 mb-12 leading-[0.9] tracking-tighter text-balance">
                {academy.heritageTitle.split(' ').slice(0, 3).join(' ')} <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800">
                  {academy.heritageTitle.split(' ').slice(3).join(' ')}
                </span>
              </h2>
              
              <div className="space-y-8 text-slate-500 text-sm md:text-base leading-relaxed font-light">
                <p className="text-balance">{academy.heritageText1}</p>
                <p className="text-balance">{academy.heritageText2}</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-4 border-2 border-slate-100 rounded-[3rem] rotate-3 -z-10"></div>
              <div className="bg-white p-16 md:p-24 rounded-[3rem] border border-slate-100 shadow-premium flex flex-col items-center justify-center text-center aspect-square relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="w-24 h-24 bg-amber-50 rounded-[2rem] shadow-xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <Trophy className="text-amber-500" size={48} />
                </div>
                
                <h3 className="text-3xl font-bold text-blue-950 mb-6 tracking-widest uppercase relative z-10">{t.academy.studentFocus}</h3>
                <div className="h-px w-20 bg-amber-300 mb-8 relative z-10"></div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.5em] relative z-10">{t.academy.studentFocusDesc}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SchoolVideoSection />

      {/* Pourquoi Choisir l'Académie ? */}
      <section className="section-padding bg-slate-50 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent"></div>
        
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="h-px w-12 bg-amber-500"></div>
              <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm">
                {t.common.whyUs}
              </span>
              <div className="h-px w-12 bg-amber-500"></div>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-950 mb-10 tracking-tighter leading-none text-balance">
              {academy.whyTitle}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {academy.whyCards.map((card: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="bg-white p-12 rounded-[2.5rem] shadow-premium border border-slate-100 hover:border-amber-200 transition-all group relative overflow-hidden cursor-default"
              >
                {/* Background Decorative Element */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl"></div>
                
                {/* Icon Container with Animation */}
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-amber-100 group-hover:rotate-3 transition-all duration-500 relative z-10 shadow-sm group-hover:shadow-amber-200/50">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {idx === 0 && <BookOpen size={36} className="text-amber-500" />}
                    {idx === 1 && <Users size={36} className="text-amber-500" />}
                    {idx === 2 && <GraduationCap size={36} className="text-amber-500" />}
                  </motion.div>
                </div>
                
                <h3 className="text-xl font-bold text-blue-950 mb-6 tracking-tight relative z-10 group-hover:text-amber-600 transition-colors duration-300">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light relative z-10 group-hover:text-slate-600 transition-colors duration-300">{card.desc}</p>
                
                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 h-1.5 bg-amber-400 w-0 group-hover:w-full transition-all duration-700"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Le mot du Directeur */}
      <section className="section-padding bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-blue-950 rounded-[4rem] shadow-premium overflow-hidden flex flex-col lg:flex-row relative"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            
            <div className="lg:w-2/5 relative group overflow-hidden">
              <img 
                src={ASSETS.director} 
                alt={academy.directionName} 
                width="400"
                height="500"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-12 left-12">
                <h4 className="text-3xl font-bold text-white tracking-tight mb-2">{academy.directionName}</h4>
                <p className="text-amber-400 font-bold uppercase tracking-[0.3em] text-xs opacity-80">{academy.directionRole}</p>
              </div>
            </div>
            
            <div className="lg:w-3/5 p-16 md:p-24 lg:p-32 flex flex-col justify-center relative z-10">
              <div className="text-amber-400/20 mb-12">
                <svg width="80" height="60" viewBox="0 0 60 45" fill="currentColor">
                  <path d="M0 25.7143C0 11.5179 11.5179 0 25.7143 0V8.57143C16.25 8.57143 8.57143 16.25 8.57143 25.7143V42.8571H0V25.7143ZM34.2857 25.7143C34.2857 11.5179 45.8036 0 60 0V8.57143C50.5357 8.57143 42.8571 16.25 42.8571 25.7143V42.8571H34.2857V25.7143Z" />
                </svg>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 tracking-tighter leading-[0.9] text-balance">
                {academy.directionTitle}
              </h2>
              
              <p className="text-blue-50 text-base md:text-lg lg:text-xl leading-relaxed mb-16 font-light text-balance opacity-90">
                "{academy.directionQuote}"
              </p>
              
              <div className="flex items-center space-x-8">
                <div className="h-px w-16 bg-amber-400/50"></div>
                <Link to="/academie" className="text-amber-400 font-bold uppercase tracking-[0.4em] text-xs hover:text-white transition-colors">
                  {academy.heroSubtitle.split(' ').slice(0, 2).join(' ')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-950 to-blue-900"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 text-center">
            {academy.statsItems.map((stat: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-400 mb-6 tracking-tighter leading-none">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-xs md:text-sm font-bold tracking-[0.4em] uppercase opacity-60">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision - Dark Section */}
      <section className="section-padding bg-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-blue-900 to-blue-950"></div>
        
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-16 md:p-20 rounded-[3rem] shadow-premium group hover:bg-white/10 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              
              <div className="w-24 h-24 bg-amber-400 text-blue-950 rounded-[2rem] flex items-center justify-center mb-12 group-hover:scale-110 transition-transform duration-500 relative z-10 shadow-2xl">
                <Target size={48} />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight relative z-10">{academy.missionTitle}</h3>
              <p className="text-blue-100 text-base leading-relaxed font-light relative z-10 opacity-80">
                {academy.missionText}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-16 md:p-20 rounded-[3rem] shadow-premium group hover:bg-white/10 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              
              <div className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mb-12 group-hover:scale-110 transition-transform duration-500 relative z-10 shadow-2xl">
                <Eye size={48} />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight relative z-10">{academy.visionTitle}</h3>
              <p className="text-blue-100 text-base leading-relaxed font-light relative z-10 opacity-80">
                {academy.visionText}
              </p>
            </motion.div>
          </div>
          
          <div className="mt-32 flex flex-wrap justify-center gap-12 md:gap-24">
            {academy.values.map((val: string, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-6 text-white font-bold tracking-[0.4em] uppercase text-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-amber-400" />
                </div>
                <span>{val}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Les visages de l'excellence */}
      <section className="section-padding bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="h-px w-12 bg-amber-500"></div>
              <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm">
                {academy.teamTitle}
              </span>
              <div className="h-px w-12 bg-amber-500"></div>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-950 mb-10 tracking-tighter leading-none text-balance">
              {academy.teamTitle}
            </h2>
            <p className="text-base md:text-lg text-slate-500 max-w-3xl mx-auto font-light leading-relaxed text-balance">
              {academy.teamDesc}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {academy.teamMembers.map((member: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-premium grayscale hover:grayscale-0 transition-all duration-700 relative">
                  <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                  <img 
                    src={`https://storage.googleapis.com/ux-pilot-public-assets-v2/academy/photo_${[4, 8, 14, 1][idx]}.jpg`} 
                    alt={member.name} 
                    width="400"
                    height="500"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                </div>
                <h4 className="text-2xl font-bold text-blue-950 mb-2 tracking-tight">{member.name}</h4>
                <p className="text-amber-600 text-xs font-bold uppercase tracking-[0.3em] opacity-80">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Infrastructures */}
      <section className="section-padding bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent"></div>
        
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="h-px w-12 bg-amber-500"></div>
              <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm">
                {academy.infraTitle}
              </span>
              <div className="h-px w-12 bg-amber-500"></div>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-950 mb-10 tracking-tighter leading-none text-balance">
              {academy.infraTitle}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-[700px] md:h-[900px]">
            <div className="lg:col-span-1 h-full rounded-[3rem] overflow-hidden shadow-premium group relative">
              <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
              <img src="https://storage.googleapis.com/ux-pilot-public-assets-v2/academy/photo_14.jpg" alt="Library" width="400" height="900" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" loading="lazy" />
            </div>
            <div className="lg:col-span-2 grid grid-rows-2 gap-8 h-full">
              <div className="grid grid-cols-2 gap-8">
                <div className="rounded-[3rem] overflow-hidden shadow-premium group relative">
                  <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                  <img src="https://storage.googleapis.com/ux-pilot-public-assets-v2/academy/photo_12.jpg" alt="Classroom" width="400" height="450" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" loading="lazy" />
                </div>
                <div className="rounded-[3rem] overflow-hidden shadow-premium group relative">
                  <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                  <img src="https://storage.googleapis.com/ux-pilot-public-assets-v2/academy/photo_11.jpg" alt="Gym" width="400" height="450" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" loading="lazy" />
                </div>
              </div>
              <div className="rounded-[3rem] overflow-hidden shadow-premium relative group">
                <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/20 transition-colors duration-700 z-10"></div>
                <img src="https://storage.googleapis.com/ux-pilot-public-assets-v2/academy/photo_15.jpg" alt={academy.title} width="800" height="450" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                   <h3 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.4em] uppercase text-center px-8 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-10 group-hover:translate-y-0">{academy.title}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>
        
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-slate-50 p-16 md:p-24 lg:p-32 rounded-[4rem] text-center shadow-premium border border-white relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-amber-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-950 mb-10 tracking-tighter leading-none text-balance relative z-10">
              {academy.ctaTitle}
            </h2>
            <p className="text-base md:text-lg text-slate-500 max-w-4xl mx-auto mb-16 font-light leading-relaxed text-balance relative z-10">
              {academy.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8 relative z-10">
              <Link to="/inscription" className="btn-premium px-12 py-6 text-lg shadow-2xl">
                <Calendar className="mr-4" size={24} />
                {academy.ctaVisitBtn}
              </Link>
              <Link to="/inscription" className="btn-premium-gold px-12 py-6 text-lg shadow-2xl">
                <FileText className="mr-4" size={24} />
                {academy.ctaAdmissionBtn}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AcademyPage;
