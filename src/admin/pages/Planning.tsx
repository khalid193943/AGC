import { useState } from 'react';
import { ExternalLink, CalendarRange, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { PageTitle, Btn, Panel } from '../ui';

/** Planning AGC (emplois du temps) — application dédiée, affichée dans l'administration. */
export const PLANNING_URL = 'https://agcplanning.vercel.app/';

export default function PlanningPage() {
  const [key, setKey] = useState(0);
  const [full, setFull] = useState(false);
  return (
    <div className={full ? 'fixed inset-0 z-[100] bg-salt p-4 flex flex-col' : ''}>
      <PageTitle
        title="Planning — emplois du temps"
        desc="Classes, enseignants, salles et créneaux se gèrent dans Planning AGC. Connectez-vous avec vos identifiants Planning."
        actions={<>
          <Btn variant="ghost" onClick={() => setKey((k) => k + 1)}><RefreshCw size={16} /> Recharger</Btn>
          <Btn variant="ghost" onClick={() => setFull((f) => !f)}>{full ? <><Minimize2 size={16} /> Réduire</> : <><Maximize2 size={16} /> Plein écran</>}</Btn>
          <Btn href={PLANNING_URL} className="[&>a]:no-underline"><ExternalLink size={16} /> Ouvrir dans un onglet</Btn>
        </>}
      />
      <Panel className={`overflow-hidden ${full ? 'flex-1' : ''}`}>
        <iframe
          key={key}
          src={PLANNING_URL}
          title="Planning AGC — Emplois du temps"
          className={`w-full bg-white ${full ? 'h-full' : 'h-[78vh] min-h-[640px]'}`}
          allow="clipboard-write; fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Panel>
      {!full && (
        <p className="text-xs text-mute mt-3 inline-flex items-center gap-2"><CalendarRange size={14} /> Si l’application ne s’affiche pas dans ce cadre (réglage de sécurité de son hébergement), utilisez « Ouvrir dans un onglet ».</p>
      )}
    </div>
  );
}
