import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectTestDb, disconnectTestDb } from './helpers/db.js';
import { api, registerUser, createProduct, addToCart } from './helpers/api.js';

let seller;
let customer;
let product;

beforeAll(async () => {
  await connectTestDb();
  seller = await registerUser({ name: 'Satıcı', email: 'seller@test.dev', role: 'seller' });
  customer = await registerUser({ name: 'Müşteri', email: 'customer@test.dev', role: 'customer' });
  ({ product } = await createProduct(seller.token, { name: 'Ceviz', stock: 5, price: 200 }));
});
afterAll(disconnectTestDb);

describe('Cart', () => {
  it('seller sepete erişemez (403)', async () => {
    const res = await api().get('/api/cart').set('Authorization', `Bearer ${seller.token}`);
    expect(res.status).toBe(403);
  });

  it('sepete ürün eklenir, toplam server tarafında hesaplanır', async () => {
    const res = await addToCart(customer.token, product._id, 2);
    expect(res.status).toBe(201);
    expect(res.body.data.total).toBe(400); // 2 x 200
  });

  it('stoktan fazla ekleme 400 döner (sepetteki adet de hesaba katılır)', async () => {
    // Sepette zaten 2 adet var; 4 daha eklemek 6 yapar > stok 5
    const res = await addToCart(customer.token, product._id, 4);
    expect(res.status).toBe(400);
  });

  it('adet güncellenir ve toplam yeniden hesaplanır', async () => {
    const res = await api()
      .put(`/api/cart/items/${product._id}`)
      .set('Authorization', `Bearer ${customer.token}`)
      .send({ quantity: 5 });
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(1000);
  });

  it('stok üstü adet güncellemesi 400 döner', async () => {
    const res = await api()
      .put(`/api/cart/items/${product._id}`)
      .set('Authorization', `Bearer ${customer.token}`)
      .send({ quantity: 6 });
    expect(res.status).toBe(400);
  });

  it('ürün sepetten çıkarılır', async () => {
    const res = await api()
      .delete(`/api/cart/items/${product._id}`)
      .set('Authorization', `Bearer ${customer.token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.cart.items.length).toBe(0);
    expect(res.body.data.total).toBe(0);
  });

  it('sepette olmayan ürünü çıkarmak 404 döner', async () => {
    const res = await api()
      .delete(`/api/cart/items/${product._id}`)
      .set('Authorization', `Bearer ${customer.token}`);
    expect(res.status).toBe(404);
  });
});
