import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrders } from '../api/orders.api';
import { formatPrice } from '../utils/format';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { MSG } from '../constants/messages';

export default function CartPage() {
  const { cart, total, loading, error: loadError, refreshCart, updateItem, removeItem, clearLocal } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const items = cart?.items || [];

  const changeQuantity = async (productId, quantity) => {
    setError('');
    setBusyId(productId);
    try {
      await updateItem(productId, quantity);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (productId) => {
    setError('');
    setBusyId(productId);
    try {
      await removeItem(productId);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleCheckout = async () => {
    setError('');
    setCheckingOut(true);
    try {
      const res = await createOrders();
      clearLocal();
      const orders = res.data.orders;
      if (orders.length === 1) {
        // Tek sipariş → doğrudan ödeme sayfasına
        navigate(`/payment/${orders[0]._id}`);
      } else {
        // Birden fazla satıcı → siparişler sayfasından tek tek ödenir
        navigate('/orders', { state: { notice: res.message } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  // Boş sepet mesajından ÖNCE yükleme ve hata durumları ele alınır;
  // aksi halde başarısız istek "boş sepet" gibi görünür.
  if (loading) return <Loader label={MSG.LOADING_CART} />;
  if (loadError) return <ErrorMessage message={loadError} onRetry={refreshCart} />;

  if (items.length === 0) {
    return (
      <EmptyState title={MSG.EMPTY_CART_TITLE} hint={MSG.EMPTY_CART_HINT}>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>Ürünlere göz at</Link>
      </EmptyState>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Sepetim</h1>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        {items.map((item) => {
          const product = item.productId; // populate edilmiş ürün
          return (
            <div className="cart-row" key={product._id}>
              <div>
                <Link to={`/products/${product._id}`} style={{ fontWeight: 600 }}>{product.name}</Link>
                <p className="muted">{formatPrice(product.price)} / adet</p>
              </div>
              <div className="qty-picker">
                <button
                  type="button"
                  disabled={busyId === product._id || item.quantity <= 1}
                  onClick={() => changeQuantity(product._id, item.quantity - 1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  disabled={busyId === product._id || item.quantity >= product.stock}
                  onClick={() => changeQuantity(product._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <strong>{formatPrice(product.price * item.quantity)}</strong>
              <button className="btn btn-danger btn-sm" disabled={busyId === product._id} onClick={() => handleRemove(product._id)}>
                Kaldır
              </button>
            </div>
          );
        })}

        <div className="cart-summary">
          <span className="cart-total">Toplam: {formatPrice(total)}</span>
          <button className="btn btn-primary" onClick={handleCheckout} disabled={checkingOut}>
            {checkingOut ? MSG.BUSY_CHECKOUT : 'Siparişi Tamamla'}
          </button>
        </div>
      </div>
    </>
  );
}
