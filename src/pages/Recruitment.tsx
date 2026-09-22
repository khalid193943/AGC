import { useEffect, useState, FormEvent } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Check, Loader2, Upload, Users, GraduationCap, Sparkles } from 'lucide-react';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { IMG } from '../content/site';
import { WordReveal, Reveal } from '../components/ui/motion';
import { Seo, Chapter, Button } from '../components/ui';
import { PageHero } from '../components/sections';

interface Job { id: string; title: string; category: 'teacher' | 'driver' | 'intern' | 'other'; description: string; requirements: string[]; active: boolean }

const toBase64 = (file: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(file); });

const Recruitment = () => {
  const { t, currentLang } = useLanguage();
  const fr = currentLang === 'FR';
  const r = t.recruitment;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selected, setSelected] = useState<Job | 'spontaneous' | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '', cv: null as File | null, coverLetter: null as File | null });
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const catLabel: Record<string, string> = { teacher: r.categories.Professor, driver: r.categories.Driver, intern: r.categories.Intern, other: r.categories.Other };

  useEffect(() => {
    const u = onSnapshot(collection(db, 'jobs'), (s) => setJobs(s.docs.map((d) => ({ id: d.id, ...(d.data() as any) })).filter((j) => j.active !== false)), () => setJobs([]));
    return () => u();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setState('sending');
    try {
      const job = selected === 'spontaneous' ? null : selected;
      await addDoc(collection(db, 'applications'), {
        jobId: job ? job.id : 'spontaneous', jobTitle: job ? job.title : t.ui.spontaneous,
        firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, message: form.message, subject: form.subject,
        cvName: form.cv?.name || '', coverLetterName: form.coverLetter?.name || '',
        cv: form.cv ? await toBase64(form.cv) : '', coverLetter: form.coverLetter ? await toBase64(form.coverLetter) : '',
        status: 'new', createdAt: serverTimestamp(),
      });
      setState('done');
    } catch { setState('idle'); }
  };

  const needSubject = selected === 'spontaneous' || (selected && (selected.category === 'teacher' || selected.category === 'intern'));
  const why = [
    { icon: Sparkles, title: fr ? 'Excellence' : 'Excellence', desc: fr ? 'Un environnement stimulant et exigeant.' : 'A stimulating and demanding environment.' },
    { icon: Users, title: fr ? 'Communauté' : 'Community', desc: fr ? 'Une équipe soudée, à taille humaine.' : 'A close-knit, human-sized team.' },
    { icon: GraduationCap, title: fr ? 'Évolution' : 'Growth', desc: fr ? 'Formations continues et projets pédagogiques.' : 'Continuous training and teaching projects.' },
  ];

  return (
    <main>
      <Seo title={`${r.title} | ${r.subtitle} — Georges Claude Private Academy El Jadida`} description={r.heroDesc} path="/recrutement" image={IMG.team} />
      <PageHero chapter={r.title} title={r.subtitle} lead={r.heroDesc} image={IMG.team} imageAlt={fr ? 'L’équipe de l’académie' : 'The academy team'} compact />

      <section className="section bg-salt">
        <div className="wrap grid lg:grid-cols-12 gap-12">
          {/* Postes */}
          <div className="lg:col-span-5">
            <Chapter className="mb-6">{t.ui.jobsTitle}</Chapter>
            <h2 className="t-h2 mb-8"><WordReveal text={fr ? 'Les talents que nous cherchons.' : 'The talent we are looking for.'} /></h2>
            <div className="space-y-3">
              {jobs.length === 0 && <p className="t-body text-mute mb-4">{t.ui.jobsEmpty}</p>}
              {jobs.map((j) => (
                <button key={j.id} onClick={() => { setSelected(j); setState('idle'); }} className={`w-full text-left card p-5 transition-all ${selected !== 'spontaneous' && selected?.id === j.id ? 'border-ink shadow-[0_20px_40px_-25px_rgba(6,25,58,0.3)]' : 'hover:border-ink/40'}`}>
                  <p className="t-meta">{catLabel[j.category] || j.category}</p>
                  <p className="t-h4 mt-1">{j.title}</p>
                  {j.description && <p className="t-small text-mute mt-2 line-clamp-2">{j.description}</p>}
                  {j.requirements?.length > 0 && <ul className="mt-3 flex flex-wrap gap-1.5">{j.requirements.slice(0, 4).map((q) => <li key={q} className="text-xs rounded-full border border-ink/15 px-2.5 py-0.5">{q}</li>)}</ul>}
                </button>
              ))}
              <button onClick={() => { setSelected('spontaneous'); setState('idle'); }} className={`w-full text-left rounded-[1.5rem] p-5 border transition-all ${selected === 'spontaneous' ? 'bg-ink text-salt border-ink' : 'bg-saffron/20 border-saffron/40 hover:border-ink/40'}`}>
                <p className="t-h4">{t.ui.spontaneous}</p>
                <p className={`t-small mt-1 ${selected === 'spontaneous' ? 'text-sea' : 'text-mute'}`}>{r.noPositions}</p>
              </button>
            </div>
            <div className="mt-12 grid sm:grid-cols-3 gap-6">
              {why.map((w, i) => (
                <Reveal key={i} delay={0.06 * i} className="border-t border-ink/15 pt-4">
                  <w.icon size={18} className="text-ink-3 mb-3" />
                  <p className="font-semibold">{w.title}</p>
                  <p className="t-small text-mute mt-1">{w.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="card p-7 md:p-10 lg:sticky lg:top-28">
              {!selected ? (
                <div className="py-12 text-center">
                  <p className="t-h4">{r.formTitle}</p>
                  <p className="t-body text-mute mt-2 max-w-[36ch] mx-auto">{t.ui.choosePosition}</p>
                </div>
              ) : state === 'done' ? (
                <div className="py-10 text-center">
                  <span className="mx-auto w-14 h-14 rounded-full bg-leaf text-salt flex items-center justify-center mb-5"><Check size={24} /></span>
                  <p className="t-h3">{r.successTitle}</p>
                  <p className="t-body text-mute mt-3 max-w-[40ch] mx-auto">{r.successDesc}</p>
                </div>
              ) : (
                <form onSubmit={submit} className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <p className="t-meta">{r.formTitle}</p>
                    <h3 className="t-h3 mt-1">{selected === 'spontaneous' ? t.ui.spontaneous : selected.title}</h3>
                  </div>
                  <div className="field"><label htmlFor="r-fn">{t.ui.firstName} *</label><input id="r-fn" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} autoComplete="given-name" /></div>
                  <div className="field"><label htmlFor="r-ln">{t.ui.lastName} *</label><input id="r-ln" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} autoComplete="family-name" /></div>
                  <div className="field"><label htmlFor="r-email">{r.email} *</label><input id="r-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></div>
                  <div className="field"><label htmlFor="r-phone">{r.phone} *</label><input id="r-phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" /></div>
                  {needSubject && <div className="field sm:col-span-2"><label htmlFor="r-subj">{t.ui.subjectTaught}</label><input id="r-subj" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>}
                  <div className="field"><label htmlFor="r-cv">{t.ui.cvLabel} *</label><label htmlFor="r-cv" className="flex items-center gap-3 cursor-pointer rounded-xl border border-dashed border-ink/25 px-4 py-3 text-sm hover:border-ink"><Upload size={16} /> {form.cv?.name || (fr ? 'Choisir un fichier' : 'Choose a file')}</label><input id="r-cv" type="file" accept=".pdf,.doc,.docx" required className="sr-only" onChange={(e) => setForm({ ...form, cv: e.target.files?.[0] || null })} /></div>
                  <div className="field"><label htmlFor="r-cl">{t.ui.clLabel}</label><label htmlFor="r-cl" className="flex items-center gap-3 cursor-pointer rounded-xl border border-dashed border-ink/25 px-4 py-3 text-sm hover:border-ink"><Upload size={16} /> {form.coverLetter?.name || (fr ? 'Choisir un fichier' : 'Choose a file')}</label><input id="r-cl" type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => setForm({ ...form, coverLetter: e.target.files?.[0] || null })} /></div>
                  <div className="field sm:col-span-2"><label htmlFor="r-msg">{r.message}</label><textarea id="r-msg" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
                  <div className="sm:col-span-2 flex items-center justify-between gap-4">
                    <p className="t-meta">* {t.ui.requiredNote}</p>
                    <Button type="submit" size="lg" disabled={state === 'sending'} icon="none">{state === 'sending' ? <Loader2 className="animate-spin" size={18} /> : r.submit}</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Recruitment;
