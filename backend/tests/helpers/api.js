import request from 'supertest';
import app from '../../src/app.js';

export const api = () => request(app);

// Kayıt + token döner
export async function registerUser({ name, email, password = 'sifre123', role }) {
  const res = await request(app).post('/api/auth/register').send({ name, email, password, role });
  return { res, token: res.body.data?.token, user: res.body.data?.user };
}

// Seller token'ıyla ürün oluşturur, ürünü döner
export async function createProduct(token, overrides = {}) {
  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Test Balı',
      description: 'Test için ürün',
      price: 100,
      stock: 10,
      category: 'food',
      ...overrides,
    });
  return { res, product: res.body.data?.product };
}

export async function addToCart(token, productId, quantity) {
  return request(app)
    .post('/api/cart/items')
    .set('Authorization', `Bearer ${token}`)
    .send({ productId, quantity });
}

export async function createOrders(token) {
  const res = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`);
  return { res, orders: res.body.data?.orders };
}

export async function payOrder(token, orderId, cardNumber) {
  return request(app)
    .post('/api/payments/pay')
    .set('Authorization', `Bearer ${token}`)
    .send({ orderId, cardNumber, cardHolder: 'Test Kullanıcı', expiry: '12/30', cvv: '123' });
}

export async function getProduct(productId) {
  return request(app).get(`/api/products/${productId}`);
}

export const SUCCESS_CARD = '4242424242424242';
export const FAIL_CARD = '4000000000000000';
