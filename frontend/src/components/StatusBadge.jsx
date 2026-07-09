import { useLang } from '../i18n/LanguageContext';

const STATUS_CLASSES = {
  PENDING_PAYMENT: 'badge-warning',
  PAID: 'badge-info',
  PAYMENT_FAILED: 'badge-danger',
  SHIPPED: 'badge-primary',
  DELIVERED: 'badge-success',
};

export default function StatusBadge({ status }) {
  const { t } = useLang();
  return (
    <span className={`badge ${STATUS_CLASSES[status] || 'badge-info'}`}>
      {t.STATUS[status] || status}
    </span>
  );
}
