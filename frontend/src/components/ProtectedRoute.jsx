import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Giriş ve (opsiyonel) rol şartı koyan route sarmalayıcısı.
// Kullanım: <ProtectedRoute roles={['seller']}><SellerDashboardPage /></ProtectedRoute>
export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Girişten sonra kaldığı yere dönebilmesi için hedefi state'te taşı
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
