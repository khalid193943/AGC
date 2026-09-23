import { useState } from 'react';
import { Download, Trash2, Copy, Check } from 'lucide-react';
import { useCollection, remove, fmt, toCsv, download } from '../data';
import { PageTitle, Panel, Btn, Empty, SearchBox, useConfirm, useToast } from '../ui';

export default function NewsletterPage() {
  const { rows, loading } = useCollection<any>('messages', 'createdAt');
  const [q, setQ] = useState(''); const [copied, setCopied] = useState(false);
  const { confirm, node } = useConfirm(); const toast = useToast();
  const subs = rows.filter((m) => m.type === 'newsletter');
  const list = subs.filter((m) => !q || m.email?.toLowerCase().includes(q.toLowerCase()));
  const copyAll = async () => { await navigator.clipboard.writeText(subs.map((s) => s.email).join(', ')); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const del = async (m: any) => { if (await confirm(`Retirer ${m.email} de la liste ?`)) { await remove('messages', m.id); toast('Abonné retiré.'); } };
  return (
    <div>
      <PageTitle title="Newsletter" desc={`${subs.length} abonné${subs.length > 1 ? 's' : ''} · inscrits depuis le pied de page et le journal.`} actions={<><SearchBox value={q} onChange={setQ} placeholder="Rechercher un email…" /><Btn variant="ghost" onClick={copyAll}>{copied ? <Check size={16} /> : <Copy size={16} />} Copier les adresses</Btn><Btn onClick={() => download(`newsletter-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(subs, ['email', 'createdAt']))}><Download size={16} /> Exporter (Excel)</Btn></>} />
      <Panel className="p-2">
        {loading ? <p className="p-4 text-mute text-sm">Chargement…</p> : list.length === 0 ? <div className="p-4"><Empty text="Aucun abonné pour le moment." /></div> : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-mute"><th className="px-4 py-2 font-medium">Email</th><th className="px-4 py-2 font-medium">Inscrit le</th><th /></tr></thead>
            <tbody className="divide-y divide-ink/10">
              {list.map((m) => <tr key={m.id}><td className="px-4 py-3 font-medium">{m.email}</td><td className="px-4 py-3 text-mute">{fmt(m.createdAt)}</td><td className="px-4 py-3 text-right"><button onClick={() => del(m)} className="h-8 w-8 rounded-full text-logo-red hover:bg-logo-red/10 inline-flex items-center justify-center" aria-label="Retirer"><Trash2 size={14} /></button></td></tr>)}
            </tbody>
          </table>
        )}
      </Panel>
      <p className="text-xs text-mute mt-4">Pour envoyer une campagne : « Copier les adresses », puis collez-les en Cci dans votre messagerie, ou importez le fichier Excel dans Mailchimp / Brevo.</p>
      {node}
    </div>
  );
}
