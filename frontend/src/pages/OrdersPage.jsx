import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { listMyOrders } from '../api/orders.api';
import { useFetch } from '../hooks/useFetch';
import { useLang } from '../i18n/LanguageContext';
import { formatDate, formatPrice } from '../utils/format';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

const PAYABLE_STATUSES = ['PENDING_PAYMENT', 'PAYMENT_FAILED'];

export default function OrdersPage() {
  const location = useLocation();
  const { t } = useLang();
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useFetch(() => listMyOrders({ page }), [page]);

  return (
    <>
      <div className="page-header">
        <h1>{t.PAGE_ORDERS}</h1>
      </div>

      {location.state?.notice && <div className="alert alert-info">{location.state.notice}</div>}

      {loading && <Loader label={t.LOADING_ORDERS} />}
      {!loading && error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && data?.items?.length === 0 && (
        <EmptyState title={t.EMPTY_ORDERS_TITLE} hint={t.EMPTY_ORDERS_HINT}>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>{t.BTN_BROWSE}</Link>
        </EmptyState>
      )}
      {!loading && !error && data?.items?.length > 0 && (
        <>
          {data.items.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-head">
                <div>
                  <strong>{t.ORDER_NO(order._id.slice(-8).toUpperCase())}</strong>
                  <p className="muted">{formatDate(order.createdAt)}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <ul className="order-items">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} × {item.quantity} — {formatPrice(item.price * item.quantity)}
                  </li>
                ))}
              </ul>
              <div className="order-foot">
                <strong>{formatPrice(order.totalPrice)}</strong>
                {PAYABLE_STATUSES.includes(order.status) && (
                  <Link to={`/payment/${order._id}`} className="btn btn-primary btn-sm">
                    {order.status === 'PAYMENT_FAILED' ? t.BTN_PAY_RETRY : t.BTN_PAY}
                  </Link>
                )}
              </div>
            </div>
          ))}
          <Pagination pagination={data.pagination} onPage={setPage} />
        </>
      )}
    </>
  );
}
