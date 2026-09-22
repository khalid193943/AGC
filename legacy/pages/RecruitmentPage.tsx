import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Briefcase, 
  ChevronRight, 
  FileText, 
  Send, 
  CheckCircle2, 
  Loader2,
  Upload,
  User,
  Users,
  Mail,
  Phone,
  MessageSquare,
  BookOpen,
  Truck,
  GraduationCap
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

interface Job {
  id: string;
  title: string;
  category: 'teacher' | 'driver' | 'intern' | 'other';
  description: string;
  requirements: string[];
  active: boolean;
}

export default function RecruitmentPage() {
  const { t, currentLang } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSpontaneous, setIsSpontaneous] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    cv: null as File | null,
    coverLetter: null as File | null,
    subject: '' // for interns/teachers
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'jobs'), (snapshot) => {
      const jobsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Job))
        .filter(job => job.active);
      setJobs(jobsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'jobs');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cv' | 'coverLetter') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob && !isSpontaneous) return;

    setSubmitting(true);
    try {
      let cvBase64 = '';
      let clBase64 = '';

      if (formData.cv) {
        cvBase64 = await fileToBase64(formData.cv);
      }
      if (formData.coverLetter) {
        clBase64 = await fileToBase64(formData.coverLetter);
      }

      await addDoc(collection(db, 'applications'), {
        jobId: isSpontaneous ? 'spontaneous' : selectedJob?.id,
        jobTitle: isSpontaneous ? (t.admin.recruitment.spontaneous || 'Candidature Spontanée') : selectedJob?.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        subject: formData.subject,
        cvName: formData.cv?.name || '',
        coverLetterName: formData.coverLetter?.name || '',
        cv: cvBase64,
        coverLetter: clBase64,
        status: 'new',
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        cv: null,
        coverLetter: null,
        subject: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'applications');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'teacher': return <BookOpen className="w-5 h-5" />;
      case 'driver': return <Truck className="w-5 h-5" />;
      case 'intern': return <GraduationCap className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-blue-950 text-white selection:bg-amber-400 selection:text-blue-950">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-amber-400" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.4em]">
                {t.recruitment.title}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight"
            >
              Rejoignez <span className="text-amber-400">l'Excellence</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-blue-200/60 max-w-xl text-xl leading-relaxed font-medium"
            >
              Nous sommes toujours à la recherche de talents passionnés pour enrichir notre communauté éducative. Découvrez nos opportunités et postulez dès maintenant.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-blue-900/20 rounded-[3rem] blur-2xl -rotate-3" />
            <img 
              src="https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/69cd5b3c8fbdc13183530b9d_team-buid%20(1).jpg" 
              alt="Recruitment" 
              width="800"
              height="400"
              fetchPriority="high"
              className="w-full h-[400px] object-cover rounded-[3rem] relative z-10 border border-white/10 shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -left-6 bg-amber-400 p-8 rounded-3xl z-20 shadow-xl">
              <Briefcase className="w-8 h-8 text-blue-950" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Job List */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-[10px] font-bold text-blue-200/40 uppercase tracking-[0.3em] mb-6 px-4">Nos Opportunités</h2>
            
            {/* Spontaneous Application Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => {
                setIsSpontaneous(true);
                setSelectedJob(null);
                setSubmitted(false);
              }}
              className={`w-full text-left p-6 rounded-3xl border transition-all duration-500 group ${
                isSpontaneous
                  ? 'bg-amber-400 border-amber-400 shadow-2xl shadow-amber-400/20'
                  : 'bg-white/5 border-white/10 hover:border-amber-400/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl transition-colors duration-500 ${
                    isSpontaneous ? 'bg-blue-950 text-amber-400' : 'bg-white/5 text-amber-400'
                  }`}>
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm uppercase tracking-wider mb-1 ${
                      isSpontaneous ? 'text-blue-950' : 'text-white'
                    }`}>
                      {t.admin.recruitment.spontaneous || 'Candidature Spontanée'}
                    </h3>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      isSpontaneous ? 'text-blue-950/60' : 'text-blue-200/40'
                    }`}>
                      Toutes catégories
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform duration-500 ${
                  isSpontaneous ? 'text-blue-950 translate-x-1' : 'text-white/20 group-hover:text-amber-400'
                }`} />
              </div>
            </motion.button>

            <div className="w-full h-[1px] bg-white/5 my-8" />

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white/5 rounded-3xl p-12 text-center border border-white/10">
                <Briefcase className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-blue-200/40 font-medium">Aucune offre spécifique disponible.</p>
              </div>
            ) : (
              jobs.map((job, index) => (
                <motion.button
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedJob(job);
                    setIsSpontaneous(false);
                    setSubmitted(false);
                  }}
                  className={`w-full text-left p-6 rounded-3xl border transition-all duration-500 group ${
                    selectedJob?.id === job.id
                      ? 'bg-white text-blue-950 shadow-2xl shadow-white/10'
                      : 'bg-white/5 border-white/10 hover:border-amber-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl transition-colors duration-500 ${
                        selectedJob?.id === job.id ? 'bg-blue-950 text-amber-400' : 'bg-white/5 text-amber-400'
                      }`}>
                        {getCategoryIcon(job.category)}
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm uppercase tracking-wider mb-1 ${
                          selectedJob?.id === job.id ? 'text-blue-950' : 'text-white'
                        }`}>
                          {job.title}
                        </h3>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          selectedJob?.id === job.id ? 'text-blue-950/60' : 'text-blue-200/40'
                        }`}>
                          {job.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform duration-500 ${
                      selectedJob?.id === job.id ? 'text-blue-950 translate-x-1' : 'text-white/20 group-hover:text-amber-400'
                    }`} />
                  </div>
                </motion.button>
              ))
            )}

            {/* Extra Decorative Images */}
            <div className="pt-12 grid grid-cols-2 gap-4">
              <motion.img 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=500" 
                className="w-full h-40 object-cover rounded-3xl border border-white/10"
                referrerPolicy="no-referrer"
              />
              <motion.img 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500" 
                className="w-full h-40 object-cover rounded-3xl border border-white/10"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!selectedJob && !isSpontaneous ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-white/5 rounded-[2.5rem] p-12 border border-white/10 flex flex-col items-center justify-center text-center min-h-[400px]">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                      <FileText className="w-8 h-8 text-blue-200/20" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-4">Prêt à postuler ?</h2>
                    <p className="text-blue-200/40 max-w-xs">
                      Sélectionnez une offre ou envoyez une candidature spontanée pour commencer.
                    </p>
                  </div>

                  {/* Why Join Us Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { icon: <CheckCircle2 className="w-5 h-5 text-amber-400" />, title: "Excellence", desc: "Un environnement stimulant" },
                      { icon: <Users className="w-5 h-5 text-amber-400" />, title: "Communauté", desc: "Une équipe soudée" },
                      { icon: <GraduationCap className="w-5 h-5 text-amber-400" />, title: "Évolution", desc: "Formations continues" }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <div className="mb-4">{item.icon}</div>
                        <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                        <p className="text-[10px] text-blue-200/40 uppercase tracking-widest">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 rounded-[2.5rem] p-12 border border-white/10 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Candidature Envoyée !</h2>
                  <p className="text-blue-200/60 mb-8 max-w-sm">
                    Merci pour votre intérêt. Notre équipe examinera votre profil et vous contactera prochainement.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-4 bg-amber-400 text-blue-950 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl shadow-amber-400/20"
                  >
                    Envoyer une autre candidature
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/5 rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl shadow-black/20"
                >
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-amber-400/10 text-amber-400 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                        {isSpontaneous ? 'Spontanée' : selectedJob?.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-4">
                      {isSpontaneous ? (t.admin.recruitment.spontaneous || 'Candidature Spontanée') : selectedJob?.title}
                    </h2>
                    <p className="text-blue-200/60 text-lg leading-relaxed mb-6">
                      {isSpontaneous 
                        ? "Vous ne trouvez pas de poste correspondant à votre profil ? Envoyez-nous votre candidature spontanée. Nous gardons précieusement tous les talents."
                        : selectedJob?.description}
                    </p>
                    {!isSpontaneous && selectedJob?.requirements && selectedJob.requirements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-blue-200/40 uppercase tracking-widest mb-3">Prérequis</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedJob.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-blue-200/80">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="w-full h-[1px] bg-white/5 mb-10" />

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-200/40 uppercase tracking-widest px-1">Prénom</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/20" />
                          <input
                            required
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-amber-400 transition-all text-white placeholder:text-blue-200/20"
                            placeholder="Jean"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-200/40 uppercase tracking-widest px-1">Nom</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/20" />
                          <input
                            required
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-amber-400 transition-all text-white placeholder:text-blue-200/20"
                            placeholder="Dupont"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-200/40 uppercase tracking-widest px-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/20" />
                          <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-amber-400 transition-all text-white placeholder:text-blue-200/20"
                            placeholder="jean.dupont@email.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-200/40 uppercase tracking-widest px-1">Téléphone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/20" />
                          <input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-amber-400 transition-all text-white placeholder:text-blue-200/20"
                            placeholder="+212 6..."
                          />
                        </div>
                      </div>
                    </div>

                    {(isSpontaneous || selectedJob?.category === 'teacher' || selectedJob?.category === 'intern') && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-200/40 uppercase tracking-widest px-1">Matière / Spécialité</label>
                        <div className="relative">
                          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/20" />
                          <input
                            required
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-amber-400 transition-all text-white placeholder:text-blue-200/20"
                            placeholder="ex: Mathématiques, Français..."
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-blue-200/40 uppercase tracking-widest px-1">Message de motivation</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-6 w-4 h-4 text-blue-200/20" />
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-amber-400 transition-all resize-none text-white placeholder:text-blue-200/20"
                          placeholder="Parlez-nous de vous..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-200/40 uppercase tracking-widest px-1">CV (PDF)</label>
                        <div className="relative group">
                          <input
                            required
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(e, 'cv')}
                            className="hidden"
                            id="cv-upload"
                          />
                          <label
                            htmlFor="cv-upload"
                            className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group-hover:ring-2 group-hover:ring-amber-400"
                          >
                            <Upload className="w-4 h-4 text-blue-200/40" />
                            <span className="text-sm text-blue-200/60 truncate">
                              {formData.cv ? formData.cv.name : 'Choisir un fichier'}
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-200/40 uppercase tracking-widest px-1">Lettre de motivation (PDF)</label>
                        <div className="relative group">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(e, 'coverLetter')}
                            className="hidden"
                            id="cover-letter-upload"
                          />
                          <label
                            htmlFor="cover-letter-upload"
                            className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group-hover:ring-2 group-hover:ring-amber-400"
                          >
                            <Upload className="w-4 h-4 text-blue-200/40" />
                            <span className="text-sm text-blue-200/60 truncate">
                              {formData.coverLetter ? formData.coverLetter.name : 'Choisir un fichier'}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={submitting}
                      type="submit"
                      className="w-full py-5 bg-amber-400 text-blue-950 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                          Envoyer ma candidature
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
