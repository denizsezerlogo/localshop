import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectTestDb, disconnectTestDb } from './helpers/db.js';
import { api, registerUser, createProduct } from './helpers/api.js';

let seller;
let otherSeller;
let customer;

beforeAll(async () => {
  await connectTestDb();
  seller = await registerUser({ name: 'Satıcı A', email: 'sa@test.dev', role: 'seller' });
  otherSeller = await registerUser({ name: 'Satıcı B', email: 'sb@test.dev', role: 'seller' });
  customer = await registerUser({ name: 'Müşteri', email: 'cust@test.dev', role: 'customer' });
});
afterAll(disconnectTestDb);

describe('Product yönetimi', () => {
  it('customer ürün ekleyemez (403)', async () => {
    const { res } = await createProduct(customer.token);
    expect(res.status).toBe(403);
  });

  it('seller ürün ekleyebilir (201) ve sellerId otomatik atanır', async () => {
    const { res, product } = await createProduct(seller.token, { name: 'Organik Bal', category: 'food' });
    expect(res.status).toBe(201);
    expect(product.sellerId).toBe(seller.user._id);
  });

  it('geçersiz gövdeyle ürün ekleme 400 döner', async () => {
    const { res } = await createProduct(seller.token, { price: -5 });
    expect(res.status).toBe(400);
  });

  it('sahibi olmayan seller ürünü güncelleyemez (403), sahibi güncelleyebilir', async () => {
    const { product } = await createProduct(seller.token, { name: 'Zeytinyağı', price: 300 });

    const forbidden = await api()
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${otherSeller.token}`)
      .send({ price: 1 });
    expect(forbidden.status).toBe(403);

    const ok = await api()
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${seller.token}`)
      .send({ price: 350 });
    expect(ok.status).toBe(200);
    expect(ok.body.data.product.price).toBe(350);
  });

  it('katalog: kategori filtresi ve arama çalışır', async () => {
    await createProduct(seller.token, { name: 'Lavanta Sabunu', category: 'cosmetics' });

    const byCategory = await api().get('/api/products?category=cosmetics');
    expect(byCategory.status).toBe(200);
    expect(byCategory.body.data.items.every((p) => p.category === 'cosmetics')).toBe(true);

    const bySearch = await api().get('/api/products?search=lavanta');
    expect(bySearch.status).toBe(200);
    expect(bySearch.body.data.items.some((p) => p.name.includes('Lavanta'))).toBe(true);
  });

  it('geçersiz id formatı 400, olmayan id 404 döner', async () => {
    const bad = await api().get('/api/products/gecersiz-id');
    expect(bad.status).toBe(400);

    const missing = await api().get('/api/products/645a1b2c3d4e5f6a7b8c9d0e');
    expect(missing.status).toBe(404);
  });

  it('sahibi ürünü silebilir; silinen ürün detayı 404 döner', async () => {
    const { product } = await createProduct(seller.token, { name: 'Silinecek Ürün' });

    const del = await api().delete(`/api/products/${product._id}`).set('Authorization', `Bearer ${seller.token}`);
    expect(del.status).toBe(200);

    const detail = await api().get(`/api/products/${product._id}`);
    expect(detail.status).toBe(404);
  });

  it('/products/mine yalnızca kendi ürünlerini döner', async () => {
    const mine = await api().get('/api/products/mine').set('Authorization', `Bearer ${otherSeller.token}`);
    expect(mine.status).toBe(200);
    expect(mine.body.data.items.every((p) => p.sellerId === otherSeller.user._id)).toBe(true);
  });
});
