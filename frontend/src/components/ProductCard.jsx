import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';
import { useLang } from '../i18n/LanguageContext';

export default function ProductCard({ product }) {
  const { t } = useLang();
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <span className="category">{t.CATEGORY_LABELS[product.category] || product.category}</span>
      <h3>{product.name}</h3>
      {product.sellerId?.name && <span className="seller">{t.SELLER_PREFIX(product.sellerId.name)}</span>}
      {product.stock === 0 ? (
        <span className="stock-out">{t.STOCK_OUT}</span>
      ) : (
        product.stock <= 5 && <span className="stock-note">{t.STOCK_LAST(product.stock)}</span>
      )}
      <span className="price">{formatPrice(product.price)}</span>
    </Link>
  );
}
