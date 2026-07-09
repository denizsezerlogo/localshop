import client from './client';

export const listProducts = (params) => client.get('/products', { params });
export const listCategories = () => client.get('/products/categories');
export const getProduct = (id) => client.get(`/products/${id}`);
export const createProduct = (payload) => client.post('/products', payload);
export const updateProduct = (id, payload) => client.put(`/products/${id}`, payload);
export const deleteProduct = (id) => client.delete(`/products/${id}`);
export const listMyProducts = (params) => client.get('/products/mine', { params });
