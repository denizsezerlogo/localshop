import { Link, useNavigate } from 'react-router-dom';
import { createProduct } from '../api/products.api';
import ProductForm from '../components/ProductForm';

export default function AddProductPage() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    await createProduct(values);
    navigate('/seller');
  };

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <p style={{ marginBottom: 12 }}>
        <Link to="/seller" className="muted">← Satıcı paneline dön</Link>
      </p>
      <h1 style={{ marginBottom: 16 }}>Yeni Ürün Ekle</h1>
      <ProductForm onSubmit={handleSubmit} submitLabel="Ürünü Ekle" />
    </div>
  );
}
