import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectTestDb, disconnectTestDb } from './helpers/db.js';
import {
  api,
  registerUser,
  createProduct,
  addToCart,
  createOrders,
  payOrder,
  getProduct,
  SUCCESS_CARD,
  FAIL_CARD,
} from './helpers/api.js';

let sellerA;
let sellerB;
let customer;
let otherCustomer;

beforeAll(async () => {
  await connectTestDb();
  sellerA = await registerUser({ name: 'Satıcı A', email: 'sella@test.dev', role: 'seller' });
  sellerB = await registerUser({ name: 'Satıcı B', email: 'sellb@test.dev', role: 'seller' });
  customer = await registerUser({ name: 'Müşteri', email: 'cust@test.dev', role: 'customer' });
  otherCustomer = await registerUser({ name: 'Diğer Müşteri', email: 'cust2@test.dev', role: 'customer' });
});
afterAll(disconnectTestDb);

describe('Checkout: satıcı bazlı sipariş bölme', () => {
  it('boş sepetle sipariş 400 döner', async () => {
    const { res } = await createOrders(customer.token);
    expect(res.status).toBe(400);
  });

  it('iki farklı satıcının ürünü satıcı başına ayrı siparişe bölünür; stok henüz düşmez', async () => {
    const { product: pA } = await createProduct(sellerA.token, { name: 'A Balı', price: 100, stock: 10 });
    const { product: pB } = await createProduct(sellerB.token, { name: 'B Sabunu', price: 50, stock: 10, category: 'cosmetics' });

    await addToCart(customer.token, pA._id, 2);
    await addToCart(customer.token, pB._id, 1);

    const { res, orders } = await createOrders(customer.token);
    expect(res.status).toBe(201);
    expect(orders.length).toBe(2);

    // Her sipariş tek satıcıya ait olmalı
    for (const order of orders) {
      const sellerIds = new Set(order.items.map((i) => i.sellerId));
      expect(sellerIds.size).toBe(1);
      expect(order.status).toBe('PENDING_PAYMENT');
    }

    // Toplamlar server'da doğru hesaplanmalı (2x100 ve 1x50)
    const totals = orders.map((o) => o.totalPrice).sort((a, b) => a - b);
    expect(totals).toEqual([50, 200]);

    // Stok sipariş oluşturmayla DÜŞMEZ (rezervasyon ödeme anında)
    const freshA = await getProduct(pA._id);
    expect(freshA.body.data.product.stock).toBe(10);

    // Sepet temizlenmiş olmalı
    const cart = await api().get('/api/cart').set('Authorization', `Bearer ${customer.token}`);
    expect(cart.body.data.cart.items.length).toBe(0);
  });
});

