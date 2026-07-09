import { Link, useNavigate } from 'react-router-dom';
import { createProduct } from '../api/products.api';
import { useLang } from '../i18n/LanguageContext';
import ProductForm from '../components/ProductForm';

export default function AddProductPage() {
  const navigate = useNavigate();
  const { t } = useLang();

  const handleSubmit = async (values) => {
    await createProduct(values);
    navigate('/seller');
  };

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <p style={{ marginBottom: 12 }}>
        <Link to="/seller" className="muted">{t.BACK_TO_SELLER}</Link>
      </p>
      <h1 style={{ marginBottom: 16 }}>{t.PAGE_ADD_PRODUCT}</h1>
      <ProductForm onSubmit={handleSubmit} submitLabel={t.BTN_SUBMIT_ADD} />
    </div>
  );
}
