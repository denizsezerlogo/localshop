import { useLang } from '../i18n/LanguageContext';

export default function Pagination({ pagination, onPage }) {
  const { t } = useLang();
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages } = pagination;

  return (
    <div className="pagination">
      <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        {t.BTN_PREV}
      </button>
      <span className="muted">{t.PAGE_OF(page, pages)}</span>
      <button className="btn btn-outline btn-sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        {t.BTN_NEXT}
      </button>
    </div>
  );
}
