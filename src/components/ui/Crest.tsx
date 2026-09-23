import { IMG, SITE } from '../../content/site';

/**
 * Médaillon : le blason de l'école entouré d'un texte circulaire qui tourne lentement.
 * Transform uniquement (rotation), désactivé avec prefers-reduced-motion (voir index.css).
 */
export const Crest = ({ size = 160, text, dark = true, className = '' }: { size?: number; text?: string; dark?: boolean; className?: string }) => {
  const label = text || `${SITE.name} · El Jadida · ${SITE.motto.FR} · `;
  const id = `crest-${size}`;
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full crest-spin">
        <defs><path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke={dark ? 'rgba(255,255,255,0.18)' : 'rgba(6,25,58,0.15)'} strokeWidth="1" />
        <text fontSize="11.5" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="600" letterSpacing="1.6" fill={dark ? '#E8B04B' : '#06193A'}>
          <textPath href={`#${id}`} startOffset="0">{label}{label}</textPath>
        </text>
      </svg>
      <div className={`absolute inset-[22%] rounded-full flex items-center justify-center ${dark ? 'bg-white/10 backdrop-blur-md ring-1 ring-white/20' : 'bg-salt ring-1 ring-ink/10'} shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]`}>
        <img src={IMG.logo} alt="" className="w-[78%] h-[78%] object-contain" referrerPolicy="no-referrer" loading="lazy" />
      </div>
    </div>
  );
};
