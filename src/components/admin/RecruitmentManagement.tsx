import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Download, 
  Eye, 
  Search,
  Filter,
  Loader2,
  Briefcase,
  Users,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Job {
  id: string;
  title: string;
  category: 'teacher' | 'driver' | 'intern' | 'other';
  description: string;
  requirements: string[];
  active: boolean;
  createdAt: any;
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  cvName: string;
  coverLetterName: string;
  cv: string;
  coverLetter: string;
  status: 'new' | 'reviewed' | 'accepted' | 'rejected';
  subject?: string;
  createdAt: any;
}

export default function RecruitmentManagement() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'jobs' | 'applications'>('jobs');
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [jobForm, setJobForm] = useState({
    title: '',
    category: 'teacher' as Job['category'],
    description: '',
    requirements: '',
    active: true
  });

  useEffect(() => {
    const unsubscribeJobs = onSnapshot(query(collection(db, 'jobs'), orderBy('createdAt', 'desc')), (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'jobs');
    });

    const unsubscribeApps = onSnapshot(query(collection(db, 'applications'), orderBy('createdAt', 'desc')), (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'applications');
    });

    return () => {
      unsubscribeJobs();
      unsubscribeApps();
    };
  }, []);

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const requirementsArray = jobForm.requirements.split('\n').filter(r => r.trim());
    
    try {
      if (editingJob) {
        await updateDoc(doc(db, 'jobs', editingJob.id), {
          ...jobForm,
          requirements: requirementsArray
        });
      } else {
        await addDoc(collection(db, 'jobs'), {
          ...jobForm,
          requirements: requirementsArray,
          createdAt: serverTimestamp()
        });
      }
      setIsAddingJob(false);
      setEditingJob(null);
      setJobForm({ title: '', category: 'teacher', description: '', requirements: '', active: true });
    } catch (error) {
      handleFirestoreError(error, editingJob ? OperationType.UPDATE : OperationType.CREATE, 'jobs');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm(t.admin.recruitment.confirmDelete)) {
      try {
        await deleteDoc(doc(db, 'jobs', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'jobs');
      }
    }
  };

  const handleUpdateAppStatus = async (id: string, status: Application['status']) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status });
      if (selectedApplication?.id === id) {
        setSelectedApplication(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'applications');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = `${app.firstName} ${app.lastName} ${app.email} ${app.jobTitle}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-600';
      case 'reviewed': return 'bg-amber-100 text-amber-600';
      case 'accepted': return 'bg-green-100 text-green-600';
      case 'rejected': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const downloadFile = (base64Data: string, fileName: string) => {
    if (!base64Data || base64Data.startsWith('Simulated')) {
      alert('Ce fichier n\'est pas disponible pour le téléchargement (données simulées).');
      return;
    }
    
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-blue-950 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-amber-400" />
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.4em]">
              {t.admin.recruitment.title}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-blue-950 uppercase tracking-tight">
            {activeView === 'jobs' ? t.admin.recruitment.jobs : t.admin.recruitment.applications}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <button
              onClick={() => setActiveView('jobs')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeView === 'jobs' ? 'bg-blue-950 text-white shadow-lg shadow-blue-950/20' : 'text-slate-400 hover:text-blue-950'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{t.admin.recruitment.jobs}</span>
            </button>
            <button
              onClick={() => setActiveView('applications')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeView === 'applications' ? 'bg-blue-950 text-white shadow-lg shadow-blue-950/20' : 'text-slate-400 hover:text-blue-950'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{t.admin.recruitment.applications}</span>
            </button>
          </div>

          {activeView === 'jobs' && (
            <button
              onClick={() => {
                setEditingJob(null);
                setJobForm({ title: '', category: 'teacher', description: '', requirements: '', active: true });
                setIsAddingJob(true);
              }}
              className="flex items-center gap-3 px-8 py-4 bg-amber-400 text-blue-950 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl shadow-amber-400/20"
            >
              <Plus className="w-4 h-4" />
              {t.admin.recruitment.addJob}
            </button>
          )}
        </div>
      </div>

      {activeView === 'jobs' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              layout
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-950/5 transition-all duration-500 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${
                  job.active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  {job.active ? 'Active' : 'Inactive'}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingJob(job);
                      setJobForm({
                        title: job.title,
                        category: job.category,
                        description: job.description,
                        requirements: job.requirements.join('\n'),
                        active: job.active
                      });
                      setIsAddingJob(true);
                    }}
                    className="p-3 text-slate-400 hover:text-blue-950 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-blue-950 mb-2">{job.title}</h3>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4">{job.category}</p>
              <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">{job.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {applications.filter(a => a.jobId === job.id).length} Candidats
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-amber-400 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-grow relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input
                type="text"
                placeholder="Rechercher un candidat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-8 py-5 bg-white border border-slate-100 rounded-3xl text-sm focus:ring-2 focus:ring-amber-400 transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-4 bg-white px-6 py-2 rounded-3xl border border-slate-100 shadow-sm">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-slate-600 focus:ring-0 cursor-pointer"
              >
                <option value="all">Tous les statuts</option>
                <option value="new">Nouveau</option>
                <option value="reviewed">Examiné</option>
                <option value="accepted">Accepté</option>
                <option value="rejected">Refusé</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidat</th>
                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Poste</th>
                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut</th>
                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xs">
                            {app.firstName[0]}{app.lastName[0]}
                          </div>
                          <div>
                            <div className="font-bold text-blue-950 text-sm">{app.firstName} {app.lastName}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{app.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-slate-600 text-[10px] uppercase tracking-widest">{app.jobTitle}</div>
                          {app.jobId === 'spontaneous' && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded text-[8px] font-bold uppercase tracking-widest">Spontanée</span>
                          )}
                        </div>
                        {app.subject && <div className="text-[9px] text-amber-500 font-bold uppercase mt-1">{app.subject}</div>}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                          <Calendar className="w-3.5 h-3.5" />
                          {app.createdAt?.toDate().toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="p-3 text-slate-400 hover:text-blue-950 hover:bg-white rounded-xl transition-all shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredApplications.length === 0 && (
              <div className="py-24 text-center">
                <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">{t.admin.recruitment.noApplications}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Job Modal */}
      <AnimatePresence>
        {isAddingJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingJob(false)}
              className="absolute inset-0 bg-blue-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-12">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold text-blue-950 uppercase tracking-tight">
                    {editingJob ? t.admin.recruitment.editJob : t.admin.recruitment.addJob}
                  </h2>
                  <button onClick={() => setIsAddingJob(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <XCircle className="w-6 h-6 text-slate-300" />
                  </button>
                </div>

                <form onSubmit={handleSaveJob} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Titre du poste</label>
                      <input
                        required
                        type="text"
                        value={jobForm.title}
                        onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-amber-400 transition-all"
                        placeholder="ex: Professeur de Mathématiques"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Catégorie</label>
                      <select
                        value={jobForm.category}
                        onChange={(e) => setJobForm(prev => ({ ...prev, category: e.target.value as Job['category'] }))}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer"
                      >
                        <option value="teacher">Enseignant</option>
                        <option value="driver">Conducteur / Transport</option>
                        <option value="intern">Stagiaire</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={jobForm.description}
                      onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-amber-400 transition-all resize-none"
                      placeholder="Décrivez le poste..."
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Prérequis (un par ligne)</label>
                    <textarea
                      rows={4}
                      value={jobForm.requirements}
                      onChange={(e) => setJobForm(prev => ({ ...prev, requirements: e.target.value }))}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-amber-400 transition-all resize-none"
                      placeholder="ex: Master en éducation&#10;3 ans d'expérience..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="active"
                      checked={jobForm.active}
                      onChange={(e) => setJobForm(prev => ({ ...prev, active: e.target.checked }))}
                      className="w-5 h-5 rounded border-slate-200 text-amber-400 focus:ring-amber-400"
                    />
                    <label htmlFor="active" className="text-sm font-bold text-blue-950 uppercase tracking-widest">Offre active</label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddingJob(false)}
                      className="flex-1 py-5 border border-slate-100 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-5 bg-blue-950 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-950/20"
                    >
                      {editingJob ? 'Mettre à jour' : 'Publier l\'offre'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApplication(null)}
              className="absolute inset-0 bg-blue-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-12 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 font-bold text-2xl shadow-inner">
                      {selectedApplication.firstName[0]}{selectedApplication.lastName[0]}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-blue-950 mb-2">
                        {selectedApplication.firstName} {selectedApplication.lastName}
                      </h2>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${getStatusColor(selectedApplication.status)}`}>
                          {selectedApplication.status}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Poste: {selectedApplication.jobTitle}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedApplication(null)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <XCircle className="w-6 h-6 text-slate-300" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-10">
                    <section>
                      <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-6">Message de motivation</h4>
                      <div className="bg-slate-50 p-8 rounded-3xl text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedApplication.message}
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-6">Documents joints</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl group hover:border-amber-400 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-1">Curriculum Vitae</div>
                              <div className="text-[9px] text-slate-400 truncate">{selectedApplication.cvName}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => downloadFile(selectedApplication.cv, selectedApplication.cvName)}
                            className="p-3 text-slate-300 hover:text-amber-500 transition-colors"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                        {selectedApplication.coverLetterName && (
                          <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl group hover:border-amber-400 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div className="overflow-hidden">
                                <div className="text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-1">Lettre de motivation</div>
                                <div className="text-[9px] text-slate-400 truncate">{selectedApplication.coverLetterName}</div>
                              </div>
                            </div>
                            <button 
                              onClick={() => downloadFile(selectedApplication.coverLetter, selectedApplication.coverLetterName)}
                              className="p-3 text-slate-300 hover:text-amber-500 transition-colors"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8">
                    <section className="bg-slate-50 p-8 rounded-[2.5rem]">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">Informations de contact</h4>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Email</div>
                            <div className="text-sm font-bold text-blue-950">{selectedApplication.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Téléphone</div>
                            <div className="text-sm font-bold text-blue-950">{selectedApplication.phone}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Appliqué le</div>
                            <div className="text-sm font-bold text-blue-950">
                              {selectedApplication.createdAt?.toDate().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Changer le statut</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleUpdateAppStatus(selectedApplication.id, 'reviewed')}
                          className={`py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                            selectedApplication.status === 'reviewed' ? 'bg-amber-400 text-blue-950' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          Examiné
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(selectedApplication.id, 'accepted')}
                          className={`py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                            selectedApplication.status === 'accepted' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          Accepté
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(selectedApplication.id, 'rejected')}
                          className={`py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                            selectedApplication.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          Refusé
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(selectedApplication.id, 'new')}
                          className={`py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                            selectedApplication.status === 'new' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          Nouveau
                        </button>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
