import { useEffect, useState, FormEvent, lazy, Suspense } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, Newspaper, CalendarDays, Images, Inbox, UserPlus, Mail, Briefcase, Users, LogOut, ExternalLink, Menu, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { IMG, SITE } from '../content/site';
import { login, logout, watchSession, Session } from './auth';
import { useCollection } from './data';
import { ToastProvider, Badge } from './ui';
import { EASE } from '../components/ui/motion';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const NewsPage = lazy(() => import('./pages/News'));
const EventsPage = lazy(() => import('./pages/Events'));
const GalleryPage = lazy(() => import('./pages/Gallery'));
const MessagesPage = lazy(() => import('./pages/Messages'));
const NewsletterPage = lazy(() => import('./pages/Newsletter'));
const RecruitmentPage = lazy(() => import('./pages/Recruitment'));
const UsersPage = lazy(() => import('./pages/Users'));

/* ------------------------------------------------------------------ */
/* Connexion                                                            */
/* ------------------------------------------------------------------ */
const Login = ({ onDone }: { onDone: (s: Session) => void }) => {
  const [u, setU] = useState(''); const [p, setP] = useState(''); const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { onDone(await login(u, p)); } catch (ex: any) { setErr(ex?.message || 'Connexion impossible.'); } finally { setBusy(false); }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-salt">
      <div className="relative bg-ink text-salt grain overflow-hidden hidden lg:flex flex-col justify-between p-12">
        <img src={IMG.school} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="relative flex items-center gap-3"><img src={IMG.logo} alt="" className="h-14 w-14 object-contain" referrerPolicy="no-referrer" /><span className="font-display font-semibold text-lg leading-tight">Georges Claude<br /><span className="text-sea text-sm font-medium">Administration</span></span></div>
        <div className="relative"><p className="t-h2 max-w-[14ch]">Le site, entre vos mains.</p><p className="t-body text-sea mt-4 max-w-[40ch]">Actualités, événements, galerie, inscriptions, messages, newsletter et recrutement : tout se gère ici, en temps réel.</p></div>
        <p className="relative text-sm text-sea-2">{SITE.name} · El Jadida</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <motion.form onSubmit={submit} className="w-full max-w-sm" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
          <img src={IMG.logo} alt="" className="h-16 w-16 object-contain lg:hidden mb-6" referrerPolicy="no-referrer" />
          <h1 className="t-h3">Connexion</h1>
          <p className="t-small text-mute mt-1">Espace réservé à l’équipe de l’académie.</p>
          <div className="mt-8 space-y-4">
            <div className="field"><label htmlFor="a-u">Identifiant ou email</label><input id="a-u" value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" required autoFocus /></div>
            <div className="field"><label htmlFor="a-p">Mot de passe</label>
              <div className="relative"><input id="a-p" type={show ? 'text' : 'password'} value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password" required className="!pr-12" /><button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mute" aria-label="Afficher">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            </div>
            {err && <p className="text-sm text-logo-red bg-logo-red/10 rounded-xl px-4 py-3">{err}</p>}
            <button className="btn btn-ink w-full" disabled={busy}>{busy ? <Loader2 className="animate-spin" size={18} /> : 'Se connecter'}</button>
          </div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-mute mt-8 ulink"><ExternalLink size={14} /> Retour au site</Link>
        </motion.form>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Coquille : barre latérale + contenu                                  */
/* ------------------------------------------------------------------ */
const NAV = [
  { to: '/admin', label: 'Tableau de bord', Icon: LayoutDashboard, end: true },
  { to: '/admin/actualites', label: 'Actualités', Icon: Newspaper },
  { to: '/admin/evenements', label: 'Événements', Icon: CalendarDays },
  { to: '/admin/galerie', label: 'Galerie', Icon: Images },
  { to: '/admin/inscriptions', label: 'Inscriptions', Icon: UserPlus, badge: 'admissions' },
  { to: '/admin/messages', label: 'Messages', Icon: Inbox, badge: 'contact' },
  { to: '/admin/newsletter', label: 'Newsletter', Icon: Mail },
  { to: '/admin/recrutement', label: 'Recrutement', Icon: Briefcase, badge: 'applications' },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', Icon: Users, adminOnly: true },
];

const Shell = ({ session }: { session: Session }) => {
  const nav = useNavigate(); const loc = useLocation();
  const [open, setOpen] = useState(false);
  const { rows: messages } = useCollection<any>('messages');
  const { rows: apps } = useCollection<any>('applications');
  const counts: Record<string, number> = {
    admissions: messages.filter((m) => m.type === 'admissions' && (m.status || 'new') === 'new').length,
    contact: messages.filter((m) => m.type === 'contact' && (m.status || 'new') === 'new').length,
    applications: apps.filter((a) => (a.status || 'new') === 'new').length,
  };
  useEffect(() => { setOpen(false); }, [loc.pathname]);
  const current = NAV.find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)));
  const side = (
    <nav className="flex flex-col h-full">
      <Link to="/admin" className="flex items-center gap-3 px-5 h-20 border-b border-white/10"><img src={IMG.logo} alt="" className="h-11 w-11 object-contain" referrerPolicy="no-referrer" /><span className="font-display font-semibold leading-tight">Georges Claude<br /><span className="text-sea-2 text-xs font-medium">Administration</span></span></Link>
      <ul className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.filter((n) => !n.adminOnly || session.role === 'admin').map((n) => (
          <li key={n.to}>
            <NavLink to={n.to} end={n.end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 h-11 text-[14px] font-medium transition-colors ${isActive ? 'bg-white/10 text-salt' : 'text-sea hover:bg-white/6 hover:text-salt'}`}>
              {({ isActive }) => (<><n.Icon size={18} className={isActive ? 'text-saffron' : ''} /><span className="flex-1">{n.label}</span>{n.badge && counts[n.badge] > 0 && <span className="rounded-full bg-saffron text-ink text-[11px] font-bold px-1.5 min-w-[20px] h-5 flex items-center justify-center">{counts[n.badge]}</span>}</>)}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="p-3 border-t border-white/10 space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3.5 h-10 text-[13px] text-sea hover:text-salt"><ExternalLink size={16} /> Voir le site</a>
        <button onClick={async () => { await logout(); nav('/admin/login'); }} className="w-full flex items-center gap-3 rounded-xl px-3.5 h-10 text-[13px] text-sea hover:text-salt"><LogOut size={16} /> Déconnexion</button>
        <p className="px-3.5 pt-2 text-[11px] text-sea-2 truncate">{session.user.email} · {session.role}</p>
      </div>
    </nav>
  );
  return (
    <div className="min-h-screen bg-salt text-ink flex">
      <aside className="hidden lg:block w-64 shrink-0 bg-ink text-salt sticky top-0 h-screen">{side}</aside>
      {open && <div className="fixed inset-0 z-[100] lg:hidden"><div className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} /><div className="absolute inset-y-0 left-0 w-72 bg-ink text-salt">{side}</div></div>}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 h-16 bg-salt/85 backdrop-blur-xl border-b border-ink/10 flex items-center gap-3 px-4 lg:px-8">
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden w-10 h-10 rounded-full border border-ink/12 flex items-center justify-center" aria-label="Menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
          <p className="font-display font-semibold">{current?.label || 'Administration'}</p>
          <div className="ml-auto flex items-center gap-2 text-xs text-mute"><Badge tone="leaf">En ligne</Badge>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Suspense fallback={<div className="flex items-center gap-2 text-mute"><Loader2 className="animate-spin" size={18} /> Chargement…</div>}>
            <Routes>
              <Route index element={<Dashboard session={session} />} />
              <Route path="actualites" element={<NewsPage />} />
              <Route path="evenements" element={<EventsPage />} />
              <Route path="galerie" element={<GalleryPage />} />
              <Route path="inscriptions" element={<MessagesPage kind="admissions" />} />
              <Route path="messages" element={<MessagesPage kind="contact" />} />
              <Route path="newsletter" element={<NewsletterPage />} />
              <Route path="recrutement" element={<RecruitmentPage />} />
              <Route path="utilisateurs" element={session.role === 'admin' ? <UsersPage /> : <Navigate to="/admin" replace />} />
              <Route path="dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Point d'entrée : session, garde, routes                             */
/* ------------------------------------------------------------------ */
export default function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const loc = useLocation(); const nav = useNavigate();
  useEffect(() => watchSession(setSession), []);
  useEffect(() => { document.title = 'Administration — Georges Claude Private Academy'; }, []);
  if (session === undefined) return <div className="min-h-screen bg-salt flex items-center justify-center text-mute gap-2"><Loader2 className="animate-spin" size={18} /> Vérification de la session…</div>;
  if (!session) return loc.pathname.endsWith('/login') ? <ToastProvider><Login onDone={(s) => { setSession(s); nav('/admin'); }} /></ToastProvider> : <Navigate to="/admin/login" replace />;
  if (loc.pathname.endsWith('/login')) return <Navigate to="/admin" replace />;
  return <ToastProvider><Shell session={session} /></ToastProvider>;
}
