import { useState } from 'react';
import { Link } from 'react-router-dom';
import { listMyProducts, deleteProduct } from '../api/products.api';
import { listSellerOrders, updateOrderStatus } from '../api/orders.api';
import { useFetch } from '../hooks/useFetch';
import { useLang } from '../i18n/LanguageContext';
import { formatDate, formatPrice } from '../utils/format';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

export default function SellerDashboardPage() {
  const { t } = useLang();
  const [tab, setTab] = useState('products');

  return (
    <>
      <div className="page-header">
        <h1>{t.PAGE_SELLER}</h1>
        <Link to="/seller/products/new" className="btn btn-primary">{t.BTN_NEW_PRODUCT}</Link>
      </div>

      <div className="tabs" role="tablist">
        <button role="tab" className={`tab${tab === 'products' ? ' active' : ''}`} onClick={() => setTab('products')}>
          {t.TAB_PRODUCTS}
        </button>
        <button role="tab" className={`tab${tab === 'orders' ? ' active' : ''}`} onClick={() => setTab('orders')}>
          {t.TAB_ORDERS}
        </button>
      </div>

      {tab === 'products' ? <ProductsTab /> : <OrdersTab />}
    </>
  );
}

function ProductsTab() {
  const { t } = useLang();
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState('');
  const { data, loading, error, refetch } = useFetch(() => listMyProducts({ page }), [page]);

  const handleDelete = async (product) => {
    if (!window.confirm(t.DELETE_PRODUCT_CONFIRM(product.name))) return;
    setActionError('');
    try {
      await deleteProduct(product._id);
      refetch();
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (loading) return <Loader label={t.LOADING_PRODUCTS} />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (data.items.length === 0) {
    return (
      <EmptyState title={t.EMPTY_SELLER_PRODUCTS_TITLE} hint={t.EMPTY_SELLER_PRODUCTS_HINT}>
        <Link to="/seller/products/new" className="btn btn-primary" style={{ marginTop: 12 }}>{t.BTN_ADD_FIRST}</Link>
      </EmptyState>
    );
  }

  return (
    <>
      {actionError && <div className="alert alert-error">{actionError}</div>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.TH_PRODUCT}</th>
              <th>{t.TH_CATEGORY}</th>
              <th>{t.TH_PRICE}</th>
              <th>{t.TH_STOCK}</th>
              <th>{t.TH_ACTIONS}</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((product) => (
              <tr key={product._id}>
                <td>
                  <Link to={`/products/${product._id}`} style={{ fontWeight: 600 }}>{product.name}</Link>
                </td>
                <td>{t.CATEGORY_LABELS[product.category] || product.category}</td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.stock === 0 ? <span className="stock-out">{t.STOCK_OUT}</span> : product.stock}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/seller/products/${product._id}/edit`} className="btn btn-outline btn-sm">{t.BTN_EDIT}</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product)}>{t.BTN_DELETE}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination pagination={data.pagination} onPage={setPage} />
    </>
  );
}

function OrdersTab() {
  const { t } = useLang();
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const { data, loading, error, refetch } = useFetch(() => listSellerOrders({ page }), [page]);

  const handleStatus = async (orderId, status) => {
    setActionError('');
    setBusyId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      refetch();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loader label={t.LOADING_ORDERS} />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (data.items.length === 0) {
    return <EmptyState title={t.EMPTY_SELLER_ORDERS_TITLE} hint={t.EMPTY_SELLER_ORDERS_HINT} />;
  }

  return (
    <>
      {actionError && <div className="alert alert-error">{actionError}</div>}
      {data.items.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-head">
            <div>
              <strong>{t.ORDER_NO(order._id.slice(-8).toUpperCase())}</strong>
              <p className="muted">
                {formatDate(order.createdAt)}
                {order.userId?.name && ` · ${t.CUSTOMER_PREFIX(order.userId.name)}`}
              </p>
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
            <div style={{ display: 'flex', gap: 8 }}>
              {order.status === 'PAID' && (
                <button className="btn btn-primary btn-sm" disabled={busyId === order._id} onClick={() => handleStatus(order._id, 'SHIPPED')}>
                  {t.BTN_SHIP}
                </button>
              )}
              {order.status === 'SHIPPED' && (
                <button className="btn btn-primary btn-sm" disabled={busyId === order._id} onClick={() => handleStatus(order._id, 'DELIVERED')}>
                  {t.BTN_DELIVER}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      <Pagination pagination={data.pagination} onPage={setPage} />
    </>
  );
}
