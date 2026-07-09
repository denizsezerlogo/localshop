import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n/LanguageContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Zaten girişliyse rolüne uygun sayfaya yönlendir
  if (user) return <Navigate to={user.role === 'seller' ? '/seller' : '/'} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedIn = await login(email, password);
      const fallback = loggedIn.role === 'seller' ? '/seller' : '/';
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setError(err.message);
      setPassword(''); // başarısız denemede parola ekranda bırakılmaz
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card auth-card">
      <h1 style={{ marginBottom: 16 }}>{t.LOGIN_TITLE}</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">{t.FIELD_EMAIL}</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.PH_EMAIL} required />
        </div>
        <div className="field">
          <label htmlFor="password">{t.FIELD_PASSWORD}</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.PH_PASSWORD_LOGIN} required />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? t.BUSY_LOGIN : t.BTN_LOGIN}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16, textAlign: 'center' }}>
        {t.AUTH_NO_ACCOUNT}{' '}
        <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{t.LINK_REGISTER}</Link>
      </p>
    </div>
  );
}
