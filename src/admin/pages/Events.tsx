import { useEffect, useState, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, MapPin, Clock } from 'lucide-react';
import { useCollection, create, update, remove, fmt, today } from '../data';
import { PageTitle, Panel, Btn, Drawer, F, ImageField, Badge, Empty, Tabs, useConfirm, useToast } from '../ui';

const blank = () => ({ title: '', date: today(), time: '09:00', image: '', location: 'Campus Sidi Bouzid', description: '' });

export default function EventsPage() {
  const { rows, loading } = useCollection<any>('events', 'date');
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState('upcoming');
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(blank());
  const [busy, setBusy] = useState(false);
  const { confirm, node } = useConfirm(); const toast = useToast();
  useEffect(() => { if (params.get('new')) { setForm(blank()); setEditing({}); setParams({}); } }, [params, setParams]);
  const open = (e?: any) => { setForm(e ? { ...blank(), ...e } : blank()); setEditing(e || {}); };
  const isPast = (e: any) => new Date(e.date).getTime() < Date.now() - 86400000;
  const upcoming = rows.filter((e) => !isPast(e)).sort((a, b) => a.date.localeCompare(b.date));
  const past = rows.filter(isPast);
  const list = tab === 'upcoming' ? upcoming : past;

  const save = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!form.image) return toast('Ajoutez une image.', 'err');
    setBusy(true);
    const data = { title: form.title.trim(), date: form.date, time: form.time, image: form.image, location: form.location, description: form.description };
    try {
      if (editing?.id) { await update('events', editing.id, data); toast('Événement mis à jour.'); } else { await create('events', data, true); toast('Événement ajouté à l’agenda.'); }
      setEditing(null);
    } catch (ex: any) { toast(ex?.message || 'Enregistrement impossible.', 'err'); } finally { setBusy(false); }
  };
  const del = async (e: any) => { if (await confirm(`Supprimer « ${e.title} » ?`)) { await remove('events', e.id); toast('Événement supprimé.'); } };

  return (
    <div>
      <PageTitle title="Événements" desc="Les familles peuvent ajouter chaque événement à leur agenda depuis le site." actions={<><Tabs items={[{ key: 'upcoming', label: 'À venir', count: upcoming.length }, { key: 'past', label: 'Passés', count: past.length }]} value={tab} onChange={setTab} /><Btn onClick={() => open()}><Plus size={16} /> Nouvel événement</Btn></>} />
      {loading ? <p className="text-mute text-sm">Chargement…</p> : list.length === 0 ? <Empty text={tab === 'upcoming' ? 'Aucun événement à venir.' : 'Aucun événement passé.'} action={tab === 'upcoming' && <Btn onClick={() => open()}><Plus size={16} /> Planifier</Btn>} /> : (
        <div className="space-y-3">
          {list.map((e) => {
            const d = new Date(e.date);
            return (
              <Panel key={e.id} className="p-3 flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="w-16 shrink-0 rounded-xl bg-ink text-salt text-center py-2 leading-none"><span className="block text-[10px] uppercase text-saffron">{d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}</span><span className="block font-display font-semibold text-2xl mt-1">{d.getDate()}</span><span className="block text-[10px] text-sea-2 mt-1">{d.getFullYear()}</span></span>
                <img src={e.image} alt="" className="w-full sm:w-28 h-20 object-cover rounded-lg bg-sea/40" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold leading-snug">{e.title}</h3>
                  <p className="text-xs text-mute mt-1 flex flex-wrap gap-x-3"><span className="inline-flex items-center gap-1"><Clock size={12} />{e.time}</span>{e.location && <span className="inline-flex items-center gap-1"><MapPin size={12} />{e.location}</span>}</p>
                  <p className="text-sm text-mute mt-1 line-clamp-1">{e.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">{isPast(e) && <Badge>Passé</Badge>}<Btn size="sm" variant="ghost" onClick={() => open(e)}><Pencil size={14} /> Modifier</Btn><button onClick={() => del(e)} className="h-9 w-9 rounded-full text-logo-red hover:bg-logo-red/10 flex items-center justify-center" aria-label="Supprimer"><Trash2 size={15} /></button></div>
              </Panel>
            );
          })}
        </div>
      )}
      <Drawer open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Modifier l’événement' : 'Nouvel événement'}
        footer={<><Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn><Btn onClick={() => (document.getElementById('ev-form') as HTMLFormElement)?.requestSubmit()} disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</Btn></>}>
        <form id="ev-form" onSubmit={save} className="grid sm:grid-cols-2 gap-5">
          <F label="Titre" span><input required maxLength={99} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></F>
          <F label="Date"><input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></F>
          <F label="Heure"><input type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></F>
          <F label="Lieu" span><input maxLength={99} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></F>
          <ImageField value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
          <F label="Description" span hint={`${form.description.length} / 1 900 caractères`}><textarea required rows={6} maxLength={1900} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></F>
        </form>
      </Drawer>
      {node}
    </div>
  );
}
