import { useState } from 'react';
import { useLang } from '../i18n/LanguageContext';
import { CATEGORIES } from '../constants/categories';

// Ürün ekleme ve düzenleme sayfalarının ortak formu.
// initialValues verilirse düzenleme modunda çalışır.
export default function ProductForm({ initialValues, onSubmit, submitLabel }) {
  const { t } = useLang();
  const [values, setValues] = useState({
    name: initialValues?.name || '',
    description: initialValues?.description || '',
    price: initialValues?.price ?? '',
    stock: initialValues?.stock ?? '',
    category: initialValues?.category || '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setValues((prev) => ({ ...prev, [key]: e.target.value }));

  // Client tarafı ön kontrol: boş sayı alanı Number('') → 0'a dönüşüp
  // istenmeden ücretsiz ürün / sıfır stok oluşturmasın. Nihai otorite backend validasyonudur.
  const validate = () => {
    if (values.name.trim().length < 2) return t.VAL_PRODUCT_NAME;
    if (!values.description.trim()) return t.VAL_DESC_REQUIRED;
    const price = Number(values.price);
    if (values.price === '' || !Number.isFinite(price) || price < 0) return t.VAL_PRICE;
    const stock = Number(values.stock);
    if (values.stock === '' || !Number.isInteger(stock) || stock < 0) return t.VAL_STOCK;
    if (!CATEGORIES.includes(values.category)) return t.VAL_CATEGORY;
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        name: values.name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        stock: Number(values.stock),
        category: values.category,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="field">
        <label htmlFor="name">{t.FIELD_PRODUCT_NAME}</label>
        <input id="name" value={values.name} onChange={set('name')} placeholder={t.PH_PRODUCT_NAME} required />
      </div>

      <div className="field">
        <label htmlFor="description">{t.FIELD_DESCRIPTION}</label>
        <textarea id="description" rows={4} value={values.description} onChange={set('description')} placeholder={t.PH_DESCRIPTION} required />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="price">{t.FIELD_PRICE}</label>
          <input id="price" type="number" min="0" step="0.01" value={values.price} onChange={set('price')} required />
        </div>
        <div className="field">
          <label htmlFor="stock">{t.FIELD_STOCK}</label>
          <input id="stock" type="number" min="0" step="1" value={values.stock} onChange={set('stock')} required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="category">{t.FIELD_CATEGORY}</label>
        {/* Kategori serbest metin değil, sabit listeden seçilir: veri tutarlı kalır
            ve görünen ad seçili dile göre çevrilebilir */}
        <select id="category" value={values.category} onChange={set('category')} required>
          <option value="" disabled>{t.PH_CATEGORY}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{t.CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? t.BUSY_SAVING : submitLabel}
      </button>
    </form>
  );
}
