import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle2, MapPin, Clock, Users, Shield, BookOpen } from 'lucide-react';

interface SpaceDetailPageProps {
  t: any;
  currentLang: string;
}

const SpaceDetailPage: React.FC<SpaceDetailPageProps> = ({ t, currentLang }) => {
  const { slug } = useParams<{ slug: string }>();

  const spacesData: Record<string, any> = {
    sports: {
      title: currentLang === 'FR' ? 'Infrastructures Sportives de Pointe' : 'State-of-the-Art Sports Facilities',
      heroImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80',
      desc: currentLang === 'FR' 
        ? "Le sport est au cœur de notre projet pédagogique. Nos installations permettent la pratique de plus de 15 disciplines différentes dans des conditions professionnelles."
        : "Sport is at the heart of our pedagogical project. Our facilities allow for the practice of over 15 different disciplines in professional conditions.",
      features: [
        { title: 'Piscine Semi-Olympique', desc: 'Bassin de 25m chauffé avec système de filtration à l\'ozone.' },
        { title: 'Terrain de Foot Synthétique', desc: 'Gazon de dernière génération homologué FIFA.' },
        { title: 'Gymnase Omnisports', desc: 'Parquet en chêne massif pour le basket, volley et hand.' },
        { title: 'Salle de Fitness', desc: 'Équipements cardio et musculation connectés.' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80'
      ]
    },
    labs: {
      title: currentLang === 'FR' ? 'Laboratoires de Sciences' : 'Science Laboratories',
      heroImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80',
      desc: currentLang === 'FR'
        ? "Nos laboratoires offrent aux élèves l'opportunité de passer de la théorie à la pratique grâce à des équipements de pointe et des protocoles de sécurité rigoureux."
        : "Our laboratories offer students the opportunity to move from theory to practice through state-of-the-art equipment and rigorous safety protocols.",
      features: [
        { title: 'Labo de Physique', desc: 'Bancs d\'optique, kits d\'électronique et capteurs numériques.' },
        { title: 'Labo de Chimie', desc: 'Hottes aspirantes, verrerie de précision et réactifs sécurisés.' },
        { title: 'Labo de SVT', desc: 'Microscopes binoculaires et modèles anatomiques 3D.' },
        { title: 'Espace Robotique', desc: 'Imprimantes 3D et kits de programmation Arduino/LEGO.' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80'
      ]
    },
    library: {
      title: currentLang === 'FR' ? 'Médiathèque & Bibliothèque' : 'Media Center & Library',
      heroImage: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80',
      desc: currentLang === 'FR'
        ? "Un sanctuaire du savoir combinant le charme des livres papier et la puissance des ressources numériques."
        : "A sanctuary of knowledge combining the charm of paper books and the power of digital resources.",
      features: [
        { title: 'Fonds Documentaire', desc: 'Plus de 15 000 ouvrages en Français, Anglais et Arabe.' },
        { title: 'Espace Numérique', desc: 'Tablettes et ordinateurs avec accès aux bases de données mondiales.' },
        { title: 'Zone de Lecture', desc: 'Fauteuils ergonomiques et ambiance propice à la concentration.' },
        { title: 'Salle de Travail', desc: 'Espaces modulables pour les projets de groupe.' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1529148482759-b35b25c5f217?auto=format&fit=crop&q=80'
      ]
    }
  };

  const space = slug ? spacesData[slug] : null;

  if (!space) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-4xl font-bold mb-8">Espace non trouvé</h1>
        <Link to="/vie-scolaire" className="text-blue-600 hover:underline">Retour à la vie scolaire</Link>
      </div>
    );
  }

  return (
    <main className="bg-blue-950 text-white">
      <Helmet>
        <title>{`${space.title} | Infrastructures Georges Claude Private Academy El Jadida`}</title>
        <meta name="description" content={`${space.title} à Georges Claude Private Academy d'El Jadida. ${space.desc.substring(0, 120)}...`} />
        <meta property="og:title" content={`${space.title} | Académie Georges Claude Private Academy El Jadida`} />
        <meta property="og:description" content={space.desc.substring(0, 155)} />
        <meta property="og:image" content={space.heroImage} />
        <meta property="og:url" content={`https://agc.ma/espaces/${slug}`} />
        <link rel="canonical" href={`https://agc.ma/espaces/${slug}`} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img 
            src={space.heroImage} 
            alt={`${space.title} - Académie Georges Claude Private Academy El Jadida`} 
            width="1920"
            height="1080"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-30 scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-blue-950/80 to-blue-950"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.8)_100%)]"></div>
        </div>
        
        <div className="container-wide relative z-10 w-full">
          <Link 
            to="/vie-scolaire" 
            className="inline-flex items-center space-x-2 text-white/60 hover:text-amber-400 transition-colors mb-12 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span className="font-bold uppercase tracking-widest text-[10px] md:text-xs">Retour à la vie scolaire</span>
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-px w-12 bg-amber-400"></div>
                <span className="text-amber-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">Espaces d'excellence</span>
              </div>
              <h1 className="text-white mb-8 font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-none">
                {space.title}
              </h1>
            </motion.div>

            <div className="hidden lg:flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="w-48 h-48 md:w-64 md:h-64 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 flex items-center justify-center text-amber-400 shadow-2xl relative group"
              >
                <div className="absolute inset-0 bg-amber-400/20 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <BookOpen size={120} className="relative z-10" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-20">
            <div className="lg:col-span-7">
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-px w-12 bg-amber-500"></div>
                <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-xs">Détails de l'espace</span>
              </div>
              <p className="text-2xl text-slate-600 font-light leading-relaxed mb-12">
                {space.desc}
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                {space.features.map((feature: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <CheckCircle2 className="text-amber-500 mb-6" size={32} />
                    <h4 className="text-xl font-bold text-blue-950 mb-3">{feature.title}</h4>
                    <p className="text-slate-500 text-sm font-light leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-blue-950 rounded-[3rem] p-12 text-white sticky top-32">
                <h3 className="text-3xl font-bold mb-10 tracking-tight">Informations Pratiques</h3>
                <div className="space-y-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-amber-400" size={24} />
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Localisation</p>
                      <p className="text-lg font-light">Bâtiment C, Aile Nord - Georges Claude Private Academy</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Clock className="text-amber-400" size={24} />
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Horaires d'accès</p>
                      <p className="text-lg font-light">Lundi - Vendredi : 08h00 - 18h30</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Users className="text-amber-400" size={24} />
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Capacité</p>
                      <p className="text-lg font-light">Jusqu'à 150 élèves simultanément</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Shield className="text-amber-400" size={24} />
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Sécurité</p>
                      <p className="text-lg font-light">Présence permanente d'un superviseur qualifié</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-12 bg-amber-400 text-blue-950 py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-white transition-all">
                  Réserver une visite
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container-wide">
          <div className="flex items-center space-x-4 mb-12">
            <div className="h-px w-12 bg-amber-500"></div>
            <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-xs">Galerie Photos</span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {space.gallery.map((img: string, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl group"
              >
                <img 
                  src={img} 
                  alt={`${space.title} ${idx + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SpaceDetailPage;
