import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { TRANSLATIONS } from '../constants';
import { EXTRA, Lang } from '../content/site';

interface LanguageContextType {
  currentLang: Lang;
  setCurrentLang: (lang: Lang) => void;
  /** Accès par chemin "a.b.c" ou par objet (t.nav.home) */
  t: any;
  language: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const deepMerge = (base: any, extra: any): any => {
  if (!extra) return base;
  const out: any = Array.isArray(base) ? [...base] : { ...base };
  for (const key of Object.keys(extra)) {
    const b = out[key];
    const e = extra[key];
    out[key] = b && typeof b === 'object' && !Array.isArray(b) && e && typeof e === 'object' && !Array.isArray(e) ? deepMerge(b, e) : e;
  }
  return out;
};

const DICT: Record<Lang, any> = {
  FR: deepMerge(TRANSLATIONS.FR, EXTRA.FR),
  EN: deepMerge(TRANSLATIONS.EN, EXTRA.EN),
};

const readStoredLang = (): Lang => {
  try {
    const v = window.localStorage.getItem('agc-lang');
    return v === 'EN' ? 'EN' : 'FR';
  } catch {
    return 'FR';
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLang, setLang] = useState<Lang>(readStoredLang);

  const setCurrentLang = useCallback((lang: Lang) => {
    setLang(lang);
    try { window.localStorage.setItem('agc-lang', lang); } catch { /* ignore */ }
  }, []);

  const t = useMemo(() => {
    const dict = DICT[currentLang];
    const fn = (path: string): any => {
      let result: any = dict;
      for (const key of path.split('.')) {
        if (result && typeof result === 'object' && key in result) result = result[key];
        else return path;
      }
      return result;
    };
    Object.assign(fn, dict);
    return fn;
  }, [currentLang]);

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = currentLang.toLowerCase();
  }, [currentLang]);

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, t, language: currentLang.toLowerCase() }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
