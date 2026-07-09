import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useLang } from '../i18n/LanguageContext';

export default function NotFoundPage() {
  const { t } = useLang();
  return (
    <EmptyState title={t.NOT_FOUND_TITLE} hint={t.NOT_FOUND_HINT}>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>
        {t.BTN_BACK_PRODUCTS}
      </Link>
    </EmptyState>
  );
}
