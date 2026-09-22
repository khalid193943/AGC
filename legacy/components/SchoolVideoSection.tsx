import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Volume2, VolumeX, Play, Pause, Maximize } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SchoolVideoSectionProps {
  videoUrl?: string; // URL de la vidéo
}

export default function SchoolVideoSection({ videoUrl = "https://res.cloudinary.com/ddvgp1zrz/video/upload/v1779369814/presentation_q1lmet.mp4" }: SchoolVideoSectionProps) {
  const { language, currentLang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  
  // Détecte si la section est visible à l'écran
  const isInView = useInView(ref, { amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      // Lance la vidéo quand l'utilisateur arrive sur la section
      desktopVideoRef.current?.play().catch(e => console.log("L'autoplay a été bloqué par le navigateur:", e));
      mobileVideoRef.current?.play().catch(e => console.log("L'autoplay a été bloqué par le navigateur:", e));
      setIsPlaying(true);
    } else {
      // Met en pause quand on quitte la section
      desktopVideoRef.current?.pause();
      mobileVideoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isInView]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (desktopVideoRef.current) desktopVideoRef.current.muted = nextMuted;
    if (mobileVideoRef.current) mobileVideoRef.current.muted = nextMuted;
  };

  const togglePlay = () => {
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    if (nextPlaying) {
      desktopVideoRef.current?.play().catch(() => {});
      mobileVideoRef.current?.play().catch(() => {});
    } else {
      desktopVideoRef.current?.pause();
      mobileVideoRef.current?.pause();
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    
    if (desktopVideoRef.current && desktopVideoRef.current.duration) {
      desktopVideoRef.current.currentTime = (value / 100) * desktopVideoRef.current.duration;
    }
    if (mobileVideoRef.current && mobileVideoRef.current.duration) {
      mobileVideoRef.current.currentTime = (value / 100) * mobileVideoRef.current.duration;
    }
  };

  const toggleFullscreen = () => {
    const isMobile = window.innerWidth < 768;
    const videoElement = isMobile ? mobileVideoRef.current : desktopVideoRef.current;
    const container = ref.current;

    if (!document.fullscreenElement && container) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(err => {
          // Fallback to video directly for iOS
          if (videoElement && (videoElement as any).webkitEnterFullscreen) {
            (videoElement as any).webkitEnterFullscreen();
          }
        });
      } else if (videoElement && (videoElement as any).webkitEnterFullscreen) {
        (videoElement as any).webkitEnterFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <section ref={ref} className="w-full bg-slate-50 flex flex-col">
      {/* Title Header */}
      <div className="w-full py-16 px-6 md:py-24 z-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="max-w-7xl mx-auto flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="w-12 h-px bg-blue-900/30"></div>
            <span className="text-blue-900 font-bold uppercase tracking-[0.4em] text-[11px]">
              {currentLang === 'FR' ? "L'Académie en vidéo" : "The Academy in Motion"}
            </span>
            <div className="w-12 h-px bg-blue-900/30"></div>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-blue-950 tracking-tight">
            {currentLang === 'FR' ? (
              <>Découvrez <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 italic">Notre Univers</span></>
            ) : (
              <>Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 italic">Our Universe</span></>
            )}
          </h2>
        </motion.div>
      </div>

      {/* Video Container */}
      <div className="relative w-full aspect-video bg-black overflow-hidden group">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          {/* Desktop Video */}
          <video 
            ref={desktopVideoRef}
            className="absolute inset-0 w-full h-full object-cover hidden md:block" 
            muted={isMuted} // Must be muted for autoplay to work seamlessly on all browsers
            autoPlay
            loop
            playsInline
            crossOrigin="anonymous"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>

          {/* Mobile Video */}
          <video 
            ref={mobileVideoRef}
            className="absolute inset-0 w-full h-full object-cover md:hidden" 
            muted={isMuted} // Must be muted for autoplay to work seamlessly on all browsers
            autoPlay
            loop
            playsInline
            crossOrigin="anonymous"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>

        {/* Control Palette Overlay (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full z-20 pb-8 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:pb-12 focus-within:opacity-100">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
            <div className="flex items-center space-x-4 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-6 py-4 md:py-3 transition-all duration-300 w-full shadow-2xl">
              <button onClick={togglePlay} className="text-white hover:text-amber-400 transition-colors focus:outline-none shrink-0" aria-label="Play/Pause">
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              
              <input 
                type="range"
                min="0"
                max="100"
                value={progress || 0}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/30 rounded-full outline-none appearance-none cursor-pointer accent-amber-400"
                aria-label="Progress"
              />

              <button onClick={toggleMute} className="text-white hover:text-amber-400 transition-colors focus:outline-none shrink-0" aria-label="Mute/Unmute">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <button onClick={toggleFullscreen} className="text-white hover:text-amber-400 transition-colors focus:outline-none shrink-0 border-l border-white/20 pl-4 ml-2" aria-label="Fullscreen">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
