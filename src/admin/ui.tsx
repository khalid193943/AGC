import { ReactNode, useEffect, useRef, useState, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, AlertTriangle, Search, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { EASE } from '../components/ui/motion';
import { compressImage } from './data';

/* ------------------------------------------------------------------ */
/* Notifications                                                        */
/* ------------------------------------------------------------------ */
type Toast = { id: number; text: string; kind: 'ok' | 'err' };
const ToastCtx = createContext<(text: string, kind?: 'ok' | 'err') => void>(() => {});
export const useToast = () => useContext(ToastCtx);
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [list, setList] = useState<Toast[]>([]);
  const push = useCallback((text: string, kind: 'ok' | 'err' = 'ok') => {
    const id = Date.now() + Math.random();
    setList((l) => [...l, { id, text, kind }]);
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-5 right-5 z-[120] flex flex-col gap-2">
        <AnimatePresence>
          {list.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-[0_20px_40px_-15px_rgba(6,25,58,0.4)] ${t.kind === 'ok' ? 'bg-ink text-salt' : 'bg-logo-red text-white'}`}>
              {t.kind === 'ok' ? <Check size={16} className="text-saffron" /> : <AlertTriangle size={16} />}{t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
};

/* ------------------------------------------------------------------ */
/* Blocs                                                                */
/* ------------------------------------------------------------------ */
export const Panel = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-ink/10 ${className}`}>{children}</div>
);

export const PageTitle = ({ title, desc, actions }: { title: string; desc?: string; actions?: ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
    <div><h1 className="t-h3">{title}</h1>{desc && <p className="t-small text-mute mt-1">{desc}</p>}</div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export const Stat = ({ label, value, sub, icon, tone = 'ink', onClick }: { label: string; value: ReactNode; sub?: string; icon: ReactNode; tone?: 'ink' | 'saffron' | 'red' | 'leaf'; onClick?: () => void }) => {
  const tones = { ink: 'bg-ink text-saffron', saffron: 'bg-saffron text-ink', red: 'bg-logo-red text-white', leaf: 'bg-leaf text-salt' };
  return (
    <button onClick={onClick} className={`text-left bg-white rounded-2xl border border-ink/10 p-5 flex items-start gap-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-25px_rgba(6,25,58,0.35)] ${onClick ? 'cursor-pointer' : 'cursor-default'}`}>
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>{icon}</span>
      <span className="min-w-0"><span className="block font-display font-semibold text-3xl leading-none">{value}</span><span className="block text-sm font-medium mt-1.5">{label}</span>{sub && <span className="block text-xs text-mute mt-0.5">{sub}</span>}</span>
    </button>
  );
};

export const Badge = ({ children, tone = 'sea' }: { children: ReactNode; tone?: 'sea' | 'saffron' | 'red' | 'leaf' | 'ink' }) => {
  const t = { sea: 'bg-sea/50 text-ink', saffron: 'bg-saffron text-ink', red: 'bg-logo-red/10 text-logo-red', leaf: 'bg-leaf/10 text-leaf', ink: 'bg-ink text-salt' };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${t[tone]}`}>{children}</span>;
};

export const Empty = ({ text, action }: { text: string; action?: ReactNode }) => (
  <div className="text-center py-16 px-6 border border-dashed border-ink/15 rounded-2xl">
    <p className="t-body text-mute">{text}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const Btn = ({ children, onClick, variant = 'ink', size = 'md', type = 'button', disabled, className = '', href, download }: { children: ReactNode; onClick?: () => void; variant?: 'ink' | 'saffron' | 'ghost' | 'danger'; size?: 'sm' | 'md'; type?: 'button' | 'submit'; disabled?: boolean; className?: string; href?: string; download?: string }) => {
  const v = { ink: 'bg-ink text-salt hover:bg-ink-2', saffron: 'bg-saffron text-ink hover:bg-saffron-2', ghost: 'border border-ink/15 text-ink hover:border-ink', danger: 'border border-logo-red/30 text-logo-red hover:bg-logo-red hover:text-white' }[variant];
  const s = size === 'sm' ? 'h-9 px-3 text-[13px]' : 'h-11 px-4 text-sm';
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${v} ${s} ${className}`;
  if (href) return <a href={href} download={download} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className={cls}>{children}</a>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
};

export const SearchBox = ({ value, onChange, placeholder = 'Rechercher…' }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <label className="relative block w-full md:w-72">
    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" />
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full h-11 rounded-full border border-ink/12 bg-white pl-10 pr-4 text-sm focus:outline-none focus:border-ink" />
  </label>
);

export const Tabs = ({ items, value, onChange }: { items: { key: string; label: string; count?: number }[]; value: string; onChange: (k: string) => void }) => (
  <div className="flex flex-wrap gap-1.5">
    {items.map((it) => (
      <button key={it.key} onClick={() => onChange(it.key)} className={`inline-flex items-center gap-2 rounded-full px-3.5 h-9 text-[13px] font-semibold transition-colors ${value === it.key ? 'bg-ink text-salt' : 'border border-ink/12 text-ink hover:border-ink'}`}>
        {it.label}{it.count !== undefined && <span className={`rounded-full px-1.5 text-[11px] ${value === it.key ? 'bg-saffron text-ink' : 'bg-sea/60'}`}>{it.count}</span>}
      </button>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Formulaires                                                          */
/* ------------------------------------------------------------------ */
export const F = ({ label, children, hint, span = false }: { label: string; children: ReactNode; hint?: string; span?: boolean }) => (
  <div className={`field ${span ? 'sm:col-span-2' : ''}`}>
    <label>{label}</label>
    {children}
    {hint && <span className="text-xs text-mute">{hint}</span>}
  </div>
);

export const ImageField = ({ value, onChange, label = 'Image', ratio = 'aspect-[16/9]' }: { value: string; onChange: (v: string) => void; label?: string; ratio?: string }) => {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try { onChange(await compressImage(file)); } finally { setBusy(false); }
  };
  return (
    <div className="field sm:col-span-2">
      <label>{label}</label>
      {value ? (
        <div className={`relative ${ratio} rounded-xl overflow-hidden border border-ink/10 bg-sea/40`}>
          <img src={value} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button type="button" onClick={() => input.current?.click()} className="h-8 px-3 rounded-full bg-white/90 text-xs font-semibold">Remplacer</button>
            <button type="button" onClick={() => onChange('')} className="h-8 w-8 rounded-full bg-white/90 text-logo-red flex items-center justify-center" aria-label="Retirer"><Trash2 size={14} /></button>
          </div>
        </div>
      ) : (
        <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }} onClick={() => input.current?.click()} className={`${ratio} rounded-xl border-2 border-dashed border-ink/15 hover:border-ink bg-salt flex flex-col items-center justify-center gap-2 cursor-pointer text-mute`}>
          {busy ? <Loader2 className="animate-spin" /> : <ImagePlus size={26} />}
          <span className="text-sm">{busy ? 'Traitement…' : 'Glissez une image ou cliquez'}</span>
          <span className="text-xs">JPG, PNG, WEBP — compressée automatiquement</span>
        </div>
      )}
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      <button type="button" onClick={() => setUrl((v) => !v)} className="text-xs text-mute ulink self-start">{url ? 'Masquer' : 'Ou coller un lien d’image'}</button>
      {url && <input placeholder="https://…" onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Panneau latéral (édition) et confirmation                           */
/* ------------------------------------------------------------------ */
export const Drawer = ({ open, onClose, title, children, footer, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[110] bg-ink/50 backdrop-blur-[2px] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.aside onClick={(e) => e.stopPropagation()} className={`h-full bg-salt w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} flex flex-col shadow-2xl`} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.45, ease: EASE }} role="dialog" aria-modal="true" aria-label={title}>
            <header className="flex items-center justify-between px-6 h-16 border-b border-ink/10 bg-white">
              <h2 className="font-display font-semibold text-lg">{title}</h2>
              <button onClick={onClose} className="w-9 h-9 rounded-full border border-ink/12 flex items-center justify-center hover:bg-ink hover:text-salt transition-colors" aria-label="Fermer"><X size={16} /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
            {footer && <footer className="px-6 py-4 border-t border-ink/10 bg-white flex items-center justify-end gap-2">{footer}</footer>}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const useConfirm = () => {
  const [state, setState] = useState<{ text: string; resolve: (v: boolean) => void } | null>(null);
  const confirm = (text: string) => new Promise<boolean>((resolve) => setState({ text, resolve }));
  const node = (
    <AnimatePresence>
      {state && (
        <motion.div className="fixed inset-0 z-[130] bg-ink/60 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md" initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}>
            <p className="t-h4">{state.text}</p>
            <p className="t-small text-mute mt-2">Cette action est définitive.</p>
            <div className="flex justify-end gap-2 mt-6">
              <Btn variant="ghost" onClick={() => { state.resolve(false); setState(null); }}>Annuler</Btn>
              <Btn variant="danger" onClick={() => { state.resolve(true); setState(null); }}>Supprimer</Btn>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  return { confirm, node };
};
