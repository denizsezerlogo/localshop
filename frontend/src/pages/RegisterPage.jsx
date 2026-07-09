import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n/LanguageContext';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const { t } = useLang();
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
      <h1 style={{ marginBottom: 16 }}>{t.REGISTER_TITLE}</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">{t.FIELD_NAME}</label>
          <input id="name" value={values.name} onChange={set('name')} placeholder={t.PH_NAME} required />
        </div>
        <div className="field">
          <label htmlFor="email">{t.FIELD_EMAIL}</label>
          <input id="email" type="email" value={values.email} onChange={set('email')} placeholder={t.PH_EMAIL} required />
        </div>
        <div className="field">
          <label htmlFor="password">{t.FIELD_PASSWORD}</label>
          <input id="password" type="password" value={values.password} onChange={set('password')} placeholder={t.PH_PASSWORD_REGISTER} required />
        </div>
        <div className="field">
          <label>{t.FIELD_ROLE}</label>
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" name="role" value="customer" checked={values.role === 'customer'} onChange={set('role')} />
              <span>
                {t.ROLE_CUSTOMER}
                <small>{t.ROLE_CUSTOMER_DESC}</small>
              </span>
            </label>
            <label className="radio-option">
              <input type="radio" name="role" value="seller" checked={values.role === 'seller'} onChange={set('role')} />
              <span>
                {t.ROLE_SELLER}
                <small>{t.ROLE_SELLER_DESC}</small>
              </span>
            </label>
          </div>
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? t.BUSY_REGISTER : t.BTN_REGISTER}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16, textAlign: 'center' }}>
        {t.AUTH_HAVE_ACCOUNT}{' '}
        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{t.LINK_LOGIN}</Link>
      </p>
    </div>
  );
}
