import { BrowserRouter, HashRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, lazy, Suspense, ReactNode } from 'react';
import { motion } from 'motion/react';
import ReactGA from 'react-ga4';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Preloader, RouteProgress } from './components/Preloader';
import { BackToTop } from './components/BackToTop';
import { IMG } from './content/site';

// Build d'aperçu autonome : navigation par #/ (voir vite.preview.config.ts)
const Router = import.meta.env.VITE_HASH_ROUTER === '1' ? HashRouter : BrowserRouter;

const Home = lazy(() => import('./pages/Home'));
const Academy = lazy(() => import('./pages/Academy'));
const ProgramsPage = lazy(() => import('./pages/Programs'));
const CyclePage = lazy(() => import('./pages/Cycle'));
const LifePage = lazy(() => import('./pages/Life'));
const SpacePage = lazy(() => import('./pages/Space'));
const NewsPage = lazy(() => import('./pages/News'));
const ArticlePage = lazy(() => import('./pages/Article'));
const GalleryPage = lazy(() => import('./pages/Gallery'));
const EnrollmentPage = lazy(() => import('./pages/Enrollment'));
const ContactPage = lazy(() => import('./pages/Contact'));
const RecruitmentPage = lazy(() => import('./pages/Recruitment'));
const PartnersPage = lazy(() => import('./pages/Partners'));
const LegalPage = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminApp = lazy(() => import('./admin/AdminApp'));

const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    if (!hash) return;
    // La page est chargée à la demande : on attend que la section existe avant d'y descendre.
    let tries = 0;
    let timer = 0;
    const seek = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) { timer = window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250); return; }
      if (tries++ < 40) timer = window.setTimeout(seek, 75);
    };
    seek();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
  return null;
};

/** Transition de page : fondu court (opacité uniquement, pas de reflow) */
const PageTransition = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

const LegacySpaceRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/espaces/${slug}`} replace />;
};

const AppRoutes = () => {
  const { currentLang } = useLanguage();
  return (
    <Suspense fallback={<RouteProgress />}>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/academie" element={<Academy />} />
          <Route path="/programmes" element={<ProgramsPage />} />
          <Route path="/programmes/:id" element={<CyclePage key={currentLang} />} />
          <Route path="/vie-scolaire" element={<LifePage />} />
          <Route path="/espaces/:slug" element={<SpacePage />} />
          <Route path="/spaces/:slug" element={<LegacySpaceRedirect />} />
          <Route path="/actualites" element={<NewsPage />} />
          <Route path="/actualites/:id" element={<ArticlePage />} />
          <Route path="/galerie" element={<GalleryPage />} />
          <Route path="/inscription" element={<EnrollmentPage />} />
          <Route path="/admissions" element={<Navigate to="/inscription" replace />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/recrutement" element={<RecruitmentPage />} />
          <Route path="/partenaires" element={<PartnersPage />} />
          <Route path="/mentions-legales" element={<LegalPage kind="legal" />} />
          <Route path="/politique-confidentialite" element={<LegalPage kind="privacy" />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </Suspense>
  );
};

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    if (gaId) ReactGA.initialize(gaId);
  }, []);
  useEffect(() => {
    if (import.meta.env.VITE_GOOGLE_ANALYTICS_ID) ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-salt text-ink">
      {!isAdmin && <Preloader />}
      {!isAdmin && <Header />}
      <div className="flex-grow">
        <AppRoutes />
      </div>
      {!isAdmin && <Footer />}
      {!isAdmin && <BackToTop />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <LanguageProvider>
          <Router>
            <Analytics />
            <ScrollManager />
            <AppContent />
          </Router>
        </LanguageProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
