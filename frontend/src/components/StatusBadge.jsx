const STATUS_CONFIG = {
  PENDING_PAYMENT: { label: 'Ödeme Bekliyor', className: 'badge-warning' },
  PAID: { label: 'Ödendi', className: 'badge-info' },
  PAYMENT_FAILED: { label: 'Ödeme Başarısız', className: 'badge-danger' },
  SHIPPED: { label: 'Kargoda', className: 'badge-primary' },
  DELIVERED: { label: 'Teslim Edildi', className: 'badge-success' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'badge-info' };
  return <span className={`badge ${config.className}`}>{config.label}</span>;
}
