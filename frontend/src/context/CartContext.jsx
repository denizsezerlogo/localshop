import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as cartApi from '../api/cart.api';
import { useAuth } from './AuthContext';

// Sepet server'da tutulur (kaynak: /api/cart); bu context güncel kopyayı,
// yükleme/hata durumunu ve sepet işlemlerini paylaşır. Navbar rozeti de buradan beslenir.
// Yükleme hatası yutulmaz: sayfa, hatayı "boş sepet" gibi göstermek yerine
// yeniden deneme imkânıyla kullanıcıya iletir.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isCustomer = user?.role === 'customer';

  const apply = (res) => {
    setCart(res.data.cart);
    setTotal(res.data.total);
  };

  const refreshCart = useCallback(async () => {
    if (!isCustomer) {
      setCart(null);
      setTotal(0);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      apply(await cartApi.getCart());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isCustomer]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (productId, quantity) => apply(await cartApi.addItem(productId, quantity));
  const updateItem = async (productId, quantity) => apply(await cartApi.updateItem(productId, quantity));
  const removeItem = async (productId) => apply(await cartApi.removeItem(productId));

  // Sipariş oluşturulduktan sonra (server sepeti zaten temizledi) lokal kopyayı sıfırla
  const clearLocal = () => {
    setCart((prev) => (prev ? { ...prev, items: [] } : prev));
    setTotal(0);
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, total, itemCount, loading, error, refreshCart, addItem, updateItem, removeItem, clearLocal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
