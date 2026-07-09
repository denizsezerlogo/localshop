import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';
import { MSG } from '../constants/messages';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <span className="category">{product.category}</span>
      <h3>{product.name}</h3>
      {product.sellerId?.name && <span className="seller">Satıcı: {product.sellerId.name}</span>}
      {product.stock === 0 ? (
        <span className="stock-out">{MSG.STOCK_OUT}</span>
      ) : (
        product.stock <= 5 && <span className="stock-note">{MSG.STOCK_LAST(product.stock)}</span>
      )}
      <span className="price">{formatPrice(product.price)}</span>
    </Link>
  );
}
