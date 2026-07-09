import client from './client';

export const createOrders = () => client.post('/orders');
export const listMyOrders = (params) => client.get('/orders', { params });
export const getOrder = (id) => client.get(`/orders/${id}`);
export const listSellerOrders = (params) => client.get('/orders/seller', { params });
export const updateOrderStatus = (id, status) => client.put(`/orders/${id}/status`, { status });
