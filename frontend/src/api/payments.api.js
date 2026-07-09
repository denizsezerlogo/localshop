import client from './client';

export const payOrder = (payload) => client.post('/payments/pay', payload);
