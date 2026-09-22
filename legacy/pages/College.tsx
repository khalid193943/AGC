import { motion } from 'motion/react';
import { BookOpen, Users, Target, Rocket, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

import { ASSETS } from '../constants';

export const College = () => {
  const { t } = useLanguage();
  const content = t.college;

  const features = [
    { icon: <Users className="text-blue-500" />, ...content.features[0] },
    { icon: <Rocket className="text-amber-500" />, ...content.features[1] },
    { icon: <Target className="text-red-500" />, ...content.features[2] },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={ASSETS.heroBg} 
            alt="Collège"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-400 px-4 py-2 rounded-full mb-6 backdrop-blur-md border border-amber-400/30">
              <BookOpen size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">{content.title}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {content.subtitle}
            </h1>
            <p className="text-xl text-slate-200 mb-8 leading-relaxed">
              {content.heroDesc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Presentation Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-blue-900 mb-8">{t.academy.presentation}</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {content.presentation}
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="font-bold text-blue-900">{feature.title}</h3>
                      <p className="text-slate-600">{feature.desc}</p>
                    </div>
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
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80" 
                  alt="Education"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-amber-400 p-8 rounded-2xl shadow-xl hidden md:block max-w-xs">
                <p className="text-blue-900 font-bold text-lg italic">
                  "L'esprit n'est pas un vase qu'on remplit, mais un feu qu'on allume."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Pourquoi nous choisir ?</h2>
          <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-400 skew-x-12 translate-x-1/2 opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Prêt à inscrire votre enfant ?</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Rejoignez la communauté de Georges Claude Private Academy et offrez à votre enfant un avenir radieux.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-amber-400 text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-amber-500 transition-colors shadow-lg">
              {t.nav.enroll}
            </button>
            <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-colors backdrop-blur-sm">
              {t.faq.ctaBtn}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
