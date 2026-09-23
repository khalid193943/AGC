import { useState, FormEvent } from 'react';
import { Plus, Pencil, Trash2, Download, Mail, Phone, FileText, Power } from 'lucide-react';
import { useCollection, create, update, patch, remove, fmt } from '../data';
import { PageTitle, Panel, Btn, Drawer, F, Badge, Empty, Tabs, useConfirm, useToast } from '../ui';

const CAT: Record<string, string> = { teacher: 'Enseignant·e', driver: 'Chauffeur', intern: 'Stagiaire', other: 'Autre' };
const APP_STATUS: Record<string, { label: string; tone: 'saffron' | 'sea' | 'leaf' | 'red' }> = { new: { label: 'Nouvelle', tone: 'saffron' }, reviewed: { label: 'Examinée', tone: 'sea' }, accepted: { label: 'Retenue', tone: 'leaf' }, rejected: { label: 'Refusée', tone: 'red' } };
const blank = () => ({ title: '', category: 'teacher', description: '', requirements: '', active: true });

export default function RecruitmentPage() {
  const { rows: jobs } = useCollection<any>('jobs', 'createdAt');
  const { rows: apps, loading } = useCollection<any>('applications', 'createdAt');
  const [tab, setTab] = useState('applications');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(blank());
  const [sel, setSel] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  const { confirm, node } = useConfirm(); const toast = useToast();
  const st = (a: any) => a.status || 'new';
  const list = apps.filter((a) => filter === 'all' || st(a) === filter);
  const open = (j?: any) => { setForm(j ? { ...blank(), ...j, requirements: (j.requirements || []).join('\n') } : blank()); setEditing(j || {}); };
  const save = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    const data = { title: form.title.trim(), category: form.category, description: form.description, requirements: form.requirements.split('\n').map((x: string) => x.trim()).filter(Boolean), active: !!form.active };
    try { if (editing?.id) { await update('jobs', editing.id, data); toast('Poste mis à jour.'); } else { await create('jobs', data); toast('Poste publié.'); } setEditing(null); }
    catch (ex: any) { toast(ex?.message || 'Enregistrement impossible.', 'err'); } finally { setBusy(false); }
  };
  const delJob = async (j: any) => { if (await confirm(`Supprimer le poste « ${j.title} » ?`)) { await remove('jobs', j.id); } };
  const delApp = async (a: any) => { if (await confirm('Supprimer cette candidature ?')) { await remove('applications', a.id); setSel(null); } };
  const openApp = (a: any) => { setSel(a); if (st(a) === 'new') patch('applications', a.id, { status: 'reviewed' }); };
  const fileHref = (data: string, name: string) => (data ? { href: data, download: name || 'document' } : null);

  return (
    <div>
      <PageTitle title="Recrutement" desc="Postes publiés sur le site et candidatures reçues." actions={<><Tabs items={[{ key: 'applications', label: 'Candidatures', count: apps.filter((a) => st(a) === 'new').length }, { key: 'jobs', label: 'Postes', count: jobs.length }]} value={tab} onChange={setTab} />{tab === 'jobs' && <Btn onClick={() => open()}><Plus size={16} /> Nouveau poste</Btn>}</>} />

      {tab === 'jobs' ? (
        jobs.length === 0 ? <Empty text="Aucun poste. Les candidatures spontanées restent possibles." action={<Btn onClick={() => open()}><Plus size={16} /> Publier un poste</Btn>} /> : (
          <div className="grid md:grid-cols-2 gap-3">
            {jobs.map((j) => (
              <Panel key={j.id} className="p-5">
                <div className="flex items-start justify-between gap-3"><div><Badge>{CAT[j.category] || j.category}</Badge><h3 className="font-display font-semibold mt-2">{j.title}</h3></div><Badge tone={j.active !== false ? 'leaf' : 'sea'}>{j.active !== false ? 'En ligne' : 'Masqué'}</Badge></div>
                <p className="text-sm text-mute mt-2 line-clamp-2">{j.description}</p>
                <div className="mt-4 flex items-center gap-1.5"><Btn size="sm" variant="ghost" onClick={() => open(j)}><Pencil size={14} /> Modifier</Btn><Btn size="sm" variant="ghost" onClick={() => patch('jobs', j.id, { active: j.active === false })}><Power size={14} /> {j.active !== false ? 'Masquer' : 'Publier'}</Btn><button onClick={() => delJob(j)} className="ml-auto h-9 w-9 rounded-full text-logo-red hover:bg-logo-red/10 flex items-center justify-center" aria-label="Supprimer"><Trash2 size={15} /></button></div>
              </Panel>
            ))}
          </div>
        )
      ) : (
        <div>
          <Tabs items={[{ key: 'all', label: 'Toutes', count: apps.length }, ...Object.entries(APP_STATUS).map(([k, v]) => ({ key: k, label: v.label, count: apps.filter((a) => st(a) === k).length }))]} value={filter} onChange={setFilter} />
          <div className="grid lg:grid-cols-12 gap-4 mt-5">
            <Panel className="lg:col-span-5 overflow-hidden">
              {loading ? <p className="p-5 text-mute text-sm">Chargement…</p> : list.length === 0 ? <div className="p-5"><Empty text="Aucune candidature." /></div> : (
                <ul className="divide-y divide-ink/10 max-h-[70vh] overflow-y-auto">
                  {list.map((a) => (
                    <li key={a.id}><button onClick={() => openApp(a)} className={`w-full text-left px-4 py-3.5 hover:bg-salt ${sel?.id === a.id ? 'bg-salt' : ''}`}>
                      <span className="flex items-center justify-between gap-2"><span className={`text-sm ${st(a) === 'new' ? 'font-semibold' : 'font-medium'}`}>{a.firstName} {a.lastName}</span><Badge tone={APP_STATUS[st(a)]?.tone}>{APP_STATUS[st(a)]?.label}</Badge></span>
                      <span className="block text-xs text-mute mt-0.5 truncate">{a.jobTitle}{a.subject ? ` · ${a.subject}` : ''} · {fmt(a.createdAt)}</span>
                    </button></li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel className="lg:col-span-7 p-6 min-h-[50vh]">
              {!sel ? <p className="text-mute text-sm">Sélectionnez une candidature.</p> : (
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="t-h4">{sel.firstName} {sel.lastName}</h2><p className="text-xs text-mute mt-1">{sel.jobTitle}{sel.subject ? ` · ${sel.subject}` : ''} · {fmt(sel.createdAt)}</p></div><Badge tone={APP_STATUS[st(sel)]?.tone}>{APP_STATUS[st(sel)]?.label}</Badge></div>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    <a href={`mailto:${sel.email}`} className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-3 h-9 hover:border-ink"><Mail size={14} />{sel.email}</a>
                    <a href={`tel:${sel.phone}`} className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-3 h-9 hover:border-ink"><Phone size={14} />{sel.phone}</a>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {fileHref(sel.cv, sel.cvName) && <Btn variant="ghost" href={sel.cv} download={sel.cvName || 'cv'}><FileText size={16} /> Télécharger le CV</Btn>}
                    {fileHref(sel.coverLetter, sel.coverLetterName) && <Btn variant="ghost" href={sel.coverLetter} download={sel.coverLetterName || 'lettre'}><Download size={16} /> Lettre de motivation</Btn>}
                  </div>
                  {sel.message && <div className="mt-5 rounded-xl bg-salt p-5 t-body whitespace-pre-wrap">{sel.message}</div>}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Btn onClick={() => { patch('applications', sel.id, { status: 'accepted' }); setSel({ ...sel, status: 'accepted' }); }} variant="saffron">Retenir</Btn>
                    <Btn variant="ghost" onClick={() => { patch('applications', sel.id, { status: 'rejected' }); setSel({ ...sel, status: 'rejected' }); }}>Refuser</Btn>
                    <Btn variant="danger" onClick={() => delApp(sel)} className="ml-auto"><Trash2 size={16} /> Supprimer</Btn>
                  </div>
                </div>
              )}
            </Panel>
          </div>
        </div>
      )}

      <Drawer open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Modifier le poste' : 'Nouveau poste'} footer={<><Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn><Btn onClick={() => (document.getElementById('job-form') as HTMLFormElement)?.requestSubmit()} disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</Btn></>}>
        <form id="job-form" onSubmit={save} className="grid gap-5">
          <F label="Intitulé"><input required maxLength={99} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex. : Professeur·e de mathématiques — collège" /></F>
          <F label="Catégorie"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{Object.entries(CAT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></F>
          <F label="Description"><textarea required rows={6} maxLength={4900} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></F>
          <F label="Profil recherché" hint="Un critère par ligne"><textarea rows={4} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder={'Master ou licence\nExpérience de 3 ans'} /></F>
          <label className="flex items-center gap-3 rounded-xl border border-ink/12 p-4 cursor-pointer"><input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-5 h-5 accent-[#06193A]" /><span className="text-sm font-semibold">Visible sur le site</span></label>
        </form>
      </Drawer>
      {node}
    </div>
  );
}
