import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, lazy, Suspense, ReactNode } from 'react';
import { motion } from 'motion/react';
import ReactGA from 'react-ga4';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { IMG } from './content/site';

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
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

const PageLoader = () => (
  <div className="fixed inset-0 z-[60] bg-ink flex flex-col items-center justify-center gap-6" role="status" aria-live="polite">
    <img src={IMG.logo} alt="" className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
    <span className="w-24 h-px bg-white/15 overflow-hidden"><span className="block h-full bg-saffron origin-left" style={{ animation: 'loader-bar 1.4s cubic-bezier(.16,1,.3,1) infinite' }} /></span>
    <span className="sr-only">Chargement</span>
  </div>
);

const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80); return; }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
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
    <Suspense fallback={<PageLoader />}>
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
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
      {!isAdmin && <Header />}
      <div className="flex-grow">
        <AppRoutes />
      </div>
      {!isAdmin && <Footer />}
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
