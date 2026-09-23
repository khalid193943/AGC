import { useState } from 'react';
import { Mail, Phone, Trash2, CheckCheck, Download, Reply, MessageCircle } from 'lucide-react';
import { useCollection, patch, remove, fmt, fmtTime, toCsv, download } from '../data';
import { PageTitle, Panel, Btn, Badge, Empty, Tabs, SearchBox, useConfirm, useToast } from '../ui';

const STATUS: Record<string, { label: string; tone: 'saffron' | 'sea' | 'leaf' }> = { new: { label: 'Nouveau', tone: 'saffron' }, read: { label: 'Lu', tone: 'sea' }, answered: { label: 'Traité', tone: 'leaf' } };

export default function MessagesPage({ kind }: { kind: 'contact' | 'admissions' }) {
  const { rows, loading } = useCollection<any>('messages', 'createdAt');
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<any | null>(null);
  const { confirm, node } = useConfirm(); const toast = useToast();
  const all = rows.filter((m) => (m.type || 'contact') === kind);
  const st = (m: any) => m.status || 'new';
  const list = all.filter((m) => (tab === 'all' || st(m) === tab) && (!q || `${m.name} ${m.email} ${m.phone} ${m.message}`.toLowerCase().includes(q.toLowerCase())));
  const open = (m: any) => { setSel(m); if (st(m) === 'new') patch('messages', m.id, { status: 'read' }); };
  const setStatus = (m: any, s: string) => { patch('messages', m.id, { status: s }); setSel({ ...m, status: s }); };
  const del = async (m: any) => { if (await confirm('Supprimer ce message ?')) { await remove('messages', m.id); setSel(null); toast('Message supprimé.'); } };
  const exportCsv = () => download(`${kind}-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(all, ['name', 'email', 'phone', 'message', 'status', 'createdAt']));
  const title = kind === 'admissions' ? 'Demandes d’inscription' : 'Messages de contact';
  const grade = (m: any) => (m.message || '').match(/Niveau:\s*([a-zé]+)/i)?.[1];

  return (
    <div>
      <PageTitle title={title} desc={kind === 'admissions' ? 'Chaque demande envoyée depuis la page Inscription arrive ici.' : 'Formulaire de contact et demande d’informations de l’accueil.'} actions={<><SearchBox value={q} onChange={setQ} /><Btn variant="ghost" onClick={exportCsv}><Download size={16} /> Exporter (Excel)</Btn></>} />
      <Tabs items={[{ key: 'all', label: 'Tous', count: all.length }, { key: 'new', label: 'Nouveaux', count: all.filter((m) => st(m) === 'new').length }, { key: 'read', label: 'Lus', count: all.filter((m) => st(m) === 'read').length }, { key: 'answered', label: 'Traités', count: all.filter((m) => st(m) === 'answered').length }]} value={tab} onChange={setTab} />
      <div className="grid lg:grid-cols-12 gap-4 mt-5">
        <Panel className="lg:col-span-5 overflow-hidden">
          {loading ? <p className="p-5 text-mute text-sm">Chargement…</p> : list.length === 0 ? <div className="p-5"><Empty text="Aucun message." /></div> : (
            <ul className="divide-y divide-ink/10 max-h-[70vh] overflow-y-auto">
              {list.map((m) => (
                <li key={m.id}><button onClick={() => open(m)} className={`w-full text-left px-4 py-3.5 flex gap-3 hover:bg-salt transition-colors ${sel?.id === m.id ? 'bg-salt' : ''}`}>
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${st(m) === 'new' ? 'bg-saffron' : 'bg-transparent'}`} />
                  <span className="flex-1 min-w-0"><span className="flex items-center justify-between gap-2"><span className={`text-sm truncate ${st(m) === 'new' ? 'font-semibold' : 'font-medium'}`}>{m.name || m.email}</span><span className="text-[11px] text-mute whitespace-nowrap">{fmt(m.createdAt)}</span></span><span className="block text-xs text-mute truncate mt-0.5">{kind === 'admissions' && grade(m) ? <Badge>{grade(m)}</Badge> : null} {m.message || m.email}</span></span>
                </button></li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel className="lg:col-span-7 p-6 min-h-[50vh]">
          {!sel ? <p className="text-mute text-sm">Sélectionnez un message pour le lire.</p> : (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h2 className="t-h4">{sel.name || '—'}</h2><p className="text-xs text-mute mt-1">{fmt(sel.createdAt)} à {fmtTime(sel.createdAt)}</p></div>
                <Badge tone={STATUS[st(sel)]?.tone || 'sea'}>{STATUS[st(sel)]?.label || st(sel)}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {sel.email && <a href={`mailto:${sel.email}`} className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-3 h-9 hover:border-ink"><Mail size={14} />{sel.email}</a>}
                {sel.phone && <a href={`tel:${sel.phone}`} className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-3 h-9 hover:border-ink"><Phone size={14} />{sel.phone}</a>}
                {sel.phone && <a href={`https://wa.me/${String(sel.phone).replace(/\D/g, '').replace(/^0/, '212')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-3 h-9 hover:border-ink"><MessageCircle size={14} />WhatsApp</a>}
              </div>
              <div className="mt-5 rounded-xl bg-salt p-5 t-body whitespace-pre-wrap">{sel.message || <span className="text-mute">Pas de message — demande de rappel.</span>}</div>
              <div className="mt-5 flex flex-wrap gap-2">
                {sel.email && <Btn href={`mailto:${sel.email}?subject=${encodeURIComponent('Georges Claude Private Academy — votre demande')}`}><Reply size={16} /> Répondre par email</Btn>}
                <Btn variant="ghost" onClick={() => setStatus(sel, 'answered')}><CheckCheck size={16} /> Marquer traité</Btn>
                {st(sel) !== 'new' && <Btn variant="ghost" onClick={() => setStatus(sel, 'new')}>Remettre en nouveau</Btn>}
                <Btn variant="danger" onClick={() => del(sel)} className="ml-auto"><Trash2 size={16} /> Supprimer</Btn>
              </div>
            </div>
          )}
        </Panel>
      </div>
      {node}
    </div>
  );
}
