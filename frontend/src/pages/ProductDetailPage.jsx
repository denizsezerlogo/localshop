import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProduct } from '../api/products.api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const [adding, setAdding] = useState(false);

  const { data, loading, error, refetch } = useFetch(() => getProduct(id), [id]);

  if (loading) return <Loader label="Ürün yükleniyor…" />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const product = data.product;
  const outOfStock = product.stock === 0;

  const handleAdd = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    setAdding(true);
    setNotice('');
    setActionError('');
    try {
      await addItem(product._id, quantity);
      setNotice('Ürün sepete eklendi.');
    } catch (err) {
      setActionError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <p style={{ marginBottom: 16 }}>
        <Link to="/" className="muted">← Ürünlere dön</Link>
      </p>
      <div className="product-detail">
        <div className="card">
          <span className="category" style={{ display: 'inline-block', marginBottom: 10 }}>{product.category}</span>
          <h1 style={{ marginBottom: 8 }}>{product.name}</h1>
          {product.sellerId?.name && <p className="muted" style={{ marginBottom: 12 }}>Satıcı: {product.sellerId.name}</p>}
          <p>{product.description}</p>
        </div>

        <div className="card">
          <p className="price" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: 8 }}>
            {formatPrice(product.price)}
          </p>
          {outOfStock ? (
            <p className="stock-out" style={{ marginBottom: 12 }}>Bu ürün tükendi</p>
          ) : (
            <p className="muted" style={{ marginBottom: 12 }}>Stok: {product.stock} adet</p>
          )}

          {notice && <div className="alert alert-success">{notice} <Link to="/cart" style={{ fontWeight: 700 }}>Sepete git →</Link></div>}
          {actionError && <div className="alert alert-error">{actionError}</div>}

          {user?.role !== 'seller' && !outOfStock && (
            <>
              <div className="field">
                <label>Adet</label>
                <div className="qty-picker">
                  <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</button>
                </div>
              </div>
              <button className="btn btn-primary btn-block" onClick={handleAdd} disabled={adding}>
                {adding ? 'Ekleniyor…' : 'Sepete Ekle'}
              </button>
            </>
          )}
          {user?.role === 'seller' && <p className="muted">Satıcı hesabıyla alışveriş yapılamaz.</p>}
        </div>
      </div>
    </>
  );
}
