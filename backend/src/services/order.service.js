import { Order } from '../models/order.model.js';
import { Cart } from '../models/cart.model.js';
import { ApiError } from '../utils/ApiError.js';

// Seller'ın yapabileceği durum geçişleri. Ödeme durumları (PAID / PAYMENT_FAILED)
// buradan DEĞİL, yalnızca payment service üzerinden değişir.
const SELLER_TRANSITIONS = {
  PAID: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
};

function buildPagination(page, limit) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  return { page: p, limit: l, skip: (p - 1) * l };
}

// Sepetten sipariş oluşturma — checkout'un kalbi.
//
// Mimari karar: Sepet SATICIYA GÖRE gruplanır ve satıcı başına AYRI bir sipariş
// oluşturulur. Böylece her siparişin tek status'u ve tek ödeme akışı olur;
// hiçbir satıcı başka bir satıcının kalemlerinin durumunu değiştiremez.
// Tek satıcılı sepette davranış değişmez: tek sipariş oluşur.
//
// Stok burada yalnızca KONTROL edilir (erken ve anlaşılır hata için);
// kesin rezervasyon ödeme anında yapılır (bkz. stock.service.js).
export async function createOrderFromCart(userId) {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  const items = (cart?.items || []).filter((i) => i.productId); // silinmiş ürünleri ele
  if (items.length === 0) throw new ApiError(400, 'CART_EMPTY');

  for (const item of items) {
    if (item.quantity > item.productId.stock) {
      throw new ApiError(400, 'ORDER_STOCK_LEFT', item.productId.name, item.productId.stock);
    }
  }

  // Satıcıya göre grupla
  const groups = new Map();
  for (const item of items) {
    const key = item.productId.sellerId.toString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }

  // Her grup için snapshot'lı bir sipariş oluştur.
  // Toplam HER ZAMAN server'da, DB fiyatlarından hesaplanır.
  const orders = [];
  for (const groupItems of groups.values()) {
    const orderItems = groupItems.map((i) => ({
      productId: i.productId._id,
      name: i.productId.name,
      price: i.productId.price,
      sellerId: i.productId.sellerId,
      quantity: i.quantity,
    }));
    const totalPrice = Number(orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2));
    orders.push(await Order.create({ userId, items: orderItems, totalPrice }));
  }

  // Sepeti temizle
  cart.items = [];
  await cart.save();

  return orders;
}

// Müşterinin kendi sipariş geçmişi
export async function listMyOrders(userId, { page, limit }) {
  const { page: p, limit: l, skip } = buildPagination(page, limit);

  const [items, total] = await Promise.all([
    Order.find({ userId }).sort('-createdAt').skip(skip).limit(l),
    Order.countDocuments({ userId }),
  ]);

  return { items, pagination: { total, page: p, pages: Math.ceil(total / l) || 1, limit: l } };
}

// Sipariş detayı — yalnızca siparişin sahibi görebilir
export async function getOrder(userId, orderId) {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'ORDER_NOT_FOUND');
  if (order.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'ORDER_FORBIDDEN');
  }
  return order;
}

// Seller: kendi ürünlerini içeren siparişler
export async function listSellerOrders(sellerId, { page, limit }) {
  const { page: p, limit: l, skip } = buildPagination(page, limit);
  const filter = { 'items.sellerId': sellerId };

  const [items, total] = await Promise.all([
    Order.find(filter).populate('userId', 'name').sort('-createdAt').skip(skip).limit(l),
    Order.countDocuments(filter),
  ]);

  return { items, pagination: { total, page: p, pages: Math.ceil(total / l) || 1, limit: l } };
}

// Seller: sipariş durumu güncelleme (yalnızca PAID → SHIPPED → DELIVERED)
export async function updateOrderStatus(sellerId, orderId, nextStatus) {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'ORDER_NOT_FOUND');

  // Siparişler satıcı başına oluşturulduğu için TÜM kalemler bu satıcıya ait olmalı.
  // (every kullanımı bilinçli: karma sipariş asla oluşmamalı, oluşursa da güncellenememeli)
  const ownsAll =
    order.items.length > 0 && order.items.every((i) => i.sellerId.toString() === sellerId.toString());
  if (!ownsAll) throw new ApiError(403, 'ORDER_NO_SELLER_ITEMS');

  const allowed = SELLER_TRANSITIONS[order.status] || [];
  if (!allowed.includes(nextStatus)) {
    throw new ApiError(400, 'ORDER_BAD_TRANSITION', order.status, nextStatus);
  }

  order.status = nextStatus;
  await order.save();
  return order;
}
