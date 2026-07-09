import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLang } from '../i18n/LanguageContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Local<span>Shop</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end className={navClass}>
            {t.NAV_PRODUCTS}
          </NavLink>

          {user?.role === 'customer' && (
            <>
              <NavLink to="/cart" className={navClass}>
                {t.NAV_CART}
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </NavLink>
              <NavLink to="/orders" className={navClass}>
                {t.NAV_ORDERS}
              </NavLink>
            </>
          )}

          {user?.role === 'seller' && (
            <NavLink to="/seller" className={navClass}>
              {t.NAV_SELLER_PANEL}
            </NavLink>
          )}

          {user ? (
            <>
              <span className="nav-user">{user.name}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                {t.NAV_LOGOUT}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>
                {t.NAV_LOGIN}
              </NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                {t.NAV_REGISTER}
              </Link>
            </>
          )}

          {/* Dil değiştirici */}
          <div className="lang-switch" role="group" aria-label="Language">
            <button
              className={`lang-btn${lang === 'tr' ? ' active' : ''}`}
              onClick={() => setLang('tr')}
            >
              TR
            </button>
            <button
              className={`lang-btn${lang === 'en' ? ' active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
