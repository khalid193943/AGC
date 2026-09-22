import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  User, Phone, Mail, Send, CheckCircle2, 
  ArrowRight, Shield, Sparkles, GraduationCap,
  Calendar, Clock, MapPin, ChevronDown, Loader2, Smartphone
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface EnrollmentPageProps {
  t: any;
  currentLang: string;
}

import { ASSETS } from '../constants';

import { ColorSeparator } from '../components/ColorSeparator';

const EnrollmentPage: React.FC<EnrollmentPageProps> = ({ t, currentLang }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    grade: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.grade) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: `Grade: ${formData.grade}. ${formData.message || ''}`,
        type: 'admissions',
        status: 'new',
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        grade: '',
        message: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'messages');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = t.enrollment.steps;

  return (
    <main className="bg-blue-950 text-white">
      <Helmet>
        <title>Inscription en ligne 2026-2027 | Georges Claude Private Academy El Jadida</title>
        <meta name="description" content="Inscrivez votre enfant en ligne à Georges Claude Private Academy El Jadida. Formulaire d'inscription pour la maternelle, le primaire, le collège et le lycée." />
        <meta property="og:title" content="Inscription en ligne 2026-2027 | Académie Georges Claude Private Academy El Jadida" />
        <meta property="og:description" content="Rejoignez l'excellence à El Jadida. Remplissez notre formulaire d'inscription en ligne pour l'année scolaire 2026-2027." />
        <meta property="og:image" content={ASSETS.heroBg} />
        <meta property="og:url" content="https://agc.ma/inscription" />
        <link rel="canonical" href="https://agc.ma/inscription" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img 
            src={ASSETS.heroBg} 
            alt="Inscription Académie Georges Claude Private Academy El Jadida" 
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
              className="max-w-4xl"
            >
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">
                  {currentLang === 'FR' ? 'Inscriptions 2026-2027' : 'Enrollment 2026-2027'}
                </span>
              </div>
              <h1 className="text-white mb-8 font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-none">
                {t.enrollment.heroTitle1} <br />
                <span className="text-amber-400">{t.enrollment.heroTitle2}</span>
              </h1>
              <p className="text-base md:text-lg font-light max-w-xl text-blue-100/60 leading-relaxed mb-12 uppercase tracking-wider opacity-80">
                {t.enrollment.heroDesc}
              </p>
            </motion.div>

            <div className="hidden lg:flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="w-48 h-48 md:w-64 md:h-64 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 flex items-center justify-center text-amber-400 shadow-2xl relative group"
              >
                <div className="absolute inset-0 bg-amber-400/20 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img src={ASSETS.logo} alt="Logo Académie Georges Claude Private Academy El Jadida" className="w-40 h-auto relative z-10 opacity-80" referrerPolicy="no-referrer" loading="lazy" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <ColorSeparator />

      {/* Steps Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-8 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-all group shadow-sm"
              >
                <span className="absolute top-4 right-6 text-2xl font-bold text-slate-100 group-hover:text-amber-400/10 transition-colors">{step.number}</span>
                <h3 className="text-sm font-bold text-blue-950 mb-3 uppercase tracking-widest">{step.title}</h3>
                <p className="text-slate-500 text-xs font-light leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ColorSeparator />

      {/* Form & Info Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Side: Info */}
            <div className="lg:col-span-4 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-200"
              >
                <h2 className="text-2xl font-bold text-blue-950 mb-8 tracking-tight">{t.enrollment.whyTitle}</h2>
                <div className="space-y-8">
                  {t.enrollment.whyItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">
                        {idx === 0 ? <Sparkles className="text-amber-500" size={32} /> : idx === 1 ? <Shield className="text-blue-600" size={32} /> : <GraduationCap className="text-amber-500" size={32} />}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-blue-950 mb-2">{item.title}</h4>
                        <p className="text-slate-500 text-sm font-light leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-blue-950 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                <h3 className="text-lg font-bold mb-6 tracking-tight">{t.enrollment.helpTitle}</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="bg-white/10 p-2.5 rounded-lg group-hover:bg-amber-400 transition-colors">
                      <Phone size={16} className="text-white group-hover:text-blue-950" />
                    </div>
                    <span className="font-medium text-sm">+212 5233-48010</span>
                  </div>
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="bg-white/10 p-2.5 rounded-lg group-hover:bg-amber-400 transition-colors">
                      <Smartphone size={16} className="text-white group-hover:text-blue-950" />
                    </div>
                    <span className="font-medium text-sm">07 08 76 00 34</span>
                  </div>
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="bg-white/10 p-2.5 rounded-lg group-hover:bg-amber-400 transition-colors">
                      <Mail size={16} className="text-white group-hover:text-blue-950" />
                    </div>
                    <span className="font-medium text-sm">inscription@agc.ma</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Form */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden"
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-blue-950 mb-4 tracking-tight">{t.enrollment.formTitle}</h2>
                  <p className="text-slate-500 text-lg font-light">{t.enrollment.formDesc}</p>
                </div>

                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                      onSubmit={handleSubmit}
                      className="space-y-8"
                    >
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-blue-950 uppercase tracking-widest ml-1">
                            {t.enrollment.fullName} *
                          </label>
                          <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                              required
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                              placeholder={currentLang === 'FR' ? 'Ex: Jean Dupont' : 'e.g. John Doe'}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/5 transition-all text-base text-slate-900"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-blue-950 uppercase tracking-widest ml-1">
                            {t.enrollment.phone} *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                              required
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              placeholder="+212 6..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/5 transition-all text-base text-slate-900"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-blue-950 uppercase tracking-widest ml-1">
                            {t.enrollment.email}
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              placeholder="email@example.com"
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/5 transition-all text-base text-slate-900"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-blue-950 uppercase tracking-widest ml-1">
                            {t.enrollment.grade}
                          </label>
                          <div className="relative">
                            <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <select
                              value={formData.grade}
                              onChange={(e) => setFormData({...formData, grade: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-14 pr-10 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/5 transition-all text-base appearance-none text-slate-900"
                            >
                              <option value="">{t.enrollment.gradePlaceholder}</option>
                              <option value="maternelle">{t.programs.p1.title}</option>
                              <option value="primaire">{t.programs.p2.title}</option>
                              <option value="college">{t.programs.p3.title}</option>
                              <option value="lycee">{t.programs.p4.title}</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-blue-950 uppercase tracking-widest ml-1">
                          {t.enrollment.message}
                        </label>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          placeholder={t.enrollment.messagePlaceholder}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/5 transition-all resize-none text-base text-slate-900"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-950 text-white py-6 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-900 transition-all flex items-center justify-center shadow-2xl group disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Send size={14} className="mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            {t.enrollment.submitBtn}
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} />
                      </div>
                      <h2 className="text-xl font-bold text-blue-950 mb-2">
                        {t.enrollment.successTitle}
                      </h2>
                      <p className="text-slate-500 text-xs mb-8 max-w-xs mx-auto font-light leading-relaxed">
                        {t.enrollment.successDesc}
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="text-blue-900 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center mx-auto hover:text-amber-500 transition-colors"
                      >
                        {t.enrollment.newRequest}
                        <ArrowRight size={12} className="ml-2" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EnrollmentPage;
