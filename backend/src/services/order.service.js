import { Order } from '../models/order.model.js';
import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
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

// Sepetten sipariş oluşturma — checkout'un kalbi
export async function createOrderFromCart(userId) {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  const items = (cart?.items || []).filter((i) => i.productId); // silinmiş ürünleri ele
  if (items.length === 0) throw new ApiError(400, 'Sepetiniz boş');

  // 1) Ön kontrol: tüm kalemler için stok yeterli mi?
  for (const item of items) {
    if (item.quantity > item.productId.stock) {
      throw new ApiError(400, `Yetersiz stok: '${item.productId.name}' için ${item.productId.stock} adet kaldı`);
    }
  }

  // 2) Stok düşümü: atomik koşullu update (stock >= quantity şartıyla $inc).
  //    Aynı anda gelen iki sipariş aynı stoğu tüketemez. Bir kalem başarısız olursa
  //    önceden düşülenler geri alınır (compensating update).
  //    Not: Gerçek sistemde bu blok MongoDB transaction'ı ile yapılır (replica set gerektirir);
  //    MVP lokal standalone MongoDB'de çalıştığı için bu yaklaşım bilinçli olarak seçildi.
  const decremented = [];
  for (const item of items) {
    const result = await Product.updateOne(
      { _id: item.productId._id, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );
    if (result.modifiedCount === 0) {
      for (const done of decremented) {
        await Product.updateOne({ _id: done.id }, { $inc: { stock: done.qty } });
      }
      throw new ApiError(400, `Yetersiz stok: '${item.productId.name}' bu sırada tükendi`);
    }
    decremented.push({ id: item.productId._id, qty: item.quantity });
  }

  // 3) Snapshot'lı sipariş kalemleri + toplam HER ZAMAN server'da, DB fiyatlarından hesaplanır
  const orderItems = items.map((i) => ({
    productId: i.productId._id,
    name: i.productId.name,
    price: i.productId.price,
    sellerId: i.productId.sellerId,
    quantity: i.quantity,
  }));
  const totalPrice = Number(orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2));

  const order = await Order.create({ userId, items: orderItems, totalPrice });

  // 4) Sepeti temizle
  cart.items = [];
  await cart.save();

  return order;
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
  if (!order) throw new ApiError(404, 'Sipariş bulunamadı');
  if (order.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'Bu siparişi görüntüleme yetkiniz yok');
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
  if (!order) throw new ApiError(404, 'Sipariş bulunamadı');

  const hasItems = order.items.some((i) => i.sellerId.toString() === sellerId.toString());
  if (!hasItems) throw new ApiError(403, 'Bu siparişte size ait ürün bulunmuyor');

  const allowed = SELLER_TRANSITIONS[order.status] || [];
  if (!allowed.includes(nextStatus)) {
    throw new ApiError(400, `'${order.status}' durumundan '${nextStatus}' durumuna geçilemez`);
  }

  order.status = nextStatus;
  await order.save();
  return order;
}
