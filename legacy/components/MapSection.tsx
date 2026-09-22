import { MapPin, ExternalLink } from 'lucide-react';
import { ASSETS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export const MapSection = () => {
  const { currentLang } = useLanguage();

  return (
    <section className="w-full bg-blue-950 relative border-t border-white/5 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Info Side */}
        <div className="w-full lg:w-1/3 p-12 lg:p-20 flex flex-col justify-center bg-blue-950 text-white relative z-20 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <img src={ASSETS.logo} alt="Logo Georges Claude Private Academy El Jadida" className="h-24 w-auto object-contain mb-12" referrerPolicy="no-referrer" loading="lazy" />
            
            <h3 className="text-[30px] font-bold uppercase tracking-widest mb-6 flex items-center w-[305px] h-[89px]">
              <MapPin className="text-amber-400 mr-4 shrink-0" size={28} />
              {currentLang === 'EN' ? 'Where To Find Us' : 'Où Nous Trouver'}
            </h3>
            
            <p className="text-blue-100/80 leading-relaxed font-light mb-10 text-sm uppercase tracking-widest">
              6FG2+G8 Sidi Bouzid Centre,<br />
              Georges Claude Private Academy,<br />
              Sidi Bouzid 24005
            </p>
            
            <a 
              href="https://maps.app.goo.gl/9MoTY1M49wwjcAzQA" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={currentLang === 'EN' ? 'Open in Google Maps' : 'Ouvrir dans Google Maps'}
              className="inline-flex items-center px-8 py-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-red-600 transition-all duration-500 rounded-full shadow-xl shadow-red-600/20 group"
            >
              {currentLang === 'EN' ? 'Open in Google Maps' : 'Ouvrir dans Google Maps'}
              <ExternalLink size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
        
        {/* Map Side */}
        <div className="w-full lg:w-2/3 h-[400px] lg:h-[600px] relative group overflow-hidden">
          {/* Map Overlay to prevent interaction until click or just for styling */}
          <div className="absolute inset-0 bg-blue-950/10 pointer-events-none z-10 transition-opacity duration-500 group-hover:opacity-0"></div>
          
          <iframe 
            src="https://maps.google.com/maps?q=Acad%C3%A9mie%20Georges%20Claude,%20Sidi%20Bouzid&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation de l'Académie Georges Claude Private Academy à El Jadida"
            className="absolute inset-0 w-full h-full grayscale invert-[0.9] hue-rotate-[180deg] brightness-[0.7] contrast-[1.2] opacity-80 transition-all duration-700 group-hover:grayscale-0 group-hover:invert-0 group-hover:hue-rotate-0 group-hover:brightness-100 group-hover:opacity-100"
          ></iframe>
          
          {/* Decorative border or glow */}
          <div className="absolute inset-0 border-l border-white/5 pointer-events-none z-20"></div>
        </div>
      </div>
    </section>
  );
};
