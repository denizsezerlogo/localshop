import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Local<span>Shop</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Ürünler
          </NavLink>

          {user?.role === 'customer' && (
            <>
              <NavLink to="/cart" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                Sepet{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </NavLink>
              <NavLink to="/orders" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                Siparişlerim
              </NavLink>
            </>
          )}

          {user?.role === 'seller' && (
            <NavLink to="/seller" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Satıcı Paneli
            </NavLink>
          )}

          {user ? (
            <>
              <span className="nav-user">{user.name}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Çıkış
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                Giriş
              </NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                Kayıt Ol
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
