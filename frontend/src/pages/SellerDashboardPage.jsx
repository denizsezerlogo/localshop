import { useState } from 'react';
import { Link } from 'react-router-dom';
import { listMyProducts, deleteProduct } from '../api/products.api';
import { listSellerOrders, updateOrderStatus } from '../api/orders.api';
import { useFetch } from '../hooks/useFetch';
import { formatDate, formatPrice } from '../utils/format';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { MSG } from '../constants/messages';

export default function SellerDashboardPage() {
  const [tab, setTab] = useState('products');

  return (
    <>
      <div className="page-header">
        <h1>Satıcı Paneli</h1>
        <Link to="/seller/products/new" className="btn btn-primary">+ Yeni Ürün</Link>
      </div>

      <div className="tabs" role="tablist">
        <button role="tab" className={`tab${tab === 'products' ? ' active' : ''}`} onClick={() => setTab('products')}>
          Ürünlerim
        </button>
        <button role="tab" className={`tab${tab === 'orders' ? ' active' : ''}`} onClick={() => setTab('orders')}>
          Gelen Siparişler
        </button>
      </div>

      {tab === 'products' ? <ProductsTab /> : <OrdersTab />}
    </>
  );
}

function ProductsTab() {
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState('');
  const { data, loading, error, refetch } = useFetch(() => listMyProducts({ page }), [page]);

  const handleDelete = async (product) => {
    if (!window.confirm(MSG.DELETE_PRODUCT_CONFIRM(product.name))) return;
    setActionError('');
    try {
      await deleteProduct(product._id);
      refetch();
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (loading) return <Loader label={MSG.LOADING_PRODUCTS} />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (data.items.length === 0) {
    return (
      <EmptyState title={MSG.EMPTY_SELLER_PRODUCTS_TITLE} hint={MSG.EMPTY_SELLER_PRODUCTS_HINT}>
        <Link to="/seller/products/new" className="btn btn-primary" style={{ marginTop: 12 }}>Ürün Ekle</Link>
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
              <th>Ürün</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((product) => (
              <tr key={product._id}>
                <td>
                  <Link to={`/products/${product._id}`} style={{ fontWeight: 600 }}>{product.name}</Link>
                </td>
                <td>{product.category}</td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.stock === 0 ? <span className="stock-out">Tükendi</span> : product.stock}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/seller/products/${product._id}/edit`} className="btn btn-outline btn-sm">Düzenle</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product)}>Sil</button>
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

  if (loading) return <Loader label={MSG.LOADING_ORDERS} />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (data.items.length === 0) {
    return <EmptyState title={MSG.EMPTY_SELLER_ORDERS_TITLE} hint={MSG.EMPTY_SELLER_ORDERS_HINT} />;
  }

  return (
    <>
      {actionError && <div className="alert alert-error">{actionError}</div>}
      {data.items.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-head">
            <div>
              <strong>Sipariş #{order._id.slice(-8).toUpperCase()}</strong>
              <p className="muted">
                {formatDate(order.createdAt)}
                {order.userId?.name && ` · Müşteri: ${order.userId.name}`}
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
                  Kargoya Ver
                </button>
              )}
              {order.status === 'SHIPPED' && (
                <button className="btn btn-primary btn-sm" disabled={busyId === order._id} onClick={() => handleStatus(order._id, 'DELIVERED')}>
                  Teslim Edildi Olarak İşaretle
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
