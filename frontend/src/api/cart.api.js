import client from './client';

export const getCart = () => client.get('/cart');
export const addItem = (productId, quantity) => client.post('/cart/items', { productId, quantity });
export const updateItem = (productId, quantity) => client.put(`/cart/items/${productId}`, { quantity });
export const removeItem = (productId) => client.delete(`/cart/items/${productId}`);
