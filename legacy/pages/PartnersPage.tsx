import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Globe, BookOpen, Brain, Star, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PartnersPage = () => {
  return (
    <div className="min-h-screen font-sans bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow pb-24">
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 bg-blue-950 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-400/20 rounded-full blur-[120px]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          </div>
          
          <div className="container-wide relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 mb-6 backdrop-blur-sm">
                <Globe className="text-amber-400" size={16} />
                <span className="text-white font-bold uppercase tracking-widest text-xs">Réseau d'Excellence</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6">
                Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Partenaires</span>
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                Une ouverture sur le monde et des collaborations stratégiques pour offrir à nos élèves les meilleures opportunités académiques et internationales.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Cambridge Feature Section */}
        <section className="py-24 bg-white relative">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                    <BookOpen size={32} className="text-blue-900" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Cambridge Assessment</h2>
                    <p className="text-slate-500 uppercase tracking-widest text-sm font-bold">International Education</p>
                  </div>
                </div>

                <div className="prose prose-lg text-slate-600 font-light mb-8">
                  <p>
                    Dans le cadre de notre engagement envers l'excellence académique, l'Académie Privée Georges Claude est fière d'intégrer progressivement le programme <strong>Cambridge</strong>. Ce partenariat stratégique permet à nos élèves de bénéficier d'une éducation répondant aux plus hauts standards internationaux.
                  </p>
                  <p>
                    L'approche Cambridge développe non seulement une maîtrise exceptionnelle de la langue anglaise, mais cultive également la pensée critique, la créativité et la résolution de problèmes complexes — des compétences essentielles pour exceller dans un monde globalisé.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    "Curriculum international reconnu mondialement",
                    "Développement du trilinguisme dès le plus jeune âge",
                    "Préparation aux certifications officielles Cambridge",
                    "Méthodologie axée sur l'analyse et la réflexion"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                      </div>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <Link to="/contact" className="inline-flex items-center space-x-3 bg-blue-900 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300">
                  <span>En savoir plus</span>
                  <ArrowRight size={18} />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* SVG Illustration for Cambridge */}
                <div className="relative aspect-square rounded-[3rem] bg-gradient-to-br from-white to-blue-50 border border-slate-200 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex items-center justify-center p-12">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-10 right-10 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 left-10 w-56 h-56 bg-blue-600/10 rounded-full blur-3xl"></div>
                  
                  {/* Official Logo */}
                  <div className="relative z-10 w-full max-w-sm drop-shadow-xl hover:scale-105 transition-transform duration-500">
                    <img src="https://res.cloudinary.com/ddvgp1zrz/image/upload/v1782686752/1042775c-cddc-48a8-89e7-59988c86eabd.png" alt="Cambridge Assessment International Education" className="w-full h-auto object-contain" />
                  </div>

                  {/* Badges */}
                  <motion.div 
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-8 left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
                  >
                    <div className="bg-amber-100 p-2 rounded-xl">
                      <Award className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <div className="text-blue-950 font-bold text-sm">Excellence</div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Internationale</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-8 right-8 bg-blue-900 p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-blue-800"
                  >
                    <div className="bg-blue-800 p-2 rounded-xl">
                      <Brain className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Pensée</div>
                      <div className="text-blue-300 text-[10px] uppercase tracking-wider font-bold">Critique</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Future Partners / Certifications */}
        <section className="py-24 bg-slate-100">
          <div className="container-wide">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Star className="mx-auto text-amber-400 mb-4" size={32} />
              <h3 className="text-3xl font-display font-bold text-slate-900 mb-4">Un Réseau en Croissance</h3>
              <p className="text-slate-600 font-light">
                Nous travaillons continuellement à étendre notre réseau de partenaires académiques, institutionnels et sportifs pour enrichir l'expérience de nos élèves.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Certifications Linguistiques", desc: "Centres de préparation pour divers diplômes de langues." },
                { title: "Institutions Sportives", desc: "Collaborations avec des clubs locaux pour développer les talents." },
                { title: "Partenaires Culturels", desc: "Théâtres, musées et bibliothèques pour l'ouverture d'esprit." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-200">
                    <div className="w-4 h-4 rounded-full bg-amber-400 animate-pulse"></div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PartnersPage;
