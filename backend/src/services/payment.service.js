import { Order } from '../models/order.model.js';
import { ApiError } from '../utils/ApiError.js';
import * as fakePay from './fakePay.service.js';

export async function payOrder(userId, orderId, card) {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Sipariş bulunamadı');

  // Yalnızca siparişin sahibi ödeyebilir
  if (order.userId.toString() !== userId.toString()) {
    throw new ApiError(403, 'Bu sipariş size ait değil');
  }

  // Yalnızca ödeme bekleyen / başarısız olmuş siparişler ödenebilir (tekrar deneme desteklenir)
  if (!['PENDING_PAYMENT', 'PAYMENT_FAILED'].includes(order.status)) {
    throw new ApiError(400, 'Bu sipariş ödemeye uygun durumda değil');
  }

  // Tutar HER ZAMAN sipariş kaydından okunur — client'tan gelen tutara güvenilmez
  const result = await fakePay.charge({ ...card, amount: order.totalPrice });

  // GÜVENLİK: Kart bilgileri bilinçli olarak veritabanına yazılmaz ve loglanmaz.
  // Siparişe yalnızca işlem referansı kaydedilir.
  if (result.success) {
    order.status = 'PAID';
    order.paymentResult = { transactionId: result.transactionId, processedAt: new Date() };
  } else {
    order.status = 'PAYMENT_FAILED';
  }
  await order.save();

  return { order, paymentSuccess: result.success, reason: result.reason };
}
