import { createContext, useContext, useEffect, useState } from 'react';
import { loginRequest, registerRequest, meRequest } from '../api/auth.api';

// Oturum durumu tüm uygulamada tek yerden yönetilir.
// Not: Token localStorage'da tutulur; XSS'e karşı üretim ortamında
// httpOnly cookie tabanlı oturum tercih edilebilir.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  // Açılışta localStorage'daki oturum server'a doğrulatılır: kullanıcı silinmiş,
  // token süresi dolmuş veya lokal veri bozulmuşsa UI eski oturumla kalmaz.
  // (401 durumunda API client oturumu temizleyip login'e yönlendirir.)
  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    meRequest()
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      })
      .catch(() => {});
  }, []);

  const saveSession = ({ user: nextUser, token }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (email, password) => {
    const res = await loginRequest({ email, password });
    saveSession(res.data);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await registerRequest(payload);
    saveSession(res.data);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
