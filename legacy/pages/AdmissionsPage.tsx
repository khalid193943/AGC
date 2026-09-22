import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FileText, CheckCircle2, ArrowRight, 
  Calendar, Clock, Shield, Heart, 
  Info, Download, Phone, Mail
} from 'lucide-react';

interface AdmissionsPageProps {
  t: any;
  currentLang: string;
}

import { ASSETS } from '../constants';

import { ColorSeparator } from '../components/ColorSeparator';

const AdmissionsPage: React.FC<AdmissionsPageProps> = ({ t, currentLang }) => {
  const steps = [
    { title: t.contact.step1.title, desc: t.contact.step1.desc, icon: <Info size={20} /> },
    { title: t.contact.step2.title, desc: t.contact.step2.desc, icon: <Calendar size={20} /> },
    { title: t.contact.step3.title, desc: t.contact.step3.desc, icon: <FileText size={20} /> }
  ];

  const requirements = t.admissions.requirementsItems;

  return (
    <main className="bg-white text-slate-900">
      <Helmet>
        <title>Admissions 2026-2027 | Georges Claude Private Academy El Jadida</title>
        <meta name="description" content="Inscrivez votre enfant à Georges Claude Private Academy pour l'année scolaire 2026-2027. Découvrez notre processus d'admission et les documents requis à El Jadida." />
        <meta property="og:title" content="Admissions 2026-2027 | Académie Georges Claude Private Academy El Jadida" />
        <meta property="og:description" content="Rejoignez notre communauté éducative à El Jadida. Processus d'inscription simple et transparent." />
        <meta property="og:image" content={ASSETS.heroBg} />
        <meta property="og:url" content="https://agc.ma/admissions" />
        <link rel="canonical" href="https://agc.ma/admissions" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img 
            src={ASSETS.heroBg} 
            alt="Admissions Académie Georges Claude Private Academy El Jadida" 
            width="1920"
            height="1080"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-30 scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-blue-950/80 to-blue-950"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.9)_100%)]"></div>
        </div>
        
        <div className="max-w-[1600px] mx-auto px-4 relative z-10 w-full pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">{t.nav.admissions}</span>
              </div>
              
              <h1 className="text-white mb-8 font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-none">
                {t.admissions.heroTitle1} <br />
                <span className="text-amber-400">{t.admissions.heroTitle2}</span>
              </h1>
              
              <p className="text-base md:text-lg text-blue-100 font-light tracking-wide max-w-3xl mx-auto lg:mx-0 mb-16 leading-relaxed text-balance">
                {t.contact.desc}
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-8">
                <a href="#inscription" className="btn-premium-gold px-12 py-5 text-lg shadow-2xl group">
                  {t.admissions.requirementsTitle}
                  <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
                </a>
              </div>
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
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Process Steps */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-400/5 rounded-full blur-[150px] -mr-96 -mt-96"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>
        
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center mb-32">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="h-px w-12 bg-amber-500"></div>
              <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm">
                {t.admissionsPage.journey}
              </span>
              <div className="h-px w-12 bg-amber-500"></div>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-blue-950 mb-12 tracking-tighter leading-[0.9] text-balance uppercase">
              {t.admissionsPage.howToJoin} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 italic">{t.admissionsPage.join}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="group p-12 lg:p-16 rounded-[4rem] bg-slate-50 border border-slate-100 hover:border-amber-400 transition-all duration-700 shadow-premium relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="w-24 h-24 bg-white text-blue-900 rounded-3xl flex items-center justify-center mb-12 shadow-premium group-hover:bg-blue-900 group-hover:text-amber-400 transition-all duration-700 relative z-10">
                  {React.cloneElement(step.icon as React.ReactElement, { size: 40 })}
                </div>
                
                <div className="absolute top-12 right-12 text-8xl font-bold text-slate-100 group-hover:text-amber-400/10 transition-colors duration-700 select-none">
                  0{idx + 1}
                </div>
                
                <h3 className="text-2xl font-bold text-blue-950 mb-6 tracking-tight relative z-10 uppercase">{step.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-light relative z-10 opacity-80">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration & Fees */}
      <section className="section-padding bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#002147 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Inscription */}
            <motion.div
              id="inscription"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-12 md:p-20 lg:p-24 rounded-[5rem] shadow-premium border border-slate-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
              
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-blue-950 mb-12 tracking-tighter leading-none relative z-10 uppercase">
                {t.admissions.requirementsTitle}
              </h2>
              <p className="text-base md:text-lg text-slate-500 mb-16 leading-relaxed font-light relative z-10 opacity-80">
                {t.admissions.requirementsDesc}
              </p>
              
              <div className="space-y-8 mb-20 relative z-10">
                {requirements.map((req: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-8 group/item">
                    <div className="mt-1 bg-amber-400/10 p-3 rounded-2xl group-hover/item:bg-amber-400 transition-all duration-500">
                      <CheckCircle2 size={24} className="text-amber-600 group-hover/item:text-blue-950 transition-colors duration-500 flex-shrink-0" />
                    </div>
                    <span className="text-slate-700 font-medium text-lg leading-relaxed group-hover/item:text-blue-950 transition-colors">{req}</span>
                  </div>
                ))}
              </div>

              <Link to="/inscription" className="btn-premium-gold w-full py-6 text-xl shadow-2xl relative z-10">
                <Download size={24} className="mr-4 group-hover:-translate-y-1 transition-transform" />
                {t.admissions.requirementsDownload}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ / Help */}
      <section className="py-32 md:py-48 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="h-px w-12 bg-amber-500"></div>
              <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm">
                {t.faq.title}
              </span>
              <div className="h-px w-12 bg-amber-500"></div>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-blue-950 mb-10 tracking-tighter leading-none text-balance uppercase">
              {t.faq.title}
            </h2>
            <p className="text-base md:text-lg text-slate-500 max-w-3xl mx-auto font-light leading-relaxed text-balance">
              {t.faq.desc}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {[t.faq.q1, t.faq.q2, t.faq.q3, t.faq.q4].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:border-amber-400 transition-all group shadow-sm hover:shadow-premium"
              >
                <h4 className="text-2xl font-bold text-blue-900 mb-6 group-hover:text-blue-950 transition-colors tracking-tight">{item.q}</h4>
                <p className="text-slate-600 text-base leading-relaxed font-light opacity-80">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdmissionsPage;
