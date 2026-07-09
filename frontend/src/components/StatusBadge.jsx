import { STATUS_LABELS } from '../constants/messages';

const STATUS_CLASSES = {
  PENDING_PAYMENT: 'badge-warning',
  PAID: 'badge-info',
  PAYMENT_FAILED: 'badge-danger',
  SHIPPED: 'badge-primary',
  DELIVERED: 'badge-success',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_CLASSES[status] || 'badge-info'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
