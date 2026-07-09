import { useState } from 'react';
import { MSG } from '../constants/messages';

// Ürün ekleme ve düzenleme sayfalarının ortak formu.
// initialValues verilirse düzenleme modunda çalışır.
export default function ProductForm({ initialValues, onSubmit, submitLabel = 'Kaydet' }) {
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
    if (values.name.trim().length < 2) return 'Ürün adı en az 2 karakter olmalı';
    if (!values.description.trim()) return 'Açıklama zorunludur';
    const price = Number(values.price);
    if (values.price === '' || !Number.isFinite(price) || price < 0) return 'Geçerli bir fiyat girin (0 veya üzeri)';
    const stock = Number(values.stock);
    if (values.stock === '' || !Number.isInteger(stock) || stock < 0) return 'Stok 0 veya daha büyük bir tam sayı olmalı';
    if (values.category.trim().length < 2) return 'Kategori en az 2 karakter olmalı';
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
        category: values.category.trim().toLowerCase(),
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
        <label htmlFor="name">Ürün adı</label>
        <input id="name" value={values.name} onChange={set('name')} placeholder="Örn. Organik Çiçek Balı" required />
      </div>

      <div className="field">
        <label htmlFor="description">Açıklama</label>
        <textarea id="description" rows={4} value={values.description} onChange={set('description')} placeholder="Ürünü kısaca tanıtın" required />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="price">Fiyat (₺)</label>
          <input id="price" type="number" min="0" step="0.01" value={values.price} onChange={set('price')} required />
        </div>
        <div className="field">
          <label htmlFor="stock">Stok</label>
          <input id="stock" type="number" min="0" step="1" value={values.stock} onChange={set('stock')} required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="category">Kategori</label>
        <input id="category" value={values.category} onChange={set('category')} placeholder="Örn. food, cosmetics, crafts" required />
      </div>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? MSG.BUSY_SAVING : submitLabel}
      </button>
    </form>
  );
}
