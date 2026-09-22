import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Shield, Scale, FileText, Mail } from 'lucide-react';
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

const LegalPage: React.FC = () => {
  const { t } = useLanguage();
  const content = t.legal;

  const icons = [<Scale className="w-6 h-6" />, <FileText className="w-6 h-6" />, <Shield className="w-6 h-6" />, <Mail className="w-6 h-6" />];

  return (
    <main className="bg-white text-blue-950 font-sans selection:bg-amber-400 selection:text-blue-950 overflow-x-hidden">
      <Helmet>
        <title>{content.title} | Georges Claude Private Academy El Jadida</title>
        <meta name="description" content={content.heroDesc} />
      </Helmet>

      {/* HERO */}
      <section className="relative h-[50vh] flex items-center overflow-hidden bg-blue-950 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src={ASSETS.heroBg} 
            alt="Legal Mentions Georges Claude Private Academy" 
            width="1920"
            height="1080"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/60 via-blue-950/40 to-blue-950"></div>
        </div>

        <FloatingShape className="top-1/4 left-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl" />
        
        <div className="max-w-[1600px] mx-auto px-4 relative z-10 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">
                  {content.subtitle}
                </span>
              </div>
              
              <h1 className="text-white mb-6 font-display font-bold text-4xl md:text-6xl leading-tight">
                {content.title}
              </h1>

              <p className="text-lg text-white/80 max-w-2xl leading-relaxed font-light">
                {content.heroDesc}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid gap-12">
            {content.sections.map((section: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex gap-6 items-start"
              >
                <div className="w-12 h-12 bg-blue-950 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                  {icons[index % icons.length]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-blue-950">{section.title}</h2>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LegalPage;
