import { useLang } from '../i18n/LanguageContext';

export default function Loader({ label }) {
  const { t } = useLang();
  return (
    <div className="loader-wrap" role="status">
      <div className="spinner" />
      <span>{label || t.LOADING}</span>
    </div>
  );
}
