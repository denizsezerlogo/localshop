import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct } from '../api/products.api';
import { useFetch } from '../hooks/useFetch';
import ProductForm from '../components/ProductForm';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch(() => getProduct(id), [id]);

  if (loading) return <Loader label="Ürün yükleniyor…" />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const handleSubmit = async (values) => {
    await updateProduct(id, values);
    navigate('/seller');
  };

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <p style={{ marginBottom: 12 }}>
        <Link to="/seller" className="muted">← Satıcı paneline dön</Link>
      </p>
      <h1 style={{ marginBottom: 16 }}>Ürünü Düzenle</h1>
      <ProductForm initialValues={data.product} onSubmit={handleSubmit} submitLabel="Değişiklikleri Kaydet" />
    </div>
  );
}
