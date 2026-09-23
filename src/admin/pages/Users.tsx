import { useState, FormEvent } from 'react';
import { Plus, Pencil, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useCollection, create, update, remove } from '../data';
import { PageTitle, Panel, Btn, Drawer, F, Badge, Empty, useConfirm, useToast } from '../ui';

const blank = () => ({ username: '', password: '', email: '', role: 'editor' });

export default function UsersPage() {
  const { rows } = useCollection<any>('admin_users', 'username', 'asc');
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(blank());
  const [busy, setBusy] = useState(false);
  const { confirm, node } = useConfirm(); const toast = useToast();
  const open = (u?: any) => { setForm(u ? { ...blank(), ...u } : blank()); setEditing(u || {}); };
  const save = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    const data = { username: form.username.trim(), password: form.password, email: form.email.trim().toLowerCase(), role: form.role, permissions: [] };
    try { if (editing?.id) { await update('admin_users', editing.id, data); toast('Compte mis à jour.'); } else { await create('admin_users', data); toast('Compte créé.'); } setEditing(null); }
    catch (ex: any) { toast(ex?.message || 'Enregistrement impossible.', 'err'); } finally { setBusy(false); }
  };
  const del = async (u: any) => { if (await confirm(`Supprimer le compte « ${u.username} » ?`)) { await remove('admin_users', u.id); } };
  return (
    <div>
      <PageTitle title="Utilisateurs" desc="Comptes ayant accès à cette administration." actions={<Btn onClick={() => open()}><Plus size={16} /> Nouveau compte</Btn>} />
      <div className="rounded-xl border border-saffron/50 bg-saffron/10 p-4 text-sm flex gap-3 mb-4"><AlertTriangle size={18} className="text-ink shrink-0 mt-0.5" /><span>Ces comptes sont enregistrés dans Firestore (collection <code>admin_users</code>), comme avant la refonte. Pour une sécurité optimale, créez à chaque membre un compte dans Firebase Authentication (email + mot de passe) : il pourra alors se connecter directement avec son email, et cette liste pourra être supprimée. Détails dans le README.</span></div>
      {rows.length === 0 ? <Empty text="Aucun compte supplémentaire. Les comptes historiques restent actifs." /> : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {rows.map((u) => (
            <Panel key={u.id} className="p-5 flex items-start gap-4">
              <span className="w-11 h-11 rounded-full bg-ink text-saffron flex items-center justify-center font-display font-semibold">{(u.username || '?')[0].toUpperCase()}</span>
              <div className="flex-1 min-w-0"><p className="font-semibold truncate">{u.username}</p><p className="text-xs text-mute truncate">{u.email}</p><div className="mt-2"><Badge tone={u.role === 'admin' ? 'saffron' : 'sea'}>{u.role === 'admin' ? 'Administrateur' : 'Éditeur'}</Badge></div></div>
              <div className="flex gap-1"><button onClick={() => open(u)} className="h-9 w-9 rounded-full border border-ink/12 hover:border-ink flex items-center justify-center" aria-label="Modifier"><Pencil size={14} /></button><button onClick={() => del(u)} className="h-9 w-9 rounded-full text-logo-red hover:bg-logo-red/10 flex items-center justify-center" aria-label="Supprimer"><Trash2 size={14} /></button></div>
            </Panel>
          ))}
        </div>
      )}
      <Drawer open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Modifier le compte' : 'Nouveau compte'} footer={<><Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn><Btn onClick={() => (document.getElementById('user-form') as HTMLFormElement)?.requestSubmit()} disabled={busy}>Enregistrer</Btn></>}>
        <form id="user-form" onSubmit={save} className="grid gap-5">
          <F label="Identifiant"><input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></F>
          <F label="Email"><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></F>
          <F label="Mot de passe"><input required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></F>
          <F label="Rôle"><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="admin">Administrateur (tout gérer)</option><option value="editor">Éditeur (contenus)</option></select></F>
          <p className="text-xs text-mute inline-flex gap-2"><ShieldCheck size={14} /> L’accès est validé par les règles Firebase.</p>
        </form>
      </Drawer>
      {node}
    </div>
  );
}
