import { SITE } from '../../content/site';

/* Icônes des réseaux — tracés simples, cohérents avec les icônes Lucide (trait 1.8) */
export const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
);
export const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
export const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.5z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-1.9-1-.9.8a4 4 0 0 1-2.3-2.3l.8-.9-1-1.9z" /></svg>
);
export const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 4c.5 2.5 2.5 4 5 4" /></svg>
);

export const SOCIALS = [
  { key: 'instagram', label: 'Instagram', href: SITE.social.instagram, Icon: InstagramIcon },
  { key: 'facebook', label: 'Facebook', href: SITE.social.facebook, Icon: FacebookIcon },
  { key: 'whatsapp', label: 'WhatsApp', href: SITE.whatsappHref, Icon: WhatsAppIcon },
];

/** Rangée de réseaux : pastilles rondes, ou libellés avec icône */
export const SocialLinks = ({ variant = 'pill', dark = false, className = '' }: { variant?: 'pill' | 'label'; dark?: boolean; className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {SOCIALS.map((s) => (
      <a
        key={s.key}
        href={s.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={s.label}
        className={
          variant === 'pill'
            ? `w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 hover:-translate-y-0.5 ${dark ? 'border-white/20 text-salt hover:bg-saffron hover:text-ink hover:border-saffron' : 'border-ink/15 text-ink hover:bg-ink hover:text-salt'}`
            : `inline-flex items-center gap-2 text-sm font-semibold ulink ${dark ? 'text-salt' : 'text-ink'}`
        }
      >
        <s.Icon size={variant === 'pill' ? 18 : 16} />{variant === 'label' && s.label}
      </a>
    ))}
  </div>
);
