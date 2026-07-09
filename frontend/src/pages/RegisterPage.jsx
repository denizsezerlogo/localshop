import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={user.role === 'seller' ? '/seller' : '/'} replace />;

  const set = (key) => (e) => setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const created = await register(values);
      navigate(created.role === 'seller' ? '/seller' : '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card auth-card">
      <h1 style={{ marginBottom: 16 }}>Kayıt Ol</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Ad Soyad</label>
          <input id="name" value={values.name} onChange={set('name')} placeholder="Adınız Soyadınız" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={values.email} onChange={set('email')} placeholder="ornek@mail.com" required />
        </div>
        <div className="field">
          <label htmlFor="password">Parola</label>
          <input id="password" type="password" value={values.password} onChange={set('password')} placeholder="En az 6 karakter" required />
        </div>
        <div className="field">
          <label>Hesap türü</label>
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" name="role" value="customer" checked={values.role === 'customer'} onChange={set('role')} />
              <span>
                Müşteri
                <small>Ürünleri keşfet ve satın al</small>
              </span>
            </label>
            <label className="radio-option">
              <input type="radio" name="role" value="seller" checked={values.role === 'seller'} onChange={set('role')} />
              <span>
                Satıcı
                <small>Ürünlerini sat</small>
              </span>
            </label>
          </div>
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? 'Kayıt yapılıyor…' : 'Kayıt Ol'}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16, textAlign: 'center' }}>
        Zaten hesabın var mı? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Giriş yap</Link>
      </p>
    </div>
  );
}
