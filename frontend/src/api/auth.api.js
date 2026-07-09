import client from './client';

export const registerRequest = (payload) => client.post('/auth/register', payload);
export const loginRequest = (payload) => client.post('/auth/login', payload);
export const meRequest = () => client.get('/auth/me');
