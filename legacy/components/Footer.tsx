import { 
  Phone, 
  Smartphone,
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ASSETS } from '../constants';

export const Footer = () => {
  const { currentLang, t } = useLanguage();

  return (
    <footer className="bg-blue-950 text-white pt-32 pb-0 relative overflow-hidden border-t border-white/5">
      <div className="container-wide relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">
          <div className="space-y-10">
            <Link to="/" className="inline-block group" aria-label="Retour à l'accueil">
              <img src={ASSETS.logo} alt="Logo Georges Claude Private Academy El Jadida" className="w-[150px] h-[150px] object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]" width="150" height="150" referrerPolicy="no-referrer" loading="lazy" />
            </Link>
            <p className="text-blue-200/60 text-sm leading-relaxed font-light max-w-sm uppercase tracking-widest">
              {t.footer.desc}
            </p>
            <div className="flex space-x-5">
              <a href="https://www.facebook.com/AcademieGeorgesClaude" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Facebook" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-amber-400 hover:text-blue-950 transition-all duration-500 group">
                <Facebook size={16} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://www.instagram.com/academiegeorgesclaude.officiel/" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Instagram" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-amber-400 hover:text-blue-950 transition-all duration-500 group">
                <Instagram size={16} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[12px] uppercase tracking-[0.4em] text-amber-400 mb-10 flex items-center">
              <span className="w-6 h-px bg-amber-400/30 mr-4"></span>
              {t.footer.links}
            </h4>
            <ul className="space-y-4">
              {[
                { name: t.nav.home, to: '/' },
                { name: t.academy.title, to: '/academie' },
                { name: t.nav.programs, to: '/programmes' },
                { name: t.nav.life, to: '/vie-scolaire' },
                { name: t.nav.admissions, to: '/inscription' },
                { name: t.recruitment.title, to: '/recrutement' }
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-blue-200/60 hover:text-amber-400 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center group">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ fontSize: '16px' }}>
            <h4 className="font-bold text-[12px] uppercase tracking-[0.4em] text-amber-400 mb-10 flex items-center">
              <span className="w-6 h-px bg-amber-400/30 mr-4"></span>
              {t.footer.contact}
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start group">
                <MapPin size={14} className="text-amber-400 mr-4 mt-1 flex-shrink-0" />
                <span className="text-blue-200/60 font-bold uppercase tracking-widest leading-relaxed">Sidi Bouzid, Route de Casablanca,<br />El Jadida, Maroc</span>
              </li>
              <li className="flex items-center group">
                <Phone size={14} className="text-amber-400 mr-4 flex-shrink-0" />
                <span className="text-blue-200/60 font-bold uppercase tracking-widest">+212 5233-48010</span>
              </li>
              <li className="flex items-center group">
                <Smartphone size={14} className="text-amber-400 mr-4 flex-shrink-0" />
                <span className="text-blue-200/60 font-bold uppercase tracking-widest">07 08 76 00 34</span>
              </li>
              <li className="flex items-center group">
                <Mail size={14} className="text-amber-400 mr-4 flex-shrink-0" />
                <span className="text-blue-200/60 font-bold uppercase tracking-widest">contact@agc.ma</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[12px] uppercase tracking-[0.4em] text-amber-400 mb-10 flex items-center">
              <span className="w-6 h-px bg-amber-400/30 mr-4"></span>
              {t.footer.newsletter}
            </h4>
            <p className="text-blue-200/60 text-[12px] mb-8 font-light leading-relaxed uppercase tracking-widest">{t.footer.newsDesc}</p>
            <form className="space-y-4">
              <input 
                type="email" 
                placeholder={t.footer.emailPlaceholder} 
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:border-amber-400 transition-all text-[12px] uppercase tracking-widest placeholder:text-white/20 text-white" 
              />
              <button className="w-full bg-amber-400 text-blue-950 py-4 rounded-full font-bold uppercase tracking-widest text-[13px] hover:bg-white transition-all duration-500 shadow-xl shadow-amber-400/10 active:scale-95">
                {t.footer.subscribe}
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-12 pb-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-blue-200/40 text-[9px] font-bold uppercase tracking-[0.2em]">
            &copy; 2026 Georges Claude Private Academy. {t.footer.rights}
          </p>
          <div className="flex space-x-8 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200/40">
            <Link to="/mentions-legales" className="hover:text-amber-400 transition-colors duration-300">
              {t.legal.title}
            </Link>
            <Link to="/politique-confidentialite" className="hover:text-amber-400 transition-colors duration-300">
              {t.privacy.title}
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Colored Lines */}
      <div className="flex flex-col">
        <div className="h-[5px] w-full bg-[#E31E24]"></div>
        <div className="h-[5px] w-full bg-[#FFD700]"></div>
        <div className="h-[5px] w-full bg-[#0054A6]"></div>
      </div>
    </footer>
  );
};
