import { Order } from '../models/order.model.js';
import { ApiError } from '../utils/ApiError.js';
import * as fakePay from './fakePay.service.js';
import { reserveStock, releaseStock } from './stock.service.js';
import { MSG } from '../constants/messages.js';

export async function payOrder(userId, orderId, card) {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, MSG.ORDER_NOT_FOUND);

  // Yalnızca siparişin sahibi ödeyebilir
  if (order.userId.toString() !== userId.toString()) {
    throw new ApiError(403, MSG.PAYMENT_NOT_YOURS);
  }

  // Yalnızca ödeme bekleyen / başarısız olmuş siparişler ödenebilir (tekrar deneme desteklenir)
  if (!['PENDING_PAYMENT', 'PAYMENT_FAILED'].includes(order.status)) {
    throw new ApiError(400, MSG.PAYMENT_NOT_PAYABLE);
  }

  // 1) Stok ÖDEME ANINDA atomik olarak rezerve edilir; yetersizse ödeme hiç denenmez.
  const reserved = await reserveStock(order.items);

  // 2) Tutar HER ZAMAN sipariş kaydından okunur — client'tan gelen tutara güvenilmez
  const result = await fakePay.charge({ ...card, amount: order.totalPrice });

  // GÜVENLİK: Kart bilgileri bilinçli olarak veritabanına yazılmaz ve loglanmaz.
  // Siparişe yalnızca işlem referansı kaydedilir.
  if (result.success) {
    order.status = 'PAID';
    order.paymentResult = { transactionId: result.transactionId, processedAt: new Date() };
  } else {
    // 3) Ödeme reddedildi → rezervasyon anında iade edilir, sipariş tekrar denenebilir
    await releaseStock(reserved);
    order.status = 'PAYMENT_FAILED';
  }
  await order.save();

  return { order, paymentSuccess: result.success, reason: result.reason };
}
