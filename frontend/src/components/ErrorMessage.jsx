import { useLang } from '../i18n/LanguageContext';

export default function ErrorMessage({ message, onRetry }) {
  const { t } = useLang();
  return (
    <div className="alert alert-error">
      <p>{message || t.ERROR_FALLBACK}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }} onClick={onRetry}>
          {t.RETRY}
        </button>
      )}
    </div>
  );
}
