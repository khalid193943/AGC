import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { WordReveal } from '../components/ui/motion';
import { Seo } from '../components/ui';

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <main className="bg-ink text-salt on-dark min-h-[80svh] flex items-end grain relative overflow-hidden">
      <Seo title="404 | Georges Claude Private Academy" description={t.ui.notFound} />
      <div className="wrap pb-20" style={{ paddingTop: 'calc(var(--header-h) + 6rem)' }}>
        <p className="t-num text-saffron">404</p>
        <h1 className="t-h1 mt-6 max-w-[14ch]"><WordReveal text={t.ui.notFound} inView={false} /></h1>
        <p className="t-lead text-sea mt-6 max-w-[40ch]">{t.ui.notFoundDesc}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/" className="btn btn-saffron btn-lg">{t.ui.backHome}</Link>
          <Link to="/contact" className="btn btn-ghost-light btn-lg">{t.nav.contact}</Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
