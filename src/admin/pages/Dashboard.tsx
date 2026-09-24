import { Link } from 'react-router-dom';
import { Newspaper, CalendarDays, Images, Inbox, UserPlus, Mail, Briefcase, ArrowUpRight, Plus, CalendarRange } from 'lucide-react';
import { Session } from '../auth';
import { useCollection, fmt, fmtTime } from '../data';
import { Stat, Panel, PageTitle, Badge } from '../ui';

export default function Dashboard({ session }: { session: Session }) {
  const { rows: news } = useCollection<any>('news', 'date');
  const { rows: events } = useCollection<any>('events', 'date');
  const { rows: moments } = useCollection<any>('moments');
  const { rows: messages } = useCollection<any>('messages');
  const { rows: apps } = useCollection<any>('applications');
  const isNew = (m: any) => (m.status || 'new') === 'new';
  const admissions = messages.filter((m) => m.type === 'admissions');
  const contact = messages.filter((m) => m.type === 'contact');
  const newsletter = messages.filter((m) => m.type === 'newsletter');
  const upcoming = events.filter((e) => new Date(e.date).getTime() > Date.now() - 86400000).sort((a, b) => a.date.localeCompare(b.date));
  const ts = (x: any) => x?.createdAt?.seconds || 0;
  const activity = [
    ...messages.map((m) => ({ ...m, _k: m.type === 'admissions' ? 'Inscription' : m.type === 'newsletter' ? 'Newsletter' : 'Message', _to: m.type === 'admissions' ? '/admin/inscriptions' : m.type === 'newsletter' ? '/admin/newsletter' : '/admin/messages', _label: m.name || m.email })),
    ...apps.map((a) => ({ ...a, _k: 'Candidature', _to: '/admin/recrutement', _label: `${a.firstName || ''} ${a.lastName || ''} — ${a.jobTitle || ''}` })),
  ].sort((a, b) => ts(b) - ts(a)).slice(0, 8);
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div>
      <PageTitle title={`${hello}.`} desc="Voici ce qui s’est passé sur le site." actions={<><Link to="/admin/actualites?new=1" className="btn btn-ink !h-11 text-sm"><Plus size={16} /> Nouvelle actualité</Link><Link to="/admin/evenements?new=1" className="btn btn-ghost !h-11 text-sm"><Plus size={16} /> Nouvel événement</Link></>} />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Link to="/admin/inscriptions"><Stat label="Demandes d’inscription" value={admissions.filter(isNew).length} sub={`${admissions.length} au total`} icon={<UserPlus size={20} />} tone="saffron" /></Link>
        <Link to="/admin/messages"><Stat label="Messages à traiter" value={contact.filter(isNew).length} sub={`${contact.length} reçus`} icon={<Inbox size={20} />} /></Link>
        <Link to="/admin/newsletter"><Stat label="Abonnés newsletter" value={newsletter.length} icon={<Mail size={20} />} tone="leaf" /></Link>
        <Link to="/admin/recrutement"><Stat label="Candidatures nouvelles" value={apps.filter(isNew).length} sub={`${apps.length} au total`} icon={<Briefcase size={20} />} tone="red" /></Link>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-3">
        <Link to="/admin/actualites"><Stat label="Actualités publiées" value={news.length} icon={<Newspaper size={20} />} /></Link>
        <Link to="/admin/evenements"><Stat label="Événements à venir" value={upcoming.length} icon={<CalendarDays size={20} />} /></Link>
        <Link to="/admin/galerie"><Stat label="Photos et vidéos" value={moments.length} icon={<Images size={20} />} /></Link>
        <Link to="/admin/planning"><Stat label="Planning" value="Emplois du temps" sub="Classes, enseignants, salles" icon={<CalendarRange size={20} />} tone="saffron" /></Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-4 mt-6">
        <Panel className="lg:col-span-7 p-5">
          <div className="flex items-center justify-between mb-3"><h2 className="t-h4">Dernière activité</h2><span className="text-xs text-mute">temps réel</span></div>
          {activity.length === 0 ? <p className="t-small text-mute">Rien pour le moment.</p> : (
            <ul className="divide-y divide-ink/10">
              {activity.map((a: any) => (
                <li key={a.id + a._k}><Link to={a._to} className="flex items-center gap-4 py-3 group">
                  <Badge tone={a._k === 'Inscription' ? 'saffron' : a._k === 'Candidature' ? 'red' : a._k === 'Newsletter' ? 'leaf' : 'sea'}>{a._k}</Badge>
                  <span className="flex-1 min-w-0 truncate text-sm font-medium group-hover:text-ink-3">{a._label}</span>
                  {isNew(a) && <span className="w-2 h-2 rounded-full bg-saffron" />}
                  <span className="text-xs text-mute whitespace-nowrap">{fmt(a.createdAt)} {fmtTime(a.createdAt)}</span>
                  <ArrowUpRight size={14} className="text-mute" />
                </Link></li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel className="lg:col-span-5 p-5">
          <div className="flex items-center justify-between mb-3"><h2 className="t-h4">Prochains événements</h2><Link to="/admin/evenements" className="text-xs ulink">Gérer</Link></div>
          {upcoming.length === 0 ? <p className="t-small text-mute">Aucun événement planifié.</p> : (
            <ul className="space-y-3">
              {upcoming.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-center gap-3">
                  <span className="w-12 rounded-xl bg-ink text-salt text-center py-1.5 leading-none"><span className="block text-[10px] uppercase text-saffron">{new Date(e.date).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}</span><span className="block font-display font-semibold text-xl mt-0.5">{new Date(e.date).getDate()}</span></span>
                  <span className="min-w-0"><span className="block text-sm font-semibold truncate">{e.title}</span><span className="block text-xs text-mute">{e.time}{e.location ? ` · ${e.location}` : ''}</span></span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 pt-4 border-t border-ink/10 text-xs text-mute">Connecté en tant que <strong className="text-ink">{session.user.email}</strong> ({session.role}).</div>
        </Panel>
      </div>
    </div>
  );
}
