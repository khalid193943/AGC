import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, CheckCircle2, Calendar, 
  Users, BookOpen, GraduationCap, 
  Clock, Award, Shield, Sparkles, Globe
} from 'lucide-react';

interface ProgramDetailPageProps {
  t: any;
  currentLang: string;
}

const ProgramDetailPage: React.FC<ProgramDetailPageProps> = ({ t, currentLang }) => {
  const { id } = useParams<{ id: string }>();
  const content = t.programDetail;

  // This would normally come from a central data file or API
  const programsData: Record<string, any> = {
    maternelle: {
      title: t.programs.p1.title,
      subtitle: t.maternelle.subtitle,
      heroImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80',
      color: 'bg-rose-50',
      textColor: 'text-rose-600',
      accentColor: 'amber',
      objectives: t.maternelle.pillars.map((p: any) => p.title),
      curriculum: t.maternelle.curriculum.map((c: any) => ({ title: c.title, desc: c.items.join(', ') }))
    },
    primaire: {
      title: t.programs.p2.title,
      subtitle: t.primaire.subtitle,
      heroImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80',
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      accentColor: 'blue',
      objectives: t.primaire.pillars.map((p: any) => p.title),
      curriculum: t.primaire.curriculum.map((c: any) => ({ title: c.title, desc: c.items.join(', ') }))
    },
    college: {
      title: t.programs.p3.title,
      subtitle: t.college.subtitle,
      heroImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
      color: 'bg-amber-50',
      textColor: 'text-amber-600',
      accentColor: 'amber',
      objectives: t.college.pillars.map((p: any) => p.title),
      curriculum: t.college.curriculum.map((c: any) => ({ title: c.title, desc: c.items.join(', ') }))
    },
    lycee: {
      title: t.programs.p4.title,
      subtitle: t.lycee.subtitle,
      heroImage: 'https://images.unsplash.com/photo-1541339907198-e08756dee81c?auto=format&fit=crop&q=80',
      color: 'bg-slate-50',
      textColor: 'text-slate-600',
      accentColor: 'slate',
      objectives: t.lycee.pillars.map((p: any) => p.title),
      curriculum: t.lycee.curriculum.map((c: any) => ({ title: c.title, desc: c.items.join(', ') }))
    }
  };

  const program = id ? programsData[id] : null;

  if (!program) {
    return (
      <div className="pt-40 text-center">
        <h1 className="text-4xl font-bold text-blue-950 mb-8">{currentLang === 'FR' ? 'Programme non trouvé' : 'Program not found'}</h1>
        <Link to="/programmes" className="text-blue-600 font-bold hover:underline">{content.backBtn}</Link>
      </div>
    );
  }

  return (
    <main className="bg-blue-950 text-white">
      <Helmet>
        <title>{`${program.title} | Georges Claude Private Academy El Jadida`}</title>
        <meta name="description" content={`${program.title} à Georges Claude Private Academy d'El Jadida. ${program.subtitle}. Découvrez nos objectifs pédagogiques et notre programme d'excellence.`} />
        <meta property="og:title" content={`${program.title} | Académie Georges Claude Private Academy El Jadida`} />
        <meta property="og:description" content={program.subtitle} />
        <meta property="og:image" content={program.heroImage} />
        <meta property="og:url" content={`https://agc.ma/programmes/${id}`} />
        <link rel="canonical" href={`https://agc.ma/programmes/${id}`} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img 
            src={program.heroImage} 
            alt={`${program.title} Académie Georges Claude Private Academy El Jadida`} 
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
        
        <div className="container-wide relative z-10 w-full">
          <Link to="/programmes" className="inline-flex items-center text-white/60 hover:text-amber-400 transition-colors mb-12 group">
            <ArrowLeft className="mr-3 group-hover:-translate-x-2 transition-transform" size={20} />
            <span className="font-bold uppercase tracking-widest text-[10px] md:text-xs">{content.backBtn}</span>
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full mb-10">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-amber-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">{program.title}</span>
              </div>
              <h1 className="text-white mb-8 font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-none">
                {program.title} <br />
                <span className="text-amber-400">{program.subtitle}</span>
              </h1>
            </motion.div>

            <div className="hidden lg:flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="w-64 h-64 md:w-80 md:h-80 bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/20 flex items-center justify-center text-amber-400 shadow-2xl relative group"
              >
                <div className="absolute inset-0 bg-amber-400/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <BookOpen size={160} className="relative z-10" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-32 md:py-48 bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-24 md:gap-32 items-start">
            
            {/* Left: Objectives */}
            <div>
              <h2 className="font-bold text-blue-950 mb-12 tracking-tight">
                {content.objectivesTitle}
              </h2>
              <div className="space-y-8">
                {program.objectives.map((obj: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start space-x-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-amber-400 transition-all group"
                  >
                    <div className="mt-1 bg-amber-400/20 p-2 rounded-xl group-hover:bg-amber-400 transition-colors">
                      <CheckCircle2 size={24} className="text-amber-600 group-hover:text-blue-950" />
                    </div>
                    <span className="text-blue-950 font-bold text-lg leading-relaxed">{obj}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Curriculum Highlights */}
            <div className="bg-blue-950 p-12 md:p-20 rounded-[4rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              
              <h2 className="font-bold mb-12 tracking-tight">
                {content.highlightsTitle}
              </h2>
              
              <div className="space-y-12">
                {program.curriculum.map((item: any, idx: number) => (
                  <div key={idx} className="relative z-10">
                    <h4 className="text-2xl font-bold text-amber-400 mb-4">{item.title}</h4>
                    <p className="text-blue-100/70 text-base md:text-lg font-light leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-16 border-t border-white/10 grid grid-cols-2 gap-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Users className="text-amber-400" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200/60 uppercase font-bold tracking-widest">{content.ratioLabel}</p>
                    <p className="text-xl font-bold">1:15</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Globe className="text-amber-400" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200/60 uppercase font-bold tracking-widest">{content.languagesLabel}</p>
                    <p className="text-xl font-bold">Trilingue+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-48 bg-slate-50">
        <div className="container-wide">
          <div className="bg-white p-16 md:p-24 rounded-[4rem] shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-900/5 rounded-full -ml-32 -mt-32 blur-3xl"></div>
            <h2 className="font-bold text-blue-950 mb-10 tracking-tight">
              {content.ctaTitle}
            </h2>
            <p className="text-slate-500 text-xl md:text-2xl max-w-3xl mx-auto mb-16 font-light leading-relaxed">
              {content.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <Link to="/inscription" className="bg-blue-950 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-amber-400 hover:text-blue-950 transition-all shadow-2xl">
                {content.ctaEnroll}
              </Link>
              <Link to="/inscription" className="bg-white text-blue-950 border-2 border-blue-950/10 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all">
                {content.ctaAdmission}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProgramDetailPage;
