// Merkezi HTTP istemcisi — sayfalar axios'u doğrudan kullanmaz, bu katmandan geçer.
import axios from 'axios';
import { getCurrentLang, getDict } from '../i18n/LanguageContext';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Her isteğe JWT + istek dili ekle (backend mesajları arayüz diliyle aynı gelsin)
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Accept-Language'] = getCurrentLang();
  return config;
});

// Yanıtları sadeleştir: çağıranlar doğrudan { success, data, message } alır.
// 401 gelirse (süresi dolmuş/geçersiz oturum) oturum temizlenir ve login'e dönülür.
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const hadSession = Boolean(localStorage.getItem('token'));
    if (error.response?.status === 401 && hadSession) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    const message = error.response?.data?.message || getDict().GENERIC_ERROR;
    return Promise.reject(new Error(message));
  }
);

export default client;