describe('FakePay: ödeme ve stok yaşam döngüsü', () => {
  let product;
  let orderId;

  beforeAll(async () => {
    ({ product } = await createProduct(sellerA.token, { name: 'Kayısı', price: 80, stock: 6 }));
    await addToCart(customer.token, product._id, 3);
    const { orders } = await createOrders(customer.token);
    orderId = orders[0]._id;
  });

  it('başkasının siparişini ödemek 403 döner', async () => {
    const res = await payOrder(otherCustomer.token, orderId, SUCCESS_CARD);
    expect(res.status).toBe(403);
  });

  it('geçersiz kart formatı 400 döner (ödeme hiç denenmez)', async () => {
    const res = await payOrder(customer.token, orderId, '1234');
    expect(res.status).toBe(400);
  });

  it('başarısız kart: sipariş PAYMENT_FAILED olur, stok anında iade edilir', async () => {
    const res = await payOrder(customer.token, orderId, FAIL_CARD);
    expect(res.status).toBe(200);
    expect(res.body.data.paymentSuccess).toBe(false);
    expect(res.body.data.order.status).toBe('PAYMENT_FAILED');

    const fresh = await getProduct(product._id);
    expect(fresh.body.data.product.stock).toBe(6); // iade edildi
  });

  it('başarılı kart: tekrar deneme PAID yapar, stok bu anda düşer, işlem referansı kaydedilir', async () => {
    const res = await payOrder(customer.token, orderId, SUCCESS_CARD);
    expect(res.status).toBe(200);
    expect(res.body.data.paymentSuccess).toBe(true);
    expect(res.body.data.order.status).toBe('PAID');
    expect(res.body.data.order.paymentResult.transactionId).toMatch(/^FP-/);

    const fresh = await getProduct(product._id);
    expect(fresh.body.data.product.stock).toBe(3); // 6 - 3
  });

  it('PAID siparişi tekrar ödemek 400 döner', async () => {
    const res = await payOrder(customer.token, orderId, SUCCESS_CARD);
    expect(res.status).toBe(400);
  });

  it('aynı siparişe EŞZAMANLI iki ödeme denemesinde yalnızca biri tahsil edilir', async () => {
    const { product: p } = await createProduct(sellerA.token, { name: 'Nar Ekşisi', price: 150, stock: 5 });
    await addToCart(customer.token, p._id, 2);
    const { orders } = await createOrders(customer.token);
    const oid = orders[0]._id;

    // İki ödeme isteği aynı anda: atomik kilit sayesinde yalnızca biri işlenmeli
    const [r1, r2] = await Promise.all([
      payOrder(customer.token, oid, SUCCESS_CARD),
      payOrder(customer.token, oid, SUCCESS_CARD),
    ]);

    const statuses = [r1.status, r2.status].sort((a, b) => a - b);
    expect(statuses).toEqual([200, 400]); // biri öder, diğeri kilide takılır

    const winner = r1.status === 200 ? r1 : r2;
    expect(winner.body.data.paymentSuccess).toBe(true);
    expect(winner.body.data.order.status).toBe('PAID');

    // Stok yalnızca BİR kez düşmüş olmalı (çift tahsilat yok)
    const fresh = await getProduct(p._id);
    expect(fresh.body.data.product.stock).toBe(3);
  });

  it('ödeme anında stok yetersizse ödeme reddedilir, sipariş beklemede kalır', async () => {
    // Kalan stok 3; iki müşteri de 3'er adetlik sipariş oluşturur (soft check ikisine de izin verir)
    await addToCart(customer.token, product._id, 3);
    const first = await createOrders(customer.token);

    await addToCart(otherCustomer.token, product._id, 3);
    const second = await createOrders(otherCustomer.token);

    // İlk ödeme stoğu alır
    const pay1 = await payOrder(customer.token, first.orders[0]._id, SUCCESS_CARD);
    expect(pay1.body.data.order.status).toBe('PAID');

    // İkinci ödeme stok bulamaz → 400, sipariş hâlâ ödenebilir durumda
    const pay2 = await payOrder(otherCustomer.token, second.orders[0]._id, SUCCESS_CARD);
    expect(pay2.status).toBe(400);

    const orderCheck = await api()
      .get(`/api/orders/${second.orders[0]._id}`)
      .set('Authorization', `Bearer ${otherCustomer.token}`);
    expect(orderCheck.body.data.order.status).toBe('PENDING_PAYMENT');
  });
});

describe('Sipariş durum yönetimi', () => {
  let orderId;

  beforeAll(async () => {
    const { product } = await createProduct(sellerA.token, { name: 'Gül Suyu', price: 90, stock: 10, category: 'cosmetics' });
    await addToCart(customer.token, product._id, 1);
    const { orders } = await createOrders(customer.token);
    orderId = orders[0]._id;
    await payOrder(customer.token, orderId, SUCCESS_CARD);
  });

  const setStatus = (token, id, status) =>
    api().put(`/api/orders/${id}/status`).set('Authorization', `Bearer ${token}`).send({ status });

  it('customer sipariş durumunu değiştiremez (403)', async () => {
    const res = await setStatus(customer.token, orderId, 'SHIPPED');
    expect(res.status).toBe(403);
  });

  it('başka satıcı siparişi güncelleyemez (403)', async () => {
    const res = await setStatus(sellerB.token, orderId, 'SHIPPED');
    expect(res.status).toBe(403);
  });

  it('geçersiz geçiş reddedilir: PAID → DELIVERED olamaz (400)', async () => {
    const res = await setStatus(sellerA.token, orderId, 'DELIVERED');
    expect(res.status).toBe(400);
  });

  it('kurallı akış çalışır: PAID → SHIPPED → DELIVERED', async () => {
    const shipped = await setStatus(sellerA.token, orderId, 'SHIPPED');
    expect(shipped.status).toBe(200);
    expect(shipped.body.data.order.status).toBe('SHIPPED');

    const delivered = await setStatus(sellerA.token, orderId, 'DELIVERED');
    expect(delivered.status).toBe(200);
    expect(delivered.body.data.order.status).toBe('DELIVERED');
  });

  it('seller /orders/seller ile yalnızca kendi siparişlerini görür', async () => {
    const res = await api().get('/api/orders/seller').set('Authorization', `Bearer ${sellerB.token}`);
    expect(res.status).toBe(200);
    const allMine = res.body.data.items.every((order) =>
      order.items.every((item) => item.sellerId === sellerB.user._id)
    );
    expect(allMine).toBe(true);
  });

  it('customer başkasının sipariş detayını göremez (403)', async () => {
    const res = await api().get(`/api/orders/${orderId}`).set('Authorization', `Bearer ${otherCustomer.token}`);
    expect(res.status).toBe(403);
  });
});
