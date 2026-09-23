import { useEffect, useState, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Star, Eye } from 'lucide-react';
import { useCollection, create, update, remove, fmt, today } from '../data';
import { PageTitle, Panel, Btn, Drawer, F, ImageField, Badge, Empty, SearchBox, useConfirm, useToast } from '../ui';

const CATEGORIES = ['Actualité', 'Événement', 'Pédagogie', 'Succès', 'Vie scolaire', 'Sport', 'Culture', 'Administration'];
const blank = () => ({ title: '', date: today(), category: CATEGORIES[0], image: '', content: '', isFeatured: false, additionalImages: [] as string[] });

export default function NewsPage() {
  const { rows, loading } = useCollection<any>('news', 'date');
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(blank());
  const [busy, setBusy] = useState(false);
  const { confirm, node } = useConfirm(); const toast = useToast();
  useEffect(() => { if (params.get('new')) { setForm(blank()); setEditing({}); setParams({}); } }, [params, setParams]);
  const open = (n?: any) => { setForm(n ? { ...blank(), ...n } : blank()); setEditing(n || {}); };
  const list = rows.filter((n) => !q || `${n.title} ${n.category} ${n.content}`.toLowerCase().includes(q.toLowerCase()));

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.image) return toast('Ajoutez une image principale.', 'err');
    setBusy(true);
    const data = { title: form.title.trim(), date: form.date, category: form.category, image: form.image, content: form.content, isFeatured: !!form.isFeatured, additionalImages: (form.additionalImages || []).filter(Boolean).slice(0, 4) };
    try {
      if (editing?.id) { await update('news', editing.id, data); toast('Actualité mise à jour.'); }
      else { await create('news', data, true); toast('Actualité publiée.'); }
      setEditing(null);
    } catch (ex: any) { toast(ex?.message || 'Enregistrement impossible.', 'err'); } finally { setBusy(false); }
  };
  const del = async (n: any) => { if (await confirm(`Supprimer « ${n.title} » ?`)) { await remove('news', n.id); toast('Actualité supprimée.'); } };
  const feature = async (n: any) => { await update('news', n.id, { isFeatured: !n.isFeatured }); };

  return (
    <div>
      <PageTitle title="Actualités" desc={`${rows.length} article${rows.length > 1 ? 's' : ''} · l’article « à la une » ouvre le journal.`} actions={<><SearchBox value={q} onChange={setQ} /><Btn onClick={() => open()}><Plus size={16} /> Nouvelle actualité</Btn></>} />
      {loading ? <p className="text-mute text-sm">Chargement…</p> : list.length === 0 ? <Empty text="Aucune actualité pour le moment." action={<Btn onClick={() => open()}><Plus size={16} /> Écrire la première</Btn>} /> : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((n) => (
            <Panel key={n.id} className="overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] bg-sea/40"><img src={n.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />{n.isFeatured && <span className="absolute top-3 left-3"><Badge tone="saffron">À la une</Badge></span>}</div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-mute">{n.category} · {fmt(n.date)}</p>
                <h3 className="font-display font-semibold mt-1 leading-snug line-clamp-2">{n.title}</h3>
                <p className="text-sm text-mute mt-1.5 line-clamp-2">{n.content}</p>
                <div className="mt-auto pt-4 flex items-center gap-1.5">
                  <Btn size="sm" variant="ghost" onClick={() => open(n)}><Pencil size={14} /> Modifier</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => feature(n)} className={n.isFeatured ? '!bg-saffron !border-saffron' : ''}><Star size={14} /></Btn>
                  <a href={`/actualites/${n.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-ink/15 hover:border-ink" aria-label="Voir"><Eye size={14} /></a>
                  <button onClick={() => del(n)} className="ml-auto h-9 w-9 rounded-full text-logo-red hover:bg-logo-red/10 flex items-center justify-center" aria-label="Supprimer"><Trash2 size={15} /></button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Drawer open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Modifier l’actualité' : 'Nouvelle actualité'} wide
        footer={<><Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn><Btn type="submit" onClick={() => (document.getElementById('news-form') as HTMLFormElement)?.requestSubmit()} disabled={busy}>{busy ? 'Enregistrement…' : editing?.id ? 'Enregistrer' : 'Publier'}</Btn></>}>
        <form id="news-form" onSubmit={save} className="grid sm:grid-cols-2 gap-5">
          <F label="Titre" span><input required maxLength={99} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex. : Journée portes ouvertes 2026" /></F>
          <F label="Date"><input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></F>
          <F label="Catégorie"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></F>
          <ImageField value={form.image} onChange={(v) => setForm({ ...form, image: v })} label="Image principale" />
          <F label="Texte de l’article" span hint={`${form.content.length} / 4 900 caractères · séparez les paragraphes par une ligne vide`}><textarea required rows={10} maxLength={4900} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></F>
          <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4">
            {[0, 1].map((i) => <ImageField key={i} value={form.additionalImages?.[i] || ''} onChange={(v) => { const a = [...(form.additionalImages || [])]; a[i] = v; setForm({ ...form, additionalImages: a }); }} label={`Image complémentaire ${i + 1} (facultatif)`} ratio="aspect-[4/3]" />)}
          </div>
          <label className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-ink/12 p-4 cursor-pointer"><input type="checkbox" checked={!!form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-5 h-5 accent-[#06193A]" /><span><span className="block font-semibold text-sm">Mettre à la une</span><span className="block text-xs text-mute">Affiché en grand sur l’accueil et en tête du journal.</span></span></label>
        </form>
      </Drawer>
      {node}
    </div>
  );
}
